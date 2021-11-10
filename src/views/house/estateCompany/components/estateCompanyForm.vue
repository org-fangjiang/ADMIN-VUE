// 添加更改楼栋信息
<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="estateCompanyConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="name" :label="t('host.name')" name="name">
        <Input
          :disabled="isUpdate && !estateCompanyConst._UPDATE_FIELDS.includes('name')"
          v-model:value="formState.name"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="description" :label="t('host.description')" name="description">
        <Textarea
          :disabled="isUpdate && !estateCompanyConst._UPDATE_FIELDS.includes('description')"
          v-model:value="formState.description"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="link" :label="t('host.link')" name="link">
        <Input
          :disabled="isUpdate && !estateCompanyConst._UPDATE_FIELDS.includes('link')"
          v-model:value="formState.link"
          autoComplete="off"
        />
      </FormItem>
      <FormItem :wrapper-col="{ span: 14, offset: 4 }">
        <Button type="primary" @click="onSubmit">{{ t('component.modal.okText') }}</Button>
        <Button style="margin-left: 10px" @click="resetForm">{{
          t('component.cropper.btn_reset')
        }}</Button>
      </FormItem>
    </Form>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Button, Form, FormItem, Input, Textarea } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import {
    EstateCompanyModel,
    _EstateCompanyConst,
  } from '/@/api/host/estateCompany/model/estateCompanyModel';
  import {
    addEstateCompany,
    getEstateCompany,
    updateEstateCompany,
  } from '/@/api/host/estateCompany/estateCompany';
  import { success, failed } from '/@/hooks/web/useList';

  export default defineComponent({
    name: 'EstateCompanyForm',
    components: {
      Button,
      Form,
      FormItem,
      Input,
      Loading,
      Textarea,
    },
    props: {
      id: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      debugger;
      const { t } = useI18n();
      const { prefixCls } = useDesign('estateCompany');
      const estateCompanyConst = ref(_EstateCompanyConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      //判断是不是更新
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      //初始加载
      onMounted(async () => {
        loading.value = true;
        if (props.id) {
          const { content } = await getEstateCompany(props.id);
          Object.assign(formState, content);
        }
        loading.value = false;
      });

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<EstateCompanyModel> = reactive({});

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            if (props.id) {
              loading.value = true;
              try {
                await updateEstateCompany(formState);
                success(t('host.action.update'), t('host.action.success'));
              } catch (error: any) {
                failed(error?.response?.data?.message, t('host.action.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              loading.value = true;
              try {
                const { content } = await addEstateCompany(formState);
                success(t('host.action.add'), t('host.action.success'));
                Object.assign(formState, content);
              } catch (error: any) {
                failed(error?.response?.data?.message, t('host.action.fail'));
              } finally {
                loading.value = false;
              }
            }
          })
          .catch((error: any) => {
            console.log('error', error);
          });
      };

      //重置
      const resetForm = async () => {
        loading.value = true;
        try {
          formRef.value.resetFields();
        } catch (error) {
        } finally {
          loading.value = false;
        }
      };

      return {
        t,
        prefixCls,
        estateCompanyConst,
        loading,
        tip,
        formRef,
        formState,
        onSubmit,
        resetForm,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        isUpdate,
        props,
      };
    },
  });
</script>
