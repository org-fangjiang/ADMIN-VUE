<template>
  <div :class="prefixCls">
    <Form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
      <FormItem ref="price" :label="t('ohouse.house.price')" name="price">
        <Input
          v-model:value="formState.price"
          required
          autoComplete="off"
          :type="'number'"
          suffix="万元"
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
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { Button, Form, FormItem, Input } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { success, failed } from '/@/hooks/web/useList';
  import { updateHousePrice } from '/@/api/ohouse/house/house';

  export default defineComponent({
    name: 'PriceForm',
    components: {
      Button,
      Form,
      FormItem,
      Input,
      Loading,
    },
    props: {
      priceInfo: {
        type: Object,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('project');
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      // fromRef 获取form
      const formRef = ref();
      const formState = reactive({
        houseId: '',
        price: '',
      });

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            try {
              await updateHousePrice(formState.houseId, formState.price);
              success(t('host.action.update'), t('host.action.success'));
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
        } catch (error) {
        } finally {
          loading.value = false;
        }
      };
      onMounted(async () => {
        loading.value = true;
        formState.houseId = props.priceInfo?.id;
        formState.price = props.priceInfo?.price;
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
      };
    },
  });
</script>
