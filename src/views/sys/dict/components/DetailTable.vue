// 字典详情

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <Table :columns="detailColumns" :data-source="list" rowKey="id" size="small">
      <template #state="{ text: state }">
        <span>
          <Tag :color="dictConst.STATES[state].color">
            {{ dictConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #action="{ text: detail }">
        <!-- 操作下拉框 -->
        <Dropdown placement="bottomCenter" trigger="click">
          <Button type="link">{{ t('model.dict.detail.action') }}</Button>
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem :key="0" :data-id="detail.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button :class="prefixCls" v-auth="dictConst._PERMS.DELETE" type="link" size="small"
                  >{{ t('model.dict.detail.deleteDetail') }}
                </Button>
              </MenuItem>
              <MenuItem :key="1" :data-id="detail.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="dictConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('model.dict.detail.recoveryDetail') }}
                </Button>
              </MenuItem>
              <MenuItem :key="2" :data-id="detail.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="dictConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('model.dict.detail.updateDetail') }}
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
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import {
    getSysDictDetails,
    deleteSysDictDetail,
    reEnableSysDictDetail,
  } from '/@/api/sys/dict/dict';
  import { DetailColumns, DictDetailModel, DictConst } from '/@/api/sys/dict/model/dictModel';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Table, Pagination, Tag, Button, Dropdown, Menu, MenuItem } from 'ant-design-vue';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Loading } from '/@/components/Loading';
  export default defineComponent({
    name: 'DetailTable',
    components: {
      Table,
      Pagination,
      Tag,
      Button,
      Dropdown,
      Menu,
      MenuItem,
      Loading,
    },
    props: {
      groupId: {
        type: String,
        require: true,
      },
    },
    emits: ['onUpdateDetail'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('dict');
      const dictConst = ref(DictConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const formRef = ref();
      const rules = reactive(DictConst._DETAIL_RULES);
      const pageSizeList = ref<string[]>(PageSizeList);
      const detailColumns = reactive(DetailColumns);
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });
      const formState: UnwrapRef<DictDetailModel> = reactive({
        id: '',
        name: '',
        groupId: '',
        state: '',
      });
      const condition = reactive({
        state: '',
        groupId: props.groupId,
      });

      const detailModels: DictDetailModel[] = [];
      let list = reactive(detailModels);

      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<DictDetailModel> | undefined;
        try {
          result = await getSysDictDetails(condition, {
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
      onMounted(async () => {
        loading.value = true;
        const result = await getList();
        processList(result);
        loading.value = false;
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
              const detail: DictDetailModel = { id: id };
              await deleteSysDictDetail(detail);
              success(t('model.dict.detail.deleteDetail'), t('model.dict.detail.success'));
              const result = await getList();
              processList(result);
            } catch (error) {
              failed(error?.response?.data?.message, t('model.dict.detail.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 1:
            // 恢复
            try {
              loading.value = true;
              const detail: DictDetailModel = { id: id };
              await reEnableSysDictDetail(detail);
              success(t('model.dict.detail.recoveryDetail'), t('model.dict.detail.success'));
              const result = await getList();
              processList(result);
            } catch (error) {
              failed(error?.response?.data?.message, t('model.dict.detail.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 2:
            updateDetail(id);
            break;
        }
      };
      //更新地区
      const updateDetail = (detailId) => {
        emit('onUpdateDetail', { detailId });
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
      const onShowSizeChange = async (current, size) => {
        console.log(current);
        pageParam.size = size;
        pageParam.number = 1;
        const result = await getList();
        processList(result);
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
        rules,
        formRef,
        detailColumns,
        loading,
        pageSizeList,
        pageParam,
        list,
        onChange,
        updateDetail,
        onShowSizeChange,
        action,
        formState,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        refresh,
      };
    },
  });
</script>
