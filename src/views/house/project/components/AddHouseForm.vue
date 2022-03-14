<template>
  <div>
    <Form
      ref="formRef"
      :model="formState"
      :rules="houseConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="number" :label="t('host.manageHouse.number')" name="number">
        <Input
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('number')"
          v-model:value="formState.number"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="floor" :label="t('host.manageHouse.floor')" name="floor">
        <InputNumber
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('floor')"
          v-model:value="formState.floor"
          autoComplete="off"
          class="w-[100%]"
          type="number"
        />
      </FormItem>
      <FormItem ref="price" :label="t('host.manageHouse.price')" name="price">
        <Input
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('price')"
          v-model:value="formState.price"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="channel" :label="t('host.manageHouse.channel')" name="channel">
        <Select
          v-model:value="formState.channel"
          :options="options"
          @focus="selectChannel"
          @change="changeChannel"
          change-on-select
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('channel')"
        />
      </FormItem>
      <FormItem ref="description" :label="t('host.manageHouse.description')" name="description">
        <Textarea
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('description')"
          v-model:value="formState.description"
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
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { addManage, getManageHouse, updateManage } from '/@/api/host/manageHouse/manageHouse';
  import { Loading } from '/@/components/Loading';
  import { Form, FormItem, Input, Button, Textarea, Select, InputNumber } from 'ant-design-vue';
  import {
    ManageHouseConst,
    ManageHouseModel,
  } from '/@/api/host/manageHouse/model/manageHouseModel';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { failed, success } from '/@/hooks/web/useList';
  import { getProjectChannel } from '/@/api/host/projectChannel/projectChannel';

  interface Option {
    value: string;
    label: string;
  }
  export default defineComponent({
    name: 'AddHouseForm',
    components: {
      Loading,
      Form,
      FormItem,
      Input,
      Button,
      Textarea,
      Select,
      InputNumber,
    },
    props: {
      unitId: {
        type: String,
        required: false,
      },
      id: {
        type: String,
        required: false,
      },
      projectId: {
        type: String,
        required: true,
      },
      houseId: {
        type: String,
        required: false,
      },
    },
    setup(props) {
      const { t } = useI18n();
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      // 渠道信息
      const options = ref<Option[]>([]);
      const selectChannel = async () => {
        const { content } = await getProjectChannel(props.projectId);
        if (content.channelEntities && content.channelEntities.length > 0) {
          options.value.splice(0);
          content.channelEntities.forEach((item) => {
            options.value.push({ value: item.id || '', label: item.name || '' });
          });
        }
      };
      const changeChannel = (value) => {
        formState.channel = value;
      };

      const houseConst = ref(ManageHouseConst);
      const formRef = ref();
      const formState: ManageHouseModel = reactive({
        unitId: props.unitId,
      });

      onMounted(async () => {
        if (props.id) {
          const result = await getProjectChannel(props.projectId);
          if (result.content.channelEntities && result.content.channelEntities.length > 0) {
            result.content.channelEntities.forEach((item) => {
              options.value.push({ value: item.id || '', label: item.name || '' });
            });
          }
          const { content } = await getManageHouse(props.id);
          Object.assign(formState, content);
        } else {
          formState.number = props.houseId;
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
                await updateManage(formState);
                success(t('host.action.update'), t('host.action.success'));
              } catch (error: any) {
                failed(error?.response?.data?.message, t('host.action.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              loading.value = true;
              try {
                await addManage(formState);
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
          const { content } = await getManageHouse(props.id);
          Object.assign(formState, content);
        } else {
          formRef.value.resetFields();
          formState.number = props.houseId;
        }
      };

      return {
        onSubmit,
        resetForm,
        isUpdate,
        houseConst,
        formRef,
        formState,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        t,
        loading,
        tip,
        selectChannel,
        options,
        changeChannel,
        props,
      };
    },
  });
</script>
