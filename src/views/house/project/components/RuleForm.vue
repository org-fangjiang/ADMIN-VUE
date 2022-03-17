<template>
  <div :class="prefixCls" class="p-4">
    <Form
      ref="formRef"
      :model="formState"
      :rules="reportRuleConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="isFullNumber" :label="t('host.reportRule.isFullNumber')" name="isFullNumber">
        <RadioGroup v-model:value="formState.isFullNumber" name="isFullNumber">
          <Radio :value="1">是</Radio>
          <Radio :value="0">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem ref="isHasFace" :label="t('host.reportRule.isHasFace')" name="isHasFace">
        <RadioGroup v-model:value="formState.isHasFace" name="isHasFace">
          <Radio :value="1">是</Radio>
          <Radio :value="0">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem
        ref="isRepeatReport"
        :label="t('host.reportRule.isRepeatReport')"
        name="isRepeatReport"
      >
        <RadioGroup v-model:value="formState.isRepeatReport" name="isRepeatReport">
          <Radio :value="1">是</Radio>
          <Radio :value="0">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem
        ref="reportAfterLook"
        :label="t('host.reportRule.reportAfterLook')"
        name="reportAfterLook"
      >
        <!-- <InputNumber
          v-model:value="formState.reportAfterLook"
          autoComplete="off"
          :formatter="(value) => `${value}分钟`"
          :parser="(value) => value.replace('分钟', '')"
        /> -->
        <Input v-model:value="formState.reportAfterLook" autoComplete="off" type="number" />
      </FormItem>
      <FormItem
        ref="reportProtectTime"
        :label="t('host.reportRule.reportProtectTime')"
        name="reportProtectTime"
      >
        <InputNumber
          v-model:value="formState.reportProtectTime"
          autoComplete="off"
          :formatter="(value) => `${value}天`"
          :parser="(value) => value.replace('天', '')"
        />
      </FormItem>
      <FormItem
        ref="visitProtectTime"
        :label="t('host.reportRule.visitProtectTime')"
        name="visitProtectTime"
      >
        <InputNumber
          v-model:value="formState.visitProtectTime"
          autoComplete="off"
          :formatter="(value) => `${value}天`"
          :parser="(value) => value.replace('天', '')"
        />
      </FormItem>
      <FormItem
        ref="revisitProtectTime"
        :label="t('host.reportRule.revisitProtectTime')"
        name="revisitProtectTime"
      >
        <InputNumber
          v-model:value="formState.revisitProtectTime"
          autoComplete="off"
          :formatter="(value) => `${value}天`"
          :parser="(value) => value.replace('天', '')"
        />
      </FormItem>
      <FormItem
        ref="receiveTimeStart"
        :label="t('host.reportRule.receiveTimeStart')"
        name="receiveTimeStart"
      >
        <TimePicker v-model:value="startTime" @change="changeStart" />
      </FormItem>
      <FormItem
        ref="receiveTimeEnd"
        :label="t('host.reportRule.receiveTimeEnd')"
        name="receiveTimeEnd"
      >
        <TimePicker v-model:value="endTime" @change="changeEnd" />
      </FormItem>
      <FormItem ref="details" :label="t('host.reportRule.details')" name="details">
        <Textarea v-model:value="formState.details" autoComplete="off" />
      </FormItem>
      <FormItem :wrapper-col="{ span: 14, offset: 7 }">
        <Button v-if="isAdd" type="primary" @click="onAdd">{{ t('component.action.add') }}</Button>
        <Button v-else type="primary" @click="onSubmit">{{ t('component.action.update') }}</Button>
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
  import {
    Button,
    Form,
    FormItem,
    InputNumber,
    RadioGroup,
    Radio,
    Textarea,
    TimePicker,
    Input,
  } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { success, failed } from '/@/hooks/web/useList';
  import { ReportRuleConst, ReportRuleModel } from '/@/api/host/reportRule/model/reportRuleModel';
  import { getRule, updateRule, addRule } from '/@/api/host/reportRule/reportRule';
  import moment, { Moment } from 'moment';

  export default defineComponent({
    name: 'RuleForm',
    components: {
      Button,
      Form,
      FormItem,
      InputNumber,
      Loading,
      RadioGroup,
      Radio,
      Textarea,
      TimePicker,
      Input,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('reportRule');
      const reportRuleConst = ref(ReportRuleConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      const startTime = ref<Moment>();
      const endTime = ref<Moment>();
      const changeStart = (value) => {
        startTime.value = value;
        formState.receiveTimeStart = value.toISOString();
      };
      const changeEnd = (value) => {
        endTime.value = value;
        formState.receiveTimeEnd = value.toISOString();
      };

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<ReportRuleModel> = reactive({
        projectId: props.id,
      });
      let isAdd = ref(false);
      // 更新
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            try {
              await updateRule(formState);
              success(t('host.action.update'), t('host.action.success'));
            } catch (error: any) {
              failed(t('host.action.update'), t('host.action.fail'));
            } finally {
              loading.value = false;
            }
          })
          .catch((error: any) => {
            console.log('error', error);
          });
      };

      // 添加
      const onAdd = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            try {
              debugger;
              await addRule(formState);
              success(t('host.action.add'), t('host.action.success'));
            } catch (error: any) {
              failed(t('host.action.add'), t('host.action.fail'));
            } finally {
              loading.value = false;
            }
          })
          .catch((error: any) => {
            console.log('error', error);
          });
      };
      // 重置
      const resetForm = async () => {
        loading.value = true;
        try {
          const { content } = await getRule(props.id);
          Object.assign(formState, content);
          startTime.value = moment(formState.receiveTimeStart, 'HH:mm:ss');
          endTime.value = moment(formState.receiveTimeEnd, 'HH:mm:ss');
        } catch (error) {
        } finally {
          loading.value = false;
        }
      };
      onMounted(async () => {
        try {
          loading.value = true;
          formState.projectId = props.id;
          let result;
          result = await getRule(props.id);
          Object.assign(formState, result.content);
          startTime.value = moment(formState.receiveTimeStart, 'HH:mm:ss');
          endTime.value = moment(formState.receiveTimeEnd, 'HH:mm:ss');
          if (!result.content) {
            isAdd.value = true;
          }
        } catch (error) {
          isAdd.value = true;
        } finally {
          loading.value = false;
        }
      });

      return {
        t,
        prefixCls,
        reportRuleConst,
        loading,
        tip,
        formRef,
        formState,
        onSubmit,
        resetForm,
        labelCol: { span: 9 },
        wrapperCol: { span: 14 },
        props,
        onAdd,
        isAdd,
        changeStart,
        changeEnd,
        endTime,
        startTime,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-reportRule';
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
</style>
