<template>
  <div>
    <Form
      ref="formRef"
      :model="formState"
      :rules="linkConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="title" :label="t('model.link.title')" name="title">
        <Input
          :disabled="isUpdate && !updateFields.includes('title')"
          v-model:value="formState.title"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="page" :label="t('model.link.page')" name="page">
        <Input
          :disabled="isUpdate && !updateFields.includes('page')"
          v-model:value="formState.page"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="address" :label="t('model.link.address')" name="address">
        <Input
          :disabled="isUpdate && !updateFields.includes('address')"
          v-model:value="formState.address"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="provinceId" :label="t('model.link.provinceId')" name="provinceId">
        <FProvince
          :disabledProvince="isUpdate && !updateFields.includes('provinceId')"
          :provinceId="formState.provinceId"
          @change="changeProvince"
        />
      </FormItem>
      <FormItem ref="cityId" :label="t('model.link.cityId')" name="cityId">
        <FCity
          :disabledCity="isUpdate && !updateFields.includes('cityId')"
          :provinceId="formState.provinceId"
          :cityId="formState.cityId"
          @change="changeCity"
        />
      </FormItem>
      <FormItem ref="areaId" :label="t('model.link.areaId')" name="areaId">
        <FArea
          :disabledArea="isUpdate && !updateFields.includes('areaId')"
          :cityId="formState.cityId"
          :areaId="formState.areaId"
          @change="changeArea"
        />
      </FormItem>
      <FormItem ref="state" :label="t('model.location.area.state')" name="state">
        <Select
          :disabled="!isUpdate || (isUpdate && !updateFields.includes('state'))"
          ref="select"
          v-model:value="formState.state"
          style="width: 120px"
          :options="linkConst.STATES"
        />
      </FormItem>
      <FormItem :wrapper-col="{ span: 14, offset: 4 }">
        <Button v-if="isUpdate" type="primary" @click="onSubmit">{{
          t('model.link.updateLink')
        }}</Button>
        <Button v-else type="primary" @click="onSubmit">{{ t('model.link.addLink') }}</Button>
        <Button style="margin-left: 10px" @click="resetForm">{{ t('model.link.reset') }}</Button>
      </FormItem>
    </Form>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { addLinks, updateLinks } from '/@/api/sys/link/link';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Select, Button, Form, FormItem, Input } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';
  import { Loading } from '/@/components/Loading';
  import { LinkModel, _Const } from '/@/api/sys/link/model/linkModel';
  import { FProvince, FCity, FArea } from '/@/components/FLocation';
  export default defineComponent({
    name: 'LinkForm',
    components: {
      Select,
      Button,
      Form,
      FormItem,
      Input,
      Loading,
      FProvince,
      FCity,
      FArea,
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
      const { prefixCls } = useDesign('link');
      const linkConst = ref(_Const);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }
      const formRef = ref();
      //添加时状态初始为有效，不可改
      let state;
      if (!isUpdate.value) {
        state = _Const.EFFECTIVE;
      }
      const formState: UnwrapRef<LinkModel> = reactive({
        id: props.id || '',
        title: '',
        page: '',
        address: '',
        provinceId: '',
        cityId: '',
        areaId: '',
        state,
      });

      const changeProvince = async (e) => {
        if (e.value !== formState.provinceId) {
          formState.cityId = '';
          formState.areaId = '';
        }
        formState.provinceId = e.value || '';
      };
      const changeCity = async (e) => {
        if (e.value !== formState.cityId) {
          formState.areaId = '';
        }
        formState.cityId = e.value || '';
      };
      const changeArea = async (e) => {
        formState.areaId = e.value || '';
      };

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            if (props.id) {
              try {
                const { content } = await updateLinks(formState);
                success(t('model.link.updateLink'), t('model.link.success'));
                Object.assign(formState, content);
              } catch (error) {
                failed(error?.response?.data?.message, t('model.link.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              try {
                const { content } = await addLinks(formState);
                success(t('model.link.addLink'), t('model.link.success'));
                Object.assign(formState, content);
              } catch (error) {
                failed(error?.response?.data?.message, t('model.link.fail'));
              } finally {
                loading.value = false;
              }
            }
          })
          .catch((error: ValidateErrorEntity<LinkModel>) => {
            console.log('error', error);
          });
      };
      const resetForm = async () => {
        loading.value = true;
        try {
          const { content } = await updateLinks({ id: props.id });
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
        if (props.id) {
          const { content } = await updateLinks({ id: props.id });
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
        linkConst,
        tip,
        props,
        isUpdate,
        updateFields: _Const._UPDATE_FIELDS,
        loading,
        changeProvince,
        changeCity,
        changeArea,
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
