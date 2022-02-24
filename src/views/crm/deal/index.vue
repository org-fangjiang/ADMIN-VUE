<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <!-- <Button @click="distributeMul" v-auth="dealConst._PERMS.DISTRIBUTE">分配</Button> -->
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
    <FCascader
      @change="liveInChange"
      class="mr-2"
      :class="`${prefixCls}-add`"
      placeholder="居住地"
    />
    <FCascader
      @change="workInChange"
      class="mr-2"
      :class="`${prefixCls}-add`"
      placeholder="工作地"
    />
    <FCascader
      @change="intentionChange"
      class="mr-2"
      :class="`${prefixCls}-add`"
      placeholder="意向地"
    />
    <!-- 意向楼盘 -->
    <FProjectSelect @setProject="setProject" @onClear="onClear" :class="`${prefixCls}-add`" />
    <!-- 购房用途 -->
    <Select
      :class="`${prefixCls}-add`"
      ref="select"
      :allowClear="true"
      style="width: 120px"
      @change="purposeChange"
      :options="dealConst.PURPOSES"
      :pagination="false"
      placeholder="购房用途"
    />
    <InputSearch
      :class="`${prefixCls}-select`"
      v-model:value="intentionRange"
      placeholder="意向强度"
      style="width: 200px"
      @search="intentionRangeSearch"
      :loading="loading"
      :allowClear="true"
      type="number"
    />
    <!-- 状态 -->
    <Select
      :class="`${prefixCls}-add`"
      :allowClear="true"
      style="width: 200px"
      @change="stateChange"
      :options="dealConst.STATES"
      :pagination="false"
      placeholder="状态"
    />
    <Tabs v-model:activeKey="activeKey">
      <TabPane
        key="1"
        tab="已成交"
        v-auth="dealConst._PERMS.SELECT"
        v-if="hasPermission(dealConst._PERMS.SELECT)"
      >
        <Table
          :columns="columnsDeal"
          :data-source="dealList"
          rowKey="id"
          :pagination="dealPagination"
          @change="handleDealTableChange"
          :row-selection="{ selectedRowKeys: selectedDeal, onChange: onSelectChangeDeal }"
        >
          <template #purpose="{ text: purpose }">
            <span v-if="purpose - 1 > -1">
              <Tag :color="dealConst.PURPOSES[purpose - 1].color">
                {{ dealConst.PURPOSES[purpose - 1].label }}
              </Tag>
            </span>
          </template>
          <template #projectsByIntention="{ text: projectsByIntention }">
            <span v-if="projectsByIntention && projectsByIntention.length > 0">
              <span v-for="i in projectsByIntention" :key="i">
                <Tag color="blue">
                  {{ i.name }}
                </Tag>
              </span>
            </span>
          </template>
          <template #gender="{ text: gender }">
            <span>
              <Tag :color="dealConst.GENDER[gender].color">
                {{ dealConst.GENDER[gender].label }}
              </Tag>
            </span>
          </template>
          <template #state="{ text: state }">
            <span>
              <Tag :color="dealConst.STATES[state].color">
                {{ dealConst.STATES[state].label }}
              </Tag>
            </span>
          </template>
          <template #operation="{ text: line }">
            <Button @click="seeDeal(line)">查看</Button>
            <!-- <Button @click="distributeOne(line)" v-auth="dealConst._PERMS.DISTRIBUTE">分配</Button> -->
            <Button @click="transferLevel(line)" v-auth="dealConst._PERMS.TRANSFER_LEVEL"
              >领取</Button
            >
          </template>
        </Table>
      </TabPane>
      <TabPane
        key="2"
        tab="待审核"
        v-auth="dealConst._PERMS.SELECT"
        v-if="hasPermission(dealConst._PERMS.EXAMINE)"
      >
        <Table
          :columns="columnsDeal"
          :data-source="examineList"
          rowKey="id"
          :pagination="examinePagination"
          @change="handleExamineTableChange"
        >
          <template #purpose="{ text: purpose }">
            <span v-if="purpose - 1 > -1">
              <Tag :color="dealConst.PURPOSES[purpose - 1].color">
                {{ dealConst.PURPOSES[purpose - 1].label }}
              </Tag>
            </span>
          </template>
          <template #projectsByIntention="{ text: projectsByIntention }">
            <span v-if="projectsByIntention && projectsByIntention.length > 0">
              <span v-for="i in projectsByIntention" :key="i">
                <Tag color="blue">
                  {{ i.name }}
                </Tag>
              </span>
            </span>
          </template>
          <template #gender="{ text: gender }">
            <span>
              <Tag :color="dealConst.GENDER[gender].color">
                {{ dealConst.GENDER[gender].label }}
              </Tag>
            </span>
          </template>
          <template #state="{ text: state }">
            <span>
              <Tag :color="dealConst.STATES[state].color">
                {{ dealConst.STATES[state].label }}
              </Tag>
            </span>
          </template>
          <template #operation="{ text: line }">
            <Button @click="clickOk(line)">审核通过</Button>
            <Button @click="clickFail(line)">审核不通过</Button>
          </template>
        </Table>
      </TabPane>
    </Tabs>
    <Modal
      v-model:visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width="40%"
      :bodyStyle="{ overflowY: 'auto', margin: '16px' }"
      :destroyOnClose="true"
      :footer="null"
    >
      <DistributeForm
        v-if="drawerParam.state === '0'"
        :id="drawerParam.id"
        :fromType="drawerParam.fromType"
        :ids="drawerParam.ids"
      />
      <SelectDetail v-if="drawerParam.state === '1'" :dealId="drawerParam.dealId" />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue';
  import { Table, Tag, Button, Modal, InputSearch, Select, Tabs, TabPane } from 'ant-design-vue';
  import { useI18n } from 'vue-i18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { Loading } from '/@/components/Loading';
  import {
    DealConst,
    DealModel,
    _ColumnsDeal as columnsDeal,
  } from '/@/api/customer/crmDeal/model/DealModel';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { BasePageResult, PageParam } from '/@/api/model/baseModel';
  import { dealFail, dealOk, getByDeal, getExamineDeal } from '/@/api/customer/crmDeal/deal';
  import { failed, processListByLine, success } from '/@/hooks/web/useList';
  import { useUserStore } from '/@/store/modules/user';
  import DistributeForm from '../customer/components/DistributeForm.vue';
  import SelectDetail from '../customer/components/SelectDetail.vue';
  import FCascader from '/@/components/FCascader';
  import FProjectSelect from '/@/components/FProjectSelect';
  import { transferLevelTo } from '/@/api/customer/crmCity/city';

  export default defineComponent({
    name: 'Deal',
    components: {
      Loading,
      Table,
      Tag,
      Button,
      Modal,
      DistributeForm,
      SelectDetail,
      InputSearch,
      Select,
      FCascader,
      FProjectSelect,
      Tabs,
      TabPane,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('customer');
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      // 领取客户
      const transferLevel = async (line) => {
        let from = 'deal';
        const result = await transferLevelTo(line.id, from, 'private');
        if (result.code === 200) {
          success('成功', '领取成功');
        } else {
          failed('失败', '领取客户失败');
        }
        refreshList();
      };

      const activeKey = ref('1');

      watch(
        () => activeKey.value,
        () => refreshList()
      );

      // 状态
      const stateChange = async (value) => {
        dealCondition.state = value;
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
        dealCondition.mobile = value;
        refreshList();
      };

      //  住址
      const liveInChange = async (e) => {
        dealCondition.liveIn = e.value.toString();
        refreshList();
      };
      // 工作地
      const workInChange = async (e) => {
        dealCondition.workIn = e.value.toString();
        refreshList();
      };
      // 意向地
      const intentionChange = async (e) => {
        dealCondition.intentionProvince = e.value[0];
        dealCondition.intentionCity = e.value[1];
        dealCondition.intentionArea = e.value[2];
        refreshList();
      };
      // 意向楼盘
      const setProject = async (value) => {
        dealCondition.intentionProject = value.key.toString();
        refreshList();
      };
      const onClear = async () => {
        dealCondition.intentionProject = '';
        refreshList();
      };

      //购房目的
      const purposeChange = async (value) => {
        dealCondition.purpose = value;
        refreshList();
      };

      // 意向强度
      let intentionRange = ref(undefined);
      const intentionRangeSearch = async (value: number) => {
        dealCondition.buyIntentionRange = value;
        refreshList();
      };

      const dealConst = ref(DealConst);
      // 成交
      const dealResult: DealModel[] = [];
      let dealList = reactive(dealResult);

      // 待审核
      const examineResult: DealModel[] = [];
      let examineList = reactive(examineResult);

      const examinePage: PageParam = {
        pageNum: 1,
        pageSize: 10,
      };
      const examineTotal = ref<number>(0);
      const examinePagination = computed(() => ({
        total: examineTotal.value,
        current: examinePage.pageNum,
        pageSize: examinePage.pageSize,
      }));
      const handleExamineTableChange = async (pag: any) => {
        examinePage.pageSize = pag!.pageSize!;
        examinePage.pageNum = pag?.current;
        const result = await getExamineList();
        processListByLine(result, examineList, examineTotal);
      };

      const refreshList = async () => {
        if (activeKey.value === '1') {
          dealPage.pageNum = 1;
          const result = await getDealList();
          processListByLine(result, dealList, dealTotal);
        } else if (activeKey.value === '2') {
          examinePage.pageNum = 1;
          const result = await getExamineList();
          processListByLine(result, examineList, examineTotal);
        }
      };

      const getExamineList = async () => {
        loading.value = true;
        let result: BasePageResult<DealModel> | undefined;
        try {
          result = await getExamineDeal(dealCondition, examinePage, dealSort);
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

      const clickOk = async (line) => {
        try {
          await dealOk(line.id);
          success('成功', '操作成功');
        } catch (error) {
          failed('失败', '操作失败');
        }
        refreshList();
      };

      const clickFail = async (line) => {
        try {
          await dealFail(line.id);
          success('成功', '操作成功');
        } catch (error) {
          failed('失败', '操作失败');
        }
        refreshList();
      };

      const userStore = useUserStore();

      const seeDeal = (line) => {
        drawerParam.state = '1';
        drawerParam.title = '查看客户信息';
        drawerParam.visible = true;
        drawerParam.dealId = line.id;
      };

      const distributeOne = (line) => {
        drawerParam.state = '0';
        drawerParam.id = line.id;
        drawerParam.title = '分配客户';
        drawerParam.visible = true;
        drawerParam.fromType = 'deal';
      };

      const distributeMul = () => {
        if (selectedDeal.value.length === 0) {
          return;
        }
        drawerParam.fromType = 'deal';
        drawerParam.ids = selectedDeal.value;
        drawerParam.state = '0';
        drawerParam.title = '查看客户信息';
        drawerParam.visible = true;
      };

      const onClose = () => {
        drawerParam.visible = false;
        drawerParam.id = '';
        drawerParam.state = '';
        drawerParam.title = '';
        drawerParam.fromType = '';
        drawerParam.ids.splice(0);
        drawerParam.dealId = '';
      };

      //选中行id
      let selectedDeal = ref<string[]>([]);
      const onSelectChangeDeal = async (selectedRowKeys) => {
        selectedDeal.value = selectedRowKeys;
      };

      // model
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
        fromType: '',
        ids: [''],
        dealId: '',
      });

      const { hasPermission } = usePermission();
      // 成交筛选
      const dealCondition = reactive({
        mobile: '',
        liveIn: '',
        workIn: '',
        intentionProvince: '',
        intentionCity: '',
        intentionArea: '',
        intentionProject: '',
        purpose: '',
        demand: '',
        source: '',
        buyIntentionRange: 0,
        companyId: userStore.getUserInfo.companyId,
        state: '',
      });
      // 成交分页
      const dealPage: PageParam = {
        pageNum: 1,
        pageSize: 10,
      };
      const dealTotal = ref<number>(0);
      const dealPagination = computed(() => ({
        total: dealTotal.value,
        current: dealPage.pageNum,
        pageSize: dealPage.pageSize,
      }));
      const handleDealTableChange = async (pag: any) => {
        dealPage.pageSize = pag!.pageSize!;
        dealPage.pageNum = pag?.current;
        const result = await getDealList();
        processListByLine(result, dealList, dealTotal);
      };

      onMounted(async () => {
        let result;
        result = await getDealList();
        processListByLine(result, dealList, dealTotal);
      });

      const dealSort = {
        desc: ['createTime'],
        asc: [''],
      };

      const getDealList = async () => {
        loading.value = true;
        let result: BasePageResult<DealModel> | undefined;
        try {
          result = await getByDeal(dealCondition, dealPage, dealSort);
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

      return {
        intentionRange,
        intentionRangeSearch,
        purposeChange,
        setProject,
        onClear,
        intentionChange,
        workInChange,
        liveInChange,
        contactSearch,
        contactChange,
        contactValue,
        seeDeal,
        distributeMul,
        selectedDeal,
        onSelectChangeDeal,
        onClose,
        distributeOne,
        handleDealTableChange,
        dealPagination,
        dealPage,
        t,
        loading,
        prefixCls,
        tip,
        dealConst,
        columnsDeal,
        dealList,
        dealCondition,
        hasPermission,
        userStore,
        drawerParam,
        activeKey,
        examineList,
        handleExamineTableChange,
        examinePagination,
        clickFail,
        clickOk,
        transferLevel,
        stateChange,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-customer';
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

    &-select {
      margin-top: 20px;
      margin-bottom: 20px;
    }
  }
</style>
