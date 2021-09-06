// 菜单信息管理页面

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <Table
      :columns="menuColumns"
      size="middle"
      :pagination="false"
      :dataSource="list"
      :loading="loading"
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
        <Button @click="handleAdd(record)">{{ t('model.menu.addMenu') }}</Button>
        <Button @click="handleUpdate(record)">{{ t('model.menu.updateMenu') }}</Button>
        <Button @click="handleDelete(record)">{{ t('model.menu.deleteMenu') }}</Button>
        <Button @click="handleReEnable(record)">{{ t('model.menu.reEnableMenu') }}</Button>
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
      <MenuForm :parentId="drawerParam.parentId" :id="drawerParam.id" />
    </Drawer>
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { defineComponent, ref, reactive, onMounted } from 'vue';
  import { Table, Tag, Drawer, Button } from 'ant-design-vue';
  import { MenuConst, _Columns } from '/@/api/sys/menu/model/menuModel';
  import { deleteMenu, getChildMenu, getParentMenu, reEnableMenu } from '/@/api/sys/menu/menu';
  import MenuForm from './components/MenuForm.vue';

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
      const { prefixCls } = useDesign('menu');
      let loading = ref<boolean>(false);
      let tip = ref<string>('加载中...');
      const menuColumns = reactive(_Columns);
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
              result.push(Object.assign(item, { children: [] }));
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
        state: '', // 0: area 1: city 2: provice
        title: '',
        visible: false,
      });
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

      let expandedRowKeys = ref<string[]>([]);
      let selectedRowKeys = ref<string[]>([]);

      const onSelectChange = (selectedRowKeys, _selectedRows) => {
        if (selectedRowKeys && selectedRowKeys.length > 0) {
          selectedRowKeys.forEach(async (element) => {
            const { content } = await getChildMenu({ parentId: element });
            if (content && content.length > 0) {
              content.forEach((item) => {
                if (!list.includes(item)) {
                  list.push(item);
                }
              });
            }
          });
        }
      };

      const handleUpdate = (record) => {
        drawerParam.visible = true;
        drawerParam.id = record.id;
        drawerParam.state = '0';
        drawerParam.title = t('model.menu.updateMenu');
      };

      const handleAdd = (record) => {
        drawerParam.visible = true;
        drawerParam.parentId = record.id;
        drawerParam.state = '0';
        drawerParam.title = t('model.menu.addMenu');
      };

      const handleDelete = async (record) => {
        await deleteMenu({ id: record.id });
        expandedRowKeys.value.splice(0);
        selectedRowKeys.value.splice(0);
        await loadData();
      };

      const handleReEnable = async (record) => {
        await reEnableMenu({ id: record.id });
        expandedRowKeys.value.splice(0);
        selectedRowKeys.value.splice(0);
        await loadData();
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
        menuColumns,
        menuConst,
        list,
        onClose,
        handleUpdate,
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
  @prefix-cls: ~'@{namespace}-menu';
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
