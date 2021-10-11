<template>
  <div>
    <Form
      ref="formRef"
      :model="formState"
      :rules="userConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="password" :label="t('model.user.password')" name="password">
        <InputPassword
          :disabled="isUpdate && !updateFields.includes('password')"
          v-model:value="formState.password"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="realName" :label="t('model.user.realName')" name="realName">
        <Input
          :disabled="isUpdate && !updateFields.includes('realName')"
          v-model:value="formState.realName"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="nickName" :label="t('model.user.nickName')" name="nickName">
        <Input
          :disabled="isUpdate && !updateFields.includes('nickName')"
          v-model:value="formState.nickName"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="sex" :label="t('model.user.sex')" name="sex">
        <Select ref="select" v-model:value="formState.sex" style="width: 120px" :allowClear="true">
          <SelectOption key="0">男</SelectOption>
          <SelectOption key="1">女</SelectOption>
        </Select>
      </FormItem>
      <FormItem ref="email" :label="t('model.user.email')" name="email">
        <Input
          :disabled="isUpdate && !updateFields.includes('email')"
          v-model:value="formState.email"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="mobile" :label="t('model.user.mobile')" name="mobile">
        <Input
          :disabled="isUpdate && !updateFields.includes('mobile')"
          v-model:value="formState.mobile"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="theme" :label="t('model.user.theme')" name="theme">
        <Input
          :disabled="isUpdate && !updateFields.includes('theme')"
          v-model:value="formState.theme"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="avatar" :label="t('model.user.avatar')" name="avatar">
        <Input
          :disabled="isUpdate && !updateFields.includes('avatar')"
          v-model:value="formState.avatar"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="description" :label="t('model.user.description')" name="description">
        <Input
          :disabled="isUpdate && !updateFields.includes('description')"
          v-model:value="formState.description"
          autoComplete="off"
        />
      </FormItem>

      <FormItem ref="roleName" :label="t('model.user.roleName')" name="roleName">
        <Select
          ref="selectRef"
          mode="multiple"
          :disabled="!updateFields.includes('roleName')"
          :options="roleOptions"
          @change="changeRole"
          change-on-select
        />
      </FormItem>

      <FormItem :wrapper-col="{ span: 14, offset: 4 }">
        <Button type="primary" @click="onSubmit">{{ t('model.user.addUser') }}</Button>
        <Button style="margin-left: 10px" @click="resetForm">{{ t('model.user.reset') }}</Button>
      </FormItem>
    </Form>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import {
    Button,
    Form,
    FormItem,
    Input,
    Select,
    InputPassword,
    SelectOption,
  } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';
  import { Loading } from '/@/components/Loading';
  import { AddUserModel, _Const } from '/@/api/sys/user/model/userModel';
  import { addUser } from '/@/api/sys/user/user';
  import { getRoles } from '/@/api/sys/role/role';
  import { useUserStore } from '/@/store/modules/user';
  interface Option {
    value: string;
    label: string;
  }
  export default defineComponent({
    name: 'AddUserForm',
    components: {
      Button,
      Form,
      FormItem,
      Input,
      Loading,
      Select,
      InputPassword,
      SelectOption,
    },
    setup() {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('user');
      const userConst = ref(_Const);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      let isUpdate = ref<boolean>(false);
      const formRef = ref();
      const roleOptions = ref<Option[]>([]);
      const companyOptions = ref<Option[]>([]);

      const userStore = useUserStore();

      const formState: UnwrapRef<AddUserModel> = reactive({
        username: '',
        password: '',
        realName: '',
        nickName: '',
        sex: '',
        email: '',
        mobile: '',
        theme: '',
        avatar: '',
        description: '',
        deptId: '',
        deptName: '',
        roleId: '',
        roleName: '',
        sysRoleBeans: [], // roleId 集合
        type: '',
        companyName: '',
        companyId: '',
      });

      const changeDept = (value) => {
        formState.deptId = value;
      };
      const changeRole = (value: string[]) => {
        // formState.roleId = value;
        value.forEach((item) => {
          formState.sysRoleBeans?.push({ id: item });
        });
      };

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            try {
              // formState.sysRoleBeans?.push({ id: formState.roleId, roleName: formState.roleName });
              // formState.roleId = '';
              // const { content } =
              await addUser(formState);
              success(t('model.user.addUser'), t('model.user.success'));
              // Object.assign(formState, content);
            } catch (error) {
              failed(error?.response?.data?.message, t('model.user.fail'));
            } finally {
              loading.value = false;
            }
          })
          .catch((error: ValidateErrorEntity<AddUserModel>) => {
            console.log('error', error);
          });
      };

      const resetForm = async () => {
        formRef.value.resetFields();
      };

      onMounted(async () => {
        loading.value = true;
        const userInfo = userStore.getUserInfo;
        const result = await getRoles({ companyId: userInfo.companyId });
        if (result.content) {
          result.content.forEach((role) => {
            roleOptions.value.push({ value: role.id || '', label: role.roleName || '' });
          });
        }
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
          getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
      };

      return {
        t,
        prefixCls,
        userConst,
        tip,
        roleOptions,
        companyOptions,
        changeDept,
        changeRole,
        isUpdate,
        updateFields: _Const._ADD_FIELDS,
        loading,
        onSubmit,
        resetForm,
        formRef,
        formState,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
      };
    },
  });
</script>
