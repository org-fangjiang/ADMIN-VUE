<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="hostConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="price" :label="t('host.price')" name="price">
        <Input v-model:value="formState.price" autoComplete="off" :type="'number'" suffix="元/m²" />
      </FormItem>
      <FormItem ref="lowTotalPrice" :label="t('host.lowTotalPrice')" name="lowTotalPrice">
        <Input
          v-model:value="formState.lowTotalPrice"
          autoComplete="off"
          suffix="万元/套"
          :type="'number'"
        />
      </FormItem>

      <FormItem ref="highTotalPrice" :label="t('host.highTotalPrice')" name="highTotalPrice">
        <Input
          v-model:value="formState.highTotalPrice"
          autoComplete="off"
          suffix="万元/套"
          :type="'number'"
        />
      </FormItem>
      <FormItem ref="priceDescription" :label="t('host.priceDescription')" name="priceDescription">
        <Input v-model:value="formState.priceDescription" autoComplete="off" />
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
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Button, Form, FormItem, Input } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { success, failed } from '/@/hooks/web/useList';
  import { _HostConst } from '/@/api/host/project/model/projectModel';
  import { PriceModel, updatePrice } from '/@/api/host/project/project';

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
      const hostConst = ref(_HostConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<PriceModel> = reactive({
        id: '',
        price: '',
        lowTotalPrice: '',
        highTotalPrice: '',
        priceDescription: '',
      });

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            try {
              const { content } = await updatePrice(formState);
              success(t('host.action.update'), t('host.action.success'));
              Object.assign(formState, content);
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
        formState.id = props.priceInfo?.id;
        formState.price = props.priceInfo?.price;
        formState.lowTotalPrice = props.priceInfo?.lowTotalPrice;
        formState.highTotalPrice = props.priceInfo?.highTotalPrice;
        formState.priceDescription = props.priceInfo?.priceDescription;
        loading.value = false;
      });

      return {
        t,
        prefixCls,
        hostConst,
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
