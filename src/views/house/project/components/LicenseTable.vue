// 许可证信息管理页面
<template>
  <div :class="prefixCls" class="relative w-full h-full px-4 pt-2">
    <Button v-auth="licenseConst._PERMS.ADD" @click="addLicense">{{ t('host.action.add') }}</Button>
    <Table
      :columns="ColumnsLicense"
      :data-source="list"
      rowKey="id"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template #hBuildsById="{ text: hBuildsById }">
        <span v-for="item in hBuildsById" :key="item.id">{{ item.name }}</span>
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
        <!-- <Button
          :class="prefixCls"
          v-auth="licenseConst._PERMS.UPDATE"
          type="link"
          size="small"
          @click="setBuild(line)"
        >
          {{ t('host.license.setBuild') }}
        </Button> -->
      </template>
    </Table>
    <Modal
      :bodyStyle="{ overflow: 'auto', 'margin-top': '16px' }"
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width="100%"
      wrapClassName="full-modal"
      :footer="null"
      :destroyOnClose="true"
    >
      <LicenseForm
        v-if="drawerParam.state === '0'"
        :id="drawerParam.id"
        :projectId="props.id"
        :provinceId="props.provinceId"
        :cityId="props.cityId"
        :areaId="props.areaId"
      />
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
  import { BasePageResult, PageParam, PageSizeList } from '/@/api/model/baseModel';
  import { Table, Tag, Button, Modal } from 'ant-design-vue';
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
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');
      const licenseConst = ref(_LicenseConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      const license: LicenseModel[] = [];

      // 添加分页
      const pageParam: PageParam = reactive({
        pageNum: 0,
        pageSize: 10,
      });
      const total = ref<number>(0);
      const pagination = computed(() => ({
        total: total,
        current: pageParam.pageNum,
        pageSize: pageParam.pageSize,
      }));
      const handleTableChange = async (pag: any) => {
        pageParam.pageSize = pag!.pageSize!;
        pageParam.pageNum = pag?.current;
        const result = await getList();
        processList(result);
      };

      // 筛选条件
      const condition = reactive({
        state: '',
        projectId: props.id || '',
        id: '',
      });
      // 列表结果
      let list = reactive(license);
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
        processList(result);
      };

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<LicenseModel> | undefined;
        try {
          result = await getLicenses(condition, pageParam);
        } catch (error) {
          createErrorModal({
            title: t('sys.api.errorTip'),
            content: error?.response?.data?.message || t('sys.api.networkExceptionMsg'),
            getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
          });
        } finally {
          loading.value = false;
        }
        return result;
      };

      function processList(result: any) {
        if (!result) {
          return;
        }
        const { page, content } = result;
        list.splice(0);
        if (content) {
          content.forEach((line) => {
            list.push(line);
          });
        }
        total.value = page.totalElements;
      }

      onMounted(async () => {
        const result = await getList();
        processList(result);
      });

      const deleteOneLicense = async (line) => {
        try {
          loading.value = true;
          await deleteLicense(line.id);
          success(t('host.action.delete'), t('host.action.success'));
          const result = await getList();
          processList(result);
        } catch (error) {
          failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };
      const reEnableOneLicense = async (line) => {
        try {
          loading.value = true;
          await reEnableLicense(line.id);
          success(t('host.action.reEnable'), t('host.action.success'));
          const result = await getList();
          processList(result);
        } catch (error) {
          failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };

      const addLicense = async () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('host.action.add');
      };

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
        } catch (error) {
          failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };

      const success = (message: any, description: any) => {
        notification.success({
          message: message,
          description: description,
          duration: 3,
        });
      };

      const failed = (title: any, content: any) => {
        createErrorModal({
          title: title || t('sys.api.errorTip'),
          content: content || t('sys.api.networkExceptionMsg'),
          getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
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
        processList,
        loading,
        tip,
        pageSizeList,
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
      };
    },
  });
</script>
