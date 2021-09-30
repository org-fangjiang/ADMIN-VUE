// 菜单信息管理页面

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <div>
      <Button v-auth="menuConst._PERMS.ADD" :class="prefixCls" @click="add">{{
        t('model.perms.addMenu')
      }}</Button>
    </div>
    <Table
      :columns="columns"
      size="middle"
      :pagination="false"
      :dataSource="list"
      :loading="loading"
      :selectedKeys="selectedRowKeys"
      :expandedRowKeys="expandedRowKeys"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      @expandedRowsChange="handleExpandedRowsChange"
      rowKey="id"
    >
      <template #state="{ text: state }">
        <span>
          <Tag :color="menuConst._TYPE[state].color">
            {{ menuConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #type="{ text: type }">
        <span>
          <Tag :color="menuConst._TYPE[type].color">
            {{ menuConst._TYPE[type].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ record }">
        <Button v-auth="menuConst._PERMS.ADD" type="link" @click="handleAdd(record)">{{
          t('model.perms.addMenu')
        }}</Button>
        <Button v-auth="menuConst._PERMS.UPDATE" type="link" @click="handleUpdate(record)">{{
          t('model.perms.updateMenu')
        }}</Button>
        <Button v-auth="menuConst._PERMS.DELETE" type="link" @click="handleDelete(record)">{{
          t('model.perms.deleteMenu')
        }}</Button>
        <Button v-auth="menuConst._PERMS.UPDATE" type="link" @click="handleReEnable(record)">{{
          t('model.perms.reEnableMenu')
        }}</Button>
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
      <MenuForm
        v-if="drawerParam.state === '0'"
        :parentId="drawerParam.parentId"
        :id="drawerParam.id"
        :parentName="drawerParam.parentName"
      />
    </Drawer>
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { defineComponent, ref, reactive, onMounted } from 'vue';
  import { Table, Tag, Drawer, Button, notification } from 'ant-design-vue';
  import { MenuConst, _Columns } from '/@/api/sys/menu/model/menuModel';
  import {
    deleteMenu,
    getChildMenu,
    getMenu,
    getParentMenu,
    reEnableMenu,
  } from '/@/api/sys/menu/menu';
  import MenuForm from './components/MenuForm.vue';
  import { useUserStore } from '/@/store/modules/user';

  interface Options {
    id?: string;
    parentId?: string;
    menuName?: string;
    path?: string;
    component?: string;
    perms?: string;
    icon?: string;
    type?: string;
    orderNum?: string;
    createTime?: string;
    updateTime?: string;
    createBy?: string;
    state?: string;
    children?: Options[];
  }
  export default defineComponent({
    name: 'Menu',
    components: {
      Table,
      MenuForm,
      Tag,
      Drawer,
      Button,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('perms');
      let loading = ref<boolean>(false);
      let tip = ref<string>('加载中...');
      const columns = reactive(_Columns);
      const menuConst = ref(MenuConst);

      const menus: Options[] = [];
      let list = reactive(menus);

      const loadData = async () => {
        loading.value = true;
        try {
          list.splice(0);
          const { content } = await getParentMenu({});
          content.forEach((item) => {
            list.push(Object.assign(item, { children: [] }));
            //将数据赋值给list，并给children一个初始的空数组
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

      //通过父级id获得子菜单赋值给result
      const getMenus = async (parentId: string) => {
        loading.value = true;
        const result: Options[] = [];
        try {
          const { content } = await getChildMenu({ parentId });
          if (content && content.length > 0) {
            content.forEach((item) => {
              if (item.type === MenuConst.MENU) {
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
        parentName: '',
        state: '',
        title: '',
        visible: false,
      });
      const onClose = async () => {
        drawerParam.id = '';
        drawerParam.parentId = '';
        drawerParam.parentName = '';
        drawerParam.state = '';
        drawerParam.title = '';
        drawerParam.visible = false;
        expandedRowKeys.value.splice(0);
        selectedRowKeys.value.splice(0);
        await loadData();
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
      const userStore = useUserStore();
      const companyId = userStore.getUserInfo.companyId;
      const add = () => {
        drawerParam.visible = true;
        drawerParam.parentId = companyId;
        drawerParam.parentName = '';
        drawerParam.state = '0';
        drawerParam.title = t('model.perms.addMenu');
      };

      const handleUpdate = async (record) => {
        drawerParam.visible = true;
        drawerParam.id = record.id;
        drawerParam.state = '0';
        drawerParam.title = t('model.perms.updateMenu');

        //判断更新的是不是一级菜单，是的话，上级名称为空
        const allMenu = await getParentMenu({});
        const ids = [''];
        allMenu.content.forEach((e) => {
          if (e.id) {
            ids.push(e.id);
          }
        });
        if (ids.includes(record.id)) {
          drawerParam.parentName = '';
        } else {
          const { content } = await getMenu({ id: record.parentId });
          drawerParam.parentName = content.menuName || '';
        }
      };

      const handleAdd = async (record) => {
        drawerParam.visible = true;
        drawerParam.parentId = record.id;
        drawerParam.state = '0';
        drawerParam.title = t('model.perms.addMenu');
        drawerParam.parentName = record.menuName;
      };

      const handleDelete = async (record) => {
        try {
          loading.value = true;
          await deleteMenu({ id: record.id });
          success(t('model.perms.deleteMenu'), t('model.perms.success'));
          expandedRowKeys.value.splice(0);
          selectedRowKeys.value.splice(0);
          await loadData();
        } catch (error) {
          failed(error?.response?.data?.message, t('model.perms.fail'));
        } finally {
          loading.value = false;
        }
      };

      const handleReEnable = async (record) => {
        try {
          loading.value = true;
          await reEnableMenu({ id: record.id });
          success(t('model.perms.deleteMenu'), t('model.perms.success'));
          expandedRowKeys.value.splice(0);
          selectedRowKeys.value.splice(0);
          await loadData();
        } catch (error) {
          failed(error?.response?.data?.message, t('model.perms.fail'));
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

      const addChild = (expandedRows: string[], parent: Options[], children: Options[]) => {
        parent.forEach((item) => {
          //先找到展开的根节点
          if (item.id === expandedRows[0]) {
            //最近展开的一层
            if (expandedRows.length === 1) {
              if (children.length === 0) {
                //没有子菜单，删除展开按钮加号
                delete item.children;
              } else {
                //遍历children，赋值给父菜单的children
                // 判断是子节点是否存在数据
                if (item.children && item.children.length > 0) {
                  return;
                }
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
      //展开行发生改变时触发
      const handleExpandedRowsChange = async (expandedRows: string[]) => {
        if (expandedRows.length === 0) {
          expandedRowKeys.value = expandedRows;
          return;
        }
        //获取当前要展开的节点
        const parentId = expandedRows[expandedRows.length - 1];
        const children = await getMenus(parentId);
        //当前展开的所有结点
        const flags: string[] = [];
        expandedRows.forEach((item) => {
          flags.push(item);
        });
        //调用递归函数
        addChild(flags, list, children);
        expandedRowKeys.value = expandedRows;
      };

      onMounted(async () => {
        await loadData();
      });
      return {
        t,
        prefixCls,
        tip,
        loading,
        columns,
        menuConst,
        list,
        onClose,
        handleUpdate,
        add,
        handleAdd,
        handleDelete,
        handleReEnable,
        handleExpandedRowsChange,
        drawerParam,
        expandedRowKeys,
        selectedRowKeys,
        onSelectChange,
        loadData,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-perms';
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
