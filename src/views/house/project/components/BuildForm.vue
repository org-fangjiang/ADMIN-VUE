// 添加更改楼栋信息
<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="buildConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="number" :label="t('host.build.number')" name="number">
        <Input
          :disabled="isUpdate && !buildConst._UPDATE_FIELDS.includes('number')"
          v-model:value="formState.number"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="floors" :label="t('host.build.floors')" name="floors">
        <Input
          :disabled="isUpdate && !buildConst._UPDATE_FIELDS.includes('floors')"
          v-model:value="formState.floors"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="price" :label="t('host.build.price')" name="price">
        <Input
          :disabled="isUpdate && !buildConst._UPDATE_FIELDS.includes('price')"
          v-model:value="formState.price"
          autoComplete="off"
        />
      </FormItem>
      <FormItem
        ref="priceDescription"
        :label="t('host.build.priceDescription')"
        name="priceDescription"
      >
        <Textarea
          :disabled="isUpdate && !buildConst._UPDATE_FIELDS.includes('priceDescription')"
          v-model:value="formState.priceDescription"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="description" :label="t('host.build.description')" name="description">
        <Textarea
          :disabled="isUpdate && !buildConst._UPDATE_FIELDS.includes('description')"
          v-model:value="formState.description"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="saleState" :label="t('host.build.saleState')" name="saleState">
        <Select
          :disabled="isUpdate && !buildConst._UPDATE_FIELDS.includes('saleState')"
          ref="select"
          :allowClear="true"
          v-model:value="formState.saleState"
          style="width: 120px"
          @change="saleStateChange"
          :options="buildConst.SALE_STATES"
          :pagination="false"
        />
      </FormItem>
      <FormItem ref="licenseId" :label="t('host.build.licenseId')" name="licenseId">
        <Image v-if="type !== '6' && type !== '7'" :src="address" width="100px" />
        <div v-else>{{ address }}</div>
        <Button @click="changeModal">{{ t('host.action.setResource') }}</Button>
      </FormItem>
      <FormItem ref="locationX" :label="t('host.build.locationX')" name="locationX">
        <Input
          :disabled="isUpdate && !buildConst._UPDATE_FIELDS.includes('locationX')"
          v-model:value="formState.locationX"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="locationY" :label="t('host.build.locationY')" name="locationY">
        <Input
          :disabled="isUpdate && !buildConst._UPDATE_FIELDS.includes('locationY')"
          v-model:value="formState.locationY"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="remark" :label="t('host.build.remark')" name="remark">
        <Select
          :disabled="isUpdate && !buildConst._UPDATE_FIELDS.includes('remark')"
          ref="select"
          :allowClear="true"
          v-model:value="formState.remark"
          style="width: 120px"
          @change="remarkChange"
          :options="buildConst.REMARK_STATES"
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
        :checkedKeys="formState.licenseId"
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
  import { Button, Form, FormItem, Input, Select, Textarea, Image, Modal } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { BuildModel, _BuildConst } from '/@/api/host/build/model/buildModel';
  import { addBuild, updateBuild, getBuild } from '/@/api/host/build/build';
  import FSource from '/@/components/FSource';
  export default defineComponent({
    name: 'BuildForm',
    components: {
      Button,
      Form,
      FormItem,
      Input,
      Loading,
      Select,
      Textarea,
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
      const buildConst = ref(_BuildConst);
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
      const formState: UnwrapRef<BuildModel> = reactive({
        projectId: props.projectId || '',
      });

      const remarkChange = async (value) => {
        formState.remark = value;
      };

      const saleStateChange = async (value) => {
        formState.saleState = value;
      };

      let address = ref<string>();
      let type = ref<string>();

      const setSource = async (value) => {
        loading.value = true;
        try {
          formState.licenseId = value.id;
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
                const { content } = await updateBuild(formState);
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
                const { content } = await addBuild(formState);
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
          const { content } = await getBuild(props.id);
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
        buildConst,
        loading,
        tip,
        formRef,
        formState,
        remarkChange,
        saleStateChange,
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
      };
    },
  });
</script>
