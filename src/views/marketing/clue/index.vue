<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
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
    <span v-if="hasAll">
      <FCascader
        @change="intentionChange"
        class="mr-2"
        :class="`${prefixCls}-add`"
        placeholder="意向地"
      />
    </span>
    <span v-if="!hasAll">
      <FCascader
        @change="intentionChange"
        class="mr-2"
        :class="`${prefixCls}-add`"
        placeholder="意向地"
        :disProCity="true"
        :provinceId="provinceId"
        :cityId="cityId"
      />
    </span>
    <!-- 手机号 -->
    <InputSearch
      :class="`${prefixCls}-add`"
      v-model:value="contactValue"
      placeholder="手机号"
      style="width: 120px"
      @search="contactSearch"
      @change="contactChange"
      :loading="loading"
      :allowClear="true"
    />
    <!-- 性别 -->
    <Select
      :class="`${prefixCls}-add`"
      v-model:value="condition.gender"
      @change="genderChange"
      style="width: 120px"
      :allowClear="true"
      placeholder="性别"
    >
      <SelectOption key="0">女</SelectOption>
      <SelectOption key="1">男</SelectOption>
    </Select>
    <!-- 意向楼盘 -->
    <FProjectSelect @setProject="setProject" @onClear="onClear" :class="`${prefixCls}-add`" />
    <!-- 购房用途 -->
    <Select
      :class="`${prefixCls}-add`"
      ref="select"
      :allowClear="true"
      style="width: 120px"
      @change="purposeChange"
      :options="clueConst.PURPOSES"
      :pagination="false"
      placeholder="购房用途"
    />
    <!-- 创建人 -->
    <Select
      v-if="condition.state === '1'"
      :class="`${prefixCls}-add`"
      v-model:value="createByOne"
      style="width: 120px"
      :options="createUsers"
      @change="createChange"
      @search="createBySearch"
      :filter-option="false"
      :showSearch="true"
      :allowClear="true"
      placeholder="创建人"
      autoComplete="off"
    />
    <!-- 跟进人 -->
    <Select
      :class="`${prefixCls}-add`"
      v-model:value="updateByOne"
      style="width: 120px"
      :options="updateUsers"
      @change="updateChange"
      @search="updateBySearch"
      :filter-option="false"
      :showSearch="true"
      :allowClear="true"
      placeholder="领取人"
      autoComplete="off"
      v-if="condition.state != 1"
    />
    <!-- 活动 -->
    <Select
      v-auth="[
        ClueActivityCOnst._PERMS.SELECT_CITY,
        ClueActivityCOnst._PERMS.SELECT_CREATE,
        ClueActivityCOnst._PERMS.SELECT_ALL,
      ]"
      :class="`${prefixCls}-add`"
      :showSearch="true"
      v-model:value="activityId"
      :filter-option="false"
      @search="activitySearch"
      @change="activityChange"
      :options="activityOptions"
      style="width: 120px"
      :not-found-content="selecting ? undefined : null"
      placeholder="相关活动"
      :allowClear="true"
    >
      <template v-if="selecting" #notFoundContent>
        <Spin size="small" />
      </template>
    </Select>
    <br />
    <Button @click="refreshClue" :class="`${prefixCls}-add`">
      {{ t('marketing.action.refresh') }}
    </Button>
    <Button @click="clearClue" :class="`${prefixCls}-add`">
      {{ t('marketing.action.clear') }}
    </Button>
    <Tabs v-model:activeKey="condition.state" type="card">
      <TabPane
        v-auth="[clueConst._PERMS.SELECT_ALL, clueConst._PERMS.SELECT_CITY]"
        key="0"
        tab="未领取"
      >
        <FClueTable :list="list" @tableAction="action" :tabState="condition.state" />
      </TabPane>
      <TabPane v-auth="clueConst._PERMS.SELECT_USER" key="1" tab="已领取">
        <FClueTable :list="list" @tableAction="action" :tabState="condition.state" />
      </TabPane>
      <TabPane
        v-auth="[clueConst._PERMS.SELECT_ALL, clueConst._PERMS.SELECT_CITY]"
        key="2"
        tab="无效"
      >
        <FClueTable :list="list" @tableAction="action" :tabState="condition.state" />
      </TabPane>
    </Tabs>
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
      :bodyStyle="{ overflow: 'auto', margin: '16px' }"
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      :footer="null"
      :destroyOnClose="true"
      centered
    >
      <ClueForm v-if="drawerParam.state === '0'" :id="drawerParam.id" />
      <TransferForm v-if="drawerParam.state === '1'" :id="drawerParam.id" />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref, unref, watch } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  // 用户store
  import { useUserStore } from '/@/store/modules/user';
  import {
    Pagination,
    Tabs,
    TabPane,
    Modal,
    Select,
    SelectOption,
    Spin,
    Button,
    InputSearch,
  } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { processList, success, failed } from '/@/hooks/web/useList';
  import { ColumnsClue, ClueConst, ClueModel } from '/@/api/marketing/clue/model/clueModel';
  import {
    invalid,
    getByPageWithUser,
    receiveInvalid,
    getByPageAll,
    getByPageWithCity,
    receive,
  } from '/@/api/marketing/clue/clue';
  import ClueForm from './components/ClueForm.vue';
  import FClueTable from '/@/components/FClueTable/src/FClueTable.vue';
  import TransferForm from './components/TransferForm.vue';
  import { debounce } from 'lodash';
  import FCascader from '/@/components/FCascader';
  import { getByPage, getAllWithCity } from '/@/api/marketing/clueActivity/clueActivity';
  import FProjectSelect from '/@/components/FProjectSelect';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useRouter } from 'vue-router';
  import { getUsersBySale } from '/@/api/sys/user/user';
  import { ClueActivityCOnst } from '/@/api/marketing/clueActivity/model/clueActivityModel';

  interface Option {
    value: String;
    label: String;
  }
  export default defineComponent({
    name: 'ClueTable',
    components: {
      Pagination,
      Loading,
      Tabs,
      TabPane,
      ClueForm,
      FCascader,
      Modal,
      FClueTable,
      TransferForm,
      Select,
      SelectOption,
      Spin,
      Button,
      FProjectSelect,
      InputSearch,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      // 获取用户store
      const userStore = useUserStore();
      const { prefixCls } = useDesign('clue');
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);

      const clueColumns = reactive(ColumnsClue);
      const clueConst = ref(ClueConst);

      const hasAll = ref(false);
      const { hasPermission } = usePermission();
      hasAll.value = hasPermission(clueConst.value._PERMS.SELECT_ALL);

      const hasActivityAll = ref(false);
      hasActivityAll.value = hasPermission(ClueActivityCOnst._PERMS.SELECT_ALL);

      // 分页
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });

      //清空
      const clearClue = async () => {
        contactValue.value = '';
        createByOne.value = undefined;
        updateByOne.value = undefined;
        Object.assign(condition, copyCondition);
        pageParam.number = 1;
        if (condition.state === '1') {
          const result = await getList();
          processList(result, list, pageParam);
        } else if (condition.state === '2') {
          let result;
          if (hasAll.value) {
            result = await getByPageAll(condition);
          } else {
            result = await getByPageWithCity(condition);
          }
          processList(result, list, pageParam);
        } else if (condition.state === '0') {
          let result;
          if (hasAll.value) {
            result = await getByPageAll(condition);
          } else {
            result = await getByPageWithCity(condition);
          }
          processList(result, list, pageParam);
        }
      };

      //刷新
      const refreshClue = async () => {
        pageParam.number = 1;
        if (condition.state === '1') {
          const result = await getList();
          processList(result, list, pageParam);
        } else if (condition.state === '2') {
          let result;
          if (hasAll.value) {
            result = await getByPageAll(condition);
          } else {
            result = await getByPageWithCity(condition);
          }
          processList(result, list, pageParam);
        } else if (condition.state === '0') {
          let result;
          if (hasAll.value) {
            result = await getByPageAll(condition);
          } else {
            result = await getByPageWithCity(condition);
          }
          processList(result, list, pageParam);
        }
      };

      //初始加载
      const { currentRoute } = useRouter();

      const { query } = unref(currentRoute);

      onMounted(async () => {
        if (query.type === '2') {
          condition.state = '0';
        }
        const result = await getList();
        processList(result, list, pageParam);
      });

      const cityId = userStore.getUserInfo.companyCityId;
      const provinceId = userStore.getUserInfo.companyProvinceId;
      const userId = userStore.getUserInfo.id;
      // 筛选条件
      const condition = reactive({
        state: '1',
        id: '',
        liveInProvince: undefined,
        liveInCity: undefined,
        liveInArea: undefined,
        userId: undefined,
        contact: undefined,
        gender: undefined,
        workInProvince: undefined,
        workInCity: undefined,
        workInArea: undefined,
        intentionProvince: undefined,
        intentionCity: undefined,
        intentionArea: undefined,
        intentionProject: undefined,
        purpose: '',
        createBy: undefined,
        updateBy: undefined,
        activityId: undefined,
      });
      const copyCondition = reactive({
        state: '1',
        id: '',
        liveInProvince: undefined,
        liveInCity: undefined,
        liveInArea: undefined,
        userId: undefined,
        contact: undefined,
        gender: undefined,
        workInProvince: undefined,
        workInCity: undefined,
        workInArea: undefined,
        intentionProvince: undefined,
        intentionCity: undefined,
        intentionArea: undefined,
        intentionProject: undefined,
        purpose: '',
        createBy: undefined,
        updateBy: undefined,
        activityId: undefined,
      });

      const liveInChange = async (e) => {
        condition.liveInProvince = e.value[0];
        condition.liveInCity = e.value[1];
        condition.liveInArea = e.value[2];
        refreshClue();
      };

      const workInChange = async (e) => {
        condition.workInProvince = e.value[0];
        condition.workInCity = e.value[1];
        condition.workInArea = e.value[2];
        refreshClue();
      };

      const intentionChange = async (e) => {
        condition.intentionProvince = e.value[0];
        condition.intentionCity = e.value[1];
        condition.intentionArea = e.value[2];
        refreshClue();
      };

      const setProject = async (value) => {
        condition.intentionProject = value.key;
        const result = await getList();
        processList(result, list, pageParam);
      };
      const onClear = async () => {
        condition.intentionProject = undefined;
        const result = await getList();
        processList(result, list, pageParam);
      };

      //手机号
      const contactValue = ref<String>('');
      const contactChange = (_value) => {
        if (contactValue.value.length === 3) {
          contactValue.value = contactValue.value + '-';
        }
        if (!contactValue.value) {
          refreshClue();
        }
      };
      const contactSearch = async (value) => {
        condition.contact = value;
        refreshClue();
      };

      //性别
      const genderChange = async (value) => {
        condition.gender = value;
        refreshClue();
      };

      //购房目的
      const purposeChange = debounce(async (value) => {
        condition.purpose = value;
        refreshClue();
      }, 800);

      //创建人
      const createByOne = ref();
      const createUsers = ref<Option[]>([]);
      const createBySearch = debounce(async (value) => {
        loading.value = true;
        if (value) {
          const { content } = await getUsersBySale(value);
          if (content && content.length > 0) {
            content.forEach((item) => {
              createUsers.value?.push({ value: item.id || '', label: item.realName || '' });
            });
          }
        } else {
          condition.createBy = undefined;
          refreshClue();
        }
        loading.value = false;
      }, 800);
      const createChange = async (value) => {
        condition.createBy = value;
        refreshClue();
      };

      //跟进人
      const updateByOne = ref();
      const updateUsers = ref<Option[]>([]);
      const updateBySearch = debounce(async (value) => {
        loading.value = true;
        if (value) {
          const { content } = await getUsersBySale(value);
          if (content && content.length > 0) {
            content.forEach((item) => {
              updateUsers.value?.push({ value: item.id || '', label: item.realName || '' });
            });
          }
        } else {
          condition.updateBy = undefined;
          refreshClue();
        }
        loading.value = false;
      }, 800);
      const updateChange = (value) => {
        condition.updateBy = value;
        refreshClue();
      };

      //相关活动
      const activityId = ref();
      const activityOptions = ref<Option[]>([]);
      let selecting = ref(false);
      const activitySearch = async (value) => {
        selecting.value = true;
        let activityResult;
        if (hasActivityAll.value) {
          activityResult = await getAllWithCity({ title: value });
        } else {
          activityResult = await getByPage({ title: value });
        }
        if (activityResult.content && activityResult.content.length > 0) {
          activityResult.content.forEach((item) => {
            activityOptions.value.push({ value: item.id, label: item.title });
          });
        }
        selecting.value = false;
      };
      const activityChange = async (value) => {
        condition.activityId = value;
        refreshClue();
      };
      const clue: ClueModel[] = [];
      // 列表结果
      let list = reactive(clue);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<ClueModel> | undefined;
        try {
          result = await getByPageWithUser(condition, {
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

      // 操作
      const action = async (key) => {
        const code = key.code;
        const id = key.id;
        switch (code) {
          case 0:
            // 删除
            try {
              loading.value = true;
              await invalid(id);
              success(t('marketing.action.delete'), t('marketing.action.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed(t('marketing.action.delete'), t('marketing.action.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 1:
            // 领取无效
            try {
              loading.value = true;
              await receiveInvalid(id);
              success(t('marketing.action.receive'), t('marketing.action.success'));
              getAll();
            } catch (error: any) {
              failed(t('marketing.action.receive'), t('marketing.action.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 4:
            // 领取
            try {
              loading.value = true;
              await receive(id);
              success(t('marketing.action.receive'), t('marketing.action.success'));
              getAll();
            } catch (error: any) {
              failed(t('marketing.action.receive'), t('marketing.action.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 2:
            // 转人
            drawerParam.visible = true;
            drawerParam.state = '1';
            drawerParam.id = id;
            drawerParam.title = t('marketing.action.transfer');
            break;
          case 3:
            // 查看
            drawerParam.visible = true;
            drawerParam.state = '0';
            drawerParam.id = id;
            drawerParam.title = t('marketing.action.see');
            break;
        }
      };

      watch(
        () => condition.state,
        async () => {
          pageParam.number = 0;
          if (condition.state === '1') {
            const result = await getList();
            processList(result, list, pageParam);
          } else if (condition.state === '2') {
            await getAll();
          } else if (condition.state === '0') {
            await getAll();
          }
        }
      );

      //获取未领取或者无效线索
      const getAll = async () => {
        loading.value = true;
        try {
          const result = await getByPageWithCity(condition, {
            pageSize: pageParam.size,
            pageNum: pageParam.number,
          });
          processList(result, list, pageParam);
        } catch (error: any) {
          createErrorModal({
            title: t('sys.api.errorTip'),
            content: error?.response?.data?.message || t('sys.api.networkExceptionMsg'),
            getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
          });
        } finally {
          loading.value = false;
        }
      };

      // 抽屉参数
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
      });
      //关闭抽屉
      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        if (condition.state === '1') {
          const result = await getList();
          processList(result, list, pageParam);
        } else {
          getAll();
        }
      };

      //页码修改
      const onChange = async (page) => {
        pageParam.number = page;
        if (condition.state === '1') {
          const result = await getList();
          processList(result, list, pageParam);
        } else if (condition.state === '2') {
          await getAll();
        } else if (condition.state === '0') {
          await getAll();
        }
      };
      const onShowSizeChange = async (current, size) => {
        console.log(current);
        pageParam.size = size;
        pageParam.number = 1;
        if (condition.state === '1') {
          const result = await getList();
          processList(result, list, pageParam);
        } else if (condition.state === '2') {
          await getAll();
        } else if (condition.state === '0') {
          await getAll();
        }
      };

      return {
        t,
        prefixCls,
        clueConst,
        condition,
        clueColumns,
        loading,
        tip,
        pageSizeList,
        list,
        pageParam,
        onChange,
        onShowSizeChange,
        onClose,
        cityId,
        drawerParam,
        failed,
        success,
        action,
        userId,
        provinceId,
        contactSearch,
        genderChange,
        liveInChange,
        workInChange,
        intentionChange,
        setProject,
        onClear,
        purposeChange,
        createBySearch,
        updateBySearch,
        activitySearch,
        activityChange,
        selecting,
        activityOptions,
        refreshClue,
        hasAll,
        copyCondition,
        clearClue,
        contactChange,
        contactValue,
        updateChange,
        updateUsers,
        createUsers,
        createChange,
        updateByOne,
        createByOne,
        activityId,
        ClueActivityCOnst,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-clue';
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
      margin-top: 10px;
      margin-right: 10px;
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
      height: calc(50vh);
    }

    .ant-modal-body {
      flex: 1;
    }
  }
</style>
