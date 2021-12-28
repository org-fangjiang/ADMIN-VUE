<template>
  <div>
    <Form
      ref="formRef"
      :rules="clueFollowConst._RULES"
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="content" :label="t('marketing.clueFollow.content')" name="content">
        <Input v-model:value="formState.content" autoComplete="off" :required="true" />
      </FormItem>
      <FormItem
        ref="followResult"
        :label="t('marketing.clueFollow.followResult')"
        name="followResult"
      >
        <Select
          ref="select"
          :allowClear="true"
          v-model:value="formState.followResult"
          style="width: 120px"
          :options="clueFollowConst.FOLLOW_RESULTS"
          :pagination="false"
        />
      </FormItem>
      <FormItem :wrapper-col="{ span: 14, offset: 4 }">
        <Button type="primary" @click="onSubmit">{{ t('component.action.save') }}</Button>
        <Button style="margin-left: 10px" @click="resetForm">{{ t('model.link.reset') }}</Button>
      </FormItem>
    </Form>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Button, Form, FormItem, Input, Select } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { success, failed } from '/@/hooks/web/useList';
  import { clueFollow, ClueFollowConst } from '/@/api/marketing/clue/model/clueModel';
  import { add } from '/@/api/marketing/clue/clue';

  export default defineComponent({
    name: 'AddFollow',
    components: {
      Input,
      Button,
      Form,
      FormItem,
      Loading,
      Select,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      //判断是不是更新
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      const clueFollowConst = ref(ClueFollowConst);
      const formRef = ref();
      const formState: UnwrapRef<clueFollow> = reactive({
        clueId: props.id,
      });

      //提交
      const onSubmit = () => {
        loading.value = true;
        formRef.value
          .validate()
          .then(async () => {
            try {
              await add(formState);
              success(t('marketing.action.addFollow'), t('marketing.action.success'));
            } catch (error) {
              failed(t('marketing.action.addFollow'), t('marketing.action.fail'));
            }
          })
          .catch((error: any) => {
            console.log('error', error);
          });
        loading.value = false;
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
      //初始加载
      onMounted(async () => {
        loading.value = true;

        loading.value = false;
      });

      return {
        t,
        tip,
        props,
        isUpdate,
        loading,
        onSubmit,
        resetForm,
        formRef,
        formState,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        clueFollowConst,
      };
    },
  });
</script>
