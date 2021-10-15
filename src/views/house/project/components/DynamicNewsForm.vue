// 添加更改许可证信息
<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="dynamicNewsConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="title" :label="t('host.dynamicNews.title')" name="title">
        <Input
          :disabled="isUpdate && !dynamicNewsConst._UPDATE_FIELDS.includes('title')"
          v-model:value="formState.title"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="description" :label="t('host.dynamicNews.description')" name="description">
        <Textarea
          :disabled="isUpdate && !dynamicNewsConst._UPDATE_FIELDS.includes('description')"
          v-model:value="formState.description"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="content" :label="t('host.dynamicNews.content')" name="content">
        <Textarea
          :disabled="isUpdate && !dynamicNewsConst._UPDATE_FIELDS.includes('content')"
          v-model:value="formState.content"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="sort" :label="t('host.dynamicNews.sort')" name="sort">
        <Select
          :disabled="isUpdate && !dynamicNewsConst._UPDATE_FIELDS.includes('sort')"
          ref="select"
          :allowClear="true"
          v-model:value="formState.sort"
          style="width: 120px"
          @change="sortChange"
          :options="dynamicNewsConst.dynamicSort"
          :pagination="false"
        />
      </FormItem>
      <FormItem ref="author" :label="t('host.dynamicNews.author')" name="author">
        <Input
          :disabled="isUpdate && !dynamicNewsConst._UPDATE_FIELDS.includes('author')"
          v-model:value="formState.author"
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
  import { Button, Form, FormItem, Input, Textarea, Select } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import {
    DynamicNewsModel,
    _DynamicNewsConst,
  } from '/@/api/host/dynamicNews/model/dynamicNewsModel';
  import {
    updateDynamicNew,
    addDynamicNew,
    getDynamicNew,
  } from '/@/api/host/dynamicNews/dynamicNews';
  export default defineComponent({
    name: 'DynamicNewsForm',
    components: {
      Button,
      Form,
      FormItem,
      Input,
      Loading,
      Textarea,
      Select,
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
      provinceId: {
        type: String,
        require: true,
      },
      cityId: {
        type: String,
        require: true,
      },
      areaId: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');
      const dynamicNewsConst = ref(_DynamicNewsConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<DynamicNewsModel> = reactive({
        projectId: props.projectId || '',
      });

      const sortChange = async (value) => {
        formState.sort = value;
      };

      function handleChange(value: string) {
        formState.content = value;
      }

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            if (props.id) {
              loading.value = true;
              try {
                debugger;
                await updateDynamicNew(formState);
                debugger;
                success(t('host.action.update'), t('host.action.success'));
              } catch (error) {
                failed(error?.response?.data?.message, t('host.action.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              loading.value = true;
              try {
                const { content } = await addDynamicNew(formState);
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
          const { content } = await getDynamicNew(props.id);
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
        dynamicNewsConst,
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
        sortChange,
        handleChange,
      };
    },
  });
</script>
