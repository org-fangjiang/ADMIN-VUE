<template>
  <div>
    <Form
      ref="formRef"
      :model="formState"
      :rules="areaConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="id" :label="t('model.location.area.id')" name="id">
        <Input
          :disabled="areaId && !updateFields.includes('id')"
          v-model:value="formState.id"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="name" :label="t('model.location.area.name')" name="name">
        <Input
          :disabled="areaId && !updateFields.includes('name')"
          v-model:value="formState.name"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="state" :label="t('model.location.area.state')" name="state">
        <Select
          :disabled="areaId && !updateFields.includes('state')"
          ref="select"
          v-model:value="formState.state"
          style="width: 120px"
          :options="areaConst.STATES"
        />
      </FormItem>
      <FormItem :wrapper-col="{ span: 14, offset: 4 }">
        <Button v-if="areaId" type="primary" @click="onSubmit">{{
          t('model.location.area.updateArea')
        }}</Button>
        <Button v-else type="primary" @click="onSubmit">{{
          t('model.location.area.addArea')
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
  import { addArea, updateArea, getArea } from '/@/api/sys/area/area';
  import { AreaConst, AreaModel } from '/@/api/sys/area/model/areaModel';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Select, Button, Form, FormItem, Input } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';
  import { Loading } from '/@/components/Loading';
  export default defineComponent({
    name: 'AreaForm',
    components: {
      Select,
      Button,
      Form,
      FormItem,
      Input,
      Loading,
    },
    props: {
      cityId: {
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
      const areaConst = ref(AreaConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const areaId = ref(props.id || undefined);
      const formRef = ref();
      const formState: UnwrapRef<AreaModel> = reactive({
        id: '',
        name: '',
        cityId: props.cityId || '',
        state: '',
      });

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            if (props.id) {
              try {
                const { content } = await updateArea(formState);
                success(t('model.location.area.updateArea'), t('model.location.area.success'));
                Object.assign(formState, content);
              } catch (error) {
                failed(error?.response?.data?.message, t('model.location.area.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              try {
                const { content } = await addArea(formState);
                success(t('model.location.area.addArea'), t('model.location.area.success'));
                Object.assign(formState, content);
              } catch (error) {
                failed(error?.response?.data?.message, t('model.location.area.fail'));
              } finally {
                loading.value = false;
              }
            }
          })
          .catch((error: ValidateErrorEntity<AreaModel>) => {
            console.log('error', error);
          });
      };
      const resetForm = async () => {
        loading.value = true;
        try {
          const area = await getArea({ id: props.id });
          Object.assign(formState, area);
        } catch (error) {
        } finally {
          loading.value = false;
        }
      };
      onMounted(async () => {
        loading.value = true;
        if (props.id) {
          const area = await getArea({ id: props.id });
          if (area) {
            Object.assign(formState, area);
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
        areaConst,
        tip,
        areaId,
        updateFields: AreaConst._UPDATE_FIELDS,
        loading,
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
