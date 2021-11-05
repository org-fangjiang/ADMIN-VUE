// 项目信息管理

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <!-- 状态筛选 -->
    <Select
      :class="`${prefixCls}-add`"
      ref="select"
      :allowClear="true"
      v-model:value="condition.state"
      style="width: 120px"
      @change="stateHandleChange"
      :options="hostConst.STATES"
      :pagination="false"
    />
    <!-- 添加 -->
    <Button :class="`${prefixCls}-add`" v-auth="hostConst._PERMS.ADD" @click="addProject">
      {{ t('host.action.add') }}</Button
    >
    <Table :columns="columns" :data-source="list" rowKey="id" :pagination="false">
      <template #state="{ text: state }">
        <span>
          <Tag :color="hostConst.STATES[state].color">
            {{ hostConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #type="{ text: type }">
        <span>
          <Tag :color="hostConst.TYPES[type - 1].color">
            {{ hostConst.TYPES[type - 1].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: link }">
        <!-- 操作下拉框 -->
        <Dropdown placement="bottomCenter" trigger="click">
          <Button type="link">{{ t('host.operation') }}</Button>
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem :key="0" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button :class="prefixCls" v-auth="hostConst._PERMS.DELETE" type="link" size="small"
                  >{{ t('host.action.delete') }}
                </Button>
              </MenuItem>
              <MenuItem :key="1" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="hostConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.reEnable') }}
                </Button>
              </MenuItem>
              <MenuItem :key="2" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="hostConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.update') }}
                </Button>
              </MenuItem>
              <MenuItem :key="3" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="hostConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.setResource') }}
                </Button>
              </MenuItem>
              <MenuItem :key="6" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="hostConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.setLicense') }}
                </Button>
              </MenuItem>
              <MenuItem :key="4" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="hostConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.setLayout') }}
                </Button>
              </MenuItem>
              <MenuItem :key="5" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="hostConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.setBuild') }}
                </Button>
              </MenuItem>
              <MenuItem :key="8" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="hostConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.setQuestion') }}
                </Button>
              </MenuItem>
              <MenuItem :key="7" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="hostConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.setDynamicNews') }}
                </Button>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </template>
    </Table>
    <Pagination
      show-size-changer
      size="large"
      :show-total="(total) => t('component.table.total', { total })"
      :pageSizeOptions="pageSizeList"
      :current="pageParam.number"
      :pageSize="pageParam.size"
      :total="pageParam.totalElements"
      @change="onChange"
      @showSizeChange="onShowSizeChange"
    />
    <Modal
      v-model:visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width="80%"
      :bodyStyle="{ overflow: 'auto', margin: '16px' }"
      :destroyOnClose="true"
      :footer="null"
    >
      <ProjectForm v-if="drawerParam.state === '0'" :id="drawerParam.id" />
      <SourceTable
        v-if="drawerParam.state === '1'"
        :id="drawerParam.id"
        :provinceId="drawerParam.provinceId"
        :cityId="drawerParam.cityId"
        :areaId="drawerParam.areaId"
      />
      <LayoutTable v-if="drawerParam.state === '2'" :id="drawerParam.id" />
      <BuildTable
        v-if="drawerParam.state === '3'"
        :id="drawerParam.id"
        :provinceId="drawerParam.provinceId"
        :cityId="drawerParam.cityId"
        :areaId="drawerParam.areaId"
      />
      <LicenseTable
        v-if="drawerParam.state === '4'"
        :id="drawerParam.id"
        :provinceId="drawerParam.provinceId"
        :cityId="drawerParam.cityId"
        :areaId="drawerParam.areaId"
      />
      <DynamicNewsTable
        v-if="drawerParam.state === '5'"
        :id="drawerParam.id"
        :provinceId="drawerParam.provinceId"
        :cityId="drawerParam.cityId"
        :areaId="drawerParam.areaId"
      />
      <QuestionTable v-if="drawerParam.state === '6'" :id="drawerParam.id" />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import {
    Table,
    Pagination,
    Tag,
    Button,
    Dropdown,
    Menu,
    MenuItem,
    Select,
    Modal,
  } from 'ant-design-vue';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Loading } from '/@/components/Loading';
  import { HostModel, _ColumnsHost, _HostConst } from '/@/api/host/project/model/projectModel';
  import ProjectForm from './components/ProjectForm.vue';
  import SourceTable from './components/SourceTable.vue';
  import LayoutTable from './components/LayoutTable.vue';
  import BuildTable from './components/BuildTable.vue';
  import LicenseTable from './components/LicenseTable.vue';
  import DynamicNewsTable from './components/DynamicNewsTable.vue';
  import QuestionTable from './components/QuestionTable.vue';
  import {
    deleteProject,
    getProject,
    reEnableProject,
    searchWithCondition,
  } from '/@/api/host/project/project';
  // 用户store
  import { useUserStore } from '/@/store/modules/user';
  import { Persistent } from '/@/utils/cache/persistent';
  import { HOUSE_PROJECT } from '/@/enums/cacheEnum';

  export default defineComponent({
    name: 'ProjectTable',
    components: {
      Table,
      Pagination,
      Tag,
      Button,
      Select,
      Dropdown,
      Menu,
      MenuItem,
      Loading,
      Modal,
      ProjectForm,
      SourceTable,
      LayoutTable,
      BuildTable,
      LicenseTable,
      DynamicNewsTable,
      QuestionTable,
    },
    setup() {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');
      const hostConst = ref(_HostConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      const columns = reactive(_ColumnsHost);
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });
      // 获取用户store
      const userStore = useUserStore();
      const cityId = userStore.getUserInfo.companyCityId;
      let provinceId = ref();
      const condition = reactive({
        state: '',
        name: '',
        provinceId: provinceId,
        cityId: cityId,
      });
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
        provinceId: '',
        cityId: '',
        areaId: '',
      });

      //根据状态筛选
      const stateHandleChange = async (value) => {
        condition.state = value;
        const result = await getList();
        processList(result);
      };

      const projects: HostModel[] = [];
      let list = reactive(projects);

      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<HostModel> | undefined;
        try {
          result = await searchWithCondition(condition, {
            pageSize: pageParam.size,
            pageNum: pageParam.number,
          });
        } catch (error: any) {
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
      //加载
      onMounted(async () => {
        provinceId.value = ref<string>(userStore.getUserInfo.companyProvinceId || '');
        const result = await getList();
        processList(result);
      });
      // 操作
      const action = async (key) => {
        const code = key.key;
        const id = key?.item['data-id'] || undefined;
        const { content } = await getProject(id);
        if (!content.sysAreaByAreaId) {
          content.sysAreaByAreaId = {};
        }
        if (!content.sysProvinceByProvinceId) {
          content.sysProvinceByProvinceId = {};
        }
        if (!content.sysCityByCityId) {
          content.sysCityByCityId = {};
        }
        drawerParam.provinceId = content.sysProvinceByProvinceId.id || '';
        drawerParam.cityId = content.sysCityByCityId.id || '';
        drawerParam.areaId = content.sysAreaByAreaId.id || '';
        switch (code) {
          case 0:
            // 删除
            try {
              loading.value = true;
              await deleteProject(id);
              success(t('host.action.delete'), t('host.action.success'));
              const result = await getList();
              processList(result);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('host.action.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 1:
            // 恢复
            try {
              loading.value = true;
              await reEnableProject(id);
              success(t('host.action.reEnable'), t('host.action.success'));
              const result = await getList();
              processList(result);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('host.action.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 2:
            // 更新
            drawerParam.id = id;
            drawerParam.state = '0';
            drawerParam.visible = true;
            drawerParam.title = t('host.action.update');
            break;
          case 3:
            // 设置资源
            drawerParam.id = id;
            drawerParam.state = '1';
            drawerParam.visible = true;
            drawerParam.title = t('host.action.setResource');
            break;
          case 4:
            // 户型
            drawerParam.id = id;
            drawerParam.state = '2';
            drawerParam.visible = true;
            drawerParam.title = t('host.action.setLayout');
            break;
          case 5:
            // 户型
            drawerParam.id = id;
            drawerParam.state = '3';
            drawerParam.visible = true;
            drawerParam.title = t('host.action.setBuild');
            break;
          case 6:
            // 预售证
            drawerParam.id = id;
            drawerParam.state = '4';
            drawerParam.visible = true;
            drawerParam.title = t('host.action.setLicense');
            break;
          case 7:
            // 动态文章
            drawerParam.id = id;
            drawerParam.state = '5';
            drawerParam.visible = true;
            drawerParam.title = t('host.action.setDynamicNews');
            break;
          case 8:
            // 动态文章
            drawerParam.id = id;
            drawerParam.state = '6';
            drawerParam.visible = true;
            drawerParam.title = t('host.action.setQuestion');
            break;
        }
      };

      const addProject = () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('host.action.add');
      };

      const onClose = async () => {
        debugger;
        if (drawerParam.id != '') {
          Persistent.removeLocal(HOUSE_PROJECT, true);
        }
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        const result = await getList();
        processList(result);
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

      function processList(result: any) {
        if (!result) {
          return;
        }
        const { page, content } = result;
        list.splice(0);
        content.forEach((link) => {
          list.push(link);
        });
        page.number = page.number + 1;
        Object.assign(pageParam, {}, page);
      }
      const onChange = async (page) => {
        pageParam.number = page;
        const result = await getList();
        processList(result);
      };
      const onShowSizeChange = async (current, size) => {
        console.log(current);
        pageParam.size = size;
        pageParam.number = 1;
        const result = await getList();
        processList(result);
      };

      return {
        t,
        prefixCls,
        hostConst,
        tip,
        columns,
        condition,
        action,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        loading,
        pageSizeList,
        pageParam,
        list,
        stateHandleChange,
        onChange,
        onShowSizeChange,
        drawerParam,
        addProject,
        onClose,
        provinceId,
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
    &-action-menu-item {
      text-align: center;
    }

    &-add {
      margin-top: 20px;
      margin-right: 10px;
      margin-bottom: 20px;
    }
  }
</style>
