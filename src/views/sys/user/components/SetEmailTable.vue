<template>
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
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  import { useUserStore } from '/@/store/modules/user';
  import { Button, Form, FormItem, Input } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { getUserInfo, setUserEmail } from '/@/api/sys/user/user';
  import { success, failed } from '/@/hooks/web/useList';

  export default defineComponent({
    name: 'SetEmailTable',
    components: { Button, Form, FormItem, Input, Loading },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
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
        const userResult = await getUser();
        if (userResult) {
          Object.assign(formState, userResult);
        }
        loading.value = false;
      });

      const getUser = async () => {
        const result = await getUserInfo(props.id);
        return result;
      };

      return {
        t,
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
