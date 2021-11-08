<template>
  <div>
    <Form
      ref="formRef"
      :model="formState"
      :rules="cityConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="id" :label="t('model.location.city.id')" name="id">
        <Input
          :disabled="isUpdate && !updateFields.includes('id')"
          v-model:value="formState.id"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="name" :label="t('model.location.city.name')" name="name">
        <Input
          :disabled="isUpdate && !updateFields.includes('name')"
          v-model:value="formState.name"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="firstLetter" :label="t('model.location.city.firstLetter')" name="firstLetter">
        <Input
          :disabled="isUpdate && !updateFields.includes('firstLetter')"
          v-model:value="formState.firstLetter"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="state" :label="t('model.location.city.state')" name="state">
        <Select
          :disabled="!isUpdate || (isUpdate && !updateFields.includes('state'))"
          ref="select"
          v-model:value="formState.state"
          style="width: 120px"
          :options="cityConst.STATES"
        />
      </FormItem>
      <FormItem :wrapper-col="{ span: 14, offset: 4 }">
        <Button v-if="isUpdate" type="primary" @click="onSubmit">{{
          t('model.location.city.updateCity')
        }}</Button>
        <Button v-else type="primary" @click="onSubmit">{{
          t('model.location.city.addCity')
        }}</Button>
        <Button style="margin-left: 10px" @click="resetForm">{{
          t('model.location.area.cancel')
        }}</Button>
      </FormItem>
    </Form>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { addCity, getCity, updateCity } from '/@/api/sys/city/city';
  import { CityConst, CityModel } from '/@/api/sys/city/model/cityModel';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Select, Button, Form, FormItem, Input } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';
  import { Loading } from '/@/components/Loading';
  export default defineComponent({
    name: 'CityForm',
    components: {
      Select,
      Button,
      Form,
      FormItem,
      Input,
      Loading,
    },
    props: {
      provinceId: {
        type: String,
        require: true,
      },
      id: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('location');
      const cityConst = ref(CityConst);
      //加载动画
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const formRef = ref();
      //判断是否为更新
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }
      //状态初始为有效
      let state;
      if (!isUpdate.value) {
        state = CityConst.EFFECTIVE;
      }
      const formState: UnwrapRef<CityModel> = reactive({
        id: '',
        name: '',
        provinceId: props.provinceId || '',
        firstLetter: '',
        state,
      });
      //提交
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            if (!props.id) {
              try {
                const { content } = await addCity(formState);
                success(t('model.location.city.addCity'), t('model.location.city.success'));
                Object.assign(formState, content);
              } catch (error: any) {
                failed(error?.response?.data?.message, t('model.location.city.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              try {
                const { content } = await updateCity(formState);
                success(t('model.location.city.updateCity'), t('model.location.city.success'));
                Object.assign(formState, content);
              } catch (error: any) {
                failed(error?.response?.data?.message, t('model.location.city.fail'));
              } finally {
                loading.value = false;
              }
            }
          })
          .catch((error: ValidateErrorEntity<CityModel>) => {
            console.log('error', error);
          });
      };
      //重置
      const resetForm = async () => {
        loading.value = true;
        try {
          const { content } = await getCity({ id: props.id });
          Object.assign(formState, content);
        } catch (error) {
        } finally {
          loading.value = false;
        }
      };
      //初始加载
      onMounted(async () => {
        if (props.id) {
          loading.value = true;
          const { content } = await getCity({ id: props.id });
          if (content) {
            Object.assign(formState, content);
          }
          loading.value = false;
        }
        loading.value = false;
      });

      //成功/失败提示信息
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
        cityConst,
        formRef,
        tip,
        isUpdate,
        loading,
        updateFields: CityConst._UPDATE_FIELDS,
        onSubmit,
        resetForm,
        formState,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
      };
    },
  });
</script>
