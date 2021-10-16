<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="questionConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="content" :label="t('host.question.content')" name="content">
        <Input
          :disabled="isUpdate && !questionConst._UPDATE_FIELDS.includes('content')"
          v-model:value="formState.content"
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
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Button, Form, FormItem, Input } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { QuestionModel, _QuestionConst } from '/@/api/host/question/model/questionModel';
  import { addQuestion, getQuestion, updateQuestion } from '/@/api/host/question/question';

  export default defineComponent({
    name: 'QuestionForm',
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
      projectId: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');
      const questionConst = ref(_QuestionConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<QuestionModel> = reactive({
        projectId: props.projectId || '',
      });

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            if (props.id) {
              loading.value = true;
              try {
                const { content } = await updateQuestion(formState);
                success(t('host.action.update'), t('host.action.success'));
                Object.assign(formState, content);
              } catch (error) {
                failed(error?.response?.data?.message, t('host.action.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              loading.value = true;
              try {
                const { content } = await addQuestion(formState);
                success(t('host.action.add'), t('host.action.success'));
                Object.assign(formState, content);
              } catch (error) {
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
      const resetForm = async () => {
        loading.value = true;
        try {
          formRef.value.resetFields();
        } catch (error) {
        } finally {
          loading.value = false;
        }
      };
      onMounted(async () => {
        loading.value = true;
        if (props.id) {
          const { content } = await getQuestion(props.id);
          Object.assign(formState, content);
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
          // getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
      };

      return {
        t,
        prefixCls,
        questionConst,
        loading,
        tip,
        formRef,
        formState,
        onSubmit,
        resetForm,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        isUpdate,
        props,
      };
    },
  });
</script>
