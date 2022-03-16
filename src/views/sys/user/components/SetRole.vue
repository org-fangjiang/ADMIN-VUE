<template>
  <div>
    <Form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
      <FormItem ref="mobile" :label="t('model.user.roleName')" name="mobile">
        <Select
          ref="selectRef"
          mode="multiple"
          :options="roleOptions"
          @change="changeRole"
          change-on-select
          v-model:value="ids"
        />
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
  import { Button, Form, FormItem, Select } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { success, failed } from '/@/hooks/web/useList';
  import { SysUserBean } from '/@/api/sys/user/model/userModel';
  import { getRoles } from '/@/api/sys/role/role';
  import { setUserRole, getUserInfo } from '/@/api/sys/user/user';
  interface Option {
    value: string;
    label: string;
  }
  export default defineComponent({
    name: 'SetRole',
    components: { Button, Form, FormItem, Select, Loading },
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

      //角色下拉
      const roleOptions = ref<Option[]>([]);
      let ids = ref<string[]>([]);
      //选择角色
      const changeRole = (value: string[]) => {
        // formState.roleId = value.toString();
        formState.sysRoleBeans?.splice(0);
        value.forEach((item) => {
          formState.sysRoleBeans?.push({ id: item });
        });
      };

      // fromRef 获取form
      const formRef = ref();
      let formState: SysUserBean = reactive({
        id: props.id,
      });

      //提交
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            try {
              await setUserRole(formState.id || '', formState.sysRoleBeans || []);
              success(t('model.user.setRole'), t('host.action.success'));
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
        const result = await getRoles({ companyId: userInfo.companyId || '' });
        if (result.content) {
          result.content.forEach((role) => {
            //角色下拉信息
            roleOptions.value.push({ value: role.id || '', label: role.roleName || '' });
          });
        }

        const userResult = await getUser();
        if (userResult) {
          Object.assign(formState, userResult);
          userResult.sysRoleBeans?.forEach((item) => {
            ids.value.push(item.id);
          });
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
        roleOptions,
        changeRole,
        ids,
      };
    },
  });
</script>
