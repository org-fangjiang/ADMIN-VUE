<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <Tabs v-model:activeKey="activeKey">
      <TabPane
        key="1"
        tab="成交"
        v-auth="dealConst._PERMS.SELECT"
        v-if="hasPermission(dealConst._PERMS.SELECT)"
      >
        <Button @click="distributeMul" v-auth="dealConst._PERMS.DISTRIBUTE">分配</Button>
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
            <Button @click="distributeOne(line)" v-auth="dealConst._PERMS.DISTRIBUTE">分配</Button>
          </template>
        </Table>
      </TabPane>
      <TabPane
        key="2"
        tab="无效"
        v-auth="invalidConst._PERMS.SELECT"
        v-if="hasPermission(invalidConst._PERMS.SELECT)"
      >
        <Button @click="distributeMul" v-auth="invalidConst._PERMS.DISTRIBUTE">分配</Button>
        <Table
          :columns="columnsInvalid"
          :data-source="invalidList"
          rowKey="id"
          :pagination="invalidPagination"
          @change="handleInvalidTableChange"
          :row-selection="{ selectedRowKeys: selectedInvalid, onChange: onSelectChangeInvalid }"
        >
          <template #purpose="{ text: purpose }">
            <span v-if="purpose - 1 > -1">
              <Tag :color="invalidConst.PURPOSES[purpose - 1].color">
                {{ invalidConst.PURPOSES[purpose - 1].label }}
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
              <Tag :color="invalidConst.GENDER[gender].color">
                {{ invalidConst.GENDER[gender].label }}
              </Tag>
            </span>
          </template>
          <template #state="{ text: state }">
            <span>
              <Tag :color="invalidConst.STATES[state].color">
                {{ invalidConst.STATES[state].label }}
              </Tag>
            </span>
          </template>
          <template #operation="{ text: line }">
            <Button @click="seeDeal(line)">查看</Button>
            <Button @click="distributeOne(line)" v-auth="invalidConst._PERMS.DISTRIBUTE"
              >分配</Button
            >
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
      <SelectDetail
        v-if="drawerParam.state === '1'"
        :dealId="drawerParam.dealId"
        :invalidId="drawerParam.invalidId"
      />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue';
  import { Tabs, TabPane, Table, Tag, Button, Modal } from 'ant-design-vue';
  import { useI18n } from 'vue-i18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { Loading } from '/@/components/Loading';
  import {
    DealConst,
    DealModel,
    _ColumnsDeal as columnsDeal,
  } from '/@/api/customer/crmDeal/model/DealModel';
  import {
    InvalidConst,
    InvalidModel,
    _ColumnsInvalid as columnsInvalid,
  } from '/@/api/customer/crmInvalid/model/InvalidModel';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { BasePageResult, PageParam } from '/@/api/model/baseModel';
  import { getByDeal } from '/@/api/customer/crmDeal/deal';
  import { processListByLine } from '/@/hooks/web/useList';
  import { getByInvalid } from '/@/api/customer/crmInvalid/invalid';
  import { useUserStore } from '/@/store/modules/user';
  import DistributeForm from '../customer/components/DistributeForm.vue';
  import SelectDetail from '../customer/components/SelectDetail.vue';

  export default defineComponent({
    name: 'Deal',
    components: {
      Loading,
      Tabs,
      TabPane,
      Table,
      Tag,
      Button,
      Modal,
      DistributeForm,
      SelectDetail,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('customer');
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      let activeKey = ref('1');
      const dealConst = ref(DealConst);
      const invalidConst = ref(InvalidConst);

      const dealResult: DealModel[] = [];
      let dealList = reactive(dealResult);
      const invalidResult: InvalidModel[] = [];
      let invalidList = reactive(invalidResult);

      const userStore = useUserStore();

      const seeDeal = (line) => {
        drawerParam.state = '1';
        drawerParam.title = '查看客户信息';
        drawerParam.visible = true;
        if (activeKey.value === '1') {
          drawerParam.dealId = line.id;
        } else if (activeKey.value === '2') {
          drawerParam.invalidId = line.id;
        }
      };

      const distributeOne = (line) => {
        drawerParam.state = '0';
        drawerParam.id = line.id;
        drawerParam.title = '分配客户';
        drawerParam.visible = true;
        if (activeKey.value === '1') {
          drawerParam.fromType = 'deal';
        } else if (activeKey.value === '2') {
          drawerParam.fromType = 'invalid';
        }
      };

      const distributeMul = () => {
        if (activeKey.value === '1') {
          if (selectedDeal.value.length === 0) {
            return;
          }
          drawerParam.fromType = 'deal';
          drawerParam.ids = selectedDeal.value;
        } else if (activeKey.value === '2') {
          if (selectedInvalid.value.length === 0) {
            return;
          }
          drawerParam.fromType = 'invalid';
          drawerParam.ids = selectedInvalid.value;
        }
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
        drawerParam.invalidId = '';
      };

      //选中行id
      let selectedDeal = ref<string[]>([]);
      const onSelectChangeDeal = async (selectedRowKeys) => {
        selectedDeal.value = selectedRowKeys;
      };
      let selectedInvalid = ref<string[]>([]);
      const onSelectChangeInvalid = async (selectedRowKeys) => {
        selectedInvalid.value = selectedRowKeys;
      };

      watch(
        () => activeKey.value,
        async () => {
          let result;
          if (activeKey.value === '1') {
            result = await getDealList();
            processListByLine(result, dealList, dealTotal);
          } else if (activeKey.value === '2') {
            result = await getInvalidList();
            processListByLine(result, invalidList, invalidTotal);
          }
        }
      );

      // model
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
        fromType: '',
        ids: [''],
        dealId: '',
        invalidId: '',
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
      // 无效筛选
      const invalidCondition = reactive({
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
      });
      // 成交分页
      const invalidPage: PageParam = {
        pageNum: 1,
        pageSize: 10,
      };
      const invalidTotal = ref<number>(0);
      const invalidPagination = computed(() => ({
        total: invalidTotal.value,
        current: invalidPage.pageNum,
        pageSize: invalidPage.pageSize,
      }));
      const handleInvalidTableChange = async (pag: any) => {
        dealPage.pageSize = pag!.pageSize!;
        dealPage.pageNum = pag?.current;
        const result = await getInvalidList();
        processListByLine(result, invalidList, invalidTotal);
      };

      onMounted(async () => {
        let result;
        if (hasPermission(dealConst.value._PERMS.SELECT)) {
          result = await getDealList();
          processListByLine(result, dealList, dealTotal);
        } else if (hasPermission(invalidConst.value._PERMS.SELECT)) {
          result = await getInvalidList();
          processListByLine(result, invalidList, invalidTotal);
        }
      });

      const invalidSort = {
        desc: ['createTime'],
        asc: [''],
      };
      const dealSort = {
        desc: ['createTime'],
        asc: [''],
      };

      const getInvalidList = async () => {
        loading.value = true;
        let result: BasePageResult<DealModel> | undefined;
        try {
          result = await getByInvalid(invalidCondition, invalidPage, invalidSort);
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
        seeDeal,
        distributeMul,
        selectedDeal,
        onSelectChangeDeal,
        onSelectChangeInvalid,
        selectedInvalid,
        onClose,
        distributeOne,
        handleInvalidTableChange,
        invalidPagination,
        invalidPage,
        handleDealTableChange,
        dealPagination,
        dealPage,
        t,
        loading,
        prefixCls,
        tip,
        activeKey,
        dealConst,
        invalidConst,
        columnsDeal,
        columnsInvalid,
        dealList,
        invalidList,
        dealCondition,
        invalidCondition,
        hasPermission,
        userStore,
        drawerParam,
      };
    },
  });
</script>
