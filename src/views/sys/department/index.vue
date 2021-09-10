// 部门信息管理页面

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <div>
      <Button :class="prefixCls" @click="add">{{ t('model.department.addDept') }}</Button>
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
    </Drawer>
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { defineComponent, ref, reactive, onMounted } from 'vue';
  import { Table, Drawer, Button, Menu, MenuItem, Dropdown, notification } from 'ant-design-vue';
  import { DepartmentColumns, DepartmentConst } from '/@/api/sys/department/model/departmentModel';
  import { getAllDepartments, deleteDepartment } from '/@/api/sys/department/department';
  import DeptForm from './components/DeptForm.vue';

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
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('department');
      let loading = ref<boolean>(false);
      let tip = ref<string>('加载中...');
      const departmentConst = ref(DepartmentConst);

      const depts: Options[] = [];
      let list = reactive(depts);

      const loadData = async () => {
        loading.value = true;
        try {
          list.splice(0);
          const { content } = await getAllDepartments({});
          content.forEach((item) => {
            if (item.hasChild) {
              list.push(Object.assign(item, { children: [] }));
            } else {
              list.push(Object.assign(item));
            }
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
      };

      let expandedRowKeys = ref<string[]>([]);
      let selectedRowKeys = ref<string[]>([]);

      const onSelectChange = (record, selected) => {
        if (selected) {
          selectedRowKeys.value.push(record.id);
        } else {
          const flag = selectedRowKeys.value.indexOf(record.id);
          selectedRowKeys.value.splice(flag, 1);
        }
      };

      //展开行发生改变时触发
      const handleExpandedRowsChange = async (expandedRows: string[]) => {
        // loading.value = true;
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
        // loading.value = false;
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
        } catch (error) {
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

      const drawerParam = reactive({
        id: '',
        parentId: '',
        state: '', //
        title: '',
        visible: false,
      });
      const add = () => {
        drawerParam.visible = true;
        drawerParam.parentId = '';
        drawerParam.state = '0';
        drawerParam.title = t('model.department.addDept');
      };

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
            } catch (error) {
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
            } catch (error) {
              failed(error?.response?.data?.message, t('model.department.fail'));
            } finally {
              loading.value = false;
            }

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
      max-width: 500px;
    }

    &-action-menu-item {
      text-align: center;
    }
  }
</style>
