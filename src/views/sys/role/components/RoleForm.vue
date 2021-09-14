// 企业信息表单
<template>
  <div>
    <Form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="roleName" :label="t('model.role.roleName')" name="roleName">
        <Input
          :disabled="isUpdate && !updateFields.includes('roleName')"
          v-model:value="formState.roleName"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="remake" :label="t('model.role.remake')" name="remake">
        <Input
          :disabled="isUpdate && !updateFields.includes('remake')"
          v-model:value="formState.remake"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="companyName" :label="t('model.role.companyName')" name="companyName">
        <Select
          ref="selectRef"
          :disabled="isUpdate && !updateFields.includes('companyId')"
          v-model:value="companyName"
          label-in-value
          placeholder="Select Company"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="null"
          :options="options"
          @search="fetchUser"
          :showSearch="true"
          :labelInValue="false"
        />
      </FormItem>
      <FormItem ref="state" :label="t('model.role.state')" name="state">
        <Select
          :disabled="!isUpdate || (isUpdate && !updateFields.includes('state'))"
          ref="select"
          v-model:value="formState.state"
          style="width: 120px"
        >
          <SelectOption key="0">无效</SelectOption>
          <SelectOption key="1">有效</SelectOption>
        </Select>
      </FormItem>
      <FormItem :wrapper-col="{ span: 14, offset: 4 }">
        <Button v-if="!isUpdate" type="primary" @click="onSubmit">{{
          t('model.role.addRole')
        }}</Button>
        <Button v-else type="primary" @click="onSubmit">{{ t('model.role.updateRole') }}</Button>
        <Button style="margin-left: 10px" @click="resetForm">{{ t('model.role.reset') }}</Button>
      </FormItem>
    </Form>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { addRoles, getRole, updateRole } from '/@/api/sys/role/role';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { RoleModel, RoleConst } from '/@/api/sys/role/model/roleModel';
  import { Loading } from '/@/components/Loading';
  import { Form, FormItem, Button, Input, Select, SelectOption } from 'ant-design-vue';
  import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';
  import { MenuModel } from '/@/api/sys/menu/model/menuModel';
  import { getCompanies, getCompany } from '/@/api/sys/compnay/company';
  import { debounce } from 'lodash-es';

  interface Option {
    value: string;
    label: string;
  }
  export default defineComponent({
    name: 'RoleForm',
    components: {
      Loading,
      Form,
      FormItem,
      Button,
      Input,
      Select,
      SelectOption,
    },
    props: {
      roleId: {
        type: String,
        require: false,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('role');
      const currentId = ref(props.roleId || undefined);
      let isUpdate = ref<boolean>(false);
      if (currentId.value && currentId.value !== '') {
        isUpdate.value = true;
      }
      let companyName = ref();
      const options = ref<Option[]>([]);

      const loading = ref<boolean>(false);
      const tip = ref<string>('加载中...');
      const formRef = ref();
      const rules = reactive(RoleConst._RULES);
      const roleConst = ref(RoleConst);
      const sysRoleMenusById: MenuModel[] = [];
      //状态默认值，添加时默认不能选，为有效
      let state = '';
      if (!isUpdate.value) {
        state = RoleConst.EFFECTIVE;
      }
      const formState: UnwrapRef<RoleModel> = reactive({
        id: currentId.value || '',
        roleName: '',
        remake: '',
        createTime: '',
        updateTime: '',
        createBy: '',
        updateBy: '',
        companyId: '',
        state,
        sysRoleMenusById: [],
      });

      //文本框值发生变化调用
      const fetchUser = debounce(async (value) => {
        options.value.splice(0);
        if (value === '') {
          return;
        }
        const { content } = await getCompanies({ name: value });
        if (content) {
          content.forEach((item) => {
            options.value?.push({ value: item.id || '', label: item.name || '' });
          });
        }
      }, 200);

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            if (currentId.value) {
              loading.value = true;
              try {
                const { content } = await updateRole(formState);
                success(t('model.role.updateRole'), t('model.role.success'));
                Object.assign(formState, content);
              } catch (error) {
                failed(error?.response?.data?.message, t('model.role.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              loading.value = true;
              try {
                const { content } = await addRoles(formState);
                success(t('model.role.addRole'), t('model.role.success'));
                Object.assign(formState, content);
              } catch (error) {
                failed(error?.response?.data?.message, t('model.role.fail'));
              } finally {
                loading.value = false;
              }
            }
          })
          .catch((error: ValidateErrorEntity<RoleModel>) => {
            console.log('error', error);
          });
      };

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

      const resetForm = async () => {
        if (currentId.value) {
          loading.value = true;
          try {
            const { content } = await getRole({ id: currentId.value });
            Object.assign(formState, content);
          } catch (error) {
          } finally {
            loading.value = false;
          }
        } else {
          formRef.value.resetFields();
        }
      };

      onMounted(async () => {
        if (currentId.value) {
          loading.value = true;
          try {
            const { content } = await getRole({ id: currentId.value });
            Object.assign(formState, content);
            const result = await getCompany(content.companyId || '');
            companyName.value = result.content.name;
          } catch (error) {
          } finally {
            loading.value = false;
          }
        }
      });

      return {
        t,
        formRef,
        sysRoleMenusById,
        formState,
        loading,
        updateFields: RoleConst._UPDATE_FIELDS,
        currentId,
        isUpdate,
        companyName,
        tip,
        rules,
        roleConst,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        onSubmit,
        resetForm,
        options,
        fetchUser,
      };
    },
  });
</script>
