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
        <Input
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
      <!-- <FormItem ref="sex" :label="t('model.user.sex')" name="sex">
        <Input
          :disabled="isUpdate && !updateFields.includes('sex')"
          v-model:value="formState.sex"
          autoComplete="off"
        />
      </FormItem> -->
      <FormItem ref="sex" :label="t('model.user.sex')" name="sex">
        <Select
          ref="select"
          v-model:value="formState.sex"
          :disabled="isUpdate && !updateFields.includes('sex')"
          style="width: 120px"
          :allowClear="true"
        >
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
          :disabled="isUpdate && !updateFields.includes('roleName')"
          v-model:value="formState.roleName"
          :options="roleOptions"
          @change="changeRole"
          change-on-select
        />
      </FormItem>
      <FormItem ref="deptName" :label="t('model.user.deptName')" name="deptName">
        <Input
          :disabled="isUpdate && !updateFields.includes('deptName')"
          v-model:value="props.deptName"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="companyName" :label="t('model.user.companyName')" name="companyName">
        <Input
          :disabled="isUpdate && !updateFields.includes('companyName')"
          v-model:value="props.companyName"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="state" :label="t('model.location.area.state')" name="state">
        <Select
          :disabled="!isUpdate || (isUpdate && !updateFields.includes('state'))"
          ref="select"
          v-model:value="formState.state"
          style="width: 120px"
          :options="userConst.STATES"
        />
      </FormItem>
      <FormItem :wrapper-col="{ span: 14, offset: 4 }">
        <Button v-if="isUpdate" type="primary" @click="onSubmit">{{
          t('model.user.updateUser')
        }}</Button>
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
  import { Select, Button, Form, FormItem, Input, SelectOption } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';
  import { Loading } from '/@/components/Loading';
  import { AddUserModel, GetUserModel, _Const } from '/@/api/sys/user/model/userModel';
  import { updateUserInfo } from '/@/api/sys/user/user';
  import { getRoles } from '/@/api/sys/role/role';
  import { useUserStore } from '/@/store/modules/user';
  interface Option {
    value: string;
    label: string;
  }
  export default defineComponent({
    name: 'UpdateUserForm',
    components: {
      Select,
      Button,
      Form,
      FormItem,
      Input,
      Loading,
      SelectOption,
    },
    props: {
      id: {
        type: String,
        require: true,
      },
      deptName: {
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
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('user');
      const userConst = ref(_Const);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }
      const formRef = ref();
      const userStore = useUserStore();
      const roleOptions = ref<Option[]>([]);
      //添加时状态初始为有效，不可改
      let state;
      if (!isUpdate.value) {
        state = _Const.EFFECTIVE;
      }
      const formState: UnwrapRef<AddUserModel> = reactive({
        id: props.id || '',
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
        deptName: props.deptName || '',
        sysRoleBeans: [], // roleId 集合
        companyName: props.deptName || '',
        companyId: '',
        roleId: '',
        roleName: '',
        state,
      });

      const changeRole = (value) => {
        formState.roleId = value;
      };

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            try {
              // const { content } =
              await updateUserInfo({ id: props.id || '' });
              success(t('model.user.updateUser'), t('model.user.success'));
              // Object.assign(formState, content);
            } catch (error) {
              failed(error?.response?.data?.message, t('model.user.fail'));
            } finally {
              loading.value = false;
            }
          })
          .catch((error: ValidateErrorEntity<GetUserModel>) => {
            console.log('error', error);
          });
      };
      const resetForm = async () => {
        loading.value = true;
        try {
          const { content } = await updateUserInfo({ id: props.id || '' });
          if (content) {
            Object.assign(formState, content);
          }
        } catch (error) {
        } finally {
          loading.value = false;
        }
      };
      onMounted(async () => {
        loading.value = true;
        const { content } = await updateUserInfo({ id: props.id || '' });
        if (content) {
          Object.assign(formState, content);
        }
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
        props,
        isUpdate,
        roleOptions,
        changeRole,
        updateFields: _Const._UPDATE_FIELDS,
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
