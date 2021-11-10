// 楼栋信息管理页面
<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <Button v-auth="buildConst._PERMS.ADD" @click="addBuild" :class="`${prefixCls}-sel`">{{
      t('host.action.add')
    }}</Button>
    <Table
      :columns="ColumnsBuild"
      :data-source="list"
      rowKey="id"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template #saleState="{ text: saleState }">
        <span>
          <Tag :color="buildConst.SALE_STATES[saleState - 1].color">
            {{ buildConst.SALE_STATES[saleState - 1].label }}
          </Tag>
        </span>
      </template>
      <template #state="{ text: state }">
        <span>
          <Tag :color="buildConst.STATES[state].color">
            {{ buildConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: line }">
        <Button
          :class="prefixCls"
          v-auth="buildConst._PERMS.DELETE"
          type="link"
          size="small"
          @click="deleteOneBuild(line)"
        >
          {{ t('host.action.delete') }}
        </Button>
        <Button
          :class="prefixCls"
          v-auth="buildConst._PERMS.UPDATE"
          type="link"
          size="small"
          @click="reEnableOneBuild(line)"
        >
          {{ t('host.action.reEnable') }}
        </Button>
        <Button
          :class="prefixCls"
          v-auth="buildConst._PERMS.ADD"
          type="link"
          size="small"
          @click="updateBuild(line)"
        >
          {{ t('host.action.update') }}
        </Button>
        <Button
          :class="prefixCls"
          v-auth="buildConst._PERMS.ADD"
          type="link"
          size="small"
          @click="setLayout(line)"
        >
          {{ t('host.build.addLayout') }}
        </Button>
        <Button
          :class="prefixCls"
          v-auth="buildConst._PERMS.ADD"
          type="link"
          size="small"
          @click="setLicense(line)"
        >
          {{ t('host.action.setLicense') }}
        </Button>
      </template>
    </Table>
    <Modal
      :bodyStyle="{ overflow: 'auto', margin: '16px' }"
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width="70%"
      :footer="null"
      :destroyOnClose="true"
    >
      <BuildForm
        v-if="drawerParam.state === '0'"
        :id="drawerParam.id"
        :projectId="props.id"
        :provinceId="props.provinceId"
        :cityId="props.cityId"
        :areaId="props.areaId"
      />
      <FLayout
        v-if="drawerParam.state === '1'"
        :id="drawerParam.id"
        :projectId="props.id"
        :selected="drawerParam.selected"
        @setBuildLayout="setBuildLayout"
      />
    </Modal>
    <Modal
      :bodyStyle="{ overflow: 'auto', margin: '16px', height: '100px' }"
      :visible="isVisible"
      :title="drawerParam.title"
      @cancel="onClose"
      :footer="null"
      :destroyOnClose="true"
    >
      <FLicense
        v-if="drawerParam.state === '2'"
        :projectId="props.id"
        :buildId="drawerParam.id"
        @setBuildLicense="setBuildLicense"
      />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasePageResult, PageParam } from '/@/api/model/baseModel';
  import { Table, Tag, Button, Modal } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import {
    BuildModel,
    _BuildConst,
    _ColumnsBuild as ColumnsBuild,
  } from '/@/api/host/build/model/buildModel';
  import { addBuildLayout, deleteBuild, getBuilds, reEnableBuild } from '/@/api/host/build/build';
  import BuildForm from './BuildForm.vue';
  import FLayout from '/@/components/FLayout';
  import FLicense from '/@/components/Flicense';
  import { BuildLayoutBean } from '/@/api/host/build/model/BuildLayoutEntity';
  import { processListByLine, success, failed } from '/@/hooks/web/useList';

  export default defineComponent({
    name: 'BuildTable',
    components: {
      Table,
      Tag,
      Button,
      Modal,
      Loading,
      BuildForm,
      FLayout,
      FLicense,
    },
    props: {
      id: {
        type: String,
        require: true,
      },
      provinceId: {
        type: String,
        require: true,
      },
      cityId: {
        type: String,
        require: true,
      },
      areaId: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');

      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //参数权限
      const buildConst = ref(_BuildConst);

      // 添加分页
      const pageParam: PageParam = reactive({
        pageNum: 0,
        pageSize: 10,
      });
      const total = ref<number>(0);
      const pagination = computed(() => ({
        total: total.value,
        current: pageParam.pageNum,
        pageSize: pageParam.pageSize,
      }));
      const handleTableChange = async (pag: any) => {
        pageParam.pageSize = pag!.pageSize!;
        pageParam.pageNum = pag?.current;
        const result = await getList();
        processListByLine(result, list, total);
      };

      // 抽屉参数
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
        selected: [''],
      });
      //关闭抽屉
      const onClose = async () => {
        isVisible.value = false;
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        drawerParam.selected = [''];
        const result = await getList();
        processListByLine(result, list, total);
      };

      // 筛选条件
      const condition = reactive({
        state: '',
        projectId: props.id || '',
        id: '',
      });
      // 列表结果
      const build: BuildModel[] = [];
      let list = reactive(build);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<BuildModel> | undefined;
        try {
          result = await getBuilds(condition, pageParam);
        } catch (error: any) {
          createErrorModal({
            title: t('sys.api.errorTip'),
            content: error?.response?.data?.message || t('sys.api.networkExceptionMsg'),
            // getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
          });
        } finally {
          loading.value = false;
        }
        return result;
      };

      //初始加载
      onMounted(async () => {
        const result = await getList();
        processListByLine(result, list, total);
      });

      //删除
      const deleteOneBuild = async (line) => {
        try {
          loading.value = true;
          await deleteBuild(line.id);
          success(t('host.action.delete'), t('host.action.success'));
          const result = await getList();
          processListByLine(result, list, total);
        } catch (error: any) {
          failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };

      //恢复
      const reEnableOneBuild = async (line) => {
        try {
          loading.value = true;
          await reEnableBuild(line.id);
          success(t('host.action.reEnable'), t('host.action.success'));
          const result = await getList();
          processListByLine(result, list, total);
        } catch (error: any) {
          failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };

      //添加，打开modal
      const addBuild = async () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('host.action.add');
      };
      //更新
      const updateBuild = async (line) => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = line.id;
        drawerParam.title = t('host.action.update');
      };
      //打开许可证设置
      let isVisible = ref(false);
      const setLicense = async (line) => {
        isVisible.value = true;
        drawerParam.state = '2';
        drawerParam.id = line.id;
        drawerParam.title = t('host.action.setLicense');
      };

      //设置许可证
      const setBuildLicense = async () => {
        isVisible.value = false;
        drawerParam.state = '';
        drawerParam.title = '';
        const result = await getList();
        processListByLine(result, list, total);
      };

      //打开设置户型
      const setLayout = async (line) => {
        drawerParam.visible = true;
        drawerParam.state = '1';
        drawerParam.id = line.id;
        drawerParam.title = t('host.build.addLayout');
        if (line.hBuildLayoutsById) {
          line.hBuildLayoutsById.forEach((item) => {
            drawerParam.selected.push(item.layoutId);
          });
        }
      };

      //设置户型
      const setBuildLayout = async (value) => {
        debugger;
        try {
          loading.value = true;
          let layouts: BuildLayoutBean[] = [];
          if (value.ids) {
            value.ids.forEach((item) => {
              if (item && item !== '') {
                layouts.push({
                  buildId: value.buildId,
                  layoutId: item,
                  hLayoutByLayoutId: { id: item },
                });
              }
            });
          }
          await addBuildLayout(value.buildId, layouts);
          success(t('host.build.addLayout'), t('host.action.success'));
        } catch (error: any) {
          failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };

      return {
        t,
        prefixCls,
        buildConst,
        condition,
        ColumnsBuild,
        loading,
        tip,
        pagination,
        handleTableChange,
        list,
        drawerParam,
        deleteOneBuild,
        reEnableOneBuild,
        updateBuild,
        onClose,
        addBuild,
        props,
        setLayout,
        setBuildLayout,
        setLicense,
        setBuildLicense,
        isVisible,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-project';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;
    }
  }

  .@{prefix-cls} {
    &-sel {
      margin-right: 10px;
      margin-bottom: 20px;
    }
  }
</style>
