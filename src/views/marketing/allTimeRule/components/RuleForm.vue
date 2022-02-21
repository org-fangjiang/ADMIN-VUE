<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="ruleConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="companyId" :label="t('marketing.timeRule.companyId')" name="companyId">
        <Select
          v-model:value="formState.companyId"
          ref="selectRef"
          label-in-value
          style="width: 120px"
          :filter-option="false"
          :not-found-content="null"
          :options="options"
          @search="fetchUser"
          :showSearch="true"
          :labelInValue="false"
          @change="companyChange"
          :allowClear="true"
          :disabled="isUpdate"
        />
      </FormItem>
      <FormItem
        ref="clueDropLevel"
        :label="t('marketing.timeRule.clueDropLevel')"
        name="clueDropLevel"
      >
        <InputNumber
          :disabled="isUpdate && !ruleConst._UPDATE_FIELDS.includes('clueDropLevel')"
          v-model:value="formState.clueDropLevel"
          autoComplete="off"
          :formatter="(value) => `${value}分钟`"
          :parser="(value) => value.replace('分钟', '')"
        />
      </FormItem>
      <FormItem
        ref="clueUnFollow"
        :label="t('marketing.timeRule.clueUnFollow')"
        name="clueUnFollow"
      >
        <InputNumber
          :disabled="isUpdate && !ruleConst._UPDATE_FIELDS.includes('clueUnFollow')"
          v-model:value="formState.clueUnFollow"
          autoComplete="off"
          :formatter="(value) => `${value}分钟`"
          :parser="(value) => value.replace('分钟', '')"
        />
      </FormItem>
      <FormItem
        ref="clueUnclaimed"
        :label="t('marketing.timeRule.clueUnclaimed')"
        name="clueUnclaimed"
      >
        <InputNumber
          :disabled="isUpdate && !ruleConst._UPDATE_FIELDS.includes('clueUnclaimed')"
          v-model:value="formState.clueUnclaimed"
          autoComplete="off"
          :formatter="(value) => `${value}分钟`"
          :parser="(value) => value.replace('分钟', '')"
        />
      </FormItem>
      <FormItem
        ref="privateToGroup"
        :label="t('marketing.timeRule.privateToGroup')"
        name="privateToGroup"
      >
        <InputNumber
          :disabled="isUpdate && !ruleConst._UPDATE_FIELDS.includes('privateToGroup')"
          v-model:value="formState.privateToGroup"
          autoComplete="off"
          :formatter="(value) => `${value}分钟`"
          :parser="(value) => value.replace('分钟', '')"
        />
      </FormItem>
      <FormItem
        ref="groupToCompany"
        :label="t('marketing.timeRule.groupToCompany')"
        name="groupToCompany"
      >
        <InputNumber
          :disabled="isUpdate && !ruleConst._UPDATE_FIELDS.includes('groupToCompany')"
          v-model:value="formState.groupToCompany"
          autoComplete="off"
          :formatter="(value) => `${value}分钟`"
          :parser="(value) => value.replace('分钟', '')"
        />
      </FormItem>
      <FormItem
        ref="companyToCity"
        :label="t('marketing.timeRule.companyToCity')"
        name="companyToCity"
      >
        <InputNumber
          :disabled="isUpdate && !ruleConst._UPDATE_FIELDS.includes('companyToCity')"
          v-model:value="formState.companyToCity"
          autoComplete="off"
          :formatter="(value) => `${value}分钟`"
          :parser="(value) => value.replace('分钟', '')"
        />
      </FormItem>
      <FormItem ref="afterFollow" :label="t('marketing.timeRule.afterFollow')" name="afterFollow">
        <InputNumber
          :disabled="isUpdate && !ruleConst._UPDATE_FIELDS.includes('afterFollow')"
          v-model:value="formState.afterFollow"
          autoComplete="off"
          :formatter="(value) => `${value}分钟`"
          :parser="(value) => value.replace('分钟', '')"
        />
      </FormItem>
      <FormItem :wrapper-col="{ span: 14, offset: 8 }">
        <Button type="primary" @click="onSubmit">{{ t('component.modal.okText') }}</Button>
        <Button style="margin-left: 10px" @click="resetForm">{{
          t('component.cropper.btn_reset')
        }}</Button>
      </FormItem>
    </Form>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Button, Form, FormItem, InputNumber, Select } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { success, failed } from '/@/hooks/web/useList';
  import { TimeRuleConst, TimeRuleModel } from '/@/api/marketing/timeRule/model/timeRuleModel';
  import { add, get, update } from '/@/api/marketing/timeRule/timeRule';
  import { debounce } from 'lodash-es';
  import { getCompanies } from '/@/api/sys/compnay/company';

  interface Option {
    value: string;
    label: string;
  }
  export default defineComponent({
    name: 'RuleForm',
    components: {
      Button,
      Form,
      FormItem,
      InputNumber,
      Loading,
      Select,
    },
    props: {
      id: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('timeRule');
      const ruleConst = ref(TimeRuleConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //判断更新还是新增
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<TimeRuleModel> = reactive({});

      const options = ref<Option[]>([]);
      //筛选文本框值发生变化调用
      const fetchUser = debounce(async (value) => {
        options.value.splice(0);
        const { content } = await getCompanies({ name: value });
        if (content) {
          content.forEach((item) => {
            options.value?.push({ value: item.id || '', label: item.name || '' });
          });
        }
      }, 200);

      //选择企业
      const companyChange = async (value) => {
        formState.companyId = value;
      };

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            if (props.id) {
              loading.value = true;
              try {
                formState.companyId = props.id;
                await update(formState);
                success(t('marketing.action.update'), t('marketing.action.success'));
              } catch (error: any) {
                failed(error?.response?.data?.message, t('marketing.action.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              loading.value = true;
              try {
                const { content } = await add(formState);
                success(t('marketing.action.add'), t('marketing.action.success'));
                Object.assign(formState, content);
              } catch (error: any) {
              } finally {
                loading.value = false;
              }
            }
          })
          .catch((error: any) => {
            console.log('error', error);
          });
      };

      //重置
      const resetForm = async () => {
        loading.value = true;
        if (props.id) {
          try {
            const { content } = await get({ companyId: props.id });
            Object.assign(formState, content);
          } catch (error) {
          } finally {
            loading.value = false;
          }
        } else {
          formRef.value.resetFields();
        }
      };

      //初始加载
      onMounted(async () => {
        loading.value = true;
        if (props.id) {
          const { content } = await get({ companyId: props.id });
          Object.assign(formState, content);
          if (content.companyById) {
            options.value.push({ value: content.companyById.id, label: content.companyById.name });
          }
        }
        loading.value = false;
      });

      return {
        t,
        prefixCls,
        ruleConst,
        loading,
        tip,
        formRef,
        formState,
        onSubmit,
        resetForm,
        labelCol: { span: 13 },
        wrapperCol: { span: 14 },
        isUpdate,
        props,
        companyChange,
        fetchUser,
        options,
      };
    },
  });
</script>
