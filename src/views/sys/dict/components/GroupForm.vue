<template>
  <div>
    <Form
      ref="formRef"
      :model="formState"
      :rules="dictConst._GROUP_RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="name" :label="t('model.dict.group.name')" name="name">
        <Input
          :disabled="isUpdate && !updateFields.includes('name')"
          v-model:value="formState.name"
          autoComplete="off"
        />
      </FormItem>

      <FormItem ref="state" :label="t('model.dict.group.state')" name="state">
        <Select
          :disabled="!isUpdate || (isUpdate && !updateFields.includes('state'))"
          ref="select"
          v-model:value="formState.state"
          style="width: 120px"
          :options="dictConst.STATES"
        />
      </FormItem>
      <FormItem :wrapper-col="{ span: 14, offset: 4 }">
        <Button v-if="props.id" type="primary" @click="onSubmit">{{
          t('model.dict.group.updateGroup')
        }}</Button>
        <Button v-else type="primary" @click="onSubmit">{{
          t('model.dict.group.addGroup')
        }}</Button>
        <Button style="margin-left: 10px" @click="resetForm">{{
          t('model.dict.group.cancel')
        }}</Button>
      </FormItem>
    </Form>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { addSysDictGroup, UpdateSysDictGroup, GetSysDictGroup } from '/@/api/sys/dict/dict';
  import { DictConst, DictGroupModel } from '/@/api/sys/dict/model/dictModel';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Select, Button, Form, FormItem, Input } from 'ant-design-vue';
  import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';
  import { Loading } from '/@/components/Loading';
  import { success, failed } from '/@/hooks/web/useList';

  export default defineComponent({
    name: 'GroupForm',
    components: {
      Select,
      Button,
      Form,
      FormItem,
      Input,
      Loading,
    },
    props: {
      id: {
        type: String,
        require: false,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('dict');
      const dictConst = ref(DictConst);
      //判断是否为更新
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }
      //加载动画
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      //状态初始为有效
      let state;
      if (!isUpdate.value) {
        state = DictConst.EFFECTIVE;
      }
      const formRef = ref();
      const formState: UnwrapRef<DictGroupModel> = reactive({
        id: '',
        name: '',
        state,
        sysDictDetails: [],
      });
      //提交
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            if (!props.id) {
              try {
                const { content } = await addSysDictGroup(formState); //返回的是一个content
                success(t('model.dict.group.addGroup'), t('model.dict.group.success'));
                Object.assign(formState, content);
              } catch (error: any) {
                failed(error?.response?.data?.message, t('model.dict.group.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              try {
                const { content } = await UpdateSysDictGroup(formState);
                success(t('model.dict.group.updateGroup'), t('model.dict.group.success'));
                Object.assign(formState, content);
              } catch (error: any) {
                failed(error?.response?.data?.message, t('model.dict.group.fail'));
              } finally {
                loading.value = false;
              }
            }
          })
          .catch((error: ValidateErrorEntity<DictGroupModel>) => {
            console.log('error', error);
          });
      };
      //重置
      const resetForm = async () => {
        if (props.id) {
          loading.value = true;
          try {
            const { content } = await GetSysDictGroup({ id: props.id });
            Object.assign(formState, content);
          } catch (error) {
          } finally {
            loading.value = false;
          }
        } else {
          formRef.value.resetFields();
        }
        loading.value = false;
      };
      //初始加载
      onMounted(async () => {
        //更新
        if (props.id) {
          loading.value = true;
          const { content } = await GetSysDictGroup({ id: props.id });
          if (content) {
            //把数据赋值到页面中
            Object.assign(formState, content);
          }
          loading.value = false;
        }
        loading.value = false;
      });

      return {
        t,
        props,
        isUpdate,
        prefixCls,
        dictConst,
        formRef,
        tip,
        loading,
        updateFields: DictConst._UPDATE_GROUP_FIELDS,
        onSubmit,
        resetForm,
        formState,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
      };
    },
  });
</script>
