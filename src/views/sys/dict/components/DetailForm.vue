<template>
  <div>
    <Form
      ref="formRef"
      :model="formState"
      :rules="dictConst._DETAIL_RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="value" :label="t('model.dict.detail.value')" name="value">
        <Input
          :disabled="isUpdate && !updateFields.includes('value')"
          v-model:value="formState.value"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="state" :label="t('model.dict.detail.state')" name="state">
        <Select
          :disabled="isUpdate && !updateFields.includes('state')"
          ref="select"
          v-model:value="formState.state"
          style="width: 120px"
          :options="dictConst.STATES"
        />
      </FormItem>
      <FormItem :wrapper-col="{ span: 14, offset: 4 }">
        <Button v-if="isUpdate" type="primary" @click="onSubmit">{{
          t('model.dict.detail.updateDetail')
        }}</Button>
        <Button v-else type="primary" @click="onSubmit">{{
          t('model.dict.detail.addDetail')
        }}</Button>
        <Button style="margin-left: 10px" @click="resetForm">{{
          t('model.dict.detail.cancel')
        }}</Button>
      </FormItem>
    </Form>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { addSysDictDetail, UpdateSysDictDetail, getSysDictDetail } from '/@/api/sys/dict/dict';
  import { DictConst, DictDetailModel } from '/@/api/sys/dict/model/dictModel';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Select, Button, Form, FormItem, Input } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';
  import { Loading } from '/@/components/Loading';
  export default defineComponent({
    name: 'DetailForm',
    components: {
      Select,
      Button,
      Form,
      FormItem,
      Input,
      Loading,
    },
    props: {
      //传递过来的分组编号和当前详情的编号
      groupId: {
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
      const { prefixCls } = useDesign('dict');
      const dictConst = ref(DictConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const formRef = ref();
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }
      const formState: UnwrapRef<DictDetailModel> = reactive({
        id: '',
        value: '',
        groupId: props.groupId || '',
        state: '',
      });

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            if (props.id) {
              try {
                const { content } = await UpdateSysDictDetail(formState);
                success(t('model.dict.detail.updateDetail'), t('model.dict.detail.success'));
                Object.assign(formState, content);
              } catch (error) {
                failed(error?.response?.data?.message, t('model.dict.detail.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              try {
                const { content } = await addSysDictDetail(formState);
                success(t('model.dict.detail.addDetail'), t('model.dict.detail.success'));
                Object.assign(formState, content);
              } catch (error) {
                failed(error?.response?.data?.message, t('model.dict.detail.fail'));
              } finally {
                loading.value = false;
              }
            }
          })
          .catch((error: ValidateErrorEntity<DictDetailModel>) => {
            console.log('error', error);
          });
      };
      const resetForm = async () => {
        if (props.id) {
          loading.value = true;
          try {
            const { content } = await getSysDictDetail({ id: props.id });
            if (content) {
              Object.assign(formState, content);
            }
          } catch (error) {
          } finally {
            loading.value = false;
          }
        } else {
          formRef.value.resetFields();
        }
        loading.value = false;
      };
      onMounted(async () => {
        loading.value = true;
        console.log('id:', props.id);
        console.log('groupid:', props.groupId);
        if (props.id) {
          const { content } = await getSysDictDetail({ id: props.id });
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
        props,
        isUpdate,
        prefixCls,
        dictConst,
        tip,
        updateFields: DictConst._UPDATE_DETAIL_FIELDS,
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
