<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="dealConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="cName" :label="t('ohouse.deal.cName')" name="cName">
        <Input v-model:value="formState.cName" required autoComplete="off" />
      </FormItem>
      <FormItem ref="cMobile" :label="t('ohouse.deal.cMobile')" name="cMobile">
        <Input v-model:value="formState.cMobile" required autoComplete="off" />
      </FormItem>
      <FormItem ref="price" :label="t('ohouse.deal.price')" name="price">
        <Input
          v-model:value="formState.price"
          required
          autoComplete="off"
          :type="'number'"
          suffix="万元"
        />
      </FormItem>
      <FormItem ref="dealTime" :label="t('ohouse.deal.dealTime')" name="dealTime">
        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" v-model:value="formState.dealTime" />
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
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { Button, Form, FormItem, Input, DatePicker } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { success, failed } from '/@/hooks/web/useList';
  import { DealHouseModel, DealHouseConst } from '/@/api/ohouse/dealHouse/model/dealModel';
  import { dealHouse } from '/@/api/ohouse/dealHouse/dealHouse';

  export default defineComponent({
    name: 'DealForm',
    components: {
      Button,
      Form,
      FormItem,
      Input,
      Loading,
      DatePicker,
    },
    props: {
      houseId: {
        type: String,
        required: true,
      },
      projectId: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('project');
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      const dealConst = ref(DealHouseConst);

      // fromRef 获取form
      const formRef = ref();
      const formState: DealHouseModel = reactive({
        projectId: props.projectId,
        houseId: props.houseId,
      });

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            try {
              await dealHouse(formState);
              success(t('host.action.deal'), t('host.action.success'));
            } catch (error: any) {
              failed(error?.response?.data?.message, t('host.action.fail'));
            } finally {
              loading.value = false;
            }
          })
          .catch((error: any) => {
            console.log('error', error);
          });
      };
      const resetForm = async () => {
        loading.value = true;
        try {
          formRef.value.resetFields();
          formState.houseId = props.houseId;
          formState.projectId = props.projectId;
        } catch (error) {
        } finally {
          loading.value = false;
        }
      };
      onMounted(async () => {
        loading.value = true;
        formState.houseId = props.houseId;
        formState.projectId = props.projectId;
        loading.value = false;
      });

      return {
        t,
        prefixCls,
        loading,
        tip,
        formRef,
        formState,
        onSubmit,
        resetForm,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        props,
        dealConst,
      };
    },
  });
</script>
