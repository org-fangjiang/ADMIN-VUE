<template>
  <div>
    <Form
      ref="formRef"
      :model="formState"
      :rules="departmentConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="parentName" :label="t('model.department.parentName')" name="parentName">
        <Input
          :disabled="isUpdate && !updateFields.includes('parentId')"
          v-model:value="parentName"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="deptName" :label="t('model.department.deptName')" name="deptName">
        <Input
          :disabled="isUpdate && !updateFields.includes('deptName')"
          v-model:value="formState.deptName"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="companyName" :label="t('model.department.companyName')" name="companyname">
        <Select
          ref="selectRef"
          :disabled="isUpdate && !updateFields.includes('companyId')"
          v-model:value="companyName"
          label-in-value
          style="width: 100%"
          :filter-option="false"
          :not-found-content="null"
          :options="options"
          @search="fetchUser"
          :showSearch="true"
          :labelInValue="false"
          @change="changeCompany"
        />
      </FormItem>
      <FormItem :wrapper-col="{ span: 14, offset: 4 }">
        <Button v-if="isUpdate" type="primary" @click="onSubmit">{{
          t('model.department.updateDept')
        }}</Button>
        <Button v-else type="primary" @click="onSubmit">{{ t('model.department.addDept') }}</Button>
        <Button style="margin-left: 10px" @click="resetForm">{{
          t('model.department.reset')
        }}</Button>
      </FormItem>
    </Form>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    addDepartment,
    updateDepartment,
    getDepartment,
    getAllDepartments,
  } from '/@/api/sys/department/department';
  import { DepartmentConst, DepartmentModel } from '/@/api/sys/department/model/departmentModel';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Button, Form, FormItem, Input, Select } from 'ant-design-vue';
  import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';
  import { Loading } from '/@/components/Loading';
  import { debounce } from 'lodash-es';
  import { getCompanies, getCompany } from '/@/api/sys/compnay/company';
  import { success, failed } from '/@/hooks/web/useList';

  interface Option {
    value: string;
    label: string;
  }
  export default defineComponent({
    name: 'DeptForm',
    components: {
      Button,
      Form,
      FormItem,
      Input,
      Loading,
      Select,
    },
    props: {
      //传递过来的分组编号和当前详情的编号
      id: {
        type: String,
        require: true,
      },
      parentId: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const departmentConst = ref(DepartmentConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const formRef = ref();

      const options = ref<Option[]>([]);
      //判断是否为更新
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }
      //企业名称，上级名称
      let companyName = ref();
      let parentName = ref();
      const formState: UnwrapRef<DepartmentModel> = reactive({
        deptId: props.id || '',
        parentId: props.parentId || '',
        deptName: '',
        orderNum: 0,
        createTime: '',
        updateTime: '',
        createBy: '',
        updateBy: '',
        companyId: '',
        hasChild: true,
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

      //选择企业
      const changeCompany = (value) => {
        formState.companyId = value;
      };
      //提交
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            if (props.id) {
              //更新
              try {
                const { content } = await updateDepartment(formState);
                success(t('model.department.updateDept'), t('model.department.success'));
                Object.assign(formState, content);
              } catch (error: any) {
                failed(error?.response?.data?.message, t('model.department.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              //添加
              try {
                const { content } = await addDepartment(formState);
                success(t('model.department.addDept'), t('model.department.success'));
                Object.assign(formState, content);
              } catch (error: any) {
                failed(error?.response?.data?.message, t('model.department.fail'));
              } finally {
                loading.value = false;
              }
            }
          })
          .catch((error: ValidateErrorEntity<DepartmentModel>) => {
            console.log('error', error);
          });
      };

      //重置
      const resetForm = async () => {
        if (props.id) {
          //将初始信息赋值
          loading.value = true;
          try {
            const { content } = await getDepartment({ deptId: props.id });
            if (content) {
              Object.assign(formState, content);
            }
          } catch (error) {
          } finally {
            loading.value = false;
          }
        } else {
          //重置清空
          formRef.value.resetFields();
        }
        loading.value = false;
      };

      onMounted(async () => {
        loading.value = true;
        //添加一级部门
        if (props.id === '' && props.parentId === '') {
          parentName.value = '';
        }
        if (props.id) {
          const { content } = await getDepartment({ deptId: props.id });
          if (content) {
            Object.assign(formState, content);
            //获取企业名称
            const result = await getCompany(content.companyId || '');
            companyName.value = result.content.name;
            //判断修改的是否是一级部门，是的话，上级名称为空
            const allDept = await getAllDepartments({});
            const ids = [''];
            allDept.content.forEach((e) => {
              if (e.deptId) {
                ids.push(e.deptId);
              }
            });
            if (content.deptId) {
              if (ids.includes(content.deptId)) {
                parentName.value = '';
              } else {
                const dept = await getDepartment({ deptId: content.parentId });
                parentName.value = dept.content.deptName;
              }
            }
          }
        }
        // 添加多级部门，将上级名称展示出来
        if (props.parentId) {
          const { content } = await getDepartment({ deptId: props.parentId });
          if (content) {
            parentName.value = content.deptName;
          }
        }
        loading.value = false;
      });

      return {
        t,
        props,
        isUpdate,
        companyName,
        parentName,
        departmentConst,
        tip,
        updateFields: DepartmentConst._UPDATE_FIELDS,
        loading,
        options,
        fetchUser,
        changeCompany,
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
