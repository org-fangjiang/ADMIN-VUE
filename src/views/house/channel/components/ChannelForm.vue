<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="channelConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="name" :label="t('host.channel.name')" name="name">
        <Input
          :disabled="isUpdate && !channelConst._UPDATE_FIELDS.includes('name')"
          v-model:value="formState.name"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="username" :label="t('host.channel.username')" name="username">
        <Input
          :disabled="isUpdate && !channelConst._UPDATE_FIELDS.includes('username')"
          v-model:value="formState.username"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="contact" :label="t('host.channel.contact')" name="contact">
        <Input
          :disabled="isUpdate && !channelConst._UPDATE_FIELDS.includes('contact')"
          v-model:value="formState.contact"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="description" :label="t('host.channel.description')" name="description">
        <Textarea
          :disabled="isUpdate && !channelConst._UPDATE_FIELDS.includes('description')"
          v-model:value="formState.description"
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
  import { Button, Form, FormItem, Input, Textarea } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { success, failed } from '/@/hooks/web/useList';
  import { ChannelModel, _ChannelConst } from '/@/api/host/channel/model/channelModel';
  import { addChannel, getChannel, updateChannel } from '/@/api/host/channel/channel';

  export default defineComponent({
    name: 'ChannelForm',
    components: {
      Button,
      Form,
      FormItem,
      Input,
      Loading,
      Textarea,
    },
    props: {
      id: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('channel');
      const channelConst = ref(_ChannelConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //判断更新还是新增
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<ChannelModel> = reactive({});

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            if (props.id) {
              loading.value = true;
              try {
                await updateChannel(formState);
                success(t('host.action.update'), t('host.action.success'));
              } catch (error: any) {
                failed(error?.response?.data?.message, t('host.action.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              loading.value = true;
              try {
                const { content } = await addChannel(formState);
                success(t('host.action.add'), t('host.action.success'));
                Object.assign(formState, content);
              } catch (error: any) {
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

      //重置
      const resetForm = async () => {
        loading.value = true;
        try {
          if (props.id) {
            const { content } = await getChannel(props.id);
            Object.assign(formState, content);
          } else {
            formRef.value.resetFields();
          }
        } catch (error) {
        } finally {
          loading.value = false;
        }
      };

      //初始加载
      onMounted(async () => {
        loading.value = true;
        if (props.id) {
          const { content } = await getChannel(props.id);
          Object.assign(formState, content);
        }
        loading.value = false;
      });

      return {
        t,
        prefixCls,
        channelConst,
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
