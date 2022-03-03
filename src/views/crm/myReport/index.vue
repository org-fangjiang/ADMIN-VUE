<template>
  <div class="p-4">
    <!-- 状态 -->
    <Select
      :allowClear="true"
      style="width: 200px"
      @change="stateChange"
      :options="reportConst.STATES"
      :pagination="false"
      placeholder="状态"
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
    <Tabs v-model:activeKey="activeKey">
      <TabPane key="1" tab="我的报备" v-if="hasPermission(reportConst._PERMS.SELECT_MY)">
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
            <Button @click="clickMy(line)" v-auth="lookConst._PERMS.SELECT_MY">查看</Button>
            <Button @click="addLook(line)" v-auth="lookConst._PERMS.ADD">录入带看</Button>
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
      </TabPane>
      <TabPane key="2" tab="小组报备" v-if="hasPermission(reportConst._PERMS.SELECT_GROUP)">
        <Table :columns="columns" :data-source="groupList" rowKey="id" :pagination="false">
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
            <Button @click="clickMy(line)" v-auth="lookConst._PERMS.SELECT_GROUP">查看</Button>
          </template>
        </Table>
        <Pagination
          show-size-changer
          size="large"
          :show-total="(total) => t('component.table.total', { total })"
          :pageSizeOptions="pageSizeList"
          :current="groupPage.number"
          :pageSize="groupPage.size"
          :total="groupPage.totalElements"
          @change="onGroupChange"
          @showSizeChange="onGroupShowSizeChange"
        />
      </TabPane>
      <TabPane key="3" tab="公司报备" v-if="hasPermission(reportConst._PERMS.SELECT_COMPANY)">
        <Table :columns="columns" :data-source="companyList" rowKey="id" :pagination="false">
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
            <Button @click="clickMy(line)" v-auth="lookConst._PERMS.SELECT_COMPANY">查看</Button>
          </template>
        </Table>
        <Pagination
          show-size-changer
          size="large"
          :show-total="(total) => t('component.table.total', { total })"
          :pageSizeOptions="pageSizeList"
          :current="companyPage.number"
          :pageSize="companyPage.size"
          :total="companyPage.totalElements"
          @change="onCompanyChange"
          @showSizeChange="onCompanyShowSizeChange"
        />
      </TabPane>
    </Tabs>
    <Modal
      v-model:visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      :bodyStyle="{ overflowY: 'auto', margin: '16px' }"
      :destroyOnClose="true"
      :footer="null"
    >
      <LookForm v-if="drawerParam.state === '0'" :id="drawerParam.id" />
      <ReportForm
        v-if="drawerParam.state === '1'"
        :id="drawerParam.id"
        :fromType="drawerParam.fromType"
      />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import {
    ReportColumns,
    ReportConst,
    ReportModel,
  } from '/@/api/customer/crmReport/model/reportModel';
  import { getCompanyReport, getGroupReport, getMyReport } from '/@/api/customer/crmReport/report';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { useDesign } from '/@/hooks/web/useDesign';
  // import { useMessage } from '/@/hooks/web/useMessage';
  import { Loading } from '/@/components/Loading';
  import { processList } from '/@/hooks/web/useList';
  import {
    Table,
    Tag,
    Pagination,
    RangePicker,
    Select,
    InputSearch,
    Modal,
    Button,
    Tabs,
    TabPane,
  } from 'ant-design-vue';
  import { Moment } from 'moment';
  import FProjectSelect from '/@/components/FProjectSelect';
  import LookForm from './components/LookForm.vue';
  import { LookConst } from '/@/api/customer/crmLook/model/lookModel';
  import { usePermission } from '/@/hooks/web/usePermission';
  import ReportForm from './components/ReportForm.vue';

  export default defineComponent({
    name: 'MyReport',
    components: {
      Loading,
      Table,
      Tag,
      Pagination,
      RangePicker,
      Select,
      InputSearch,
      FProjectSelect,
      Modal,
      LookForm,
      Button,
      TabPane,
      Tabs,
      ReportForm,
    },
    setup() {
      const { t } = useI18n();
      // const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('clue');
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      let activeKey = ref('1');

      // model
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
        fromType: '',
      });

      const onClose = async () => {
        drawerParam.state = '';
        drawerParam.title = '';
        drawerParam.id = '';
        drawerParam.visible = false;
        drawerParam.fromType = '';
      };
      // 录入带看
      const lookConst = ref(LookConst);
      const addLook = (line) => {
        drawerParam.state = '0';
        drawerParam.id = line.id;
        drawerParam.title = '录入数据';
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
          result = await getMyReport(condition, {
            pageSize: pageParam.size,
            pageNum: pageParam.number,
          });
        } catch (error: any) {
        } finally {
          loading.value = false;
        }
        return result;
      };

      // 小组列表
      const groupLooks: ReportModel[] = [];
      const groupList = reactive(groupLooks);
      const groupPage = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });
      const getGroup = async () => {
        loading.value = true;
        let result: BasePageResult<ReportModel> | undefined;
        try {
          result = await getGroupReport(condition, {
            pageNum: groupPage.number,
            pageSize: groupPage.size,
          });
        } catch (error) {
        } finally {
          loading.value = false;
        }
        loading.value = false;
        return result;
      };
      // 企业列表
      const companyLooks: ReportModel[] = [];
      const companyList = reactive(companyLooks);
      const companyPage = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });
      const getCompany = async () => {
        loading.value = true;
        let result: BasePageResult<ReportModel> | undefined;
        try {
          result = await getCompanyReport(condition, {
            pageNum: companyPage.number,
            pageSize: companyPage.size,
          });
        } catch (error) {
        } finally {
          loading.value = false;
        }
        loading.value = false;
        return result;
      };

      // 查看
      const clickMy = (line) => {
        drawerParam.state = '1';
        drawerParam.id = line.id;
        drawerParam.title = '查看报备信息';
        drawerParam.visible = true;
        if (activeKey.value === '1') {
          drawerParam.fromType = 'my';
        } else if (activeKey.value === '2') {
          drawerParam.fromType = 'group';
        } else if (activeKey.value === '3') {
          drawerParam.fromType = 'company';
        }
      };

      // 加载
      const { hasPermission } = usePermission();
      onMounted(async () => {
        loading.value = true;
        if (hasPermission(reportConst.value._PERMS.SELECT_MY)) {
          const result = await getList();
          processList(result, list, pageParam);
        } else if (hasPermission(reportConst.value._PERMS.SELECT_GROUP)) {
          const groupresult = await getGroup();
          processList(groupresult, groupList, groupPage);
          activeKey.value = '2';
        } else if (hasPermission(reportConst.value._PERMS.SELECT_COMPANY)) {
          const companyresult = await getGroup();
          processList(companyresult, companyList, companyPage);
          activeKey.value = '3';
        }
        loading.value = false;
      });

      watch(
        () => activeKey.value,
        async (_v1, _v2) => {
          refreshList();
        }
      );

      const refreshList = async () => {
        if (activeKey.value === '1') {
          pageParam.number = 1;
          const result = await getList();
          processList(result, list, pageParam);
        } else if (activeKey.value === '2') {
          groupPage.number = 1;
          const groupresult = await getGroup();
          processList(groupresult, groupList, groupPage);
        } else if (activeKey.value === '3') {
          companyPage.number = 1;
          const companyresult = await getCompany();
          processList(companyresult, companyList, companyPage);
        }
      };

      // 状态
      const stateChange = async (value) => {
        condition.state = value;
        refreshList();
      };

      // 客户名称
      const intentionRangeSearch = async (value: string) => {
        condition.customerName = value;
        refreshList();
      };

      //手机号
      const contactValue = ref<String>('');
      const contactChange = async (_value) => {
        if (contactValue.value.length === 3) {
          contactValue.value = contactValue.value + '****';
        }
        if (!contactValue.value) {
          refreshList();
        }
      };
      const contactSearch = async (value: string) => {
        value = value.replace('****', '');
        condition.mobile = value;
        refreshList();
      };

      // 意向楼盘
      const setProject = async (value) => {
        condition.projectId = value.key.toString();
        refreshList();
      };
      const onClear = async () => {
        condition.projectId = '';
        refreshList();
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
        refreshList();
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
      const onGroupChange = async (page) => {
        groupPage.number = page;
        const groupresult = await getGroup();
        processList(groupresult, groupList, groupPage);
      };
      const onGroupShowSizeChange = async (current, size) => {
        console.log(current);
        groupPage.size = size;
        groupPage.number = 1;
        const groupresult = await getGroup();
        processList(groupresult, groupList, groupPage);
      };
      const onCompanyChange = async (page) => {
        companyPage.number = page;
        const companyresult = await getGroup();
        processList(companyresult, companyList, companyPage);
      };
      const onCompanyShowSizeChange = async (current, size) => {
        console.log(current);
        companyPage.size = size;
        companyPage.number = 1;
        const companyresult = await getGroup();
        processList(companyresult, companyList, companyPage);
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
        stateChange,
        drawerParam,
        onClose,
        addLook,
        lookConst,
        activeKey,
        hasPermission,
        groupPage,
        getGroup,
        groupList,
        groupLooks,
        companyPage,
        getCompany,
        companyList,
        companyLooks,
        onCompanyShowSizeChange,
        onCompanyChange,
        onGroupShowSizeChange,
        onGroupChange,
        clickMy,
      };
    },
  });
</script>
