<template>
  <div class="min-h-[500px]">
    <Form
      ref="formRef"
      :model="formState"
      :rules="unitConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="number" :label="t('ohouse.unit.number')" name="number">
        <Input
          :disabled="isUpdate && !unitConst._UPDATE_FIELDS.includes('number')"
          v-model:value="formState.number"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="floor" :label="t('ohouse.unit.floor')" name="floor">
        <InputNumber
          :disabled="isUpdate && !unitConst._UPDATE_FIELDS.includes('floor')"
          v-model:value="formState.floor"
          autoComplete="off"
          type="number"
        />
      </FormItem>
      <FormItem ref="everyRooms" :label="t('ohouse.unit.everyRooms')" name="everyRooms">
        <InputNumber
          :disabled="isUpdate && !unitConst._UPDATE_FIELDS.includes('everyRooms')"
          v-model:value="formState.everyRooms"
          autoComplete="off"
          type="number"
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
  import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
  import { Loading } from '/@/components/Loading';
  import { Form, FormItem, Input, Button, InputNumber } from 'ant-design-vue';
  import { failed, success } from '/@/hooks/web/useList';
  import { UnitConst, UnitModel } from '/@/api/ohouse/oUnit/model/unitModel';
  import { addUnit, getUnitId, unitExist, updateUnit } from '/@/api/ohouse/oUnit/unit';

  export default defineComponent({
    name: 'UnitForm',
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
      projectId: {
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
        projectId: props.projectId,
      });
      const unitConst = ref(UnitConst);

      onMounted(async () => {
        loading.value = true;
        if (props.id) {
          const { content } = await getUnitId(props.id);
          Object.assign(formState, content);
        }
        loading.value = false;
      });

      watch(
        () => formState.number,
        async () => {
          if (formState.number) {
            const result = await unitExist(props.buildId, formState.number || '');
            if (result) {
              failed('失败', '当前单元已存在列表中');
              loading.value = false;
              return;
            }
          }
        }
      );

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
          const { content } = await getUnitId(props.id);
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
