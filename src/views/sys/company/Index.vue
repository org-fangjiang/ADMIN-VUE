// 企业信息管理页面

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <div class="container flex-row">
      <Select
        :class="`${prefixCls}-select`"
        ref="select"
        :allowClear="true"
        v-model:value="condition.state"
        style="width: 120px"
        @change="stateHandleChange"
        :options="companyConst.STATES"
      />
      <FCascader @change="locationChange" :class="`${prefixCls}-select`" />
      <Button :class="`${prefixCls}-select`" v-auth="companyConst.COMPANY_PERMS.ADD" @click="add">{{
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
              <MenuItem
                v-if="hasPermission(companyConst.COMPANY_PERMS.UPDATE)"
                :key="0"
                :data-id="company.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button v-auth="companyConst.COMPANY_PERMS.UPDATE" type="link" size="small">{{
                  t('model.company.updateInfo')
                }}</Button>
              </MenuItem>
              <MenuItem
                v-if="
                  company.state !== companyConst.LOCKED &&
                  hasPermission(companyConst.COMPANY_PERMS.UPDATE)
                "
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
                v-show="hasPermission(companyConst.COMPANY_PERMS.UPDATE)"
              >
                <template #icon></template>
                <Button v-auth="companyConst.COMPANY_PERMS.UPDATE" type="link" size="small">
                  {{ t('model.company.updateUnLocked') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="hasPermission(companyConst.COMPANY_PERMS.UPDATE)"
                :key="3"
                :data-id="company.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button v-auth="companyConst.COMPANY_PERMS.UPDATE" type="link" size="small">
                  {{ t('model.company.changeCreateBy') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="hasPermission(companyConst.COMPANY_PERMS.UPDATE)"
                :key="4"
                :data-id="company.id"
                :class="`${prefixCls}-action-menu-item`"
              >
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
  import { processList, success, failed } from '/@/hooks/web/useList';
  import { usePermission } from '/@/hooks/web/usePermission';

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
      const { createErrorModal } = useMessage();
      // 修改为其它对应的组件名称
      const { prefixCls } = useDesign('company');
      // 修改为其它对应的Const
      const companyConst = ref(CompanyConst);
      // 修改为其它对应的columns
      const columns = reactive(CompanyColumns);
      //加载动画
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      // 判断权限
      const { hasPermission } = usePermission();

      //抽屉参数
      const drawerParam = reactive({
        id: '',
        state: '0',
        title: '',
        visible: false,
        name: '',
      });

      //分页
      const pageSizeList = ref<string[]>(PageSizeList);
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });
      //筛选参数
      const condition = reactive({
        state: '2',
        provinceId: '',
        cityId: '',
        areaId: '',
      });

      // 企业信息数据
      const companies: CompanyModel[] = [];
      let list = reactive(companies);

      //状态修改
      const stateHandleChange = async (value) => {
        condition.state = value;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      //城市区筛选
      const locationChange = async (e) => {
        condition.provinceId = e.value[0] || '';
        condition.cityId = e.value[1] || '';
        condition.areaId = e.value[2] || '';
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      //获取数据
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<CompanyModel> | undefined;
        try {
          result = await getCompanies(condition, {
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

      //页码修改
      const onChange = async (page) => {
        pageParam.number = page;
        const result = await getList();
        processList(result, list, pageParam);
      };

      //页面条数改变
      const onShowSizeChange = async (current, size) => {
        console.log(current);
        pageParam.size = size;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
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
              processList(result, list, pageParam);
            } catch (error: any) {
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
              processList(result, list, pageParam);
            } catch (error: any) {
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
            drawerParam.name = content.name || '';
            break;
          case 6:
            // 管理员设置
            drawerParam.state = '6';
            drawerParam.id = id;
            drawerParam.title = t('model.company.admin');
            drawerParam.visible = true;
            drawerParam.name = content.name || '';
            break;
        }
      };

      //添加，打开抽屉
      const add = () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('model.company.add');
      };

      //关闭抽屉
      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.id = '';
        drawerParam.title = '';
        drawerParam.visible = false;
        drawerParam.name = '';
        if (drawerParam.state === '6') {
          //直接返回，不重新加载主页面
          drawerParam.state = '0';
          return;
        }
        drawerParam.state = '0';
        const result = await getList();
        processList(result, list, pageParam);
      };

      //初始加载
      onMounted(async () => {
        const result = await getList();
        processList(result, list, pageParam);
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
        hasPermission,
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

    &-select {
      margin-top: 20px;
      margin-right: 10px;
      margin-bottom: 20px;
    }
  }
</style>
