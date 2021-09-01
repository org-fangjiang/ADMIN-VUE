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
      <FormItem ref="createBy" :label="t('model.company.createBy')" name="createBy">
        <Input v-model:value="formState.create" autoComplete="off" />
      </FormItem>
      <FormItem :wrapper-col="{ span: 14, offset: 4 }">
        <Button v-if="!isUpdate" type="primary" @click="onSubmit">{{
          t('model.company.add')
        }}</Button>
        <Button v-else type="primary" @click="onSubmit">{{ t('model.company.save') }}</Button>
        <Button style="margin-left: 10px" @click="resetForm">{{
          t('model.company.cancel')
        }}</Button>
      </FormItem>
    </Form>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getCompany, changeCreateBy } from '/@/api/sys/compnay/company';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { CompanyModel, CompanyConst } from '/@/api/sys/compnay/model/companyModel';
  import { Loading } from '/@/components/Loading';
  import { Form, FormItem, Button, Input } from 'ant-design-vue';
  import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';
  export default defineComponent({
    name: 'CompanyFormCreateBy',
    components: {
      Loading,
      Form,
      FormItem,
      Button,
      Input,
    },
    props: {
      id: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('login');
      const companyId = ref(props.id);
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }
      const loading = ref<boolean>(false);
      const tip = ref<string>('更新中...');
      const formRef = ref();
      const rules = reactive(CompanyConst.COMPANY_RULES_CREATE_BY);
      const formState: UnwrapRef<CompanyModel> = reactive({
        id: '',
        createBy: '',
      });

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            if (companyId.value) {
              loading.value = true;
              try {
                const { content } = await changeCreateBy(formState);
                success(t('model.company.updateInfo'), t('model.company.update_success'));
                Object.assign(formState, content);
              } catch (error) {
                failed(error?.response?.data?.message, t('model.company.update_failed'));
              } finally {
                loading.value = false;
              }
            }
          })
          .catch((error: ValidateErrorEntity<CompanyModel>) => {
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
        if (companyId.value) {
          loading.value = true;
          try {
            const { content } = await getCompany(companyId.value);
            Object.assign(formState, content);
          } catch (error) {
          } finally {
            loading.value = false;
          }
        }
      };

      onMounted(async () => {
        if (companyId.value) {
          loading.value = true;
          try {
            const { content } = await getCompany(companyId.value);
            Object.assign(formState, content);
          } catch (error) {
          } finally {
            loading.value = false;
          }
        }
      });

      return {
        t,
        formRef,
        formState,
        loading,
        updateFields: CompanyConst.COMPANY_UPDATE_FIELDS,
        companyId,
        isUpdate,
        tip,
        rules,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        onSubmit,
        resetForm,
      };
    },
  });
</script>
