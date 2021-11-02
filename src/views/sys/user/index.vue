// 用户信息管理页面

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <!-- 状态筛选 -->
    <Select
      ref="select"
      :allowClear="true"
      v-model:value="condition.state"
      style="width: 120px"
      @change="stateHandleChange"
      :options="userConst.STATES"
      :pagination="false"
    />
    <!-- 添加用户 -->
    <Button :class="prefixCls" v-auth="userConst._PERMS.ADD" @click="addUser">
      {{ t('model.user.addUser') }}
    </Button>

    <Table :columns="columns" :data-source="list" rowKey="id" :pagination="false">
      <template #sysUserRolesById="{ text: sysUserRolesById }">
        <span v-for="item in sysUserRolesById" :key="item.id">
          <Tag :color="userConst.STATES[0].color">
            {{ item.roleName }}
          </Tag>
        </span>
      </template>
      <template #state="{ text: state }">
        <span>
          <Tag :color="userConst.STATES[state].color">
            {{ userConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: user }">
        <!-- 操作下拉框 -->
        <Dropdown placement="bottomCenter" trigger="click">
          <Button type="link">{{ t('model.user.action') }}</Button>
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem :key="0" :data-id="user.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button :class="prefixCls" v-auth="userConst._PERMS.DELETE" type="link" size="small"
                  >{{ t('model.user.deleteUser') }}
                </Button>
              </MenuItem>
              <MenuItem :key="1" :data-id="user.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="userConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('model.user.reEnableUser') }}
                </Button>
              </MenuItem>
              <!-- <MenuItem :key="2" :data-id="user.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="userConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('model.user.updateUser') }}
                </Button>
              </MenuItem> -->
              <MenuItem :key="3" :data-id="user.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="userConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('model.user.setEmail') }}
                </Button>
              </MenuItem>
              <MenuItem :key="4" :data-id="user.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="userConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('model.user.setMobile') }}
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
      <AddUserForm v-if="drawerParam.state === '1'" :id="drawerParam.id" />
      <UpdateUserForm
        v-if="drawerParam.state === '0'"
        :id="drawerParam.id"
        :companyName="drawerParam.companyName"
        :deptName="drawerParam.deptName"
      />
    </Drawer>
    <SetMobileTable :visible="isMobile" @handleCancel="isCancel" />
    <SetEmailTable :visible="isEmail" @handleCancel="isCancel" />
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
    Drawer,
  } from 'ant-design-vue';
  import { BasePageResult, BaseResult, PageSizeList } from '/@/api/model/baseModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Loading } from '/@/components/Loading';
  import { GetUserModel, _Columns, _Const } from '/@/api/sys/user/model/userModel';
  import { deleteUser, getUsers, reEnableUser, updateUserInfo } from '/@/api/sys/user/user';
  import AddUserForm from './components/AddUserForm.vue';
  import UpdateUserForm from './components/UpdateUserForm.vue';
  import { getDepartment } from '/@/api/sys/department/department';
  import { getCompany } from '/@/api/sys/compnay/company';
  import { DepartmentModel } from '/@/api/sys/department/model/departmentModel';
  import { CompanyModel } from '/@/api/sys/compnay/model/companyModel';
  import SetMobileTable from './components/SetMobileTable.vue';
  import SetEmailTable from './components/SetEmailTable.vue';
  export default defineComponent({
    name: 'UserTable',
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
      Drawer,
      AddUserForm,
      UpdateUserForm,
      SetMobileTable,
      SetEmailTable,
    },
    setup() {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('user');
      const userConst = ref(_Const);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      const columns = reactive(_Columns);
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
        companyName: '',
        deptName: '',
      });

      const condition = reactive({
        deptId: '',
        state: '',
        mobile: '',
        companyId: '',
        roleId: '',
      });

      //根据状态筛选
      const stateHandleChange = async (value) => {
        condition.state = value;
        const result = await getList();
        processList(result);
      };

      const users: GetUserModel[] = [];
      let list = reactive(users);

      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<GetUserModel> | undefined;
        try {
          result = await getUsers(condition, {
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
        const result = await getList();
        processList(result);
      });
      //设置手机号和邮箱
      let isMobile = ref(false);
      let isEmail = ref(false);
      // 操作
      const action = async (key) => {
        const code = key.key;
        const id = key?.item['data-id'] || undefined;
        switch (code) {
          case 0:
            // 删除
            try {
              loading.value = true;
              await deleteUser(id);
              success(t('model.user.deleteUser'), t('model.user.success'));
              const result = await getList();
              processList(result);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('model.user.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 1:
            // 恢复
            try {
              loading.value = true;
              await reEnableUser(id);
              success(t('model.user.reEnableUser'), t('model.user.success'));
              const result = await getList();
              processList(result);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('model.user.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 2:
            // 更新
            drawerParam.id = id;
            drawerParam.state = '0';
            drawerParam.visible = true;
            drawerParam.title = t('model.user.updateUser');
            drawerParam.deptName = '';
            drawerParam.companyName = '';
            const { content } = await updateUserInfo({ id: id });
            let dept: BaseResult<DepartmentModel>;
            let company: BaseResult<CompanyModel>;
            if (content.deptId) {
              dept = await getDepartment({ deptId: content.deptId });
              drawerParam.deptName = dept.content.deptName || '';
            }
            if (content.companyId) {
              company = await getCompany(content.companyId);
              drawerParam.companyName = company.content.name || '';
            }
            break;
          case 3:
            isEmail.value = true;
            break;
          case 4:
            isMobile.value = true;
        }
      };

      const addUser = () => {
        drawerParam.visible = true;
        drawerParam.state = '1';
        drawerParam.id = '';
        drawerParam.title = t('model.user.addUser');
      };

      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        drawerParam.companyName = '';
        drawerParam.deptName = '';
        const result = await getList();
        processList(result);
      };
      //关闭
      const isCancel = () => {
        isMobile.value = false;
        isEmail.value = false;
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
        userConst,
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
        addUser,
        onClose,
        isMobile,
        isEmail,
        isCancel,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-user';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;
    }
  }

  .@{prefix-cls} {
    &-drawer {
      max-width: 500px;
    }

    &-action-menu-item {
      text-align: center;
    }
  }
</style>
