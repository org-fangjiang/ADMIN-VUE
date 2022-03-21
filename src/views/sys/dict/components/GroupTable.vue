// 字典分组

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <!-- 状态筛选 -->
    <Select
      ref="select"
      :allowClear="true"
      v-model:value="condition.state"
      style="width: 120px"
      @change="stateHandleChange"
      :options="dictConst.STATES"
      :class="`${prefixCls}-select`"
    />
    <!-- 添加分组 -->
    <Button :class="`${prefixCls}-select`" v-auth="dictConst._PERMS.ADD" @click="onAddGroup">{{
      t('model.dict.group.addGroup')
    }}</Button>
    <Table :columns="groupColumns" :data-source="list" rowKey="id" size="small" :pagination="false">
      <template #state="{ text: state }">
        <span>
          <Tag :color="dictConst.STATES[state].color">
            {{ dictConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #action="{ text: group }">
        <!-- 操作下拉框 -->
        <Dropdown placement="bottomCenter" trigger="click">
          <Button
            v-if="
              hasPermission([
                dictConst._PERMS.ADD,
                dictConst._PERMS.DELETE,
                dictConst._PERMS.UPDATE,
              ])
            "
            type="link"
            >{{ t('model.dict.group.action') }}</Button
          >
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem
                v-if="hasPermission(dictConst._PERMS.DELETE)"
                :key="0"
                :data-id="group.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button :class="prefixCls" v-auth="dictConst._PERMS.DELETE" type="link" size="small"
                  >{{ t('model.dict.group.deleteGroup') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="hasPermission(dictConst._PERMS.UPDATE)"
                :key="1"
                :data-id="group.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  v-auth="dictConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('model.dict.group.recoveryGroup') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="hasPermission(dictConst._PERMS.ADD)"
                :key="2"
                :data-id="group.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button v-auth="dictConst._PERMS.ADD" type="link" size="small" :class="prefixCls">
                  {{ t('model.dict.detail.addDetail') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="hasPermission(dictConst._PERMS.UPDATE)"
                :key="3"
                :data-id="group.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  v-auth="dictConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('model.dict.group.updateGroup') }}
                </Button>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </template>
      <template #expandedRowRender="{ record }">
        <slot name="group" :group="record"></slot>
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
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getSysDictGroups, deleteSysDictGroup, reEnableSysDictGroup } from '/@/api/sys/dict/dict';
  import { GroupColumns, DictGroupModel, DictConst } from '/@/api/sys/dict/model/dictModel';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { Table, Pagination, Tag, Button, Dropdown, Menu, MenuItem, Select } from 'ant-design-vue';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Loading } from '/@/components/Loading';
  import { processList, success, failed } from '/@/hooks/web/useList';
  import { usePermission } from '/@/hooks/web/usePermission';

  export default defineComponent({
    name: 'GroupTable',
    components: {
      Table,
      Pagination,
      Tag,
      Button,
      Dropdown,
      Menu,
      MenuItem,
      Loading,
      Select,
    },
    props: {},
    emits: ['onAddDetail', 'onUpdateGroup', 'onAddGroup'],
    setup(_props, { emit }) {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('dict');
      const dictConst = ref(DictConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);

      // 判断权限
      const { hasPermission } = usePermission();

      //列
      const groupColumns = reactive(GroupColumns);
      //分页参数
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });
      //获取数据的条件
      const condition = reactive({
        state: '1',
        detailId: '',
      });
      //根据状态筛选
      const stateHandleChange = async (value) => {
        condition.state = value;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };
      const groups: DictGroupModel[] = [];
      let list = reactive(groups);
      //获取数据
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<DictGroupModel> | undefined;
        try {
          result = await getSysDictGroups(condition, {
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
      //初始加载
      onMounted(async () => {
        const result = await getList();
        processList(result, list, pageParam);
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
              const group: DictGroupModel = { id: id };
              await deleteSysDictGroup(group);
              success(t('model.dict.group.deleteGroup'), t('model.dict.group.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('model.dict.group.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 1:
            // 恢复
            try {
              loading.value = true;
              const group: DictGroupModel = { id: id };
              await reEnableSysDictGroup(group);
              success(t('model.dict.group.recoveryGroup'), t('model.dict.group.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('model.dict.group.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 2:
            addDetail(id);
            break;
          case 3:
            updateGroup(id);
            break;
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
      //添加详情
      const addDetail = (groupId) => {
        emit('onAddDetail', { groupId });
      };
      //更新分组
      const updateGroup = (groupId) => {
        emit('onUpdateGroup', { groupId });
      };
      //添加分组
      const onAddGroup = () => {
        emit('onAddGroup');
      };
      //刷新列表
      const refresh = async () => {
        const result = await getList();
        processList(result, list, pageParam);
      };
      return {
        t,
        prefixCls,
        dictConst,
        tip,
        groupColumns,
        loading,
        pageSizeList,
        pageParam,
        condition,
        stateHandleChange,
        list,
        onChange,
        onShowSizeChange,
        action,
        addDetail,
        updateGroup,
        onAddGroup,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        refresh,
        hasPermission,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-dict';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;
    }
  }

  .@{prefix-cls} {
    &-select {
      margin-top: 20px;
      margin-right: 10px;
      margin-bottom: 20px;
    }
  }
</style>
