<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="metroConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="name" :label="t('model.metroLine.name')" name="name">
        <Input
          :disabled="isUpdate && !metroConst._UPDATE_FIELDS.includes('name')"
          v-model:value="formState.name"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="startStation" :label="t('model.metroLine.startStation')" name="startStation">
        <div class="flex flex-row w-full h-full">
          <Input
            :disabled="isUpdate && !metroConst._UPDATE_FIELDS.includes('startStation')"
            v-model:value="formState.startStation.name"
            autoComplete="off"
          />
          <div style="padding-top: 6px; padding-left: 8px" @click="searchPOI('1')">
            <Icon icon="fa-solid:location-arrow" />
          </div>
        </div>
      </FormItem>
      <FormItem ref="endStation" :label="t('model.metroLine.endStation')" name="endStation">
        <div class="flex flex-row w-full h-full">
          <Input
            :disabled="isUpdate && !metroConst._UPDATE_FIELDS.includes('endStation')"
            v-model:value="formState.endStation.name"
            autoComplete="off"
          />
          <div style="padding-top: 6px; padding-left: 8px" @click="searchPOI('2')">
            <Icon icon="fa-solid:location-arrow" />
          </div>
        </div>
      </FormItem>
      <FormItem :wrapper-col="{ span: 14, offset: 4 }">
        <Button v-if="!isUpdate" type="primary" @click="onSubmit">{{
          t('component.modal.okText')
        }}</Button>
        <Button v-else type="primary" @click="onSubmit">{{ t('model.company.save') }}</Button>
        <Button style="margin-left: 10px" @click="resetForm">{{
          t('component.cropper.btn_reset')
        }}</Button>
      </FormItem>
    </Form>
    <Modal
      v-model:visible="visible"
      title=""
      @ok="handleOk"
      width="100%"
      wrapClassName="full-modal"
    >
      <MapSearchPOI
        :searchText="searchText"
        :type="'150500'"
        :cityId="cityId"
        :citylimit="cityId !== ''"
        @change="poiChange"
      />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { _MetroLineConst } from '/@/api/sys/metro/model/metroModel';
  import { getLine, addLine, updateLine } from '/@/api/sys/metro/metro';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 用户store
  import { useUserStore } from '/@/store/modules/user';
  import { Button, Form, FormItem, Input, Modal } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { MapSearchPOI } from '/@/components/FMap';
  import { Icon } from '/@/components/Icon';

  export default defineComponent({
    name: 'MetroLineForm',
    components: {
      Button,
      Form,
      FormItem,
      Input,
      Loading,
      MapSearchPOI,
      Modal,
      Icon,
    },
    props: {
      id: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      // 获取用户store
      const userStore = useUserStore();
      const { prefixCls } = useDesign('metro');
      const metroConst = ref(_MetroLineConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      const cityId = ref<string>(userStore.getUserInfo.companyCityId || '');
      // fromRef 获取form
      const formRef = ref();
      const formState = reactive({
        id: props.id || '',
        name: '',
        cityId: cityId,
        startStation: {
          name: '',
          longitude: '',
          latitude: '',
          cityId: cityId,
          state: _MetroLineConst.EFFECTIVE,
        },
        endStation: {
          name: '',
          longitude: '',
          latitude: '',
          cityId: cityId,
          state: _MetroLineConst.EFFECTIVE,
        },
        state: _MetroLineConst.EFFECTIVE,
        stations: [],
      });

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            if (props.id) {
              try {
                const { content } = await updateLine(formState);
                success(t('model.link.updateLink'), t('model.link.success'));
                Object.assign(formState, content);
              } catch (error) {
                failed(error?.response?.data?.message, t('model.link.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              try {
                const { content } = await addLine(formState);
                success(t('model.link.addLink'), t('model.link.success'));
                Object.assign(formState, content);
              } catch (error) {
                failed(error?.response?.data?.message, t('model.link.fail'));
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
          if (props.id) {
            const { content } = await getLine(props.id);
            if (content) {
              Object.assign(formState, content);
            }
          } else {
            formRef.value.resetFields();
          }
        } catch (error) {
        } finally {
          loading.value = false;
        }
      };
      onMounted(async () => {
        loading.value = true;
        if (props.id) {
          const { content } = await getLine(props.id);
          if (content) {
            Object.assign(formState, content);
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
          getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
      };

      // 是否打开，model
      const startOrEnd = ref('');
      const visible = ref<boolean>(false);
      const handleOk = (e: MouseEvent) => {
        console.log(e);
        visible.value = false;
      };
      // Poi 搜索内容
      const searchText = ref<string>('');
      const searchPOI = (flag) => {
        if (flag === '1') {
          startOrEnd.value = '1';
          searchText.value = formState.startStation.name;
        } else {
          startOrEnd.value = '2';
          searchText.value = formState.endStation?.name;
        }
        visible.value = true;
      };
      // poi change
      const poiChange = (result) => {
        if (result === '') {
          if (startOrEnd.value === '1') {
            formState.startStation.name = '';
            formState.startStation.longitude = '';
            formState.startStation.latitude = '';
          } else {
            formState.endStation.name = '';
            formState.endStation.longitude = '';
            formState.endStation.latitude = '';
          }
          return;
        }
        if (startOrEnd.value === '1') {
          formState.startStation.name = result.value.name;
          formState.startStation.longitude = result.value.location.lng;
          formState.startStation.latitude = result.value.location.lat;
        } else {
          formState.endStation.name = result.value.name;
          formState.endStation.longitude = result.value.location.lng;
          formState.endStation.latitude = result.value.location.lat;
        }
      };

      return {
        t,
        prefixCls,
        metroConst,
        loading,
        tip,
        isUpdate,
        formRef,
        formState,
        onSubmit,
        resetForm,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        cityId,
        visible,
        handleOk,
        searchText,
        searchPOI,
        poiChange,
      };
    },
  });
</script>
