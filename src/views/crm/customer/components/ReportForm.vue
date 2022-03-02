<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="reportConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="customerName" :label="t('marketing.follow.customerId')" name="customerName">
        <Input v-model:value="formState.customerName" />
      </FormItem>
      <FormItem ref="projectId" :label="t('marketing.follow.projectId')" name="projectId">
        <FProjectSelect
          :projectId="formState.projectId"
          @setProject="setProject"
          :disable="isUpdate && !reportConst._UPDATE_FIELDS.includes('projectId')"
        />
      </FormItem>
      <FormItem ref="lookTime" :label="t('marketing.report.lookTime')" name="lookTime">
        <DatePicker
          show-time
          :disabled="isUpdate && !reportConst._UPDATE_FIELDS.includes('lookTime')"
          format="YYYY-MM-DD HH:mm:ss"
          :value="formState.lookTime"
          @change="onChange"
        />
      </FormItem>
      <FormItem :wrapper-col="{ span: 14, offset: 4 }">
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
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { ReportConst, ReportModel } from '/@/api/customer/crmReport/model/reportModel';
  import { Loading } from '/@/components/Loading';
  import { Form, FormItem, Button, DatePicker, Input } from 'ant-design-vue';
  import FProjectSelect from '/@/components/FProjectSelect';
  import { addReport } from '/@/api/customer/crmReport/report';
  import { success } from '/@/hooks/web/useList';

  export default defineComponent({
    name: 'ReportForm',
    components: {
      Loading,
      Form,
      FormItem,
      Button,
      DatePicker,
      Input,
      FProjectSelect,
    },
    props: {
      customerId: {
        type: String,
        required: false,
      },
      id: {
        type: String,
        required: false,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('customer');
      const reportConst = ref(ReportConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //判断更新还是新增
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      const onChange = (value) => {
        formState.lookTime = value.toISOString();
      };

      const formRef = ref();
      const formState: UnwrapRef<ReportModel> = reactive({
        customerId: props.customerId,
      });
      onMounted(async () => {
        loading.value = true;
        loading.value = false;
      });

      //设置项目
      const setProject = async (value) => {
        formState.projectId = value.value;
      };

      // 确认
      const onSubmit = () => {
        formRef.value.validate().then(async () => {
          loading.value = true;
          try {
            await addReport(formState);
            success('成功', '报备成功');
          } catch (error) {
          } finally {
            loading.value = false;
          }
        });
      };

      // 重置
      const resetForm = () => {
        formRef.value.resetFields();
      };

      return {
        t,
        prefixCls,
        reportConst,
        loading,
        tip,
        formRef,
        formState,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        isUpdate,
        onChange,
        onSubmit,
        resetForm,
        setProject,
      };
    },
  });
</script>
