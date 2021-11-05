// 字典分组

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <Select
      ref="select"
      :allowClear="true"
      v-model:value="condition.state"
      style="width: 120px"
      @change="stateHandleChange"
      :options="dictConst.STATES"
      :class="`${prefixCls}-select`"
    />
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
          <Button type="link">{{ t('model.dict.group.action') }}</Button>
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem :key="0" :data-id="group.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button :class="prefixCls" v-auth="dictConst._PERMS.DELETE" type="link" size="small"
                  >{{ t('model.dict.group.deleteGroup') }}
                </Button>
              </MenuItem>
              <MenuItem :key="1" :data-id="group.id" :class="`${prefixCls}-action-menu-item`">
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
              <MenuItem :key="2" :data-id="group.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button v-auth="dictConst._PERMS.ADD" type="link" size="small" :class="prefixCls">
                  {{ t('model.dict.detail.addDetail') }}
                </Button>
              </MenuItem>
              <MenuItem :key="3" :data-id="group.id" :class="`${prefixCls}-action-menu-item`">
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
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('dict');
      const dictConst = ref(DictConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      const groupColumns = reactive(GroupColumns);
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });
      const condition = reactive({
        state: '',
        detailId: '',
      });

      const stateHandleChange = async (value) => {
        condition.state = value;
        const result = await getList();
        processList(result);
      };
      const groups: DictGroupModel[] = [];
      let list = reactive(groups);

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

      onMounted(async () => {
        const result = await getList();
        processList(result);
      });

      function processList(result: any) {
        if (!result) {
          return;
        }
        const { page, content } = result;
        list.splice(0);
        content.forEach((company) => {
          list.push(company);
        });
        page.number = page.number + 1;
        Object.assign(pageParam, {}, page);
      }

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
              processList(result);
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
              processList(result);
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

      const onChange = async (page) => {
        pageParam.number = page;
        const result = await getList();
        processList(result);
      };

      const changedict = async (_e) => {};

      const onShowSizeChange = async (current, size) => {
        console.log(current);
        pageParam.size = size;
        pageParam.number = 1;
        const result = await getList();
        processList(result);
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
        processList(result);
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
        changedict,
        onShowSizeChange,
        action,
        addDetail,
        updateGroup,
        onAddGroup,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        refresh,
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
