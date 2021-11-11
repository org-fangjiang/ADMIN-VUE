<template>
  <div class="w-full h-full">
    <Form
      ref="formRef"
      :model="formState"
      :rules="userConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="companyName" :label="t('model.user.companyName')" name="companyName">
        <Input
          :disabled="!updateFields.includes('companyName')"
          v-model:value="props.companyName"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="password" :label="t('model.user.password')" name="password">
        <InputPassword
          :disabled="!updateFields.includes('password')"
          v-model:value="formState.password"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="realName" :label="t('model.user.realName')" name="realName">
        <Input
          :disabled="!updateFields.includes('realName')"
          v-model:value="formState.realName"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="nickName" :label="t('model.user.nickName')" name="nickName">
        <Input
          :disabled="!updateFields.includes('nickName')"
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
          :disabled="!updateFields.includes('email')"
          v-model:value="formState.email"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="mobile" :label="t('model.user.mobile')" name="mobile">
        <Input
          :disabled="!updateFields.includes('mobile')"
          v-model:value="formState.mobile"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="theme" :label="t('model.user.theme')" name="theme">
        <Input
          :disabled="!updateFields.includes('theme')"
          v-model:value="formState.theme"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="avatar" :label="t('model.user.avatar')" name="avatar">
        <Input
          :disabled="!updateFields.includes('avatar')"
          v-model:value="formState.avatar"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="description" :label="t('model.user.description')" name="description">
        <Input
          :disabled="!updateFields.includes('description')"
          v-model:value="formState.description"
          autoComplete="off"
        />
      </FormItem>

      <FormItem ref="deptName" :label="t('model.user.deptName')" name="deptName">
        <Select
          ref="selectRef"
          :disabled="!updateFields.includes('deptName')"
          v-model:value="formState.deptName"
          :options="options"
          @change="changeDept"
          change-on-select
        />
      </FormItem>

      <FormItem ref="roleName" :label="t('model.user.roleName')" name="roleName">
        <Select
          ref="selectRef"
          :disabled="!updateFields.includes('roleName')"
          v-model:value="formState.roleName"
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
  import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';
  import { Loading } from '/@/components/Loading';
  import { AddUserModel, _Const } from '/@/api/sys/user/model/userModel';
  import { addCompanyUser } from '/@/api/sys/user/user';
  import { getAllDepartments } from '/@/api/sys/department/department';
  import { getRoles } from '/@/api/sys/role/role';
  import { success, failed } from '/@/hooks/web/useList';

  interface Option {
    value: string;
    label: string;
  }
  export default defineComponent({
    name: 'AddAdminForm',
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
    props: {
      companyId: {
        type: String,
        require: true,
      },
      companyName: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const userConst = ref(_Const);
      let loading = ref<boolean>(false);
      let tip = ref<string>('加载中...');

      const formRef = ref();
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
        companyName: props.companyName || '',
        companyId: props.companyId || '',
      });

      //部门/角色下拉
      const options = ref<Option[]>([]);
      const roleOptions = ref<Option[]>([]);

      const changeDept = (value) => {
        formState.deptId = value;
      };
      const changeRole = (value) => {
        formState.roleId = value;
      };

      //提交
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            try {
              formState.sysRoleBeans?.push({ id: formState.roleId, roleName: formState.roleName });
              formState.roleId = '';
              const { content } = await addCompanyUser(formState);
              success(t('model.company.addCompanyUser'), t('model.user.success'));
              Object.assign(formState, content);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('model.user.fail'));
            } finally {
              loading.value = false;
            }
          })
          .catch((error: ValidateErrorEntity<AddUserModel>) => {
            console.log('error', error);
          });
      };

      //重置
      const resetForm = async () => {
        formRef.value.resetFields();
      };

      //初始加载
      onMounted(async () => {
        const { content } = await getAllDepartments({});
        if (content) {
          content.forEach((item) => {
            options.value.push({ value: item.deptId || '', label: item.deptName || '' });
          });
        }
        const result = await getRoles({ companyId: props.companyId });
        if (result.content) {
          result.content.forEach((role) => {
            roleOptions.value.push({ value: role.id || '', label: role.roleName || '' });
          });
        }
      });

      return {
        t,
        userConst,
        tip,
        props,
        options,
        roleOptions,
        changeDept,
        changeRole,
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
