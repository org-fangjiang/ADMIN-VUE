// 部门信息管理页面

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <div>
      <Button :class="prefixCls" @click="add" class="my-4">{{
        t('model.department.addDept')
      }}</Button>
    </div>
    <Table
      :columns="DepartmentColumns"
      size="middle"
      :pagination="false"
      :dataSource="list"
      :loading="loading"
      :selectedKeys="selectedRowKeys"
      :expandedRowKeys="expandedRowKeys"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      @expandedRowsChange="handleExpandedRowsChange"
      rowKey="deptId"
      class="w-1/2"
    >
      <template #action="{ text: department }">
        <Dropdown placement="bottomCenter" trigger="click">
          <Button type="link">{{ t('model.department.action') }}</Button>
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem
                :key="0"
                :data-id="department.deptId"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button v-auth="departmentConst._PERMS.UPDATE" type="link" size="small">{{
                  t('model.department.updateDept')
                }}</Button>
              </MenuItem>
              <MenuItem
                :key="1"
                :data-id="department.deptId"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button v-auth="departmentConst._PERMS.ADD" type="link" size="small">{{
                  t('model.department.addDept')
                }}</Button>
              </MenuItem>
              <MenuItem
                :key="2"
                :data-id="department.deptId"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button v-auth="departmentConst._PERMS.DELETE" type="link" size="small">{{
                  t('model.department.deleteDept')
                }}</Button>
              </MenuItem>
              <MenuItem
                :key="3"
                :data-id="department.deptId"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button type="link" size="small">{{ t('model.department.addUser') }}</Button>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </template>
    </Table>
    <Drawer
      :zIndex="1"
      :title="drawerParam.title"
      :width="'100%'"
      :destroyOnClose="true"
      :visible="drawerParam.visible"
      :get-container="false"
      :wrapClassName="`${prefixCls}-drawer`"
      :maskStyle="{ background: 'rgba(0, 0, 0, 0)' }"
      :wrap-style="{ position: 'fixed', top: '80px', righ: '0' }"
      @close="onClose"
    >
      <DeptForm
        v-if="drawerParam.state === '0'"
        :parentId="drawerParam.parentId"
        :id="drawerParam.id"
      />
      <AddUser :id="drawerParam.id" v-if="drawerParam.state === '1'" />
    </Drawer>
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { defineComponent, ref, reactive, onMounted } from 'vue';
  import { Table, Drawer, Button, Menu, MenuItem, Dropdown } from 'ant-design-vue';
  import { DepartmentColumns, DepartmentConst } from '/@/api/sys/department/model/departmentModel';
  import { getAllDepartments, deleteDepartment } from '/@/api/sys/department/department';
  import DeptForm from './components/DeptForm.vue';
  import { success, failed } from '/@/hooks/web/useList';
  import AddUser from './components/AddUser.vue';

  interface Options {
    deptId?: string;
    parentId?: string;
    deptName?: string;
    orderNum?: number;
    createTime?: string;
    updateTime?: string;
    createBy?: string;
    updateBy?: string;
    companyId?: string;
    hasChild?: boolean;
    children?: Options[];
  }
  export default defineComponent({
    name: 'Department',
    components: {
      Table,
      DeptForm,
      Drawer,
      Button,
      Menu,
      MenuItem,
      Dropdown,
      AddUser,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      //样式前准
      const { prefixCls } = useDesign('department');
      //加载动画
      let loading = ref<boolean>(false);
      let tip = ref<string>('加载中...');
      const departmentConst = ref(DepartmentConst);
      //数据类型
      const depts: Options[] = [];
      let list = reactive(depts);

      //获取最外层数据
      const loadData = async () => {
        loading.value = true;
        try {
          list.splice(0);
          const { content } = await getAllDepartments({});
          content.forEach((item) => {
            if (item.hasChild) {
              //如果有子项，先给一个空数组，展示加号
              list.push(Object.assign(item, { children: [] }));
            } else {
              list.push(Object.assign(item));
            }
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
      };

      let expandedRowKeys = ref<string[]>([]); //展开的数据
      let selectedRowKeys = ref<string[]>([]); //选中的数据

      //选中的数据发生改变时
      const onSelectChange = (record, selected) => {
        if (selected) {
          //选中
          selectedRowKeys.value.push(record.id);
        } else {
          //取消选中，获取要取消的id，在选中的数据中进行删除
          const flag = selectedRowKeys.value.indexOf(record.id);
          selectedRowKeys.value.splice(flag, 1);
        }
      };

      //展开行发生改变时触发
      const handleExpandedRowsChange = async (expandedRows: string[]) => {
        if (expandedRows.length === 0) {
          return;
        }
        //获取当前要展开的节点
        const parentId = expandedRows[expandedRows.length - 1];
        const children = await getDepts(parentId);
        //当前展开的所有结点
        const flags: string[] = [];
        expandedRows.forEach((item) => {
          flags.push(item);
        });
        //调用递归函数
        addChild(flags, list, children);
        expandedRowKeys.value = expandedRows;
      };
      const addChild = (expandedRows: string[], parent: Options[], children: Options[]) => {
        parent.forEach((item) => {
          //先找到展开的根节点
          if (item.deptId === expandedRows[0]) {
            //最近展开的一层
            if (expandedRows.length === 1) {
              if (children.length === 0) {
                //没有子菜单，删除展开按钮加号
                delete item.children;
              } else {
                //遍历children，赋值给父菜单的children
                children.forEach((cItem) => {
                  if (!item.children) {
                    item.children = [];
                  }
                  item.children.push(cItem);
                });
              }
              return;
            }
            expandedRows.splice(0, 1); //删除第一项数据
            addChild(expandedRows, item.children || [], children);
          }
        });
      };
      //通过点击的当前id获得子菜单，并判断是否有子项，赋值给result
      const getDepts = async (parentId: string) => {
        loading.value = true;
        const result: Options[] = [];
        try {
          const { content } = await getAllDepartments({ parentId: parentId });
          if (content && content.length > 0) {
            content.forEach((item) => {
              if (item.hasChild) {
                result.push(Object.assign(item, { children: [] }));
              } else {
                result.push(item);
              }
            });
          }
        } catch (error: any) {
          createErrorModal({
            title: t('sys.api.errorTip'),
            content: error?.response?.data?.message || t('sys.api.networkExceptionMsg'),
            getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
          });
        } finally {
          loading.value = false;
          return result;
        }
      };
      //抽屉参数
      const drawerParam = reactive({
        id: '',
        parentId: '',
        state: '', //
        title: '',
        visible: false,
      });
      //添加部门
      const add = () => {
        drawerParam.visible = true;
        drawerParam.parentId = '';
        drawerParam.state = '0';
        drawerParam.title = t('model.department.addDept');
      };
      //操作
      const action = async (key) => {
        const code = key.key;
        const id = key?.item['data-id'] || undefined;
        switch (code) {
          case 0:
            // update
            drawerParam.state = '0';
            drawerParam.id = id;
            drawerParam.title = t('model.department.updateDept');
            drawerParam.visible = true;
            break;
          case 1:
            // add
            try {
              loading.value = true;
              drawerParam.state = '0';
              drawerParam.parentId = id;
              drawerParam.title = t('model.department.addDept');
              drawerParam.visible = true;
            } catch (error: any) {
              failed(error?.response?.data?.message, t('model.department.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 2:
            // delete
            try {
              loading.value = true;
              await deleteDepartment({ deptId: id });
              success(t('model.department.deleteDept'), t('model.department.success'));
              expandedRowKeys.value.splice(0);
              selectedRowKeys.value.splice(0);
              await loadData();
            } catch (error: any) {
              failed(error?.response?.data?.message, t('model.department.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 3:
            // add user
            drawerParam.state = '1';
            drawerParam.id = id;
            drawerParam.title = t('model.department.addUser');
            drawerParam.visible = true;
            break;
        }
      };

      //关闭抽屉
      const onClose = async () => {
        drawerParam.id = '';
        drawerParam.parentId = '';
        drawerParam.state = '';
        drawerParam.title = '';
        drawerParam.visible = false;
        expandedRowKeys.value.splice(0);
        selectedRowKeys.value.splice(0);
        await loadData();
      };

      //页面初始加载
      onMounted(async () => {
        await loadData();
      });

      return {
        t,
        prefixCls,
        tip,
        loading,
        departmentConst,
        DepartmentColumns,
        loadData,
        list,
        expandedRowKeys,
        selectedRowKeys,
        onSelectChange,
        handleExpandedRowsChange,
        drawerParam,
        onClose,
        action,
        add,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-department';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;
    }
  }

  .@{prefix-cls} {
    &-drawer {
      max-width: 800px;
    }

    &-action-menu-item {
      text-align: center;
    }
  }
</style>
