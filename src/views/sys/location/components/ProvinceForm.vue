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
          :disabled="province && !updateFields.includes('id')"
          v-model:value="formState.id"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="name" :label="t('model.location.province.name')" name="name">
        <Input
          :disabled="province && !updateFields.includes('name')"
          v-model:value="formState.name"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="state" :label="t('model.location.province.state')" name="state">
        <Select
          :disabled="province && !updateFields.includes('state')"
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
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Select, Button, Form, FormItem, Input } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';
  import { ProvinceModel, ProvinceConst } from '/@/api/sys/province/model/provinceModel';
  import { getProvince, updateProvince, addProvince } from '/@/api/sys/province/province';
  import { Loading } from '/@/components/Loading';
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
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('location');
      const provinceConst = ref(ProvinceConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const formRef = ref();
      const province = ref(props.id || undefined);
      const formState: UnwrapRef<ProvinceModel> = reactive({
        id: '',
        name: '',
        state: '',
      });

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
              } catch (error) {
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
              } catch (error) {
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
      onMounted(async () => {
        if (props.id) {
          const { content } = await getProvince({ id: props.id });
          if (content) {
            Object.assign(formState, content);
          }
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
        provinceConst,
        formRef,
        province,
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
