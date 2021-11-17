// 违规词库管理页面

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <Button v-auth="violationConst._PERMS.ADD" @click="addViolation" :class="`${prefixCls}-select`">
      {{ t('component.action.add') }}
    </Button>
    <Button
      v-auth="violationConst._PERMS.DELETE"
      @click="deleteViolation"
      :class="`${prefixCls}-select`"
    >
      {{ t('component.action.delete') }}
    </Button>
    <Button
      v-auth="violationConst._PERMS.UPDATE"
      @click="renableViolation"
      :class="`${prefixCls}-select`"
    >
      {{ t('component.action.reEnable') }}
    </Button>
    <Table
      :row-selection="{ selectedRowKeys: selected, onChange: onSelectChange }"
      :columns="ViolationColumns"
      :data-source="list"
      rowKey="id"
      :pagination="false"
    >
      <template #state="{ text: state }">
        <span>
          <Tag :color="violationConst.STATES[state].color">
            {{ violationConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: line }">
        <!-- 操作下拉框 -->
        <Dropdown placement="bottomCenter" trigger="click">
          <Button type="link">{{ t('component.action.index') }}</Button>
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem :key="0" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="violationConst._PERMS.DELETE"
                  :class="prefixCls"
                  type="link"
                  size="small"
                  >{{ t('component.action.delete') }}
                </Button>
              </MenuItem>
              <MenuItem :key="1" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="violationConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('component.action.reEnable') }}
                </Button>
              </MenuItem>
              <MenuItem :key="2" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="violationConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('component.action.update') }}
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
      <ViolationForm v-if="drawerParam.state === '0'" :id="drawerParam.id" />
    </Drawer>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { Table, Pagination, Tag, Button, Drawer, Dropdown, Menu, MenuItem } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { processList, success, failed } from '/@/hooks/web/useList';
  import {
    _Const,
    ViolationModel,
    _ViolationColumns as ViolationColumns,
  } from '/@/api/sys/violation/model/violationModel';
  import {
    deleteAll,
    deleteOne,
    getByPage,
    reEnable,
    reEnableAll,
  } from '/@/api/sys/violation/violation';
  import ViolationForm from './components/ViolationForm.vue';

  export default defineComponent({
    name: 'ViolationTable',
    components: {
      Table,
      Pagination,
      Tag,
      Button,
      Drawer,
      Dropdown,
      Menu,
      MenuItem,
      Loading,
      ViolationForm,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('trading');
      const violationConst = ref(_Const);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      // 分页
      const pageSizeList = ref<string[]>(PageSizeList);
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });
      // 筛选条件
      const condition = reactive({
        state: '',
        value: '',
        id: '',
      });

      // 列表结果
      const violation: ViolationModel[] = [];
      let list = reactive(violation);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<ViolationModel> | undefined;
        try {
          result = await getByPage(condition, {
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

      //页面初始化加载
      onMounted(async () => {
        const result = await getList();
        processList(result, list, pageParam);
      });

      // 抽屉参数
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
      });
      //关闭抽屉
      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        const result = await getList();
        processList(result, list, pageParam);
      };

      // 添加
      const addViolation = () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('component.action.add');
      };

      // 操作
      const action = async (key) => {
        const code = key.key;
        const id = key?.item['data-id'] || undefined;
        switch (code) {
          case 0:
            // 删除
            try {
              loading.value = true;
              await deleteOne(id);
              success(t('component.action.delete'), t('model.violation.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('model.violation.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 1:
            // 恢复
            try {
              loading.value = true;
              await reEnable(id);
              success(t('model.violation.reEnable'), t('model.violation.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('model.violation.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 2:
            // 更新
            drawerParam.visible = true;
            drawerParam.state = '0';
            drawerParam.id = id;
            drawerParam.title = t('component.action.update');
            break;
        }
      };

      //选中行id
      let selected = ref<string[]>([]);
      const onSelectChange = async (selectedRowKeys) => {
        selected.value = selectedRowKeys;
      };

      //批量恢复
      const renableViolation = async () => {
        try {
          loading.value = true;
          await reEnableAll(selected.value);
          success(t('model.violation.reEnable'), t('model.violation.success'));
          const result = await getList();
          processList(result, list, pageParam);
          selected.value.splice(0);
        } catch (error: any) {
          failed(error?.response?.data?.message, t('model.violation.fail'));
        } finally {
          loading.value = false;
        }
      };

      //批量删除
      const deleteViolation = async () => {
        try {
          loading.value = true;
          await deleteAll(selected.value);
          success(t('model.violation.delete'), t('model.violation.success'));
          const result = await getList();
          processList(result, list, pageParam);
          selected.value.splice(0);
        } catch (error: any) {
          failed(error?.response?.data?.message, t('model.violation.fail'));
        } finally {
          loading.value = false;
        }
      };

      //页码改变
      const onChange = async (page) => {
        pageParam.number = page;
        const result = await getList();
        processList(result, list, pageParam);
      };
      //每页条数改变
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
        violationConst,
        ViolationColumns,
        loading,
        tip,
        pageSizeList,
        list,
        drawerParam,
        pageParam,
        onChange,
        onShowSizeChange,
        onClose,
        addViolation,
        action,
        condition,
        onSelectChange,
        renableViolation,
        deleteViolation,
        selected,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-trading';
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

    &-select {
      margin-top: 20px;
      margin-right: 10px;
      margin-bottom: 20px;
    }
  }
</style>
