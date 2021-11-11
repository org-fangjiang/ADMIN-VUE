<template>
  <div>
    <Form
      ref="formRef"
      :model="formState"
      :rules="provinceConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="id" :label="t('model.location.province.id')" name="id">
        <Input
          :disabled="isUpdate && !updateFields.includes('id')"
          v-model:value="formState.id"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="name" :label="t('model.location.province.name')" name="name">
        <Input
          :disabled="isUpdate && !updateFields.includes('name')"
          v-model:value="formState.name"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="state" :label="t('model.location.province.state')" name="state">
        <Select
          :disabled="!isUpdate || (isUpdate && !updateFields.includes('state'))"
          ref="select"
          v-model:value="formState.state"
          style="width: 120px"
          :options="provinceConst.STATES"
        />
      </FormItem>
      <FormItem :wrapper-col="{ span: 14, offset: 4 }">
        <Button type="primary" @click="onSubmit">{{
          t('model.location.province.updateProvince')
        }}</Button>
        <Button style="margin-left: 10px" @click="resetForm">{{
          t('model.location.province.reset')
        }}</Button>
      </FormItem>
    </Form>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Select, Button, Form, FormItem, Input } from 'ant-design-vue';
  import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';
  import { ProvinceModel, ProvinceConst } from '/@/api/sys/province/model/provinceModel';
  import { getProvince, updateProvince, addProvince } from '/@/api/sys/province/province';
  import { Loading } from '/@/components/Loading';
  import { success, failed } from '/@/hooks/web/useList';

  export default defineComponent({
    name: 'ProvinceForm',
    components: {
      Select,
      Button,
      Form,
      FormItem,
      Input,
      Loading,
    },
    props: {
      id: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const provinceConst = ref(ProvinceConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      //获取表单数据
      const formRef = ref();
      //判断是否是更新
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }
      //初始默认有效
      let state;
      if (!isUpdate.value) {
        state = ProvinceConst.EFFECTIVE;
      }
      const formState: UnwrapRef<ProvinceModel> = reactive({
        id: '',
        name: '',
        state,
      });
      //提交
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            if (props.id) {
              try {
                const { content } = await updateProvince(formState);
                success(
                  t('model.location.province.updateProvince'),
                  t('model.location.province.success')
                );
                Object.assign(formState, content);
              } catch (error: any) {
                failed(error?.response?.data?.message, t('model.location.province.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              try {
                const { content } = await addProvince(formState);
                success(
                  t('model.location.province.addProvince'),
                  t('model.location.province.success')
                );
                Object.assign(formState, content);
              } catch (error: any) {
                failed(error?.response?.data?.message, t('model.location.province.fail'));
              } finally {
                loading.value = false;
              }
            }
          })
          .catch((error: ValidateErrorEntity<ProvinceModel>) => {
            console.log('error', error);
          });
      };
      //重置
      const resetForm = async () => {
        loading.value = true;
        if (props.id) {
          try {
            const { content } = await getProvince({ id: props.id });
            Object.assign(formState, content);
          } catch (error) {
          } finally {
            loading.value = false;
          }
        } else {
          formRef.value.resetFields();
        }
      };
      //初始加载
      onMounted(async () => {
        if (props.id) {
          const { content } = await getProvince({ id: props.id });
          if (content) {
            Object.assign(formState, content);
          }
        }
        loading.value = false;
      });

      return {
        t,
        provinceConst,
        formRef,
        isUpdate,
        tip,
        loading,
        updateFields: ProvinceConst._UPDATE_FIELDS,
        onSubmit,
        resetForm,
        formState,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
      };
    },
  });
</script>
