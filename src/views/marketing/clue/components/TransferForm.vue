<template>
  <div :class="prefixCls">
    <Form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
      <FormItem ref="userId" :label="t('marketing.clue.username')" name="userId">
        <Select
          v-model:value="formState.userId"
          autoComplete="off"
          :options="sales"
          @change="updateByChange"
          :allowClear="true"
          @search="updateBySearch"
          :not-found-content="updating ? undefined : null"
          :showSearch="true"
          :filter-option="false"
        >
          <template v-if="updating" #notFoundContent>
            <Spin size="small" />
          </template>
        </Select>
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
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { Button, Form, FormItem, Select, Spin } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  // import { success, failed } from '/@/hooks/web/useList';
  import { getUsersBySale } from '/@/api/sys/user/user';
  import { transfer } from '/@/api/marketing/clue/clue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { debounce } from 'lodash-es';
  import { success } from '/@/hooks/web/useList';

  interface Option {
    value: string;
    label: string;
  }
  export default defineComponent({
    name: 'TransferForm',
    components: {
      Button,
      Form,
      FormItem,
      Loading,
      Select,
      Spin,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('clue');
      const { createErrorModal } = useMessage();

      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //分配人
      let updating = ref<boolean>(false);
      const sales = ref<Option[]>([]);
      const updateBySearch = debounce(async (value) => {
        if (value) {
          updating.value = true;
          const { content } = await getUsersBySale(value);
          if (content && content.length > 0) {
            content.forEach((item) => {
              sales.value?.push({ value: item.id || '', label: item.realName || '' });
            });
          }
          updating.value = false;
        }
      }, 500);

      const updateByChange = (value) => {
        formState.userId = value;
      };

      // fromRef 获取form
      const formRef = ref();
      const formState = reactive({
        userId: '',
      });

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            try {
              await transfer(props.id, formState.userId);
              success(t('marketing.action.transfer'), t('marketing.action.success'));
            } catch (error: any) {
              createErrorModal({
                title: t('sys.api.errorTip'),
                content: error?.response?.data?.message || t('sys.api.networkExceptionMsg'),
                getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
              });
            }
          })
          .catch((error: any) => {
            console.log('error', error);
          });
      };

      //重置
      const resetForm = async () => {
        formRef.value.resetFields();
      };

      //初始加载
      onMounted(async () => {
        loading.value = true;
        loading.value = false;
      });

      return {
        t,
        prefixCls,
        loading,
        tip,
        formRef,
        formState,
        onSubmit,
        resetForm,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        props,
        sales,
        updateBySearch,
        updateByChange,
        updating,
      };
    },
  });
</script>
