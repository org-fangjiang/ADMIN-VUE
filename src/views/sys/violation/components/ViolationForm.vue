<template>
  <div>
    <Form
      ref="formRef"
      :model="formState"
      :rules="violationConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="title" :label="t('model.violation.value')" name="title">
        <Select
          :allowClear="true"
          v-model:value="tags"
          mode="tags"
          style="width: 100%"
          :token-separators="[',']"
          @change="handleChange"
          :defaultOpen="false"
          :open="false"
        />
      </FormItem>
      <FormItem ref="state" :label="t('model.violation.state')" name="state">
        <Select
          :disabled="!isUpdate || (isUpdate && !updateFields.includes('state'))"
          ref="select"
          v-model:value="formState.state"
          style="width: 120px"
          :options="violationConst.STATES"
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
  import { Select, Button, Form, FormItem } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { success, failed } from '/@/hooks/web/useList';
  import { ViolationModel, _Const } from '/@/api/sys/violation/model/violationModel';
  import { add, update, addAll, getOne } from '/@/api/sys/violation/violation';

  export default defineComponent({
    name: 'ViolationForm',
    components: {
      Select,
      Button,
      Form,
      FormItem,
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
      const violationConst = ref(_Const);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      //判断是不是更新
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      //添加时状态初始为有效，不可改
      let state;
      if (!isUpdate.value) {
        state = _Const.EFFECTIVE;
      }

      //添加多个违规词
      const tags = ref<String[]>([]);
      const handleChange = async (value) => {
        tags.value = value;
      };

      const formRef = ref();
      const formState: UnwrapRef<ViolationModel> = reactive({
        state: state,
      });

      //提交
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            if (props.id) {
              try {
                formState.value = tags.value[0] as string;
                await update(formState);
                success(t('model.violation.update'), t('model.violation.success'));
              } catch (error: any) {
                failed(error?.response?.data?.message, t('model.violation.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              //添加单个
              if (tags.value && tags.value.length === 1) {
                if (!tags.value[0]) {
                  return;
                }
                formState.value = tags.value[0] as string;
                try {
                  await add(formState);
                  success(t('model.violation.add'), t('model.violation.success'));
                } catch (error: any) {
                  failed(error?.response?.data?.message, t('model.violation.fail'));
                } finally {
                  loading.value = false;
                }
              } else if (tags.value.length > 1) {
                //添加多个
                try {
                  const violations: ViolationModel[] = [];
                  tags.value.forEach((item: string) => {
                    violations.push({ value: item || '', state: '1' });
                  });
                  await addAll(violations);
                  success(t('model.violation.add'), t('model.violation.success'));
                } catch (error: any) {
                  failed(error?.response?.data?.message, t('model.violation.fail'));
                } finally {
                  loading.value = false;
                }
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
        if (props.id) {
          const { content } = await getOne(props.id);
          if (content) {
            Object.assign(formState, content);
            tags.value.push(content.value || '');
          }
        }
        loading.value = false;
      });

      return {
        t,
        violationConst,
        tip,
        props,
        isUpdate,
        tags,
        handleChange,
        updateFields: _Const._UPDATE_FIELDS,
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
