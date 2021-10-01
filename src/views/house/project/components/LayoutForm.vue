<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="layoutConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="room" :label="t('host.layout.room')" name="room">
        <Input
          :disabled="isUpdate && !layoutConst.UPDATE_FIELDS.includes('room')"
          v-model:value="formState.room"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="hall" :label="t('host.layout.hall')" name="hall">
        <Input
          :disabled="isUpdate && !layoutConst.UPDATE_FIELDS.includes('hall')"
          v-model:value="formState.hall"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="toilet" :label="t('host.layout.toilet')" name="toilet">
        <Input
          :disabled="isUpdate && !layoutConst.UPDATE_FIELDS.includes('toilet')"
          v-model:value="formState.toilet"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="area" :label="t('host.layout.area')" name="area">
        <Input
          :disabled="isUpdate && !layoutConst.UPDATE_FIELDS.includes('area')"
          v-model:value="formState.area"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="saleState" :label="t('host.layout.saleState')" name="saleState">
        <Select
          :disabled="isUpdate && !layoutConst.UPDATE_FIELDS.includes('saleState')"
          ref="select"
          :allowClear="true"
          v-model:value="formState.saleState"
          style="width: 120px"
          @change="saleStateChange"
          :options="layoutConst.SALE_STATES"
          :pagination="false"
        />
      </FormItem>
      <FormItem ref="labels" :label="t('host.layout.labels')" name="labels">
        <FGroup @change="changeLabels" :detialsId="formState.sysDictDetailBeans" />
      </FormItem>
      <FormItem ref="face" :label="t('host.layout.face')" name="face">
        <Select
          :disabled="isUpdate && !layoutConst.UPDATE_FIELDS.includes('face')"
          ref="select"
          :allowClear="true"
          v-model:value="formState.face"
          style="width: 120px"
          @change="faceChange"
          :options="layoutConst.FACES"
          :pagination="false"
        />
      </FormItem>
      <FormItem ref="description" :label="t('host.layout.description')" name="description">
        <Textarea
          :disabled="isUpdate && !layoutConst.UPDATE_FIELDS.includes('description')"
          v-model:value="formState.description"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="resourceId" :label="t('host.action.setResource')" name="resourceId">
        <Image v-if="type !== '6' && type !== '7'" :src="address" width="100px" />
        <div v-else>{{ address }}</div>
        <Button @click="changeModal">{{ t('host.action.setResource') }}</Button>
      </FormItem>
      <FormItem :wrapper-col="{ span: 14, offset: 4 }">
        <Button type="primary" @click="onSubmit">{{ t('component.modal.okText') }}</Button>
        <Button style="margin-left: 10px" @click="resetForm">{{
          t('component.cropper.btn_reset')
        }}</Button>
      </FormItem>
    </Form>
    <Modal
      :visible="isModal"
      title=""
      @cancel="onClose"
      width="100%"
      wrapClassName="full-modal"
      :footer="null"
      :destroyOnClose="true"
    >
      <FSource
        v-if="isModal"
        :projectId="props.projectId"
        :checkedKeys="formState.resourceId"
        @setSource="setSource"
      />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Button, Form, FormItem, Input, Select, Textarea, Modal, Image } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { LayoutModel, _LayoutConst } from '/@/api/host/layout/model/layoutModel';
  import { updateLayout, addLayout, getLayout } from '/@/api/host/layout/layout';
  import FSource from '/@/components/FSource';
  import { FGroup } from '/@/components/FGroup';
  export default defineComponent({
    name: 'LayoutForm',
    components: {
      Button,
      Form,
      FormItem,
      Input,
      Loading,
      Select,
      FSource,
      Textarea,
      FGroup,
      Modal,
      Image,
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
      const layoutConst = ref(_LayoutConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      let isModal = ref<boolean>(false);
      const changeModal = () => {
        isModal.value = true;
      };
      const onClose = () => {
        isModal.value = false;
      };

      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<LayoutModel> = reactive({
        projectId: props.projectId || '',
      });

      const changeLabels = async (e) => {
        if (e && e.length > 0) {
          formState.labels = '';
          e.forEach((item) => {
            formState.labels = item.key + ',' + formState.labels;
          });
        }
      };

      const saleStateChange = async (value) => {
        formState.saleState = value;
      };

      const faceChange = async (value) => {
        formState.face = value;
      };

      let address = ref<string>();
      let type = ref<string>();

      const setSource = async (value) => {
        loading.value = true;
        try {
          formState.resourceId = value.id;
          debugger;
          address.value = value.address;
          type.value = value.type;
          success(t('host.layout.setSource'), t('host.action.success'));
        } catch (error) {
          failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
        isModal.value = false;
      };

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            if (props.id) {
              loading.value = true;
              try {
                const { content } = await updateLayout(formState);
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
                const { content } = await addLayout(formState);
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
          const { content } = await getLayout(props.id);
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
        layoutConst,
        loading,
        tip,
        changeLabels,
        saleStateChange,
        faceChange,
        setSource,
        formRef,
        formState,
        onSubmit,
        resetForm,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        isUpdate,
        props,
        changeModal,
        isModal,
        onClose,
        address,
        type,
      };
    },
  });
</script>
