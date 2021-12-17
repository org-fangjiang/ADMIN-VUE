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
          :disabled="!isUpdate || (isUpdate && !updateFields.includes('state'))"
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
  import { addSysDictDetail, UpdateSysDictDetail, getSysDictDetail } from '/@/api/sys/dict/dict';
  import { DictConst, DictDetailModel } from '/@/api/sys/dict/model/dictModel';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Select, Button, Form, FormItem, Input } from 'ant-design-vue';
  import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';
  import { Loading } from '/@/components/Loading';
  import { success } from '/@/hooks/web/useList';

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
      const dictConst = ref(DictConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //判断更新还是新增
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }
      //新增状态默认为有效
      let state;
      if (!isUpdate.value) {
        state = DictConst.EFFECTIVE;
      }
      //表单数据
      const formRef = ref();
      const formState: UnwrapRef<DictDetailModel> = reactive({
        id: '',
        value: '',
        groupId: props.groupId || '',
        state,
      });
      //提交
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            if (props.id) {
              //更新
              try {
                const { content } = await UpdateSysDictDetail(formState);
                success(t('model.dict.detail.updateDetail'), t('model.dict.detail.success'));
                Object.assign(formState, content);
              } catch (error: any) {
                // failed(error?.response?.data?.message, t('model.dict.detail.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              //新增
              try {
                const { content } = await addSysDictDetail(formState);
                success(t('model.dict.detail.addDetail'), t('model.dict.detail.success'));
                Object.assign(formState, content);
              } catch (error: any) {
                // failed(error?.response?.data?.message, t('model.dict.detail.fail'));
              } finally {
                loading.value = false;
              }
            }
          })
          .catch((error: ValidateErrorEntity<DictDetailModel>) => {
            console.log('error', error);
          });
      };
      //重置
      const resetForm = async () => {
        if (props.id) {
          //更新 ，根据id将数据赋值到表单
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
          //清空重置表单
          formRef.value.resetFields();
        }
        loading.value = false;
      };

      //初始加载
      onMounted(async () => {
        loading.value = true;
        if (props.id) {
          const { content } = await getSysDictDetail({ id: props.id });
          if (content) {
            Object.assign(formState, content);
          }
        }
        loading.value = false;
      });

      return {
        t,
        props,
        isUpdate,
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
