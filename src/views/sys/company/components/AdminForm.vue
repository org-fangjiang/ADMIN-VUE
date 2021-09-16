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
    <Button :class="prefixCls" v-auth="userConst._PERMS.ADD" @click="addUser">{{
      t('model.company.addCompanyUser')
    }}</Button>

    <Table :columns="columns" :data-source="list" rowKey="id" :pagination="false">
      <template #sysUserRolesById="{ text: sysUserRolesById }">
        <span v-for="item in sysUserRolesById" :key="item.roleName">{{ item.roleName }}</span>
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
                  >{{ t('model.company.deleteCompanyUser') }}
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
      :height="'100%'"
      :destroyOnClose="true"
      :visible="drawerParam.visible"
      :get-container="false"
      @close="onClose"
    >
      <!-- :wrapClassName="`${prefixCls}-drawer`"
      :maskStyle="{ background: 'rgba(0, 0, 0, 0)' }"
      :wrap-style="{ position: 'absolute' }" -->
      <AddAdminForm
        v-if="drawerParam.state === '1'"
        :companyId="drawerParam.companyId"
        :companyName="drawerParam.comanyName"
      />
    </Drawer>
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
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Loading } from '/@/components/Loading';
  import { GetUserModel, _Columns, _Const } from '/@/api/sys/user/model/userModel';
  import { deleteCompanyUser, getAllUsers } from '/@/api/sys/user/user';
  import AddAdminForm from './AddAdminForm.vue';
  export default defineComponent({
    name: 'AdminForm',
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
      AddAdminForm,
    },
    props: {
      companyId: {
        type: String,
        require: true,
      },
      comanyName: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('company');
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
        comanyName: '',
        companyId: '',
      });

      const condition = reactive({
        state: '',
        companyId: '',
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
          if (props.companyId) {
            condition.companyId = props.companyId;
          }
          result = await getAllUsers(condition, {
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
      //加载
      onMounted(async () => {
        const result = await getList();
        processList(result);
      });
      // 操作
      const action = async (key) => {
        const code = key.key;
        const id = key?.item['data-id'] || undefined;
        switch (code) {
          case 0:
            // 删除
            try {
              loading.value = true;
              await deleteCompanyUser(id);
              success(t('model.company.deleteCompanyUser'), t('model.user.success'));
              const result = await getList();
              processList(result);
            } catch (error) {
              failed(error?.response?.data?.message, t('model.user.fail'));
            } finally {
              loading.value = false;
            }
            break;
        }
      };

      const addUser = () => {
        drawerParam.visible = true;
        drawerParam.state = '1';
        drawerParam.title = t('model.company.addCompanyUser');
        drawerParam.comanyName = props.comanyName || '';
        drawerParam.companyId = props.companyId || '';
      };

      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.title = '';
        drawerParam.comanyName = '';
        drawerParam.companyId = '';
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
        userConst,
        tip,
        props,
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
      };
    },
  });
</script>
