// 添加更改许可证信息
<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="licenseConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="number" :label="t('host.license.number')" name="number">
        <Input
          :disabled="isUpdate && !licenseConst._UPDATE_FIELDS.includes('number')"
          v-model:value="formState.number"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="resourceId" :label="t('host.license.resourceId')" name="resourceId">
        <Image v-if="type !== '6' && type !== '7'" :src="address || updateAddress" width="100px" />
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
      :bodyStyle="{ overflow: 'auto', margin: '16px' }"
      :visible="isModal"
      title="设置资源"
      @cancel="onClose"
      width="70%"
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
  import { Button, Form, FormItem, Input, Image, Modal } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import FSource from '/@/components/FSource';
  import { LicenseModel, _LicenseConst } from '/@/api/host/license/model/licenseModel';
  import { addLicense, getLicense, updateLicense } from '/@/api/host/license/license';
  import { getResource } from '/@/api/host/source/source';
  export default defineComponent({
    name: 'LicenseForm',
    components: {
      Button,
      Form,
      FormItem,
      Input,
      Loading,
      Image,
      Modal,
      FSource,
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
      const licenseConst = ref(_LicenseConst);
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
      const formState: UnwrapRef<LicenseModel> = reactive({
        projectId: props.projectId || '',
      });

      let address = ref<string>();
      let type = ref<string>();

      const setSource = async (value) => {
        loading.value = true;
        try {
          formState.resourceId = value.id;
          address.value = value.address;
          type.value = value.type;
          success(t('host.layout.setSource'), t('host.action.success'));
        } catch (error: any) {
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
                const { content } = await updateLicense(formState);
                success(t('host.action.update'), t('host.action.success'));
                Object.assign(formState, content);
              } catch (error: any) {
                failed(error?.response?.data?.message, t('host.action.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              loading.value = true;
              try {
                const { content } = await addLicense(formState);
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

      const resetForm = async () => {
        loading.value = true;
        try {
          formRef.value.resetFields();
        } catch (error) {
        } finally {
          loading.value = false;
        }
      };

      let updateAddress = ref<string>('');

      onMounted(async () => {
        loading.value = true;
        if (props.id) {
          const { content } = await getLicense(props.id);
          Object.assign(formState, content);
          if (content.resourceId) {
            const result = await getResource(content.resourceId);
            if (result.content.sort !== '6' && result.content.sort !== '7') {
              updateAddress.value = result.content.address || '';
            }
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
          // getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
      };

      return {
        t,
        prefixCls,
        licenseConst,
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
        setSource,
        changeModal,
        isModal,
        onClose,
        address,
        type,
        updateAddress,
      };
    },
  });
</script>
