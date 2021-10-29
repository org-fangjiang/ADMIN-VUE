<template>
  <BasicModal :footer="null" :title="t('model.user.setEmail')" v-bind="$attrs" width="800px">
    <div>
      <Form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <FormItem ref="email" :label="t('model.user.email')" name="email">
          <Input v-model:value="formState.email" autoComplete="off" />
        </FormItem>
        <FormItem :wrapper-col="{ span: 14, offset: 4 }">
          <Button type="primary" @click="onSubmit">{{ t('component.modal.okText') }}</Button>
          <Button style="margin-left: 10px" @click="resetForm">{{ t('model.user.reset') }}</Button>
        </FormItem>
      </Form>
    </div>
  </BasicModal>
  <Loading :loading="loading" :absolute="false" :tip="tip" />
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';

  import { useUserStore } from '/@/store/modules/user';

  import { BasicModal } from '/@/components/Modal/index';
  import { Button, Form, FormItem, Input } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Loading } from '/@/components/Loading';
  import { setUserEmail } from '/@/api/sys/user/user';

  export default defineComponent({
    name: 'SetEmailTable',
    components: { BasicModal, Button, Form, FormItem, Input, Loading },
    setup() {
      const { t } = useI18n();
      const { prefixCls } = useDesign('header-lock-modal');
      const { notification, createErrorModal } = useMessage();
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      //获取当前用户信息
      const userStore = useUserStore();
      const userInfo = userStore.getUserInfo;

      // fromRef 获取form
      const formRef = ref();
      let formState = reactive({
        id: '',
        email: '',
      });
      //将用户信息赋值到表单
      formState = userInfo;

      //提交
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            try {
              await setUserEmail(formState.id, formState.email);
              success(t('model.user.setEmail'), t('host.action.success'));
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
        loading.value = false;
      });

      const success = (message: any, description: any) => {
        notification.success({
          message: message,
          description: description,
          duration: 3,
        });
      };

      const failed = (title: any, content: any) => {
        createErrorModal({
          title: title || t('sys.api.errorTip'),
          content: content || t('sys.api.networkExceptionMsg'),
          // getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
      };
      return {
        t,
        prefixCls,
        userInfo,
        formRef,
        formState,
        onSubmit,
        resetForm,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        loading,
        tip,
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

  .@{prefix-cls} {
    &-action-menu-item {
      text-align: center;
    }
  }
</style>
