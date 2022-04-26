// 资源信息管理页面
<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <!-- 状态筛选 -->
    <Select
      :class="`${prefixCls}-sel`"
      ref="select"
      :allowClear="true"
      v-model:value="condition.state"
      style="width: 120px"
      @change="stateHandleChange"
      :options="sourceConst.STATE"
      :pagination="false"
    />
    <Button
      v-auth="[sourceConst._PERMS.ADD, sourceConst._PERMS.UPDATE]"
      @click="addSource"
      :class="`${prefixCls}-sel`"
    >
      {{ t('host.action.add') }}
    </Button>
    <Table
      :columns="ColumnsHost"
      :data-source="list"
      rowKey="id"
      :pagination="pagination"
      @change="handleTableChange"
      :scroll="{ y: 'calc(70vh)' }"
    >
      <template #address="scope">
        <Image
          v-if="scope.record.sort !== '6' && scope.record.sort !== '7'"
          :src="scope.text"
          width="60px"
        />
        <div v-else>{{ address }}</div>
      </template>
      <template #sort="{ text: sort }">
        <span>
          <Tag :color="sourceConst.SORT[sort - 1].color">
            {{ sourceConst.SORT[sort - 1].label }}
          </Tag>
        </span>
      </template>
      <template #state="{ text: state }">
        <span>
          <Tag :color="sourceConst.STATE[state].color">
            {{ sourceConst.STATE[state].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: line }">
        <Button
          :class="prefixCls"
          v-if="line.state != '0'"
          v-auth="sourceConst._PERMS.DELETE"
          type="link"
          size="small"
          @click="deleteOneSource(line)"
        >
          {{ t('host.action.delete') }}
        </Button>
        <Button
          :class="prefixCls"
          v-else
          v-auth="sourceConst._PERMS.UPDATE"
          type="link"
          size="small"
          @click="reEnableOneSource(line)"
        >
          {{ t('host.action.reEnable') }}
        </Button>
        <Button
          :class="prefixCls"
          v-auth="sourceConst._PERMS.ADD"
          type="link"
          size="small"
          @click="updateResource(line)"
        >
          {{ t('host.action.update') }}
        </Button>
        <Button :class="prefixCls" type="link" size="small" @click="setSand(line)">
          设置沙盘图
        </Button>
        <Button :class="prefixCls" type="link" size="small" @click="setFirst(line)">
          设置项目首图
        </Button>
      </template>
    </Table>
    <Modal
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width=""
      :footer="null"
      :destroyOnClose="true"
      :bodyStyle="{ overflow: 'auto', 'margin-top': '16px' }"
    >
      <SourceForm
        v-if="drawerParam.state === '0'"
        :id="drawerParam.id"
        :provinceId="props.provinceId"
        :cityId="props.cityId"
        :areaId="props.areaId"
        :projectId="props.id"
      />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { computed, defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasePageResult, PageParam } from '/@/api/model/baseModel';
  import { Table, Tag, Button, Modal, Image, Select } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { processListByLine, success, failed } from '/@/hooks/web/useList';
  import {
    ProjectResourceConst,
    ProjectResourceModel,
    ProjectResourceColumns as ColumnsHost,
  } from '/@/api/ohouse/projectResource/model/projectResourceModel';
  import {
    deleteOResource,
    getResources,
    reEnableOResource,
  } from '/@/api/ohouse/projectResource/projectRecource';
  import SourceForm from './ResourceForm.vue';
  import { OProjectModel } from '/@/api/ohouse/project/model/projectModel';
  import { updateOHouse } from '/@/api/ohouse/project/project';

  interface Option {
    value: string;
    label: string;
  }
  export default defineComponent({
    name: 'OProjectSource',
    components: {
      Table,
      Tag,
      Button,
      Modal,
      Loading,
      Image,
      Select,
      SourceForm,
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
      const sourceConst = ref(ProjectResourceConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      // 首图
      const setFirst = async (item) => {
        const formState: UnwrapRef<OProjectModel> = reactive({
          id: props.id,
          firstImg: item.address,
        });
        debugger;
        await updateOHouse(formState);
        success('设置项目首图成功', t('host.action.success'));
      };
      // 沙盘图
      const setSand = async (item) => {
        const formState: UnwrapRef<OProjectModel> = reactive({
          id: props.id,
          sandImg: item.address,
        });
        debugger;
        await updateOHouse(formState);
        success('设置沙盘图', t('host.action.success'));
      };

      //分页
      const pageParam: PageParam = reactive({
        pageNum: 1,
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

      const options = ref<Option[]>([]);
      // 筛选条件
      const condition = reactive({
        state: '1',
        projectId: props.id || '',
        title: '',
        id: '',
        sort: '',
      });

      //根据状态筛选
      const stateHandleChange = async (value) => {
        condition.state = value;
        pageParam.pageNum = 1;
        const result = await getList();
        processListByLine(result, list, total);
      };

      //初始加载
      onMounted(async () => {
        const result = await getList();
        processListByLine(result, list, total);
      });
      // 列表结果
      const source: ProjectResourceModel[] = [];
      let list = reactive(source);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<ProjectResourceModel> | undefined;
        try {
          result = await getResources(condition, pageParam);
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

      //删除
      const deleteOneSource = async (line) => {
        try {
          loading.value = true;
          await deleteOResource(line.id);
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
      const reEnableOneSource = async (line) => {
        try {
          loading.value = true;
          await reEnableOResource(line.id);
          success(t('host.action.reEnable'), t('host.action.success'));
          const result = await getList();
          processListByLine(result, list, total);
        } catch (error: any) {
          failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };

      // 抽屉参数
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
      });
      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        const result = await getList();
        processListByLine(result, list, total);
      };
      //添加资源
      const addSource = async () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('host.action.add');
      };
      //更新
      const updateResource = async (line) => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = line.id;
        drawerParam.title = t('host.action.update');
      };

      return {
        t,
        prefixCls,
        sourceConst,
        options,
        condition,
        ColumnsHost,
        loading,
        tip,
        pagination,
        handleTableChange,
        list,
        drawerParam,
        deleteOneSource,
        reEnableOneSource,
        updateResource,
        onClose,
        addSource,
        props,
        stateHandleChange,
        setFirst,
        setSand,
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
      margin-top: 4px;
      margin-right: 10px;
      margin-bottom: 20px;
      margin-left: 0;
    }
  }
</style>
