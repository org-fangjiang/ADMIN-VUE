<template>
  <BasicModal
    :footer="null"
    :title="t('model.user.setMobile')"
    v-bind="$attrs"
    width="800px"
    @cancel="handleCancel"
  >
    <div>
      <Form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <FormItem ref="mobile" :label="t('model.user.mobile')" name="mobile">
          <Input v-model:value="formState.mobile" autoComplete="off" />
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
  import { Loading } from '/@/components/Loading';
  import { setUserMobile } from '/@/api/sys/user/user';
  import { success, failed } from '/@/hooks/web/useList';

  export default defineComponent({
    name: 'SetMobileTable',
    components: { BasicModal, Button, Form, FormItem, Input, Loading },
    emits: ['handleCancel'],
    setup(_props, { emit }) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('header-lock-modal');
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      //获取当前用户信息
      const userStore = useUserStore();
      const userInfo = userStore.getUserInfo;

      // fromRef 获取form
      const formRef = ref();
      let formState = reactive({
        id: '',
        mobile: '',
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
              await setUserMobile(formState.id, formState.mobile);
              success(t('model.user.setMobile'), t('host.action.success'));
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

      //关闭Modal
      const handleCancel = () => {
        emit('handleCancel');
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
        handleCancel,
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
