<template>
  <div class="p-4">
    <Form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem :label="t('model.sale.maxGetCustomer')" name="maxGetCustomer">
        <InputNumber
          v-model:value="formState.maxGetCustomer"
          :disabled="isUpdate && !uPDATE_FIELDS.includes('maxGetCustomer')"
        />
      </FormItem>
      <FormItem :label="t('model.user.extNumber')" name="extNumber">
        <Input
          v-model:value="formState.extNumber"
          :disabled="isUpdate && !uPDATE_FIELDS.includes('extNumber')"
        />
      </FormItem>
      <FormItem :label="t('model.sale.baseScore')" name="baseScore">
        <InputNumber
          v-model:value="formState.baseScore"
          :disabled="isUpdate && !uPDATE_FIELDS.includes('baseScore')"
        />
      </FormItem>
      <FormItem :wrapper-col="{ span: 14, offset: 4 }">
        <Button v-if="!isUpdate" type="primary" @click="onSubmit">添加</Button>
        <Button v-if="isUpdate" type="primary" @click="onSubmit">更新</Button>
        <Button style="margin-left: 10px" @click="onReset">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { SaleConst, SaleModel } from '/@/api/sys/sale/model/saleModel';
  import { getSale, saveSale, updateSale } from '/@/api/sys/sale/sale';
  import { failed, success } from '/@/hooks/web/useList';
  import { Form, FormItem, Button, InputNumber, Input } from 'ant-design-vue';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    name: 'SaleForm',
    components: { Form, FormItem, Button, InputNumber, Input },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const formRef = ref();
      const formState: UnwrapRef<SaleModel> = reactive({
        saleId: props.id,
      });

      const rules = reactive(SaleConst._RULES);
      const isUpdate = ref(false);

      onMounted(async () => {
        const result = await getSale(props.id);
        if (result.content) {
          Object.assign(formState, result.content);
          isUpdate.value = true;
        }
      });

      // 确认
      const onSubmit = () => {
        formRef.value.validate().then(async () => {
          if (isUpdate.value) {
            try {
              await updateSale(formState);
              success('成功', '更新信息成功');
            } catch (error) {
              failed('失败', '更新信息失败');
            }
          } else {
            try {
              await saveSale(formState);
              success('成功', '添加信息成功');
            } catch (error) {
              failed('失败', '添加信息失败');
            }
          }
        });
      };

      // 重置
      const onReset = async () => {
        const result = await getSale(props.id);
        if (result.content) {
          Object.assign(formState, result.content);
          isUpdate.value = true;
        }
      };

      return {
        isUpdate,
        formState,
        formRef,
        onReset,
        onSubmit,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        rules,
        t,
        uPDATE_FIELDS: SaleConst._UPDATE_FIELDS,
      };
    },
  });
</script>
