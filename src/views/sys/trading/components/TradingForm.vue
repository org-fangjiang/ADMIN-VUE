<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="tradingConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="name" :label="t('model.trading.name')" name="name">
        <div class="flex flex-row w-full h-full">
          <Input
            :disabled="isUpdate && !tradingConst._UPDATE_FIELDS.includes('name')"
            v-model:value="formState.name"
            autoComplete="off"
          />
          <div style="padding-top: 6px; padding-left: 8px" @click="searchPOI">
            <Icon icon="fa-solid:location-arrow" />
          </div>
        </div>
      </FormItem>
      <FormItem ref="description" :label="t('model.trading.description')" name="description">
        <div class="flex flex-row w-full h-full">
          <Input
            :disabled="isUpdate && !tradingConst._UPDATE_FIELDS.includes('description')"
            v-model:value="formState.description"
            autoComplete="off"
          />
        </div>
      </FormItem>
      <FormItem ref="areaId" :label="t('model.trading.areaId')" name="areaId">
        <Select
          v-model:value="formState.areaId"
          :options="options"
          @change="change"
          change-on-select
          :disabled="isUpdate && !tradingConst._UPDATE_FIELDS.includes('areaId')"
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
  // 用户store
  import { useUserStore } from '/@/store/modules/user';
  import { Button, Form, FormItem, Input, Modal, Select } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { _TradingConst } from '/@/api/sys/trading/model/tradingModel';
  import { Icon } from '/@/components/Icon';
  import { MapSearchPOI } from '/@/components/FMap';
  import {
    addTradingArea,
    getTradingAreaById,
    updateTradingArea,
  } from '/@/api/sys/trading/trading';
  import { getAreas } from '/@/api/sys/area/area';
  import { success, failed } from '/@/hooks/web/useList';

  interface Option {
    label: string;
    value: string;
  }
  export default defineComponent({
    name: 'TradingForm',
    components: {
      Button,
      Form,
      FormItem,
      Input,
      Loading,
      Icon,
      Modal,
      MapSearchPOI,
      Select,
    },
    props: {
      id: {
        type: String,
        require: true,
      },
      provinceId: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      // 获取用户store
      const userStore = useUserStore();
      const { prefixCls } = useDesign('trading');
      const tradingConst = ref(_TradingConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      //判断更新还是新增
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      const options = ref<Option[]>([]);

      const cityId = ref<string>(userStore.getUserInfo.companyCityId || '');
      // fromRef 获取form
      const formRef = ref();
      const formState = reactive({
        id: props.id || '',
        name: '',
        cityId: cityId,
        state: _TradingConst.EFFECTIVE,
        description: '',
        longitude: '',
        latitude: '',
        radius: '',
        provinceId: props.provinceId || '',
        areaId: '',
      });
      //选择地区
      const change = async (e) => {
        formState.areaId = e.value || '';
      };
      //确认
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            if (props.id) {
              try {
                const { content } = await updateTradingArea(formState);
                success(t('model.trading.tradingInfo'), t('model.trading.success'));
                Object.assign(formState, content);
              } catch (error: any) {
                failed(t('model.trading.tradingInfo'), t('model.trading.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              try {
                const { content } = await addTradingArea(formState);
                success(t('model.trading.tradingInfo'), t('model.trading.success'));
                Object.assign(formState, content);
              } catch (error: any) {
                failed(t('model.trading.tradingInfo'), t('model.trading.fail'));
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
      //加载
      onMounted(async () => {
        loading.value = true;
        if (props.id) {
          const { content } = await getTradingAreaById(props.id);
          if (content) {
            Object.assign(formState, content);
          }
        }
        const result = await getAreas({ id: cityId.value });
        result.content.forEach((item) => {
          options.value.push({ value: item.id || '', label: item.name || '' });
        });
        loading.value = false;
      });

      // 是否打开，model
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
        console.log(result.value);
        debugger;
        // formState.id = '';
        formState.name = result.value.name;
        formState.longitude = result.value.location.lng;
        formState.latitude = result.value.location.lat;
        formState.areaId = result.value.adcode;
      };

      return {
        t,
        prefixCls,
        tradingConst,
        loading,
        tip,
        options,
        change,
        formRef,
        formState,
        onSubmit,
        resetForm,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        cityId,
        isUpdate,
        visible,
        handleOk,
        searchText,
        searchPOI,
        poiChange,
      };
    },
  });
</script>
