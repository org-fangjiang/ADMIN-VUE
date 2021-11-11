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
        <div class="flex flex-row w-full h-full">
          <Input
            :disabled="isUpdate && !metroConst._UPDATE_FIELDS.includes('name')"
            v-model:value="formState.name"
            autoComplete="off"
          />
          <div style="padding-top: 6px; padding-left: 8px" @click="searchPOI">
            <Icon icon="fa-solid:location-arrow" />
          </div>
        </div>
      </FormItem>
      <FormItem :wrapper-col="{ span: 14, offset: 4 }">
        <Button v-if="!isUpdate" type="primary" @click="onSubmit">{{
          t('component.modal.okText')
        }}</Button>
        <Button v-else type="primary" @click="onSubmit">{{ t('component.action.save') }}</Button>
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
  import { _MetroStationConst } from '/@/api/sys/metro/model/metroModel';
  import { updateStation, getStation, addStation } from '/@/api/sys/metro/metro';
  // 用户store
  import { useUserStore } from '/@/store/modules/user';
  import { Button, Form, FormItem, Input, Modal } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { MapSearchPOI } from '/@/components/FMap';
  import { Icon } from '/@/components/Icon';
  import { success, failed } from '/@/hooks/web/useList';

  export default defineComponent({
    name: 'StationForm',
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
      // 获取用户store
      const userStore = useUserStore();
      const { prefixCls } = useDesign('station');
      const metroConst = ref(_MetroStationConst);
      //加载动画
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      //判断是否为更新
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }
      //获取城市id
      const cityId = ref<string>(userStore.getUserInfo.companyCityId || '');
      // fromRef 获取form
      const formRef = ref();
      const formState = reactive({
        id: props.id || '',
        name: '',
        cityId: cityId,
        state: _MetroStationConst.EFFECTIVE,
        longitude: '',
        latitude: '',
      });

      //提交
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            if (props.id) {
              try {
                const { content } = await updateStation(formState);
                success(
                  t('model.metroStation.result.update'),
                  t('model.metroStation.result.update')
                );
                Object.assign(formState, content);
              } catch (error: any) {
                failed(error?.response?.data?.message, t('model.metroStation.result.failed'));
              } finally {
                loading.value = false;
              }
            } else {
              try {
                const { content } = await addStation(formState);
                success(
                  t('model.metroStation.result.addStation'),
                  t('model.metroStation.result.addStation')
                );
                Object.assign(formState, content);
              } catch (error: any) {
                failed(error?.response?.data?.message, t('model.metroStation.result.failed'));
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
            //如果是更新，获取原本的数据填入表单
            const { content } = await getStation(props.id);
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

      //初始加载
      onMounted(async () => {
        loading.value = true;
        if (props.id) {
          const { content } = await getStation(props.id);
          if (content) {
            Object.assign(formState, content);
          }
        }
        loading.value = false;
      });

      // 是否打开，model
      // const startOrEnd = ref('');
      const visible = ref<boolean>(false);
      const handleOk = (e: MouseEvent) => {
        console.log(e);
        visible.value = false;
      };
      // Poi 搜索内容
      const searchText = ref<string>('');
      const searchPOI = () => {
        searchText.value = formState.name;
        visible.value = true;
      };
      // poi change
      const poiChange = (result) => {
        if (result === '') {
          formState.id = '';
          formState.name = '';
          formState.longitude = '';
          formState.latitude = '';
          return;
        }
        formState.name = result.value.name;
        formState.longitude = result.value.location.lng;
        formState.latitude = result.value.location.lat;
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
