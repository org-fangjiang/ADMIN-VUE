<template>
  <div class="min-h-[500px]">
    <Form
      ref="formRef"
      :model="formState"
      :rules="unitConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="number" :label="t('host.manageUnit.number')" name="number">
        <Input
          :disabled="isUpdate && !unitConst._UPDATE_FIELDS.includes('number')"
          v-model:value="formState.number"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="floor" :label="t('host.manageUnit.floor')" name="floor">
        <InputNumber
          :disabled="isUpdate && !unitConst._UPDATE_FIELDS.includes('floor')"
          v-model:value="formState.floor"
          autoComplete="off"
          type="number"
        />
      </FormItem>
      <FormItem ref="everyRooms" :label="t('host.manageUnit.everyRooms')" name="everyRooms">
        <InputNumber
          :disabled="isUpdate && !unitConst._UPDATE_FIELDS.includes('everyRooms')"
          v-model:value="formState.everyRooms"
          autoComplete="off"
          type="number"
        />
      </FormItem>
      <FormItem ref="lowPrice" :label="t('host.manageUnit.lowPrice')" name="lowPrice">
        <Input
          :disabled="isUpdate && !unitConst._UPDATE_FIELDS.includes('lowPrice')"
          v-model:value="formState.lowPrice"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="heightPrice" :label="t('host.manageUnit.heightPrice')" name="heightPrice">
        <Input
          :disabled="isUpdate && !unitConst._UPDATE_FIELDS.includes('heightPrice')"
          v-model:value="formState.heightPrice"
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
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { Loading } from '/@/components/Loading';
  import { Form, FormItem, Input, Button, InputNumber } from 'ant-design-vue';
  import { UnitConst, UnitModel } from '/@/api/host/manageUnit/model/manageUnitModel';
  import { addUnit, getUnit, updateUnit } from '/@/api/host/manageUnit/manageUnit';
  import { failed, success } from '/@/hooks/web/useList';

  export default defineComponent({
    name: 'AddUnitForm',
    components: {
      Loading,
      Form,
      FormItem,
      Input,
      Button,
      InputNumber,
    },
    props: {
      id: {
        type: String,
        required: false,
      },
      buildId: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      //判断是更新还是添加
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      const formRef = ref();
      const formState: UnitModel = reactive({
        buildId: props.buildId,
      });
      const unitConst = ref(UnitConst);

      onMounted(async () => {
        loading.value = true;
        if (props.id) {
          const { content } = await getUnit(props.id);
          Object.assign(formState, content);
        }
        loading.value = false;
      });

      //提交
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            if (props.id) {
              loading.value = true;
              try {
                await updateUnit(formState);
                success(t('host.action.update'), t('host.action.success'));
              } catch (error: any) {
                failed(error?.response?.data?.message, t('host.action.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              loading.value = true;
              try {
                await addUnit(formState);
                success(t('host.action.add'), t('host.action.success'));
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
        if (props.id) {
          const { content } = await getUnit(props.id);
          Object.assign(formState, content);
        } else {
          formRef.value.resetFields();
        }
      };

      return {
        loading,
        tip,
        formRef,
        formState,
        unitConst,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        isUpdate,
        resetForm,
        onSubmit,
        t,
      };
    },
  });
</script>
