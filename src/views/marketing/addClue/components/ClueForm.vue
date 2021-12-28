<template>
  <div :class="prefixCls" style="overflow: scroll; height: 500px">
    <div class="flex flex-row">
      <div class="w-full h-full">
        <Form
          :rules="clueConst._RULES"
          ref="formRef"
          :model="formState"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <FormItem ref="contact" :label="t('marketing.clue.contact')" name="contact">
            <Input
              :disabled="isUpdate && !clueConst._UPDATE_FIELDS.includes('contact')"
              v-model:value="formState.contact"
              autoComplete="off"
            />
          </FormItem>
          <FormItem ref="username" :label="t('marketing.clue.username')" name="username">
            <Input
              :disabled="isUpdate && !clueConst._UPDATE_FIELDS.includes('username')"
              v-model:value="formState.username"
              autoComplete="off"
            />
          </FormItem>
          <FormItem ref="nickname" :label="t('marketing.clue.nickname')" name="nickname">
            <Input
              :disabled="isUpdate && !clueConst._UPDATE_FIELDS.includes('nickname')"
              v-model:value="formState.nickname"
              autoComplete="off"
            />
          </FormItem>
          <FormItem ref="gender" :label="t('marketing.clue.gender')" name="gender">
            <RadioGroup v-model:value="formState.gender" :options="genderOption" />
          </FormItem>
          <FormItem ref="liveInProvince" :label="t('marketing.clue.liveIn')" name="liveInProvince">
            <FCascader
              v-if="isHidden"
              @change="locationChange"
              :provinceId="formState.liveInProvince"
              :cityId="formState.liveInCity"
              :areaId="formState.liveInArea"
            />
          </FormItem>
          <FormItem
            ref="liveInAddress"
            :label="t('marketing.clue.liveInAddress')"
            name="liveInAddress"
          >
            <Input
              :disabled="isUpdate && !clueConst._UPDATE_FIELDS.includes('liveInAddress')"
              v-model:value="formState.liveInAddress"
              autoComplete="off"
            />
          </FormItem>
          <FormItem ref="workInProvince" :label="t('marketing.clue.workIn')" name="workInProvince">
            <FCascader
              v-if="isHidden"
              @change="workChange"
              :provinceId="formState.workInProvince"
              :cityId="formState.workInCity"
              :areaId="formState.workInArea"
            />
          </FormItem>
          <FormItem
            ref="workInAddress"
            :label="t('marketing.clue.workInAddress')"
            name="workInAddress"
          >
            <Input
              :disabled="isUpdate && !clueConst._UPDATE_FIELDS.includes('workInAddress')"
              v-model:value="formState.workInAddress"
              autoComplete="off"
            />
          </FormItem>
          <FormItem ref="intentionCity" :label="t('marketing.clue.intention')" name="intentionCity">
            <FCascader
              v-if="isHidden"
              @change="intentionChange"
              :provinceId="provinceId"
              :cityId="cityId"
              :areaId="formState.intentionArea"
              :disProCity="true"
            />
          </FormItem>
          <FormItem
            ref="intentionProject"
            :label="t('marketing.clue.intentionProject')"
            name="intentionProject"
          >
            <Select
              :showSearch="true"
              v-model:value="projects"
              :options="data"
              :filter-option="false"
              mode="multiple"
              @change="projectChange"
              @search="projectSearch"
              style="width: 120px"
              :not-found-content="fetching ? undefined : null"
            >
              <template v-if="fetching" #notFoundContent>
                <Spin size="small" />
              </template>
            </Select>
          </FormItem>
          <FormItem ref="purpose" :label="t('marketing.clue.purpose')" name="purpose">
            <Select
              :disabled="isUpdate && !clueConst._UPDATE_FIELDS.includes('purpose')"
              ref="select"
              :allowClear="true"
              v-model:value="formState.purpose"
              style="width: 120px"
              :options="clueConst.PURPOSES"
              :pagination="false"
            />
          </FormItem>
          <FormItem ref="demand" :label="t('marketing.clue.demand')" name="demand">
            <Select
              :disabled="isUpdate && !clueConst._UPDATE_FIELDS.includes('demand')"
              v-model:value="demands"
              mode="tags"
              style="width: 100%"
              :token-separators="[',']"
              @change="demandChange"
              :open="false"
            />
          </FormItem>
          <FormItem
            ref="demandDescription"
            :label="t('marketing.clue.demandDescription')"
            name="demandDescription"
          >
            <Textarea
              :disabled="isUpdate && !clueConst._UPDATE_FIELDS.includes('demandDescription')"
              v-model:value="formState.demandDescription"
              autoComplete="off"
            />
          </FormItem>
          <FormItem ref="source" :label="t('marketing.clue.source')" name="source">
            <Select
              :disabled="isUpdate && !clueConst._UPDATE_FIELDS.includes('source')"
              ref="select"
              :allowClear="true"
              v-model:value="formState.source"
              style="width: 120px"
              :options="clueConst.SOURCES"
              :pagination="false"
            />
          </FormItem>
          <FormItem :label="t('marketing.clue.updateBy')" name="updateBy">
            <Select
              v-model:value="formState.updateBy"
              autoComplete="off"
              :options="sales"
              @change="updateByChange"
              :allowClear="true"
              @search="updateBySearch"
              :not-found-content="updating ? undefined : null"
              :showSearch="true"
              :filter-option="false"
            >
              <template v-if="updating" #notFoundContent>
                <Spin size="small" />
              </template>
            </Select>
          </FormItem>
          <FormItem v-if="isUpdate" :label="t('marketing.clue.activityId')" name="activityId">
            <Select
              v-model:value="formState.activityId"
              autoComplete="off"
              :options="activityOptions"
              @change="activityChange"
              :allowClear="true"
              @search="activitySearch"
              :not-found-content="isActivity ? undefined : null"
              :showSearch="true"
              :filter-option="false"
            >
              <template v-if="isActivity" #notFoundContent>
                <Spin size="small" />
              </template>
            </Select>
          </FormItem>
          <FormItem v-if="!isUpdate" :wrapper-col="{ span: 12, offset: 8 }">
            <Button type="primary" @click="addFollow">{{ t('marketing.action.add') }}</Button>
            <Button style="" @click="resetForm">{{ t('component.cropper.btn_reset') }}</Button>
          </FormItem>
        </Form>
      </div>
      <div v-if="isUpdate" class="pt-4 w-full h-[500px]" style="overflow-y: scroll; height: 500px">
        <Timeline>
          <TimelineItem
            :position="item.followResult === '1' ? 'right' : 'left'"
            v-for="item in formState.sysClueFollowEntities"
            :key="item.id"
          >
            <p>内容：{{ item.content || '' }}</p>
            <p>创建人：{{ item.userCreateBy?.realName || '' }}</p>
            <p>
              结果：
              <span v-if="item.followResult === '1'">无效</span>
              <span v-if="item.followResult === '2'">不买房</span>
              <span v-if="item.followResult === '3'">同行</span>
              <span v-if="item.followResult === '4'">号码错误</span>
              <span v-if="item.followResult === '5'">已转为客户</span></p
            >
            <p>
              时间：
              <span>{{ item.createTime.replace('T', ' ').replace('.000+08:00', '') }}</span>
            </p>
          </TimelineItem>
        </Timeline>
      </div>
    </div>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import {
    Form,
    FormItem,
    Input,
    Select,
    Button,
    Textarea,
    Spin,
    RadioGroup,
    Timeline,
    TimelineItem,
  } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { ClueConst, ClueModel } from '/@/api/marketing/clue/model/clueModel';
  import { useUserStore } from '/@/store/modules/user';
  import { getProject, search, searchWithCondition } from '/@/api/host/project/project';
  import { addByUser, getByIdWithCreate } from '/@/api/marketing/clue/clue';
  import { success, failed } from '/@/hooks/web/useList';
  import { debounce } from 'lodash-es';
  import { getUsersBySale } from '/@/api/sys/user/user';
  import FCascader from '/@/components/FCascader';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { ClueActivityCOnst } from '/@/api/marketing/clueActivity/model/clueActivityModel';
  import { getAllWithCity, getByPage } from '/@/api/marketing/clueActivity/clueActivity';

  interface Option {
    value: string;
    label: string;
  }
  export default defineComponent({
    name: 'ClueForm',
    components: {
      Form,
      FormItem,
      Input,
      Loading,
      Select,
      RadioGroup,
      Button,
      Textarea,
      Spin,
      FCascader,
      Timeline,
      TimelineItem,
    },
    props: {
      id: {
        type: String,
        requires: false,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('clue');
      const clueConst = ref(ClueConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //判断更新还是新增
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<ClueModel> = reactive({});

      const data = ref<Option[]>([]);
      const userStore = useUserStore();
      const provinceId = userStore.getUserInfo.companyProvinceId;
      const cityId = userStore.getUserInfo.companyCityId;
      let demands = ref<String[]>([]);
      let isHidden = ref(false);

      const genderOption = [
        { value: '0', label: '女' },
        { value: '1', label: '男' },
      ];

      const hasAll = ref(false);
      const { hasPermission } = usePermission();
      hasAll.value = hasPermission(ClueActivityCOnst._PERMS.SELECT_ALL);

      //初始加载
      onMounted(async () => {
        loading.value = true;
        if (props.id) {
          const { content } = await getByIdWithCreate(props.id);
          Object.assign(formState, content);
          isHidden.value = true;
          if (formState.demand) {
            demands.value = formState.demand.split(',');
          }
          if (formState.intentionProject) {
            const sum = formState.intentionProject.split(',');
            sum.forEach(async (item) => {
              const { content } = await getProject(item);
              projects.value.push(content.id);
              data.value.push({ value: content.id || '', label: content.name || '' });
            });
          }
          if (formState.userByUpdate) {
            sales.value.push({
              value: formState.userByUpdate.id,
              label: formState.userByUpdate.realName || '',
            });
          }
          if (formState.activityByActivityId) {
            activityOptions.value.push({
              value: formState.activityByActivityId.id || '',
              label: formState.activityByActivityId.title || '',
            });
          }
        } else {
          isHidden.value = true;
        }
        formState.intentionProvince = '130000';
        formState.intentionCity = '130100';
        loading.value = false;
      });

      const activityOptions = ref<Option[]>([]);
      const companyId = useUserStore().getUserInfo.companyId;
      let isActivity = ref(false);
      const activitySearch = debounce(async (value) => {
        isActivity.value = true;
        let result;
        if (hasAll.value) {
          result = await getAllWithCity({ title: value, companyId: companyId });
        } else {
          result = await getByPage({ title: value, companyId: companyId });
        }
        if (result.content && result.content.length > 0) {
          result.content.forEach((item) => {
            activityOptions.value.push({ value: item.id, label: item.title });
          });
        }
        isActivity.value = false;
      }, 800);
      const activityChange = async (value) => {
        formState.activityId = value;
      };

      //搜索项目
      let fetching = ref<boolean>(false);
      const projectSearch = debounce(async (value) => {
        fetching.value = true;
        let result;
        if (value) {
          result = await search({
            name: value,
            provinceId: provinceId || '',
            cityId: cityId,
            state: '1',
          });
        } else {
          result = await searchWithCondition({
            provinceId: provinceId || '',
            cityId: cityId,
            state: '1',
          });
        }
        if (result.content && result.content.length > 0) {
          data.value.splice(0);
          result.content.forEach((item) => {
            data.value.push({ value: item.id || '', label: item.name || '' });
          });
        }
        fetching.value = false;
      }, 800);

      //分配人
      let updating = ref<boolean>(false);
      const sales = ref<Option[]>([]);
      const updateBySearch = debounce(async (value) => {
        if (value) {
          updating.value = true;
          const { content } = await getUsersBySale(value);
          if (content && content.length > 0) {
            content.forEach((item) => {
              sales.value?.push({ value: item.id || '', label: item.realName || '' });
            });
          }
          updating.value = false;
        }
      }, 500);

      const updateByChange = (value) => {
        formState.updateBy = value;
      };
      //居住地
      const locationChange = async (e) => {
        formState.liveInProvince = e.value[0] || '';
        formState.liveInCity = e.value[1] || '';
        formState.liveInArea = e.value[2] || '';
      };
      //工作地
      const workChange = async (e) => {
        formState.workInProvince = e.value[0] || '';
        formState.workInCity = e.value[1] || '';
        formState.workInArea = e.value[2] || '';
      };
      //意向地
      const intentionChange = async (e) => {
        formState.intentionProvince = e.value[0] || '';
        formState.intentionCity = e.value[1] || '';
        formState.intentionArea = e.value[2] || '';
      };

      //选中项目
      let projects = ref<any[]>([]);
      const projectChange = (value) => {
        formState.intentionProject = value;
      };

      //购房需求
      const demandChange = async (value) => {
        formState.demand = value.toString();
      };

      //确认添加
      const addFollow = () => {
        formRef.value
          .validate()
          .then(async () => {
            try {
              const de = formState.demand?.toString();
              formState.demand = de;
              const pro = formState.intentionProject?.toString();
              formState.intentionProject = pro;
              await addByUser(formState);
              success(t('marketing.action.add'), t('marketing.action.success'));
            } catch (error: any) {
              failed(t('marketing.action.add'), t('marketing.action.fail'));
            }
          })
          .catch((error: any) => {
            console.log('error', error);
          });
      };

      //重置
      const resetForm = async () => {
        formRef.value.resetFields();
      };

      return {
        t,
        prefixCls,
        clueConst,
        loading,
        tip,
        formRef,
        formState,
        addFollow,
        resetForm,
        labelCol: { span: 8 },
        wrapperCol: { span: 12 },
        isUpdate,
        data,
        provinceId,
        cityId,
        projectSearch,
        demandChange,
        fetching,
        updateBySearch,
        updating,
        updateByChange,
        sales,
        locationChange,
        workChange,
        intentionChange,
        projects,
        demands,
        projectChange,
        genderOption,
        isHidden,
        props,
        activityChange,
        activitySearch,
        activityOptions,
        isActivity,
      };
    },
  });
</script>
