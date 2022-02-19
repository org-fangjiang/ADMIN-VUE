<template>
  <div>
    <Form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="contact" :label="t('marketing.customer.contact')" name="contact">
        <Input
          :disabled="isUpdate && !updateFields.includes('contact')"
          v-model:value="formState.contact"
          autoComplete="off"
          style="width: 100%"
          type="number"
        />
      </FormItem>
      <FormItem ref="username" :label="t('marketing.customer.username')" name="username">
        <Input
          :disabled="isUpdate && !updateFields.includes('username')"
          v-model:value="formState.username"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="gender" :label="t('marketing.customer.gender')" name="gender">
        <RadioGroup v-model:value="formState.gender">
          <Radio value="1">男</Radio>
          <Radio value="0">女</Radio>
        </RadioGroup>
      </FormItem>
      <!-- <FormItem ref="state" :label="t('marketing.customer.state')" name="state">
        <Select
          :disabled="isUpdate && !updateFields.includes('state')"
          :allowClear="true"
          v-model:value="formState.state"
          :options="cityConst.STATES"
        />
      </FormItem> -->
      <FormItem ref="liveIn" :label="t('marketing.customer.liveIn')" name="liveIn">
        <FCascader
          :disabled="isUpdate && !updateFields.includes('liveIn')"
          @change="liveInChange"
          :provinceId="liveIne[0] || ''"
          :cityId="liveIne[1] || ''"
          :areaId="liveIne[2] || ''"
        />
      </FormItem>
      <FormItem ref="workIn" :label="t('marketing.customer.workIn')" name="workIn">
        <FCascader
          :disabled="isUpdate && !updateFields.includes('workIn')"
          @change="workInChange"
          :provinceId="workIne[0] || ''"
          :cityId="workIne[1] || ''"
          :areaId="workIne[2] || ''"
        />
      </FormItem>
      <FormItem
        ref="intentionProvince"
        :label="t('marketing.customer.intentionProvince')"
        name="intentionProvince"
      >
        <FProvince :provinceId="formState.intentionProvince" @change="changeProvince" />
      </FormItem>
      <FormItem
        ref="intentionCity"
        :label="t('marketing.customer.intentionCity')"
        name="intentionCity"
      >
        <FCity
          :cityId="formState.intentionCity"
          :provinceId="formState.intentionProvince"
          @change="changeCity"
        />
      </FormItem>
      <FormItem
        ref="intentionArea"
        :label="t('marketing.customer.intentionArea')"
        name="intentionArea"
      >
        <FArea
          :areaId="formState.intentionArea"
          :cityId="formState.intentionCity"
          :disabledArea="isUpdate && !updateFields.includes('intentionArea')"
          @change="changeArea"
        />
      </FormItem>
      <FormItem
        ref="intentionProject"
        :label="t('marketing.customer.intentionProject')"
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
          :not-found-content="fetching ? undefined : null"
        >
          <template v-if="fetching" #notFoundContent>
            <Spin size="small" />
          </template>
        </Select>
      </FormItem>
      <FormItem ref="purpose" :label="t('marketing.customer.purpose')" name="purpose">
        <Select
          :disabled="isUpdate && !updateFields.includes('purpose')"
          :allowClear="true"
          v-model:value="formState.purpose"
          :options="groupConst.PURPOSES"
        />
      </FormItem>
      <FormItem ref="demand" :label="t('marketing.customer.demand')" name="demand">
        <Select
          :disabled="isUpdate && !updateFields.includes('demand')"
          v-model:value="demands"
          mode="tags"
          style="width: 100%"
          :token-separators="[',']"
          :open="false"
        />
      </FormItem>
      <FormItem
        ref="demandDescription"
        :label="t('marketing.customer.demandDescription')"
        name="demandDescription"
      >
        <Textarea
          :disabled="isUpdate && !updateFields.includes('demandDescription')"
          v-model:value="formState.demandDescription"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="source" :label="t('marketing.customer.source')" name="source">
        <Select
          :disabled="isUpdate && !updateFields.includes('source')"
          ref="select"
          :allowClear="true"
          v-model:value="formState.source"
          :options="groupConst.SOURCES"
          :pagination="false"
        />
      </FormItem>
      <FormItem
        ref="buyIntentionRange"
        :label="t('marketing.customer.buyIntentionRange')"
        name="buyIntentionRange"
      >
        <!-- <Input
          :disabled="isUpdate && !updateFields.includes('buyIntentionRange')"
          v-model:value="formState.buyIntentionRange"
          autoComplete="off"
          type="number"
        /> -->
        <Slider
          :disabled="isUpdate && !updateFields.includes('buyIntentionRange')"
          v-model:value="formState.buyIntentionRange"
          autoComplete="off"
        />
      </FormItem>
      <FormItem
        v-if="isUpdate"
        ref="autoBugIntentionRange"
        :label="t('marketing.customer.autoBugIntentionRange')"
        name="autoBugIntentionRange"
      >
        <Input
          :disabled="isUpdate && !updateFields.includes('autoBugIntentionRange')"
          v-model:value="formState.autoBugIntentionRange"
          autoComplete="off"
          type="number"
        />
      </FormItem>
      <FormItem
        v-if="isUpdate"
        ref="breakPromiseTimes"
        :label="t('marketing.customer.breakPromiseTimes')"
        name="breakPromiseTimes"
      >
        <Input
          :disabled="isUpdate && !updateFields.includes('breakPromiseTimes')"
          v-model:value="formState.breakPromiseTimes"
          autoComplete="off"
          type="number"
        />
      </FormItem>
      <FormItem
        v-if="isUpdate"
        ref="lookTime"
        :label="t('marketing.customer.lookTime')"
        name="lookTime"
      >
        <Input
          :disabled="isUpdate && !updateFields.includes('lookTime')"
          v-model:value="formState.lookTime"
          autoComplete="off"
          type="number"
        />
      </FormItem>
      <FormItem
        v-if="isUpdate"
        ref="reportTime"
        :label="t('marketing.customer.reportTime')"
        name="reportTime"
      >
        <Input
          :disabled="isUpdate && !updateFields.includes('reportTime')"
          v-model:value="formState.reportTime"
          autoComplete="off"
          type="number"
        />
      </FormItem>
      <FormItem
        v-if="isUpdate"
        ref="viewTime"
        :label="t('marketing.customer.viewTime')"
        name="viewTime"
      >
        <Input
          :disabled="isUpdate && !updateFields.includes('viewTime')"
          v-model:value="formState.viewTime"
          autoComplete="off"
          type="number"
        />
      </FormItem>
      <FormItem
        v-if="isUpdate"
        ref="transferTime"
        :label="t('marketing.customer.transferTime')"
        name="transferTime"
      >
        <Input
          :disabled="isUpdate && !updateFields.includes('transferTime')"
          v-model:value="formState.transferTime"
          autoComplete="off"
          type="number"
        />
      </FormItem>
      <FormItem
        v-if="isUpdate && formState.userByUpdate"
        ref="userByUpdate"
        :label="t('marketing.customer.updateUser')"
        name="userByUpdate"
      >
        <Input
          :disabled="isUpdate && !updateFields.includes('userByUpdate')"
          v-model:value="formState.userByUpdate.realName"
          autoComplete="off"
        />
      </FormItem>
      <FormItem
        v-if="formState.userByCreate"
        ref="userByCreate"
        :label="t('marketing.customer.updateUser')"
        name="userByCreate"
      >
        <Input
          :disabled="isUpdate && !updateFields.includes('userByCreate')"
          v-model:value="formState.userByCreate.realName"
          autoComplete="off"
        />
      </FormItem>
      <FormItem v-if="!isUpdate" :wrapper-col="{ span: 12, offset: 8 }">
        <Button type="primary" @click="onSubmit">{{ t('marketing.action.onSubmit') }}</Button>
        <Button style="" @click="resetForm">{{ t('component.cropper.btn_reset') }}</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, UnwrapRef, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { inSystem } from '/@/api/customer/crmCity/city';
  import { useDesign } from '/@/hooks/web/useDesign';
  // import { useMessage } from '/@/hooks/web/useMessage';
  import {
    Form,
    FormItem,
    Input,
    Select,
    Textarea,
    Spin,
    Button,
    message,
    RadioGroup,
    Radio,
    Slider,
  } from 'ant-design-vue';
  import FCascader from '/@/components/FCascader';
  import { FProvince, FCity, FArea } from '/@/components/FLocation';
  import { failed, success } from '/@/hooks/web/useList';
  import { debounce } from 'lodash-es';
  import { search, searchWithCondition } from '/@/api/host/project/project';
  import { GroupConst, GroupModel } from '/@/api/customer/crmGroup/model/groupModel';
  import { addGroup, getGroupById } from '/@/api/customer/crmGroup/group';

  interface Option {
    value: string;
    label: string;
  }
  export default defineComponent({
    name: 'GroupForm',
    components: {
      Form,
      FormItem,
      Input,
      Select,
      FCascader,
      FProvince,
      FCity,
      FArea,
      Textarea,
      Spin,
      Button,
      RadioGroup,
      Radio,
      Slider,
    },
    props: {
      id: {
        type: String,
        required: false,
      },
    },
    setup(props) {
      const { t } = useI18n();
      // const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('customer');
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //判断是否为更新
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }
      //验证规则
      const rules = reactive(GroupConst._RULES);
      const groupConst = ref(GroupConst);

      const formRef = ref();
      const formState: UnwrapRef<GroupModel> = reactive({});

      const liveIne = reactive<string[]>([]);
      const workIne = reactive<string[]>([]);
      let demands = ref<string[]>([]);

      onMounted(async () => {
        loading.value = true;
        if (props.id) {
          const { content } = await getGroupById(props.id);
          Object.assign(formState, content);
          if (content.liveIn) {
            liveIne.push(...content.liveIn.split(','));
          }
          if (content.workIn) {
            workIne.push(...content.workIn.split(','));
          }
          if (content.demand) {
            demands.value = content.demand.split(',');
          }
          if (content.projectsByIntention && content.projectsByIntention.length > 0) {
            content.projectsByIntention.forEach((p) => {
              projects.value.push(p.id);
              data.value.push({ value: p.id, label: p.name });
            });
          }
        }
        loading.value = false;
      });

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            try {
              formState.demand = demands.value.toString();
              const pro = formState.intentionProject?.toString();
              formState.intentionProject = pro;
              await addGroup(formState);
              success(t('marketing.action.add'), t('marketing.action.success'));
            } catch (error: any) {
              failed(t('marketing.action.add'), t('marketing.action.fail'));
            }
          })
          .catch((_error: any) => {
            failed('失败', '添加失败');
          });
      };

      const resetForm = () => {
        formRef.value.resetFields();
      };

      watch(
        () => formState.contact,
        (_v1, _v2) => {
          isInSys(formState.contact);
        }
      );

      const isInSys = debounce(async (phone) => {
        if (isUpdate.value) {
          return;
        }
        if (phone) {
          const result = await inSystem(phone || '');
          if (result.exist === 'company') {
            message.info({ content: '当前手机号存在于公司列表', duration: 3 });
          } else if (result.exist === 'city') {
            message.info({ content: '当前手机号存在于城市列表', duration: 3 });
          } else if (result.exist === 'group') {
            message.info({ content: '当前手机号存在于小组列表', duration: 3 });
          } else if (result.exist === 'private') {
            message.info({ content: '当前手机号存在于个人列表', duration: 3 });
          } else if (result.exist === 'deal') {
            message.info({ content: '当前手机号存在于成交列表', duration: 3 });
          } else if (result.exist === 'invalidate') {
            message.info({ content: '当前手机号存在于无效列表', duration: 3 });
          }
        }
      }, 2000);

      const liveInChange = async (e) => {
        const i = e.value[0] || '';
        const b = e.value[1] || '';
        const c = e.value[2] || '';
        formState.liveIn = i + ',' + b + ',' + c;
      };

      const workInChange = async (e) => {
        const i = e.value[0] || '';
        const b = e.value[1] || '';
        const c = e.value[2] || '';
        formState.workIn = i + ',' + b + ',' + c;
      };

      //省市区修改，更新了一个之后，下级数据清空重新获取
      const changeProvince = async (e) => {
        if (e.value !== formState.intentionProvince) {
          formState.intentionCity = '';
          formState.intentionArea = '';
        }
        formState.intentionProvince = e.value || '';
      };
      const changeCity = async (e) => {
        if (e.value !== formState.intentionCity) {
          formState.intentionArea = '';
        }
        formState.intentionCity = e.value || '';
      };
      const changeArea = async (e) => {
        formState.intentionArea = e.value || '';
      };

      //搜索项目
      let fetching = ref<boolean>(false);
      const data = ref<Option[]>([]);
      const projectSearch = debounce(async (value) => {
        if (isUpdate.value) {
          return;
        }
        fetching.value = true;
        let result;
        if (value) {
          result = await search({
            name: value,
            provinceId: formState.intentionProvince || '',
            cityId: formState.intentionCity,
            state: '1',
          });
        } else {
          result = await searchWithCondition({
            provinceId: formState.intentionProvince || '',
            cityId: formState.intentionCity,
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

      //选中项目
      let projects = ref<any[]>([]);
      const projectChange = (value) => {
        formState.intentionProject = value;
      };

      return {
        t,
        loading,
        tip,
        prefixCls,
        isUpdate,
        rules,
        groupConst,
        formRef,
        formState,
        labelCol: { span: 6 },
        wrapperCol: { span: 12 },
        updateFields: GroupConst._UPDATE_FIELDS,
        liveInChange,
        workInChange,
        changeProvince,
        changeCity,
        changeArea,
        resetForm,
        onSubmit,
        data,
        projectSearch,
        projects,
        projectChange,
        fetching,
        liveIne,
        workIne,
        demands,
      };
    },
  });
</script>
