// 许可证信息管理页面
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
      :options="licenseConst.STATES"
      :pagination="false"
    />
    <Button v-auth="licenseConst._PERMS.ADD" @click="addLicense" :class="`${prefixCls}-sel`">{{
      t('host.action.add')
    }}</Button>
    <Table
      :columns="ColumnsLicense"
      :data-source="list"
      rowKey="id"
      :pagination="pagination"
      @change="handleTableChange"
      :scroll="{ y: 'calc(70vh)' }"
    >
      <template #hBuildsById="{ text: hBuildsById }">
        <span v-for="item in hBuildsById" :key="item.id">{{ item.number }}</span>
      </template>
      <template #state="{ text: state }">
        <span>
          <Tag :color="licenseConst.STATES[state].color">
            {{ licenseConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: line }">
        <Button
          :class="prefixCls"
          v-auth="licenseConst._PERMS.DELETE"
          type="link"
          size="small"
          @click="deleteOneLicense(line)"
        >
          {{ t('host.action.delete') }}
        </Button>
        <Button
          :class="prefixCls"
          v-auth="licenseConst._PERMS.UPDATE"
          type="link"
          size="small"
          @click="reEnableOneLicense(line)"
        >
          {{ t('host.action.reEnable') }}
        </Button>
        <Button
          :class="prefixCls"
          v-auth="licenseConst._PERMS.UPDATE"
          type="link"
          size="small"
          @click="updateLicense(line)"
        >
          {{ t('host.action.update') }}
        </Button>
      </template>
    </Table>
    <Modal
      :bodyStyle="{ overflow: 'auto', 'margin-top': '16px' }"
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width=""
      :footer="null"
      :destroyOnClose="true"
    >
      <LicenseForm v-if="drawerParam.state === '0'" :id="drawerParam.id" :projectId="props.id" />
      <FBuild
        v-if="drawerParam.state === '1'"
        :id="drawerParam.id"
        :projectId="props.id"
        :selected="drawerParam.selected"
        @setLicenseBuild="setLicenseBuild"
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
  import { Table, Tag, Button, Modal, Select } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import {
    LicenseModel,
    _LicenseConst,
    _ColumnsLicense as ColumnsLicense,
  } from '/@/api/host/license/model/licenseModel';
  import {
    deleteLicense,
    getLicenses,
    reEnableLicense,
    updateLicenseAddBuild,
  } from '/@/api/host/license/license';
  import { BuildEntity } from '/@/api/host/project/model/buildEntity';
  import LicenseForm from './LicenseForm.vue';
  import FBuild from '/@/components/FBuild';
  import { processListByLine, success, failed } from '/@/hooks/web/useList';

  export default defineComponent({
    name: 'LicenseTable',
    components: {
      Table,
      Tag,
      Button,
      Modal,
      Loading,
      FBuild,
      LicenseForm,
      Select,
    },
    props: {
      id: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');
      const licenseConst = ref(_LicenseConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      // 添加分页
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

      // 筛选条件
      const condition = reactive({
        state: '1',
        projectId: props.id || '',
        id: '',
      });

      //根据状态筛选
      const stateHandleChange = async (value) => {
        condition.state = value;
        pageParam.pageNum = 1;
        const result = await getList();
        processListByLine(result, list, total);
      };

      // 列表结果
      const license: LicenseModel[] = [];
      let list = reactive(license);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<LicenseModel> | undefined;
        try {
          result = await getLicenses(condition, pageParam);
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
      const deleteOneLicense = async (line) => {
        try {
          loading.value = true;
          await deleteLicense(line.id);
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
      const reEnableOneLicense = async (line) => {
        try {
          loading.value = true;
          await reEnableLicense(line.id);
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
        selected: [''],
      });
      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        drawerParam.selected = [''];
        const result = await getList();
        processListByLine(result, list, total);
      };
      //添加
      const addLicense = async () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('host.action.add');
      };
      //更新
      const updateLicense = async (line) => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = line.id;
        drawerParam.title = t('host.action.update');
      };
      //打开设置楼栋
      const setBuild = async (line) => {
        drawerParam.visible = true;
        drawerParam.state = '1';
        drawerParam.id = line.id;
        drawerParam.title = t('host.license.setBuild');
        if (line.hBuildsById && line.hBuildsById.length > 0) {
          line.hBuildsById.forEach((item) => {
            drawerParam.selected.push(item.id);
          });
        }
      };

      //设置楼栋
      const setLicenseBuild = async (value) => {
        try {
          loading.value = true;
          let builds: BuildEntity[] = [];
          if (value.ids) {
            value.ids.forEach((item) => {
              if (item && item !== '') {
                builds.push({
                  id: item,
                  projectId: value.projectId,
                });
              }
            });
          }
          await updateLicenseAddBuild(value.licenseId, builds);
          success(t('host.license.setBuild'), t('host.action.success'));
        } catch (error: any) {
          failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };

      return {
        t,
        prefixCls,
        licenseConst,
        condition,
        pagination,
        handleTableChange,
        ColumnsLicense,
        pageParam,
        processListByLine,
        loading,
        tip,
        list,
        drawerParam,
        deleteOneLicense,
        reEnableOneLicense,
        updateLicense,
        onClose,
        addLicense,
        props,
        setBuild,
        setLicenseBuild,
        stateHandleChange,
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
    }
  }
</style>
