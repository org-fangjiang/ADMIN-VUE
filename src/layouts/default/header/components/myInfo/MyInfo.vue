<template>
  <BasicModal
    :footer="null"
    :title="t('layout.header.updateUserInfo')"
    v-bind="$attrs"
    width="1000px"
    @cancel="handleCancel"
  >
    <div>
      <Form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <FormItem ref="username" :label="t('model.user.userName')" name="userName">
          <Input v-model:value="formState.username" autoComplete="off" />
        </FormItem>
        <FormItem ref="realName" :label="t('model.user.realName')" name="realName">
          <Input v-model:value="formState.realName" autoComplete="off" />
        </FormItem>
        <FormItem ref="password" :label="t('model.user.password')" name="password">
          <InputPassword v-model:value="formState.password" autoComplete="off" />
        </FormItem>
        <FormItem ref="nickName" :label="t('model.user.nickName')" name="nickName">
          <Input v-model:value="formState.nickName" autoComplete="off" />
        </FormItem>
        <FormItem ref="sex" :label="t('model.user.sex')" name="sex">
          <Select
            ref="select"
            v-model:value="formState.sex"
            style="width: 120px"
            :allowClear="true"
          >
            <SelectOption key="0">男</SelectOption>
            <SelectOption key="1">女</SelectOption>
          </Select>
        </FormItem>
        <FormItem ref="avatar" :label="t('model.user.avatar')" name="avatar">
          <Upload
            accept="image/*"
            :customRequest="customRequest"
            list-type="picture-card"
            :show-upload-list="false"
            :data="{
              userId: userStore.getUserInfo.id,
              companyId: userStore.getUserInfo.companyId,
            }"
            :headers="requestHeader"
            :action="ApiSource.UploadUserImg"
            @change="changeFile"
          >
            <img v-if="formState.avatar" :src="formState.avatar" />
            <div v-else>Upload</div>
          </Upload>
        </FormItem>
        <FormItem ref="description" :label="t('model.user.description')" name="description">
          <Input v-model:value="formState.description" autoComplete="off" />
        </FormItem>
        <FormItem ref="companyName" :label="t('model.user.companyName')" name="companyName">
          <Input v-model:value="formState.companyName" autoComplete="off" />
        </FormItem>
        <FormItem :wrapper-col="{ span: 14, offset: 4 }">
          <Button type="primary" @click="onSubmit">{{ t('layout.header.updateUserInfo') }}</Button>
          <Button style="margin-left: 10px" @click="resetForm">{{ t('model.user.reset') }}</Button>
        </FormItem>
      </Form>
    </div>
  </BasicModal>
  <Loading :loading="loading" :absolute="false" :tip="tip" />
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';

  import { useUserStore } from '/@/store/modules/user';

  import { BasicModal } from '/@/components/Modal/index';
  import {
    Select,
    Button,
    Form,
    FormItem,
    Input,
    SelectOption,
    Upload,
    InputPassword,
    message,
  } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { updateMyInfo } from '/@/api/sys/user/user';
  import { SysUserBean } from '/@/api/sys/user/model/userModel';
  import { ApiSource, uploadUserImg } from '/@/api/host/source/source';
  import { success, failed } from '/@/hooks/web/useList';
  import { getAccessToken } from '/@/utils/auth';

  export default defineComponent({
    name: 'MyInfo',
    components: {
      BasicModal,
      Select,
      Button,
      Form,
      FormItem,
      Input,
      SelectOption,
      Loading,
      Upload,
      InputPassword,
    },
    emits: ['handleCancel'],
    setup(_props, { emit }) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('header-lock-modal');
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      //获取当前用户信息
      const userStore = useUserStore();

      // fromRef 获取form
      const formRef = ref();
      let formState: UnwrapRef<SysUserBean> = reactive({
        id: userStore.getUserInfo.id,
      });
      //上传头像
      const requestHeader = ref({ Authorization: '' });
      requestHeader.value.Authorization = getAccessToken() as string;
      const changeFile = async (info) => {
        if (info.file.status === 'done') {
          formState.avatar = info.file.response.data;
        }
      };
      const customRequest = (options) => {
        const formData = new FormData();
        formData.append('file', options.file as any);
        formData.append('userId', userStore.getUserInfo.id);
        formData.append('companyId', userStore.getUserInfo.companyId);
        uploadUserImg(formData)
          .then((res) => {
            options.onSuccess(res, options.file);
            formState.avatar = res.data.data;
          })
          .catch(() => {
            options.onError();
            message.error('上传失败，请删除重试');
          });
      };
      //提交
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            try {
              await updateMyInfo(formState);
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
      //重置
      const resetForm = () => {
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
        Object.assign(formState, userStore.getUserInfo);
        loading.value = false;
      });

      //关闭Modal
      const handleCancel = () => {
        emit('handleCancel');
      };

      return {
        t,
        prefixCls,
        formRef,
        formState,
        onSubmit,
        resetForm,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        loading,
        tip,
        handleCancel,
        ApiSource,
        changeFile,
        userStore,
        requestHeader,
        customRequest,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-myInfo';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;
    }
  }
</style>
