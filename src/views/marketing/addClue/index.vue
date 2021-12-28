<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <Button @click="clearClue" :class="`${prefixCls}-add`">
      {{ t('marketing.action.clear') }}
    </Button>
    <Button v-auth="clueConst._PERMS.ADD" @click="addClue" :class="`${prefixCls}-add`">{{
      t('marketing.action.add')
    }}</Button>
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
    />
    <Table :columns="clueColumns" :data-source="list" rowKey="id" :pagination="false">
      <template #projectRelationEntities="{ text: projectRelationEntities }">
        <span v-for="(item, index) in projectRelationEntities" :key="index">
          <Tag color="blue">{{ item.name }}</Tag>
        </span>
      </template>
      <template #state="{ text: state }">
        <span>
          <Tag :color="clueConst.STATES[state].color">
            {{ clueConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #purpose="{ text: purpose }">
        <span v-if="purpose">
          <span>
            <Tag :color="clueConst.PURPOSES[purpose - 1].color">
              {{ clueConst.PURPOSES[purpose - 1].label }}
            </Tag>
          </span>
        </span>
      </template>
      <template #demand="{ text: demand }">
        <span v-if="demand">
          <span v-for="(item, index) in demand.split(',')" :key="index">
            <Tag color="blue">
              {{ item }}
            </Tag>
          </span>
        </span>
        <span v-else></span>
      </template>
      <template #operation="{ text: operation }">
        <Button
          @click="clickSee(operation)"
          v-auth="clueConst._PERMS.SELECT_CREATE"
          type="link"
          size="small"
          :class="prefixCls"
        >
          {{ t('marketing.action.see') }}
        </Button>
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
      :bodyStyle="{ overflow: 'auto', margin: '16px' }"
      :destroyOnClose="true"
      :footer="null"
    >
      <ClueForm v-if="drawerParam.state === '0'" :id="drawerParam.id" />
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
  // 用户store
  import { useUserStore } from '/@/store/modules/user';
  import {
    Table,
    Pagination,
    Tag,
    Button,
    Modal,
    Select,
    SelectOption,
    InputSearch,
  } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { processList, success, failed } from '/@/hooks/web/useList';
  import {
    ColumnsClue as ColumnsClue,
    ClueConst,
    ClueModel,
  } from '/@/api/marketing/clue/model/clueModel';
  import { getByPageWithCreate } from '/@/api/marketing/clue/clue';
  import ClueForm from './components/ClueForm.vue';
  import { debounce } from 'lodash';
  import FCascader from '/@/components/FCascader';
  import { getByPage } from '/@/api/marketing/clueActivity/clueActivity';
  import FProjectSelect from '/@/components/FProjectSelect';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getUsersBySale } from '/@/api/sys/user/user';
  interface Option {
    label: String;
    value: String;
  }
  export default defineComponent({
    name: 'AddClue',
    components: {
      Table,
      Pagination,
      Tag,
      Button,
      Loading,
      Modal,
      ClueForm,
      Select,
      SelectOption,
      FCascader,
      FProjectSelect,
      InputSearch,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      // 获取用户store
      const userStore = useUserStore();
      const { prefixCls } = useDesign('addClue');
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);

      const clueColumns = reactive(ColumnsClue);
      const clueConst = ref(ClueConst);

      //判断是否有这个权限
      const hasAll = ref(false);
      const { hasPermission } = usePermission();
      hasAll.value = hasPermission(clueConst.value._PERMS.SELECT_ALL);

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
        updateByOne.value = undefined;
        updateUsers.value.splice(0);
        Object.assign(condition, copyCondition);
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      //初始加载
      onMounted(async () => {
        const result = await getList();
        processList(result, list, pageParam);
      });

      const userId = userStore.getUserInfo.id;
      const provinceId = userStore.getUserInfo.companyProvinceId;
      const cityId = userStore.getUserInfo.companyCityId;
      // 筛选条件
      const condition = reactive({
        state: '1',
        id: '',
        liveInProvince: undefined,
        liveInCity: undefined,
        liveInArea: undefined,
        userId: userId || undefined,
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
        userId: userId || undefined,
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
        const result = await getList();
        processList(result, list, pageParam);
      };

      const workInChange = async (e) => {
        condition.workInProvince = e.value[0];
        condition.workInCity = e.value[1];
        condition.workInArea = e.value[2];
        const result = await getList();
        processList(result, list, pageParam);
      };

      const intentionChange = async (e) => {
        condition.intentionProvince = e.value[0];
        condition.intentionCity = e.value[1];
        condition.intentionArea = e.value[2];
        const result = await getList();
        processList(result, list, pageParam);
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
      const contactChange = async (_value) => {
        if (contactValue.value.length === 3) {
          contactValue.value = contactValue.value + '-';
        }
        if (!contactValue.value) {
          pageParam.number = 1;
          const result = await getList();
          processList(result, list, pageParam);
        }
      };
      const contactSearch = async (value) => {
        loading.value = true;
        condition.contact = value;
        const result = await getList();
        processList(result, list, pageParam);
        loading.value = false;
      };

      //性别
      const genderChange = async (value) => {
        condition.gender = value;
        const result = await getList();
        processList(result, list, pageParam);
      };

      //购房目的
      const purposeChange = debounce(async (value) => {
        condition.purpose = value;
        const result = await getList();
        processList(result, list, pageParam);
      }, 800);

      //创建人
      const createBySearch = debounce(async (value) => {
        condition.createBy = value;
        const result = await getList();
        processList(result, list, pageParam);
      }, 800);

      //跟进人
      const updateByOne = ref(undefined);
      const updateUsers = ref<Option[]>([]);
      const updateBySearch = debounce(async (value) => {
        updateByOne.value = value;
        loading.value = true;
        updateUsers.value.splice(0);
        if (value) {
          const { content } = await getUsersBySale(value);
          if (content && content.length > 0) {
            content.forEach((item) => {
              updateUsers.value.push({ value: item.id || '', label: item.realName || '' });
            });
          }
        } else {
          condition.updateBy = undefined;
          const result = await getList();
          processList(result, list, pageParam);
        }
        loading.value = false;
      }, 800);
      const updateChange = async (value) => {
        condition.updateBy = value;
        const result = await getList();
        processList(result, list, pageParam);
      };

      //相关活动
      const options = ref<Option[]>([]);
      let selecting = ref(false);
      const activitySearch = async (value) => {
        selecting.value = true;
        const { content } = await getByPage({ title: value });
        if (content && content.length > 0) {
          content.forEach((item) => {
            options.value.push({ label: item.title || '', value: item.id || '' });
          });
        }
        selecting.value = false;
      };
      const activityChange = async (value) => {
        condition.activityId = value;
        const result = await getList();
        processList(result, list, pageParam);
      };

      //根据状态筛选
      const stateHandleChange = async (value) => {
        condition.state = value;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      const clue: ClueModel[] = [];
      // 列表结果
      let list = reactive(clue);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<ClueModel> | undefined;
        try {
          result = await getByPageWithCreate(condition, {
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

      //查看
      const clickSee = (value) => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = value.id;
        drawerParam.title = t('host.action.see');
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
        const result = await getList();
        processList(result, list, pageParam);
      };
      //添加
      const addClue = async () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('host.action.add');
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
        clueConst,
        condition,
        clueColumns,
        loading,
        tip,
        pageSizeList,
        list,
        pageParam,
        onChange,
        addClue,
        onShowSizeChange,
        onClose,
        drawerParam,
        failed,
        success,
        stateHandleChange,
        clickSee,
        provinceId,
        cityId,
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
        options,
        contactSearch,
        genderChange,
        hasAll,
        copyCondition,
        clearClue,
        contactChange,
        contactValue,
        updateChange,
        updateUsers,
        updateByOne,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-addClue';
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
