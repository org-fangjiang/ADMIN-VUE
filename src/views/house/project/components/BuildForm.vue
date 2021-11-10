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
        <div else>{{ licenseName }}</div>
        <Button @click="changeModal">{{ t('host.action.setLicense') }}</Button>
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
      :bodyStyle="{
        overflow: 'auto',
        'margin-top': '16px',
        'margin-left': '50px',
        height: '100px',
      }"
      :visible="isModal"
      title="设置预售证"
      @cancel="onClose"
      :footer="null"
      :destroyOnClose="true"
    >
      <FLicense
        v-if="isModal"
        :projectId="props.projectId"
        :licenseId="formState.licenseId || ''"
        :buildId="props.id"
        @setBuildLicense="setBuildLicense"
      />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Button, Form, FormItem, Input, Select, Textarea, Modal } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { BuildModel, _BuildConst } from '/@/api/host/build/model/buildModel';
  import { addBuild, updateBuild, getBuild } from '/@/api/host/build/build';
  import FLicense from '/@/components/Flicense';
  import { success, failed } from '/@/hooks/web/useList';

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
      Modal,
      FLicense,
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
      const { prefixCls } = useDesign('project');
      const buildConst = ref(_BuildConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //判断是更新还是添加
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      //是否打开设置资源的modal
      let isModal = ref<boolean>(false);
      const changeModal = () => {
        isModal.value = true;
      };
      const onClose = () => {
        isModal.value = false;
      };

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<BuildModel> = reactive({
        projectId: props.projectId || '',
      });

      //是否标记图片
      const remarkChange = async (value) => {
        formState.remark = value;
      };

      //销售状态修改
      const saleStateChange = async (value) => {
        formState.saleState = value;
      };

      //设置预售证
      let licenseName = ref('');
      const setBuildLicense = (value) => {
        isModal.value = false;
        formState.licenseId = value.formState.licenseId;
        licenseName.value = value.licenseName.value;
      };

      //提交
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
              } catch (error: any) {
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

      //初始加载
      onMounted(async () => {
        loading.value = true;
        if (props.id) {
          const { content } = await getBuild(props.id);
          Object.assign(formState, content);
        }
        loading.value = false;
      });

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
        changeModal,
        isModal,
        onClose,
        setBuildLicense,
        licenseName,
      };
    },
  });
</script>
