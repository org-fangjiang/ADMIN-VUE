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
    <Tabs v-model:activeKey="activeKey">
      <TabPane key="1" tab="我的带看" v-if="hasPermission(lookConst._PERMS.MY_LOOK)">
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
          <template #lookTime="{ text: lookTime }">
            <Tag :color="'red'">
              {{ lookTime.replace('T', ' ').replace('.000+08:00', '') }}
            </Tag>
          </template>
          <template #operation="{ text: line }">
            <Button @click="clickMy(line)" v-auth="lookConst._PERMS.MY_LOOK">查看</Button>
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
      <TabPane key="2" tab="小组带看" v-if="hasPermission(lookConst._PERMS.SELECT_GROUP)">
        <Table :columns="columns" :data-source="groupList" rowKey="id" :pagination="false">
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
      <TabPane key="3" tab="公司带看" v-if="hasPermission(lookConst._PERMS.SELECT_COMPANY)">
        <Table :columns="columns" :data-source="companyList" rowKey="id" :pagination="false">
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
          <template #lookTime="{ text: lookTime }">
            <Tag :color="'red'">
              {{ lookTime.replace('T', ' ').replace('.000+08:00', '') }}
            </Tag>
          </template>
          <template #operation="{ text: line }">
            <Button @click="clickMy(line)" v-auth="lookConst._PERMS.clickMy">查看</Button>
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
      <LookForm
        v-if="drawerParam.state === '0'"
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
    Tabs,
    TabPane,
  } from 'ant-design-vue';
  import { Moment } from 'moment';
  import FProjectSelect from '/@/components/FProjectSelect';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { LookColumns, LookConst, LookModel } from '/@/api/customer/crmLook/model/lookModel';
  import { getCompanyLook, getGroupLook, getMyLook } from '/@/api/customer/crmLook/look';
  import { processList } from '/@/hooks/web/useList';
  import LookForm from './components/lookForm.vue';
  import { usePermission } from '/@/hooks/web/usePermission';

  export default defineComponent({
    name: 'Look',
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
      LookForm,
      TabPane,
      Tabs,
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
      // 查看
      const clickMy = (line) => {
        drawerParam.state = '0';
        drawerParam.id = line.id;
        drawerParam.title = '查询带看信息';
        drawerParam.visible = true;
        if (activeKey.value === '1') {
          drawerParam.fromType = 'my';
        } else if (activeKey.value === '2') {
          drawerParam.fromType = 'group';
        } else if (activeKey.value === '3') {
          drawerParam.fromType = 'company';
        }
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
          result = await getMyLook(condition, {
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
      // 小组列表
      const groupLooks: LookModel[] = [];
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
        let result: BasePageResult<LookModel> | undefined;
        try {
          result = await getGroupLook(condition, {
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
      const companyLooks: LookModel[] = [];
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
        let result: BasePageResult<LookModel> | undefined;
        try {
          result = await getCompanyLook(condition, {
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

      // 加载
      const { hasPermission } = usePermission();
      onMounted(async () => {
        loading.value = true;
        if (hasPermission(lookConst.value._PERMS.MY_LOOK)) {
          const result = await getList();
          processList(result, list, pageParam);
        } else if (hasPermission(lookConst.value._PERMS.SELECT_GROUP)) {
          const groupresult = await getGroup();
          processList(groupresult, groupList, groupPage);
          activeKey.value = '2';
        } else if (hasPermission(lookConst.value._PERMS.SELECT_COMPANY)) {
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
        t,
        prefixCls,
        loading,
        tip,
        pageSizeList,
        pageParam,
        list,
        getList,
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
        columns,
        lookConst,
        stateChange,
        clickMy,
        onClose,
        drawerParam,
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
      };
    },
  });
</script>
