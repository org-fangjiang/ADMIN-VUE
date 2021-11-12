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
        <InputNumber
          :disabled="isUpdate && !layoutConst._UPDATE_FIELDS.includes('room')"
          v-model:value="formState.room"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="hall" :label="t('host.layout.hall')" name="hall">
        <InputNumber
          :disabled="isUpdate && !layoutConst._UPDATE_FIELDS.includes('hall')"
          v-model:value="formState.hall"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="toilet" :label="t('host.layout.toilet')" name="toilet">
        <InputNumber
          :disabled="isUpdate && !layoutConst._UPDATE_FIELDS.includes('toilet')"
          v-model:value="formState.toilet"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="area" :label="t('host.layout.area')" name="area">
        <InputNumber
          :disabled="isUpdate && !layoutConst._UPDATE_FIELDS.includes('area')"
          v-model:value="formState.area"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="saleState" :label="t('host.layout.saleState')" name="saleState">
        <Select
          :disabled="isUpdate && !layoutConst._UPDATE_FIELDS.includes('saleState')"
          ref="select"
          :allowClear="true"
          v-model:value="formState.saleState"
          @change="saleStateChange"
          :options="layoutConst.SALE_STATES"
          :pagination="false"
        />
      </FormItem>
      <FormItem ref="labels" :label="t('host.layout.labels')" name="labels">
        <FGroup
          @change="changeLabels"
          :detialsId="formState.sysDictDetailBeans"
          :selectedLabel="selectLabel"
        />
      </FormItem>
      <FormItem ref="face" :label="t('host.layout.face')" name="face">
        <Select
          :disabled="isUpdate && !layoutConst._UPDATE_FIELDS.includes('face')"
          ref="select"
          :allowClear="true"
          v-model:value="formState.face"
          @change="faceChange"
          :options="layoutConst.FACES"
          :pagination="false"
        />
      </FormItem>
      <FormItem ref="description" :label="t('host.layout.description')" name="description">
        <Textarea
          :disabled="isUpdate && !layoutConst._UPDATE_FIELDS.includes('description')"
          v-model:value="formState.description"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="resourceId" :label="t('host.action.setResource')" name="resourceId">
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
  import {
    Button,
    Form,
    FormItem,
    InputNumber,
    Select,
    Textarea,
    Modal,
    Image,
  } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { LayoutModel, _LayoutConst } from '/@/api/host/layout/model/layoutModel';
  import { updateLayout, addLayout, getLayout } from '/@/api/host/layout/layout';
  import FSource from '/@/components/FSource';
  import { FGroup } from '/@/components/FGroup';
  import { success, failed } from '/@/hooks/web/useList';
  export default defineComponent({
    name: 'LayoutForm',
    components: {
      Button,
      Form,
      FormItem,
      InputNumber,
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
      const { prefixCls } = useDesign('project');
      const layoutConst = ref(_LayoutConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //控制modal是否打开
      let isModal = ref<boolean>(false);
      const changeModal = () => {
        isModal.value = true;
      };
      const onClose = () => {
        isModal.value = false;
      };

      //判断是更新还是新增
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<LayoutModel> = reactive({
        projectId: props.projectId || '',
      });
      //标签修改
      const changeLabels = async (e) => {
        if (e && e.length > 0) {
          formState.labels = '';
          e.forEach((item) => {
            formState.labels = item.key + ',' + formState.labels;
            if (!formState.sysDictDetailBeans) {
              formState.sysDictDetailBeans = [];
            }
            formState.sysDictDetailBeans.push({
              id: item.key,
              value: item.key,
              groupId: item.label,
            });
          });
          formState.labels = formState.labels.substring(0, formState.labels.length - 1);
        }
        console.log(formState.labels);
      };
      //销售状态修改
      const saleStateChange = async (value) => {
        formState.saleState = value;
      };
      //朝向修改
      const faceChange = async (value) => {
        formState.face = value;
      };

      let address = ref<string>();
      let type = ref<string>();
      //设置资源
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

      //提交
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
              } catch (error: any) {
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
          formRef.value.resetFields();
        } catch (error) {
        } finally {
          loading.value = false;
        }
      };

      let updateAddress = ref<string>('');
      let selectLabel = ref<String[]>([]);

      //初始加载
      onMounted(async () => {
        loading.value = true;
        if (props.id) {
          const { content } = await getLayout(props.id);
          Object.assign(formState, content);
          if (formState.labels) {
            if (formState.labels.length > 0) {
              selectLabel.value = formState.labels.split(',');
            }
          }
          if (content.hResourceByResourceId) {
            if (
              content.hResourceByResourceId.sort !== '6' &&
              content.hResourceByResourceId.sort !== '7'
            ) {
              updateAddress.value = content.hResourceByResourceId.address || '';
            }
          }
        }
        loading.value = false;
      });

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
        selectLabel,
        updateAddress,
      };
    },
  });
</script>
