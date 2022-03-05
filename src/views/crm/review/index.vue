<template>
  <div class="p-4">
    <!-- 客户名 -->
    <InputSearch
      :class="`${prefixCls}-select`"
      v-model:value="condition.customerName"
      placeholder="客户名称"
      style="width: 200px"
      @search="intentionRangeSearch"
      :loading="loading"
      :allowClear="true"
    />
    <InputSearch
      :class="`${prefixCls}-select`"
      v-model:value="contactValue"
      placeholder="手机号"
      style="width: 200px"
      @search="contactSearch"
      @change="contactChange"
      :loading="loading"
      :allowClear="true"
    />
    <!-- 意向楼盘 -->
    <FProjectSelect @setProject="setProject" @onClear="onClear" :class="`${prefixCls}-add`" />
    <RangePicker
      :show-time="{ format: 'HH:mm' }"
      format="YYYY-MM-DD HH:mm"
      :placeholder="['创建开始时间', '创建结束时间']"
      @change="onTimeChange"
    />
    <Table :columns="columns" :data-source="list" rowKey="id" :pagination="false">
      <template #state="{ text: state }">
        <span>
          <Tag :color="reportConst.STATES[state].color">
            {{ reportConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #projectById="{ text: projectById }">
        <Tag :color="'blue'">
          {{ projectById.name }}
        </Tag>
      </template>
      <template #lookTime="{ text: lookTime }">
        <Tag :color="'red'">
          {{ lookTime.replace('T', ' ').replace('.000+08:00', '') }}
        </Tag>
      </template>
      <template #operation="{ text: line }">
        <Button @click="clickReview(line)" v-auth="reportConst._PERMS.EXAMINE">审核</Button>
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
      v-model:visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      :bodyStyle="{ overflowY: 'auto', margin: '16px' }"
      :destroyOnClose="true"
      :footer="null"
      wrapClassName="full-modal"
    >
      <ReviewForm v-if="drawerParam.state === '0'" :id="drawerParam.id" />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import {
    ReportColumns,
    ReportConst,
    ReportModel,
  } from '/@/api/customer/crmReport/model/reportModel';
  import { getResidentReport } from '/@/api/customer/crmReport/report';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { useDesign } from '/@/hooks/web/useDesign';
  // import { useMessage } from '/@/hooks/web/useMessage';
  import { Loading } from '/@/components/Loading';
  import { processList } from '/@/hooks/web/useList';
  import { Table, Tag, Pagination, RangePicker, InputSearch, Modal, Button } from 'ant-design-vue';
  import { Moment } from 'moment';
  import FProjectSelect from '/@/components/FProjectSelect';
  import ReviewForm from './components/ReviewForm.vue';

  export default defineComponent({
    name: 'Review',
    components: {
      Loading,
      Table,
      Tag,
      Pagination,
      RangePicker,
      InputSearch,
      FProjectSelect,
      ReviewForm,
      Modal,
      Button,
    },
    setup() {
      const { t } = useI18n();
      // const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('clue');
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      // model
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
      });

      const onClose = async () => {
        drawerParam.state = '';
        drawerParam.title = '';
        drawerParam.id = '';
        drawerParam.visible = false;
        const result = await getList();
        processList(result, list, pageParam);
      };
      // 审核
      const clickReview = (line) => {
        drawerParam.state = '0';
        drawerParam.title = '审核';
        drawerParam.id = line.id;
        drawerParam.visible = true;
      };
      const pageSizeList = ref<string[]>(PageSizeList);

      const columns = reactive(ReportColumns);
      const reportConst = ref(ReportConst);

      const condition = reactive({
        companyId: '',
        groupId: '',
        saleId: '',
        customerName: '',
        mobile: '',
        customerId: '',
        projectId: '',
        createTimeStart: '',
        createTimeEnd: '',
        state: '',
      });
      // 分页
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });

      const reports: ReportModel[] = [];
      const list = reactive(reports);

      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<ReportModel> | undefined;
        try {
          result = await getResidentReport(condition, {
            pageSize: pageParam.size,
            pageNum: pageParam.number,
          });
        } catch (error: any) {
        } finally {
          loading.value = false;
        }
        return result;
      };

      onMounted(async () => {
        loading.value = true;
        const result = await getList();
        processList(result, list, pageParam);
      });

      // 客户名称
      const intentionRangeSearch = async (value: string) => {
        condition.customerName = value;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      //手机号
      const contactValue = ref<String>('');
      const contactChange = async (_value) => {
        if (contactValue.value.length === 3) {
          contactValue.value = contactValue.value + '****';
        }
        if (!contactValue.value) {
          pageParam.number = 1;
          const result = await getList();
          processList(result, list, pageParam);
        }
      };
      const contactSearch = async (value: string) => {
        value = value.replace('****', '');
        condition.mobile = value;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      // 意向楼盘
      const setProject = async (value) => {
        condition.projectId = value.key.toString();
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };
      const onClear = async () => {
        condition.projectId = '';
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      // 创建时间
      const onTimeChange = async (value: Moment[], _dateString: string[]) => {
        if (value && value.length > 0) {
          condition.createTimeStart = value[0].toISOString();
          condition.createTimeEnd = value[1].toISOString();
        } else {
          condition.createTimeStart = '';
          condition.createTimeEnd = '';
        }
        pageParam.number = 1;
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
        contactValue,
        onTimeChange,
        setProject,
        onClear,
        contactSearch,
        contactChange,
        intentionRangeSearch,
        condition,
        pageParam,
        t,
        prefixCls,
        pageSizeList,
        tip,
        list,
        columns,
        reportConst,
        loading,
        onChange,
        onShowSizeChange,
        clickReview,
        onClose,
        drawerParam,
      };
    },
  });
</script>
<style lang="less">
  .full-modal {
    .ant-modal-content {
      @apply pb-4;
    }
  }
</style>
