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
        <Input
          :disabled="!updateFields.includes('description')"
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
      <FormItem ref="deptId" :label="t('model.user.deptName')" name="deptId">
        <Select
          ref="selectRef"
          :disabled="!updateFields.includes('deptId')"
          :options="deptOptions"
          @change="changeDept"
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
    Upload,
    message,
  } from 'ant-design-vue';
  import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';
  import { Loading } from '/@/components/Loading';
  import { AddUserModel, _Const } from '/@/api/sys/user/model/userModel';
  import { addUser } from '/@/api/sys/user/user';
  import { getRoles } from '/@/api/sys/role/role';
  import { useUserStore } from '/@/store/modules/user';
  import { ApiSource, uploadUserImg } from '/@/api/host/source/source';
  import { success, failed } from '/@/hooks/web/useList';
  import { getAccessToken } from '/@/utils/auth';
  import { getAllDepartments } from '/@/api/sys/department/department';

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
      Upload,
    },
    setup() {
      const { t } = useI18n();
      const userConst = ref(_Const);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const formRef = ref();
      //角色下拉
      const roleOptions = ref<Option[]>([]);
      // 部门下拉
      const deptOptions = ref<Option[]>([]);
      //用户信息
      const userStore = useUserStore();
      //上传图片请求头
      const requestHeader = ref({ Authorization: '' });
      requestHeader.value.Authorization = getAccessToken() as string;

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
        roleName: undefined,
        sysRoleBeans: [], // roleId 集合
        type: '',
        companyName: '',
        companyId: userStore.getUserInfo.companyId,
      });

      //上传头像
      const changeFile = async (info) => {
        if (info.file.status === 'done') {
          formState.avatar = info.file.response.data;
        }
      };
      //选择角色
      const changeRole = (value: string[]) => {
        formState.roleId = value.toString();
        formState.sysRoleBeans?.splice(0);
        value.forEach((item) => {
          formState.sysRoleBeans?.push({ id: item });
        });
      };

      // 选择部门
      const changeDept = (value) => {
        formState.deptId = value;
      };
      //提交
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            try {
              await addUser(formState);
              success(t('model.user.addUser'), t('model.user.success'));
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

      onMounted(async () => {
        loading.value = true;
        const userInfo = userStore.getUserInfo;
        const result = await getRoles({ companyId: userInfo.companyId });
        if (result.content) {
          result.content.forEach((role) => {
            //角色下拉信息
            roleOptions.value.push({ value: role.id || '', label: role.roleName || '' });
          });
        }
        const deptResult = await getAllDepartments({});
        if (deptResult.content) {
          deptResult.content.forEach((dept) => {
            deptOptions.value.push({ value: dept.deptId || '', label: dept.deptName || '' });
          });
        }
        loading.value = false;
      });

      return {
        t,
        userConst,
        tip,
        roleOptions,
        changeRole,
        updateFields: _Const._ADD_FIELDS,
        loading,
        onSubmit,
        resetForm,
        formRef,
        formState,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        userStore,
        ApiSource,
        changeFile,
        requestHeader,
        customRequest,
        deptOptions,
        changeDept,
      };
    },
  });
</script>
