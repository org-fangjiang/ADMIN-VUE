<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="hostConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="orderNum" :label="t('host.orderNum')" name="orderNum">
        <Input v-model:value="formState.orderNum" autoComplete="off" :type="'number'" />
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
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Button, Form, FormItem, Input } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { success, failed } from '/@/hooks/web/useList';
  import { HostModel, _HostConst } from '/@/api/host/project/model/projectModel';
  import { getProject, setProjectOrder } from '/@/api/host/project/project';

  export default defineComponent({
    name: 'OrderForm',
    components: {
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
      const { prefixCls } = useDesign('project');
      const hostConst = ref(_HostConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<HostModel> = reactive({});

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            try {
              await setProjectOrder(props.id || '', formState.orderNum || 0);
              success(t('host.action.setProjectOrder'), t('host.action.success'));
            } catch (error: any) {
              failed(t('host.action.setProjectOrder'), t('host.action.fail'));
            } finally {
              loading.value = false;
            }
          })
          .catch((error: any) => {
            console.log('error', error);
          });
      };
      const resetForm = async () => {
        loading.value = true;
        try {
          const { content } = await getProject(props.id || '');
          formState.orderNum = content.orderNum;
        } catch (error) {
        } finally {
          loading.value = false;
        }
      };
      onMounted(async () => {
        loading.value = true;
        const { content } = await getProject(props.id || '');
        formState.orderNum = content.orderNum;
        loading.value = false;
      });

      return {
        t,
        prefixCls,
        hostConst,
        loading,
        tip,
        formRef,
        formState,
        onSubmit,
        resetForm,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        props,
      };
    },
  });
</script>
