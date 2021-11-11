// 角色信息管理页面

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <div class="container flex-row">
      <Button :class="`${prefixCls}-select`" v-auth="roleConst._PERMS.ADD" @click="add">{{
        t('model.role.addRole')
      }}</Button>
      <Select
        ref="selectRef"
        label-in-value
        placeholder="Select Company"
        style="width: 250px"
        :filter-option="false"
        :not-found-content="null"
        :options="options"
        @search="fetchUser"
        :showSearch="true"
        :labelInValue="false"
        @change="companyChange"
        :allowClear="true"
      />
    </div>
    <Table :pagination="false" :columns="roleColumns" :data-source="list" rowKey="id">
      <template #state="{ text: state }">
        <Tag :color="roleConst.STATES[state].color">
          {{ roleConst.STATES[state].label }}
        </Tag>
      </template>
      <template #action="{ text: role }">
        <Dropdown placement="bottomCenter" trigger="click">
          <Button type="link">{{ t('model.role.action') }}</Button>
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem :key="0" :data-id="role.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button v-auth="roleConst._PERMS.UPDATE" type="link" size="small">{{
                  t('model.role.updateRole')
                }}</Button>
              </MenuItem>
              <MenuItem :key="1" :data-id="role.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button v-auth="roleConst._PERMS.DELETE" type="link" size="small">{{
                  t('model.role.deleteRole')
                }}</Button>
              </MenuItem>
              <MenuItem :key="2" :data-id="role.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button v-auth="roleConst._PERMS.UPDATE" type="link" size="small">{{
                  t('model.role.reEnableRole')
                }}</Button>
              </MenuItem>
              <MenuItem :key="3" :data-id="role.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button v-auth="roleConst._PERMS.UPDATE" type="link" size="small">{{
                  t('model.role.setRoleMenu')
                }}</Button>
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
      <RoleForm v-if="drawerParam.state === '0'" :roleId="drawerParam.id" />
      <FMenu
        v-if="drawerParam.state === '1'"
        :expandedKeys="drawerParam.checkedKeys"
        :roleId="drawerParam.id"
      />
    </Drawer>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { deleteRole, getRole, getRoles, reEnableRole } from '/@/api/sys/role/role';
  import { RoleModel, RoleColumns, RoleConst } from '/@/api/sys/role/model/roleModel';
  import { Loading } from '/@/components/Loading';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import RoleForm from './components/RoleForm.vue';
  import {
    Drawer,
    Menu,
    MenuItem,
    Dropdown,
    Table,
    Pagination,
    Button,
    Tag,
    Select,
  } from 'ant-design-vue';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { FMenu } from '/@/components/FMenu';
  import { debounce } from 'lodash-es';
  import { getCompanies } from '/@/api/sys/compnay/company';
  import { processList, success, failed } from '/@/hooks/web/useList';

  interface Option {
    value: string;
    label: string;
  }
  export default defineComponent({
    name: 'Role',
    components: {
      Loading,
      Drawer,
      Menu,
      MenuItem,
      Dropdown,
      Table,
      Pagination,
      Button,
      RoleForm,
      FMenu,
      Tag,
      Select,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      // 修改为其它对应的组件名称
      const { prefixCls } = useDesign('role');
      const pageSizeList = ref<string[]>(PageSizeList);
      // 修改为其它对应的Const
      const roleConst = ref(RoleConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      // 修改为其它对应的columns
      const roleColumns = reactive(RoleColumns);
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });

      const options = ref<Option[]>([]);
      //筛选文本框值发生变化调用
      const fetchUser = debounce(async (value) => {
        options.value.splice(0);
        const { content } = await getCompanies({ name: value });
        if (content) {
          content.forEach((item) => {
            options.value?.push({ value: item.id || '', label: item.name || '' });
          });
        }
      }, 200);

      //选择企业
      const companyChange = async (value) => {
        condition.companyId = value;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      //筛选条件
      const condition = reactive({
        state: '',
        companyId: '',
      });
      // 角色信息数据
      const roles: RoleModel[] = [];
      let list = reactive(roles);

      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<RoleModel> | undefined;
        try {
          result = await getRoles(condition, {
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

      // 操作
      const action = async (key) => {
        const code = key.key;
        const id = key?.item['data-id'] || undefined;
        switch (code) {
          case 0:
            // update
            drawerParam.state = '0';
            drawerParam.id = id;
            drawerParam.title = t('model.role.updateRole');
            drawerParam.visible = true;
            break;
          case 1:
            // delete
            try {
              loading.value = true;
              await deleteRole({ id: id });
              success(t('model.role.deleteRole'), t('model.role.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('model.role.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 2:
            //reEnableRole
            try {
              await reEnableRole({ id: id });
              success(t('model.role.reEnableRole'), t('model.role.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('model.role.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 3:
            //setRoleMenu
            drawerParam.state = '1';
            drawerParam.id = id;
            drawerParam.visible = true;
            drawerParam.checkedKeys.splice(0);
            const { content } = await getRole({ id: id });
            content.sysRoleMenusById?.forEach((item) => {
              drawerParam.checkedKeys.push(item.id || '');
            });
            break;
        }
      };

      //抽屉参数
      const drawerParam = reactive({
        id: '',
        state: '', //0 添加修改角色 1 修改权限
        checkedKeys: [''],
        title: '',
        visible: false,
      });

      const add = () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('model.role.addRole');
      };

      const onClose = async () => {
        drawerParam.title = '';
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.visible = false;
        const result = await getList();
        processList(result, list, pageParam);
      };

      onMounted(async () => {
        const result = await getList();
        processList(result, list, pageParam);
      });

      //页码修改
      const onChange = async (page) => {
        pageParam.number = page;
        const result = await getList();
        processList(result, list, pageParam);
      };

      const onShowSizeChange = async (current, size) => {
        console.log(current);
        pageParam.size = size;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      return {
        t,
        prefixCls,
        roleConst,
        roleColumns,
        drawerParam,
        loading,
        tip,
        pageSizeList,
        pageParam,
        condition,
        list,
        onChange,
        onShowSizeChange,
        companyChange,
        action,
        add,
        onClose,
        options,
        fetchUser,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-role';
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
