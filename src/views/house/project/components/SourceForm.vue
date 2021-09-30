<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="sourceConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="title" :label="t('host.source.title')" name="title">
        <div>
          <Input
            :disabled="isUpdate && !sourceConst._UPDATE_FIELDS.includes('title')"
            v-model:value="formState.title"
            autoComplete="off"
          />
          <!-- <Upload name="file" action="" @change="handleChange">
            <Button> <UploadOutlined />Click to Upload </Button>
          </Upload> -->
        </div>
      </FormItem>
      <FormItem ref="keyword" :label="t('host.source.keyword')" name="keyword">
        <Input
          :disabled="isUpdate && !sourceConst._UPDATE_FIELDS.includes('keyword')"
          v-model:value="formState.keyword"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="description" :label="t('host.source.description')" name="description">
        <Input
          :disabled="isUpdate && !sourceConst._UPDATE_FIELDS.includes('description')"
          v-model:value="formState.description"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="address" :label="t('host.source.address')" name="address">
        <Input
          :disabled="isUpdate && !sourceConst._UPDATE_FIELDS.includes('address')"
          v-model:value="formState.address"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="sort" :label="t('host.source.sort')" name="sort">
        <Select
          :disabled="isUpdate && !sourceConst._UPDATE_FIELDS.includes('sort')"
          ref="select"
          :allowClear="true"
          v-model:value="formState.sort"
          style="width: 120px"
          @change="sortChange"
          :options="sourceConst.SORTS"
          :pagination="false"
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
  import { Button, Form, FormItem, Input, Select } from 'ant-design-vue';
  // import { UploadOutlined } from '@ant-design/icons-vue';
  import { Loading } from '/@/components/Loading';
  import { SourceModel, _SourceConst } from '/@/api/host/source/model/sourceModel';
  import { updateResource, addResource, getResource } from '/@/api/host/source/source';
  interface Option {
    label: string;
    value: string;
  }
  export default defineComponent({
    name: 'SourceForm',
    components: {
      Button,
      Form,
      FormItem,
      Input,
      Loading,
      Select,
      // Upload,
      // UploadOutlined,
    },
    props: {
      id: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('metro');
      const sourceConst = ref(_SourceConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      const options = ref<Option[]>([]);
      const sortChange = async (value) => {
        formState.sort = value;
      };

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<SourceModel> = reactive({});

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            if (props.id) {
              loading.value = true;
              try {
                const { content } = await updateResource(formState);
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
                const { content } = await addResource(formState);
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
          const { content } = await getResource(props.id);
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
          getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
      };

      return {
        t,
        prefixCls,
        sourceConst,
        loading,
        tip,
        options,
        sortChange,
        formRef,
        formState,
        onSubmit,
        resetForm,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        isUpdate,
      };
    },
  });
</script>
