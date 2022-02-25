//渠道管理
<template>
  <div :class="prefixCls" class="relative w-full h-full p-4">
    <!-- 状态筛选 -->
    <Select
      :class="`${prefixCls}-add`"
      ref="select"
      :allowClear="true"
      v-model:value="condition.state"
      style="width: 120px"
      @change="stateHandleChange"
      :options="channelConst.STATES"
      :pagination="false"
    />
    <Button @click="setChannel">确定</Button>
    <!-- <Button @click="setCase">设置驻场</Button> -->
    <Table
      :columns="channelColumns"
      :data-source="list"
      rowKey="id"
      :pagination="false"
      :row-selection="{ selectedRowKeys: rows, onChange: onSelectChange, type: 'radio' }"
    >
      <template #state="{ text: state }">
        <span>
          <Tag :color="channelConst.STATES[state].color">
            {{ channelConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: operation }">
        <!-- 操作下拉框 -->
        <Button @click="setCase(operation)">设置驻场</Button>
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
    <Modal
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width="60%"
      :bodyStyle="{ overflow: 'auto', 'margin-top': '16px' }"
      :destroyOnClose="true"
      :footer="null"
      wrapClassName="full-modal"
      centered
    >
      <CaseTable
        v-if="drawerParam.state === '0'"
        :channelId="drawerParam.id"
        :projectId="drawerParam.projectId"
      />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { Table, Pagination, Tag, Button, Modal, Select } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { processList, success, failed } from '/@/hooks/web/useList';
  import {
    _ColumnsChannel,
    _ChannelConst,
    ChannelModel,
  } from '/@/api/host/channel/model/channelModel';
  import { getChannels } from '/@/api/host/channel/channel';
  import { setProjectChannel } from '/@/api/host/projectChannel/projectChannel';
  import CaseTable from './CaseTable.vue';

  export default defineComponent({
    name: 'ChannelTable',
    components: {
      Select,
      Table,
      Pagination,
      Tag,
      Button,
      Loading,
      Modal,
      CaseTable,
    },
    props: {
      id: {
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

      const channelColumns = reactive(_ColumnsChannel);
      const channelConst = ref(_ChannelConst);

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
        name: '',
      });

      //根据状态筛选
      const stateHandleChange = async (value) => {
        condition.state = value;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      const channel: ChannelModel[] = [];
      // 列表结果
      let list = reactive(channel);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<ChannelModel> | undefined;
        try {
          result = await getChannels(condition, {
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

      // 设置渠道
      const setChannel = async () => {
        if (rows.length > 0) {
          await setProjectChannel(props.id, rows[0]);
          success('成功', '设置成功');
        }
      };

      // 设置驻场
      const setCase = (line) => {
        drawerParam.state = '0';
        drawerParam.id = line.id;
        drawerParam.visible = true;
      };

      let rows = reactive<string[]>([]);

      const onSelectChange = (selectedRowKeys) => {
        rows.splice(0);
        selectedRowKeys.forEach((item) => {
          rows.push(item);
        });
      };

      // 抽屉参数
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
        projectId: props.id,
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
        channelConst,
        condition,
        channelColumns,
        loading,
        tip,
        pageSizeList,
        list,
        pageParam,
        onChange,
        onShowSizeChange,
        onClose,
        drawerParam,
        failed,
        success,
        stateHandleChange,
        setCase,
        rows,
        onSelectChange,
        setChannel,
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
      width: 70%;
      // height: 40%;
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
