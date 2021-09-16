// 企业信息管理页面

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <div class="container flex-row">
      <Select
        ref="select"
        :allowClear="true"
        v-model:value="condition.state"
        style="width: 120px"
        @change="stateHandleChange"
        :options="companyConst.STATES"
      />
      <FCascader @change="locationChange" />
      <Button :class="prefixCls" v-auth="companyConst.COMPANY_PERMS.ADD" @click="add">{{
        t('model.company.add')
      }}</Button>
    </div>
    <Table :columns="columns" :data-source="list" rowKey="id" :pagination="false">
      <template #companySize="{ text: size }">
        <span>
          <Tag :color="companyConst.COMPANY_SIZES[size].color">
            {{ companyConst.COMPANY_SIZES[size].label }}
          </Tag>
        </span>
      </template>
      <template #state="{ text: state }">
        <span>
          <Tag :color="companyConst.STATES[state].color">
            {{ companyConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #action="{ text: company }">
        <Dropdown placement="bottomCenter" trigger="click">
          <Button type="link">{{ t('model.company.action') }}</Button>
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem :key="0" :data-id="company.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button v-auth="companyConst.COMPANY_PERMS.UPDATE" type="link" size="small">{{
                  t('model.company.updateInfo')
                }}</Button>
              </MenuItem>
              <MenuItem
                v-if="company.state !== companyConst.LOCKED"
                :key="1"
                :data-id="company.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button v-auth="companyConst.COMPANY_PERMS.UPDATE" type="link" size="small">
                  {{ t('model.company.updateLocked') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-else
                :key="2"
                :data-id="company.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button v-auth="companyConst.COMPANY_PERMS.DELETE" type="link" size="small">
                  {{ t('model.company.updateUnLocked') }}
                </Button>
              </MenuItem>
              <MenuItem :key="3" :data-id="company.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button v-auth="companyConst.COMPANY_PERMS.UPDATE" type="link" size="small">
                  {{ t('model.company.changeCreateBy') }}
                </Button>
              </MenuItem>
              <MenuItem :key="4" :data-id="company.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button v-auth="companyConst.COMPANY_PERMS.UPDATE" type="link" size="small">
                  {{ t('model.company.updateRenewalData') }}
                </Button>
              </MenuItem>
              <MenuItem :key="5" :data-id="company.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button type="link" size="small">
                  {{ t('model.company.addRole') }}
                </Button>
              </MenuItem>
              <MenuItem :key="6" :data-id="company.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button type="link" size="small">
                  {{ t('model.company.admin') }}
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
    <Drawer
      :title="drawerParam.title"
      :width="'100%'"
      :destroyOnClose="true"
      :get-container="false"
      :visible="drawerParam.visible"
      :wrapClassName="`${prefixCls}-drawer`"
      :maskStyle="{ background: 'rgba(0, 0, 0, 0)' }"
      :wrap-style="{ position: 'absolute' }"
      @close="onClose"
    >
      <CompanyForm v-if="drawerParam.state === '0'" :id="drawerParam.id" />
      <CompanyFormCreateBy v-if="drawerParam.state === '3'" :id="drawerParam.id" />
      <CompanyFormExpirationData v-if="drawerParam.state === '4'" :id="drawerParam.id" />
      <FRoleForm
        v-if="drawerParam.state === '5'"
        :companyId="drawerParam.id"
        :comanyName="drawerParam.name"
      />
      <AdminForm
        v-if="drawerParam.state === '6'"
        :companyId="drawerParam.id"
        :comanyName="drawerParam.name"
      />
    </Drawer>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDesign } from '/@/hooks/web/useDesign';
  import {
    getCompanies,
    deleteCompany,
    reEnableCompany,
    getCompany,
  } from '/@/api/sys/compnay/company';
  import {
    CompanyModel,
    CompanyColumns,
    CompanyConst,
  } from '/@/api/sys/compnay/model/companyModel';
  import FCascader from '/@/components/FCascader';
  import { Loading } from '/@/components/Loading';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import CompanyForm from './components/CompanyForm.vue';
  import CompanyFormCreateBy from './components/CompanyFormCreateBy.vue';
  import CompanyFormExpirationData from './components/CompanyFormExpirationData.vue';
  import FRoleForm from './components/RoleForm.vue';
  import AdminForm from './components/AdminForm.vue';
  import {
    Drawer,
    Menu,
    MenuItem,
    Dropdown,
    Tag,
    Select,
    Table,
    Pagination,
    Button,
  } from 'ant-design-vue';
  import { defineComponent, onMounted, reactive, ref } from 'vue';

  export default defineComponent({
    name: 'Company',
    components: {
      FCascader,
      Loading,
      CompanyFormExpirationData,
      CompanyFormCreateBy,
      CompanyForm,
      Drawer,
      Menu,
      MenuItem,
      Dropdown,
      Tag,
      Select,
      Table,
      Pagination,
      Button,
      FRoleForm,
      AdminForm,
    },
    setup() {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      // 修改为其它对应的组件名称
      const { prefixCls } = useDesign('company');
      const drawerParam = reactive({
        id: '',
        state: '0',
        title: '',
        visible: false,
        name: '',
      });
      const pageSizeList = ref<string[]>(PageSizeList);
      // 修改为其它对应的Const
      const companyConst = ref(CompanyConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      // 修改为其它对应的columns
      const columns = reactive(CompanyColumns);
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });

      const condition = reactive({
        state: '',
        provinceId: '',
        cityId: '',
        areaId: '',
      });

      const stateHandleChange = async (value) => {
        condition.state = value;
        const result = await getList();
        processList(result);
      };

      // 企业信息数据
      const companies: CompanyModel[] = [];
      let list = reactive(companies);

      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<CompanyModel> | undefined;
        try {
          result = await getCompanies(condition, {
            pageSize: pageParam.size,
            pageNum: pageParam.number,
          });
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

      const onChange = async (page) => {
        pageParam.number = page;
        const result = await getList();
        processList(result);
      };

      function processList(result: any) {
        if (!result) {
          return;
        }
        const { page, content } = result;
        list.splice(0);
        content.forEach((company) => {
          list.push(company);
        });
        page.number = page.number + 1;
        Object.assign(pageParam, {}, page);
      }

      const onShowSizeChange = async (current, size) => {
        console.log(current);
        pageParam.size = size;
        pageParam.number = 1;
        const result = await getList();
        processList(result);
      };

      // 企业操作
      const action = async (key) => {
        const code = key.key;
        const id = key?.item['data-id'] || undefined;
        const { content } = await getCompany(id);
        switch (code) {
          case 0:
            // update info
            drawerParam.state = '0';
            drawerParam.id = id;
            drawerParam.title = t('model.company.updateInfo');
            drawerParam.visible = true;
            break;
          case 1:
            // update locked
            try {
              loading.value = true;
              const company: CompanyModel = { id: id };
              await deleteCompany(company);
              success(t('model.company.updateInfo'), t('model.company.update_success'));
              const result = await getList();
              processList(result);
            } catch (error) {
              failed(error?.response?.data?.message, t('model.company.update_failed'));
            } finally {
              loading.value = false;
            }
            break;
          case 2:
            // update unLocked
            try {
              loading.value = true;
              const company: CompanyModel = { id: id };
              await reEnableCompany(company);
              success(t('model.company.updateInfo'), t('model.company.update_success'));
              const result = await getList();
              processList(result);
            } catch (error) {
              failed(error?.response?.data?.message, t('model.company.update_failed'));
            } finally {
              loading.value = false;
            }
            break;
          case 3:
            // update create by 修改渠道负责人
            drawerParam.state = '3';
            drawerParam.id = id;
            drawerParam.title = t('model.company.changeCreateBy');
            drawerParam.visible = true;
            break;
          case 4:
            // 续期
            drawerParam.state = '4';
            drawerParam.id = id;
            drawerParam.title = t('model.company.updateRenewalData');
            drawerParam.visible = true;
            break;
          case 5:
            // 添加角色
            drawerParam.state = '5';
            drawerParam.id = id;
            drawerParam.title = t('model.company.addRole');
            drawerParam.visible = true;
            // const { content } = await getCompany(id);
            drawerParam.name = content.name || '';
            break;
          case 6:
            // 管理员设置
            drawerParam.state = '6';
            drawerParam.id = id;
            drawerParam.title = t('model.company.admin');
            drawerParam.visible = true;
            // const { content } = await getCompany(id);
            drawerParam.name = content.name || '';
            break;
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

      const add = () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('model.company.add');
      };

      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.id = '';
        drawerParam.title = '';
        drawerParam.visible = false;
        drawerParam.name = '';
        if (drawerParam.state === '6') {
          drawerParam.state = '0';
          return;
        }
        drawerParam.state = '0';
        const result = await getList();
        processList(result);
      };

      const locationChange = async (e) => {
        debugger;
        condition.provinceId = e.value[0] || '';
        condition.cityId = e.value[1] || '';
        condition.areaId = e.value[2] || '';
        pageParam.number = 1;
        const result = await getList();
        processList(result);
      };

      onMounted(async () => {
        const result = await getList();
        processList(result);
      });

      return {
        t,
        prefixCls,
        companyConst,
        columns,
        drawerParam,
        loading,
        tip,
        pageSizeList,
        pageParam,
        condition,
        list,
        onChange,
        onShowSizeChange,
        stateHandleChange,
        action,
        add,
        onClose,
        locationChange,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-company';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;
    }
  }

  .@{prefix-cls} {
    &-drawer {
      max-width: 1000px;
    }

    &-action-menu-item {
      text-align: center;
    }
  }
</style>
