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
      <FormItem ref="number" :label="t('ohouse.build.number')" name="number">
        <Input
          :disabled="(isUpdate && !buildConst._UPDATE_FIELDS.includes('number')) || props.isSee"
          v-model:value="formState.number"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="floors" :label="t('ohouse.build.floors')" name="floors">
        <InputNumber
          :disabled="(isUpdate && !buildConst._UPDATE_FIELDS.includes('floors')) || props.isSee"
          v-model:value="formState.floors"
          autoComplete="off"
          type="number"
        />
      </FormItem>
      <FormItem ref="unitNumber" :label="t('ohouse.build.unitNumber')" name="unitNumber">
        <InputNumber
          :disabled="(isUpdate && !buildConst._UPDATE_FIELDS.includes('unitNumber')) || props.isSee"
          v-model:value="formState.unitNumber"
          autoComplete="off"
          type="number"
        />
      </FormItem>
      <FormItem ref="description" :label="t('ohouse.build.description')" name="description">
        <Textarea
          :disabled="
            (isUpdate && !buildConst._UPDATE_FIELDS.includes('description')) || props.isSee
          "
          v-model:value="formState.description"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="openTime" :label="t('ohouse.build.openTime')" name="openTime">
        <DatePicker
          showTime
          :disabled="(isUpdate && !buildConst._UPDATE_FIELDS.includes('openTime')) || props.isSee"
          format="YYYY-MM-DD HH:mm:ss"
          :value="formState.openTime"
          @change="openTimechange"
        />
      </FormItem>
      <FormItem ref="payTime" :label="t('ohouse.build.payTime')" name="payTime">
        <DatePicker
          showTime
          :disabled="(isUpdate && !buildConst._UPDATE_FIELDS.includes('payTime')) || props.isSee"
          format="YYYY-MM-DD HH:mm:ss"
          :value="formState.payTime"
          @change="payTimechange"
        />
      </FormItem>
      <FormItem ref="locationX" :label="t('ohouse.build.locationX')" name="locationX">
        <Input
          :disabled="(isUpdate && !buildConst._UPDATE_FIELDS.includes('locationX')) || props.isSee"
          v-model:value="formState.locationX"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="locationY" :label="t('ohouse.build.locationY')" name="locationY">
        <Input
          :disabled="(isUpdate && !buildConst._UPDATE_FIELDS.includes('locationY')) || props.isSee"
          v-model:value="formState.locationY"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="remark" :label="t('ohouse.build.remark')" name="remark">
        <Select
          :disabled="(isUpdate && !buildConst._UPDATE_FIELDS.includes('remark')) || props.isSee"
          ref="select"
          :allowClear="true"
          v-model:value="formState.remark"
          style="width: 120px"
          @change="remarkChange"
          :options="buildConst.REMARK_STATES"
          :pagination="false"
        />
      </FormItem>
      <FormItem v-if="!isSee" :wrapper-col="{ span: 14, offset: 4 }">
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
  import { defineComponent, onMounted, reactive, ref, UnwrapRef, watch } from 'vue';
  import {
    Button,
    Form,
    FormItem,
    Input,
    Select,
    Textarea,
    DatePicker,
    InputNumber,
  } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { success, failed } from '/@/hooks/web/useList';
  import { oBuildConst, oBuildModel } from '/@/api/ohouse/obuild/model/oBuildModel';
  import { buildById, addBuild, updateBuild, existBuild } from '/@/api/ohouse/obuild/obuild';

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
      DatePicker,
      InputNumber,
    },
    props: {
      isSee: {
        type: Boolean,
        required: false,
        default: false,
      },
      id: {
        type: String,
        required: false,
      },
      projectId: {
        type: String,
        required: false,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('project');
      const buildConst = ref(oBuildConst);
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
      const formState: UnwrapRef<oBuildModel> = reactive({
        projectId: props.projectId || '',
      });

      //开盘时间
      const openTimechange = (_date: any | string, dateString: string) => {
        formState.openTime = dateString;
      };
      //交房时间
      const payTimechange = (_date: any | string, dateString: string) => {
        formState.payTime = dateString;
      };

      //是否标记图片
      const remarkChange = async (value) => {
        formState.remark = value;
      };

      watch(
        () => formState.number,
        async () => {
          if (formState.number && !isUpdate.value) {
            const result = await existBuild(props.projectId || '', formState.number || '');
            if (result) {
              failed('添加失败', '当前楼栋已存在');
            }
          }
        }
      );

      //提交
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            if (props.id) {
              loading.value = true;
              try {
                await updateBuild(formState);
                success(t('host.action.update'), t('host.action.success'));
              } catch (error: any) {
                failed(t('host.action.update'), t('host.action.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              loading.value = true;
              try {
                await addBuild(formState);
                success(t('host.action.add'), t('host.action.success'));
              } catch (error: any) {
                failed(t('host.action.add'), t('host.action.fail'));
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
            const { content } = await buildById(props.id);
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
          const { content } = await buildById(props.id);
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
        onSubmit,
        resetForm,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        isUpdate,
        props,
        changeModal,
        isModal,
        onClose,
        openTimechange,
        payTimechange,
      };
    },
  });
</script>
