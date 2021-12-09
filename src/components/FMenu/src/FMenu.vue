<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <Button @click="handleAdd" class="setMargin">保存</Button>
    <Table
      :columns="Component_Columns"
      size="middle"
      :pagination="false"
      :dataSource="list"
      :loading="loading"
      :selectedKeys="selectedRowKeys"
      :expandedRowKeys="expandedRowKeys"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onSelect: onSelectChange }"
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
    </Table>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { defineComponent, ref, reactive, onMounted } from 'vue';
  import { Table, Tag, Button } from 'ant-design-vue';
  import {
    MenuConst,
    _Component_Columns as Component_Columns,
  } from '/@/api/sys/menu/model/menuModel';
  import { getChildMenu, getParentMenu } from '/@/api/sys/menu/menu';
  import { Loading } from '/@/components/Loading';
  import { setRoleMenu } from '/@/api/sys/role/role';
  import { RoleModel } from '/@/api/sys/role/model/roleModel';
  import { success, failed } from '/@/hooks/web/useList';

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
    name: 'FMenu',
    components: {
      Table,
      Tag,
      Button,
      Loading,
    },
    props: {
      expandedKeys: {
        type: Array,
        require: false,
      },
      roleId: {
        type: String,
        require: false,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('menu');
      let loading = ref<boolean>(false);
      let tip = ref<string>('加载中...');
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

      const addChild = (expandedRows: string[], parent: Options[], children: Options[]) => {
        parent.forEach((item) => {
          //先找到展开的根节点
          // if (item.id === expandedRows[0]) {
          //   //最近展开的一层
          //   if (expandedRows.length === 1) {
          //     if (children.length === 0) {
          //       //没有子菜单，删除展开按钮加号
          //       delete item.children;
          //     } else {
          //       //遍历children，赋值给父菜单的children
          //       // 判断是子节点是否存在数据
          //       if (item.children && item.children.length > 0) {
          //         return;
          //       }
          //       children.forEach((cItem) => {
          //         if (!item.children) {
          //           item.children = [];
          //         }
          //         item.children.push(cItem);
          //       });
          //     }
          //     return;
          //   }
          //   expandedRows.splice(0, 1); //删除第一项数据
          //   addChild(expandedRows, item.children || [], children);
          // }
          if (item.id === expandedRows[expandedRows.length - 1]) {
            if (item.children && item.children.length > 0) {
              return;
            }
            children.forEach((cItem) => {
              if (!item.children) {
                item.children = [];
              }
              item.children.push(cItem);
            });
            return;
          }
          addChild(expandedRows, item.children || [], children);
        });
      };

      let expandedRowKeys = ref<string[]>([]);
      let selectedRowKeys = ref<string[]>(props.expandedKeys as string[]);

      const onSelectChange = (record, selected) => {
        if (selected) {
          selectedRowKeys.value.push(record.id);
        } else {
          const flag = selectedRowKeys.value.indexOf(record.id);
          selectedRowKeys.value.splice(flag, 1);
        }
      };

      //保存
      const handleAdd = async () => {
        try {
          loading.value = true;
          const updatemenus: RoleModel[] = [];
          selectedRowKeys.value.forEach((item) => {
            updatemenus.push({ id: item });
          });
          await setRoleMenu({
            id: props.roleId,
            menus: updatemenus,
          });
          success(t('model.role.setRoleMenu'), t('model.role.success'));
        } catch (error: any) {
          failed(error?.response?.data?.message, t('model.role.fail'));
        } finally {
          loading.value = false;
        }
      };

      onMounted(async () => {
        await loadData();
      });
      return {
        t,
        prefixCls,
        tip,
        loading,
        menuConst,
        list,
        handleAdd,
        handleExpandedRowsChange,
        selectedRowKeys,
        expandedRowKeys,
        onSelectChange,
        loadData,
        props,
        Component_Columns,
      };
    },
  });
</script>
<style lang="less">
  .setMargin {
    @apply mb-5;
  }
</style>
