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
          :disabled="!updateFields.includes('roleName')"
          v-model:value="formState.roleName"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="remake" :label="t('model.role.remake')" name="remake">
        <Input
          :disabled="!updateFields.includes('remake')"
          v-model:value="formState.remake"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="companyName" :label="t('model.company.name')" name="companyName">
        <Select
          ref="selectRef"
          :disabled="!updateFields.includes('companyName')"
          v-model:value="companyName"
          label-in-value
          style="width: 100%"
          :filter-option="false"
          :not-found-content="null"
          :options="options"
          :showSearch="true"
          :labelInValue="false"
        />
      </FormItem>
      <FormItem ref="state" :label="t('model.role.state')" name="state">
        <Select ref="select" :disabled="true" v-model:value="formState.state" style="width: 120px">
          <SelectOption key="0">无效</SelectOption>
          <SelectOption key="1">有效</SelectOption>
        </Select>
      </FormItem>
      <FormItem :wrapper-col="{ span: 14, offset: 4 }">
        <Button type="primary" @click="onSubmit">{{ t('model.role.addRole') }}</Button>
        <Button style="margin-left: 10px" @click="resetForm">{{ t('model.role.reset') }}</Button>
      </FormItem>
    </Form>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { addRoles } from '/@/api/sys/role/role';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { RoleModel, RoleConst } from '/@/api/sys/role/model/roleModel';
  import { Loading } from '/@/components/Loading';
  import { Form, FormItem, Button, Input, Select, SelectOption } from 'ant-design-vue';
  import { MenuModel } from '/@/api/sys/menu/model/menuModel';
  import { getCompany } from '/@/api/sys/compnay/company';
  import { success, failed } from '/@/hooks/web/useList';

  interface Option {
    value: string;
    label: string;
  }
  export default defineComponent({
    name: 'FRoleForm',
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
      companyId: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      //下拉框数据
      const options = ref<Option[]>([]);
      //加载动画
      const loading = ref<boolean>(false);
      const tip = ref<string>('加载中...');
      const formRef = ref();
      //验证规则
      const rules = reactive(RoleConst._RULES);
      const sysRoleMenusById: MenuModel[] = [];
      const formState: UnwrapRef<RoleModel> = reactive({
        id: '',
        roleName: '',
        remake: '',
        createTime: '',
        updateTime: '',
        createBy: '',
        updateBy: '',
        companyId: props.companyId || '',
        state: '1',
        sysRoleMenusById: [],
        companyName: '',
      });
      //企业名称
      const companyName = ref();
      //提交
      const onSubmit = () => {
        formRef.value.validate().then(async () => {
          loading.value = true;
          try {
            const { content } = await addRoles(formState);
            success(t('model.role.addRole'), t('model.role.success'));
            Object.assign(formState, content);
          } catch (error: any) {
            failed(error?.response?.data?.message, t('model.role.fail'));
          } finally {
            loading.value = false;
          }
        });
      };

      //重置
      const resetForm = async () => {
        formRef.value.resetFields();
      };
      //初始加载
      onMounted(async () => {
        if (props.companyId) {
          const { content } = await getCompany(props.companyId);
          companyName.value = content.name;
        }
      });

      return {
        t,
        formRef,
        companyName,
        sysRoleMenusById,
        formState,
        loading,
        updateFields: RoleConst._UPDATE_FIELDS,
        tip,
        rules,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        onSubmit,
        resetForm,
        options,
        props,
      };
    },
  });
</script>
