<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <Button @click="distributeMul" v-auth="invalidConst._PERMS.DISTRIBUTE" class="my-2"
      >分配</Button
    >
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
      :options="invalidConst.PURPOSES"
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
        <Button @click="distributeOne(line)" v-auth="invalidConst._PERMS.DISTRIBUTE">分配</Button>
      </template>
    </Table>
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
      <SelectDetail v-if="drawerParam.state === '1'" :invalidId="drawerParam.invalidId" />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
  import { Table, Tag, Button, Modal, InputSearch, Select } from 'ant-design-vue';
  import { useI18n } from 'vue-i18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { Loading } from '/@/components/Loading';
  import {
    InvalidConst,
    InvalidModel,
    _ColumnsInvalid as columnsInvalid,
  } from '/@/api/customer/crmInvalid/model/InvalidModel';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { BasePageResult, PageParam } from '/@/api/model/baseModel';
  import { processListByLine } from '/@/hooks/web/useList';
  import { getByInvalid } from '/@/api/customer/crmInvalid/invalid';
  import { useUserStore } from '/@/store/modules/user';
  import DistributeForm from '../customer/components/DistributeForm.vue';
  import SelectDetail from '../customer/components/SelectDetail.vue';
  import FCascader from '/@/components/FCascader';
  import FProjectSelect from '/@/components/FProjectSelect';

  export default defineComponent({
    name: 'Invalid',
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
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('customer');
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const invalidConst = ref(InvalidConst);

      const invalidResult: InvalidModel[] = [];
      let invalidList = reactive(invalidResult);

      //手机号
      const contactValue = ref<String>('');
      const contactChange = async (_value) => {
        if (contactValue.value.length === 3) {
          contactValue.value = contactValue.value + '****';
        }
        if (!contactValue.value) {
          const result = await getInvalidList();
          processListByLine(result, invalidList, invalidTotal);
        }
      };
      const contactSearch = async (value: string) => {
        value = value.replace('****', '');
        invalidCondition.mobile = value;
        const result = await getInvalidList();
        processListByLine(result, invalidList, invalidTotal);
      };

      //  住址
      const liveInChange = async (e) => {
        invalidCondition.liveIn = e.value.toString();
        const result = await getInvalidList();
        processListByLine(result, invalidList, invalidTotal);
      };
      // 工作地
      const workInChange = async (e) => {
        invalidCondition.workIn = e.value.toString();
        const result = await getInvalidList();
        processListByLine(result, invalidList, invalidTotal);
      };
      // 意向地
      const intentionChange = async (e) => {
        invalidCondition.intentionProvince = e.value[0];
        invalidCondition.intentionCity = e.value[1];
        invalidCondition.intentionArea = e.value[2];
        const result = await getInvalidList();
        processListByLine(result, invalidList, invalidTotal);
      };
      // 意向楼盘
      const setProject = async (value) => {
        invalidCondition.intentionProject = value.key.toString();
        const result = await getInvalidList();
        processListByLine(result, invalidList, invalidTotal);
      };
      const onClear = async () => {
        invalidCondition.intentionProject = '';
        const result = await getInvalidList();
        processListByLine(result, invalidList, invalidTotal);
      };

      //购房目的
      const purposeChange = async (value) => {
        invalidCondition.purpose = value;
        const result = await getInvalidList();
        processListByLine(result, invalidList, invalidTotal);
      };

      // 意向强度
      let intentionRange = ref(undefined);
      const intentionRangeSearch = async (value: number) => {
        invalidCondition.buyIntentionRange = value;
        const result = await getInvalidList();
        processListByLine(result, invalidList, invalidTotal);
      };

      const userStore = useUserStore();

      const seeDeal = (line) => {
        drawerParam.state = '1';
        drawerParam.title = '查看客户信息';
        drawerParam.visible = true;
        drawerParam.invalidId = line.id;
      };

      const distributeOne = (line) => {
        drawerParam.state = '0';
        drawerParam.id = line.id;
        drawerParam.title = '分配客户';
        drawerParam.visible = true;
        drawerParam.fromType = 'invalidate';
      };

      const distributeMul = () => {
        if (selectedInvalid.value.length === 0) {
          return;
        }
        drawerParam.fromType = 'invalidate';
        drawerParam.ids = selectedInvalid.value;
        drawerParam.state = '0';
        drawerParam.title = '分配客户';
        drawerParam.visible = true;
      };

      const onClose = () => {
        drawerParam.visible = false;
        drawerParam.id = '';
        drawerParam.state = '';
        drawerParam.title = '';
        drawerParam.fromType = '';
        drawerParam.ids.splice(0);
        drawerParam.invalidId = '';
      };

      //选中行id
      let selectedInvalid = ref<string[]>([]);
      const onSelectChangeInvalid = async (selectedRowKeys) => {
        selectedInvalid.value = selectedRowKeys;
      };

      // model
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
        fromType: '',
        ids: [''],
        invalidId: '',
      });

      const { hasPermission } = usePermission();
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
        invalidPage.pageSize = pag!.pageSize!;
        invalidPage.pageNum = pag?.current;
        const result = await getInvalidList();
        processListByLine(result, invalidList, invalidTotal);
      };

      onMounted(async () => {
        let result;
        result = await getInvalidList();
        processListByLine(result, invalidList, invalidTotal);
      });

      const invalidSort = {
        desc: ['createTime'],
        asc: [''],
      };

      const getInvalidList = async () => {
        loading.value = true;
        let result: BasePageResult<InvalidModel> | undefined;
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
        distributeMul,
        onSelectChangeInvalid,
        selectedInvalid,
        onClose,
        distributeOne,
        handleInvalidTableChange,
        invalidPagination,
        invalidPage,
        t,
        loading,
        prefixCls,
        tip,
        invalidConst,
        columnsInvalid,
        invalidList,
        invalidCondition,
        hasPermission,
        userStore,
        drawerParam,
        seeDeal,
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
