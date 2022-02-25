//渠道负责人管理
<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <!-- 状态筛选 -->
    <Select
      :class="`${prefixCls}-add`"
      ref="select"
      :allowClear="true"
      v-model:value="condition.state"
      style="width: 120px"
      @change="stateHandleChange"
      :options="channelCaseConst.STATES"
      :pagination="false"
    />
    <Select
      :showSearch="true"
      ref="select"
      :allowClear="true"
      v-model:value="condition.contact"
      style="width: 120px"
      @search="contactChange"
      :pagination="false"
      :filter-option="false"
      :not-found-content="fetching ? undefined : null"
      placeholder="联系方式"
      :class="`${prefixCls}-add`"
    >
      <template v-if="fetching" #notFoundContent>
        <Spin size="small" />
      </template>
    </Select>
    <Button @click="addChannelCase"> 确定 </Button>
    <Table
      :columns="channelCaseColumns"
      :data-source="list"
      rowKey="id"
      :pagination="false"
      :scroll="{ y: 'calc(70vh)' }"
      :row-selection="{ selectedRowKeys: rows, onChange: onSelectChange, type: 'radio' }"
    >
      <template #avatar="{ text: avatar }">
        <Image :src="avatar" width="63px" />
      </template>
      <template #state="{ text: state }">
        <span>
          <Tag :color="channelCaseConst.STATES[state].color">
            {{ channelCaseConst.STATES[state].label }}
          </Tag>
        </span>
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
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { Table, Pagination, Tag, Button, Select, Image, Spin } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { processList, success, failed } from '/@/hooks/web/useList';
  import {
    ChannelCaseModel,
    _ChannelCaseConst,
    Columns,
  } from '/@/api/host/channelCase/model/channelCaseModel';
  import { getChannelCases } from '/@/api/host/channelCase/channelCase';
  import { debounce } from 'lodash-es';
  import { setProjectChannelCase } from '/@/api/host/projectChannel/projectChannel';

  export default defineComponent({
    name: 'CaseTable',
    components: {
      Select,
      Table,
      Pagination,
      Tag,
      Button,
      Loading,
      Image,
      // FProjectSelect,
      Spin,
    },
    props: {
      channelId: {
        type: String,
        required: true,
      },
      projectId: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('channel');
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);

      const channelCaseColumns = reactive(Columns);
      const channelCaseConst = ref(_ChannelCaseConst);
      // 选中行
      let rows = reactive<string[]>([]);
      const onSelectChange = (selectedRowKeys) => {
        rows.splice(0);
        selectedRowKeys.forEach((item) => {
          rows.push(item);
        });
      };

      const addChannelCase = async () => {
        await setProjectChannelCase(props.projectId, rows[0]);
        success('成功', '设置成功');
      };

      // 分页
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });

      //初始加载
      onMounted(async () => {
        const result = await getList();
        processList(result, list, pageParam);
      });

      // 筛选条件
      const condition = reactive({
        state: '1',
        id: '',
        channelId: props.channelId,
        projectId: '',
        contact: undefined,
      });

      //根据状态筛选
      const stateHandleChange = async (value) => {
        condition.state = value;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      //根据联系方式筛选
      let fetching = ref<boolean>(false);
      const contactChange = debounce(async (value) => {
        fetching.value = true;
        condition.contact = value;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
        // condition.contact = '';
        fetching.value = false;
      }, 1000);

      const channelCase: ChannelCaseModel[] = [];
      // 列表结果
      let list = reactive(channelCase);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<ChannelCaseModel> | undefined;
        try {
          result = await getChannelCases(condition, {
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

      //页码修改
      const onChange = async (page) => {
        pageParam.number = page;
        const result = await getList();
        processList(result, list, pageParam);
      };
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
        channelCaseConst,
        condition,
        channelCaseColumns,
        loading,
        tip,
        pageSizeList,
        list,
        pageParam,
        onChange,
        onShowSizeChange,
        failed,
        success,
        stateHandleChange,
        props,
        contactChange,
        fetching,
        addChannelCase,
        onSelectChange,
        rows,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-channel';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;
    }
  }

  .@{prefix-cls} {
    &-action-menu-item {
      text-align: center;
    }

    &-add {
      margin-top: 20px;
      margin-right: 10px;
      margin-bottom: 20px;
    }
  }

  .full-modal {
    .ant-modal {
      max-width: 100%;
      top: 0;
      padding-bottom: 0;
      margin: 0;
    }

    .ant-modal-content {
      display: flex;
      flex-direction: column;
      height: calc(100vh);
    }

    .ant-modal-body {
      flex: 1;
    }
  }
</style>
