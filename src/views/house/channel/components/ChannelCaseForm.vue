<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="channelCaseConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="name" :label="t('host.channelCase.name')" name="name">
        <Input
          :disabled="isUpdate && !channelCaseConst._UPDATE_FIELDS.includes('name')"
          v-model:value="formState.name"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="contact" :label="t('host.channelCase.contact')" name="contact">
        <Input
          :disabled="isUpdate && !channelCaseConst._UPDATE_FIELDS.includes('contact')"
          v-model:value="formState.contact"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="avatar" :label="t('host.channelCase.avatar')" name="avatar">
        <Upload
          list-type="picture-card"
          :show-upload-list="false"
          :data="{
            provinceId: provinceId,
            cityId: cityId,
          }"
          :action="ApiSource.UploadNews"
          @change="changeFile"
        >
          <img v-if="formState.avatar" :src="formState.avatar" />
          <div v-else>Upload</div>
        </Upload>
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
  import { Button, Form, FormItem, Input, Upload } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { success, failed } from '/@/hooks/web/useList';
  import {
    ChannelCaseModel,
    _ChannelCaseConst,
  } from '/@/api/host/channelCase/model/channelCaseModel';
  import { ApiSource } from '/@/api/host/source/source';
  import { useUserStore } from '/@/store/modules/user';
  import {
    addChannelCase,
    getChannelCase,
    updateChannelCase,
  } from '/@/api/host/channelCase/channelCase';

  export default defineComponent({
    name: 'ChannelCaseForm',
    components: {
      Button,
      Form,
      FormItem,
      Input,
      Loading,
      Upload,
    },
    props: {
      id: {
        type: String,
        require: true,
      },
      channelId: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('channel');
      const channelCaseConst = ref(_ChannelCaseConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //判断更新还是新增
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      // 获取用户store
      const userStore = useUserStore();
      const cityId = userStore.getUserInfo.companyCityId;
      const provinceId = userStore.getUserInfo.companyProvinceId;

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<ChannelCaseModel> = reactive({});

      //上传头像
      const changeFile = async (info) => {
        if (info.file.status === 'done') {
          formState.avatar = info.file.response.data;
        }
      };

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            if (props.id) {
              loading.value = true;
              try {
                await updateChannelCase(formState);
                success(t('host.action.update'), t('host.action.success'));
              } catch (error: any) {
                failed(error?.response?.data?.message, t('host.action.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              loading.value = true;
              try {
                const { content } = await addChannelCase(formState);
                success(t('host.action.add'), t('host.action.success'));
                Object.assign(formState, content);
              } catch (error: any) {
                failed(error?.response?.data?.message, t('host.action.fail'));
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
        try {
          if (props.id) {
            const { content } = await getChannelCase(props.id);
            Object.assign(formState, content);
          } else {
            formRef.value.resetFields();
            formState.channelId = props.channelId;
          }
        } catch (error) {
        } finally {
          loading.value = false;
        }
      };

      //初始加载
      onMounted(async () => {
        loading.value = true;
        formState.channelId = props.channelId;
        if (props.id) {
          const { content } = await getChannelCase(props.id);
          Object.assign(formState, content);
        }
        loading.value = false;
      });

      return {
        t,
        prefixCls,
        channelCaseConst,
        loading,
        tip,
        formRef,
        formState,
        onSubmit,
        resetForm,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        isUpdate,
        props,
        ApiSource,
        cityId,
        provinceId,
        changeFile,
      };
    },
  });
</script>
