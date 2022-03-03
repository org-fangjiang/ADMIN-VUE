<template>
  <div>
    <Form
      ref="formRef"
      :model="formState"
      :rules="lookConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="photoAddress" :label="t('marketing.look.photoAddress')" name="photoAddress">
        <Upload accept="image/*" :customRequest="customRequest" :showUploadList="false">
          <Button> Upload </Button>
        </Upload>
        <Image :src="formState.photoAddress" width="100px" />
      </FormItem>
      <FormItem ref="realLookTime" :label="t('marketing.look.realLook')" name="realLookTime">
        <DatePicker show-time format="YYYY-MM-DD HH:mm:ss" :value="lookTime" @change="onChange" />
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
  import { message, FormItem, Form, Button, DatePicker, Upload, Image } from 'ant-design-vue';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { LookModel, LookConst } from '/@/api/customer/crmLook/model/lookModel';
  import { uploadLookPhoto } from '/@/api/host/source/source';
  import { success } from '/@/hooks/web/useList';
  import { addLook } from '/@/api/customer/crmLook/look';
  import { useI18n } from 'vue-i18n';
  import { Loading } from '/@/components/Loading';
  import { Moment } from 'moment';

  export default defineComponent({
    name: 'LookForm',
    components: { FormItem, Form, Button, DatePicker, Upload, Loading, Image },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      let tip = ref<string>('加载中...');
      let loading = ref<boolean>(true);
      const lookConst = ref(LookConst);
      const formRef = ref();
      const formState: LookModel = reactive({
        id: props.id,
      });

      let lookTime = ref();
      const onChange = (value: Moment) => {
        lookTime.value = value;
        formState.realLookTime = value.toISOString();
      };

      const customRequest = (options) => {
        const formData = new FormData();
        formData.append('file', options.file as any);
        formData.append('id', props.id || '');
        uploadLookPhoto(formData)
          .then((res) => {
            options.onSuccess(res, options.file);
            formState.photoAddress = res.data.data;
            success('成功', '上传成功');
          })
          .catch(() => {
            options.onError();
            message.error('上传失败，请重试');
          });
      };

      // 确认
      const onSubmit = () => {
        formRef.value.validate().then(async () => {
          try {
            loading.value = true;
            await addLook(formState);
            success('成功', '录入带看成功');
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

      onMounted(async () => {
        loading.value = false;
      });

      return {
        t,
        lookTime,
        onChange,
        lookConst,
        formRef,
        formState,
        customRequest,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        onSubmit,
        resetForm,
        tip,
        loading,
      };
    },
  });
</script>
