<template>
  <div class="p-4">
    <Select
      :options="lookConst.STATES"
      v-model:value="condition.state"
      style="width: 120px"
      placeholder="状态"
      :allowClear="true"
      @change="stateChange"
    />
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
          <Tag :color="lookConst.STATES[state].color">
            {{ lookConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #projectById="{ text: projectById }">
        <Tag :color="'blue'">
          {{ projectById.name }}
        </Tag>
      </template>
      <template #realLookTime="{ text: realLookTime }">
        <Tag :color="'red'">
          {{ realLookTime.replace('T', ' ').replace('.000+08:00', '') }}
        </Tag>
      </template>
      <template #operation="{ text: line }">
        <Button @click="clickExamine(line)" v-auth="lookConst._PERMS.EXAMINE">审核</Button>
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
    >
      <ExamineForm v-if="drawerParam.state === '0'" :id="drawerParam.id" />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { LookColumns, LookConst, LookModel } from '/@/api/customer/crmLook/model/lookModel';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { Loading } from '/@/components/Loading';
  import {
    Table,
    Tag,
    Pagination,
    RangePicker,
    InputSearch,
    Modal,
    Button,
    Select,
  } from 'ant-design-vue';
  import { getResidentLook } from '/@/api/customer/crmLook/look';
  import { processList } from '/@/hooks/web/useList';
  import { Moment } from 'moment';
  import FProjectSelect from '/@/components/FProjectSelect';
  import ExamineForm from './components/examineForm.vue';
  export default defineComponent({
    name: 'ExamineLook',
    components: {
      Loading,
      Table,
      Tag,
      Pagination,
      RangePicker,
      InputSearch,
      FProjectSelect,
      Select,
      Modal,
      Button,
      ExamineForm,
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
      const clickExamine = (line) => {
        drawerParam.state = '0';
        drawerParam.id = line.id;
        drawerParam.title = '审核带看信息';
        drawerParam.visible = true;
      };

      const pageSizeList = ref<string[]>(PageSizeList);
      // 分页
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });

      const looks: LookModel[] = [];
      const list = reactive(looks);
      const columns = reactive(LookColumns);
      const lookConst = ref(LookConst);

      // 筛选条件
      const condition = reactive({
        companyId: '',
        groupId: '',
        saleId: '',
        customerName: '',
        customerNam: '',
        mobile: '',
        customerId: '',
        projectId: '',
        createTimeStart: '',
        createTimeEnd: '',
        state: undefined,
      });
      // 获取
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<LookModel> | undefined;
        try {
          result = await getResidentLook(condition, {
            pageNum: pageParam.number,
            pageSize: pageParam.size,
          });
        } catch (error) {
        } finally {
          loading.value = false;
        }
        loading.value = false;
        return result;
      };

      // 加载
      onMounted(async () => {
        loading.value = true;
        const result = await getList();
        processList(result, list, pageParam);
        loading.value = false;
      });

      // 状态
      const stateChange = async (value) => {
        condition.state = value;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

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
        columns,
        list,
        pageParam,
        tip,
        pageSizeList,
        loading,
        prefixCls,
        t,
        lookConst,
        onShowSizeChange,
        onChange,
        contactValue,
        onTimeChange,
        setProject,
        onClear,
        contactSearch,
        contactChange,
        intentionRangeSearch,
        condition,
        stateChange,
        clickExamine,
        onClose,
        drawerParam,
      };
    },
  });
</script>
