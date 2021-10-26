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
        <FormItem ref="password" :label="t('model.user.password')" name="password">
          <Input v-model:value="formState.password" autoComplete="off" />
        </FormItem>
        <FormItem ref="realName" :label="t('model.user.realName')" name="realName">
          <Input v-model:value="formState.realName" autoComplete="off" />
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
        <FormItem ref="email" :label="t('model.user.email')" name="email">
          <Input v-model:value="formState.email" autoComplete="off" />
        </FormItem>
        <FormItem ref="mobile" :label="t('model.user.mobile')" name="mobile">
          <Input v-model:value="formState.mobile" autoComplete="off" />
        </FormItem>
        <FormItem ref="theme" :label="t('model.user.theme')" name="theme">
          <Input v-model:value="formState.theme" autoComplete="off" />
        </FormItem>
        <FormItem ref="avatar" :label="t('model.user.avatar')" name="avatar">
          <Input v-model:value="formState.avatar" autoComplete="off" />
        </FormItem>
        <FormItem ref="description" :label="t('model.user.description')" name="description">
          <Input v-model:value="formState.description" autoComplete="off" />
        </FormItem>
        <FormItem ref="roleName" :label="t('model.user.roleName')" name="roleName">
          <Select
            ref="selectRef"
            v-model:value="formState.roleName"
            :options="roleOptions"
            @change="changeRole"
            change-on-select
          />
        </FormItem>
        <!-- <FormItem ref="deptId" :label="t('model.user.deptName')" name="deptId">
          <Select
            ref="selectRef"
            v-model:value="formState.deptId"
            :options="deptOptions"
            @change="changeDept"
            change-on-select
          />
        </FormItem> -->
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
  import type { UserInfo } from '/#/store';
  import { Select, Button, Form, FormItem, Input, SelectOption } from 'ant-design-vue';
  import { updateUserInfo } from '/@/api/sys/user/user';
  import { getRoles } from '/@/api/sys/role/role';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Loading } from '/@/components/Loading';
  import { updateMyInfo } from '/@/api/sys/user/user';

  interface Option {
    value: string;
    label: string;
  }

  export default defineComponent({
    name: 'MyInfo',
    components: { BasicModal, Select, Button, Form, FormItem, Input, SelectOption, Loading },
    emits: ['handleCancel'],
    setup(_props, { emit }) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('header-lock-modal');
      const { notification, createErrorModal } = useMessage();
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      //获取当前用户信息
      const userStore = useUserStore();
      const userInfo = userStore.getUserInfo;
      //角色下拉
      const roleOptions = ref<Option[]>([]);
      const deptOptions = ref<Option[]>([]);

      // fromRef 获取form
      const formRef = ref();
      let formState: UnwrapRef<UserInfo> = reactive({
        id: '',
        username: '',
        password: '',
        realName: '',
        nickName: '',
        sex: '',
        email: '',
        mobile: '',
        state: '',
        theme: '',
        avatar: '',
        description: '',
        lastLoginTime: '',
        createTime: '',
        createBy: '',
        updateTime: '',
        deptId: '',
        deptName: '',
        roleId: '',
        roleName: '',
        sysRoleBeans: [],
        type: '',
        companyName: '',
        companyId: '',
        companyCityId: '',
        companyProvinceId: '',
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
      //修改角色
      const changeRole = (value) => {
        formState.roleId = value;
      };
      const changeDept = (value) => {
        formState.deptId = value;
      };

      onMounted(async () => {
        loading.value = true;
        const { content } = await updateUserInfo({ id: userStore.getUserInfo.id || '' });
        if (content) {
          Object.assign(formState, content);
        }
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
          // getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
      };
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
        roleOptions,
        deptOptions,
        changeRole,
        changeDept,
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
