<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="metroConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="lineName" :label="t('model.metro.lineName')" name="lineName">
        <div class="flex flex-row w-full h-full">
          <Input
            :disabled="!metroConst._UPDATE_FIELDS.includes('lineName')"
            v-model:value="formState.lineName"
            autoComplete="off"
          />
        </div>
      </FormItem>
      <FormItem ref="name" :label="t('model.metro.stationName')" name="name">
        <div class="flex flex-row w-full h-full">
          <Select
            ref="select"
            label-in-value
            v-model:value="formState.name"
            autoComplete="off"
            :options="options"
            :labelInValue="false"
            @change="stationChange"
            :allowClear="true"
            @popupScroll="onScroll"
          />
        </div>
      </FormItem>
      <FormItem ref="orderNum" :label="t('model.metro.orderNum')" name="orderNum">
        <div class="flex flex-row w-full h-full">
          <Input v-model:value="formState.orderNum" autoComplete="off" />
        </div>
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
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { _MetroStationConst } from '/@/api/sys/metro/model/metroModel';
  import { addLineStation, getAllStations, getLine } from '/@/api/sys/metro/metro';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 用户store
  import { useUserStore } from '/@/store/modules/user';
  import { Button, Form, FormItem, Input, Select } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  interface Option {
    label: string;
    value: string;
  }
  export default defineComponent({
    name: 'AddStation',
    components: {
      Button,
      Form,
      FormItem,
      Input,
      Loading,
      Select,
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
      const metroConst = ref(_MetroStationConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      let disable = ref<boolean>(true);

      // 分页
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });
      //站点信息下拉
      const options = ref<Option[]>([]);
      //选择站点
      const stationChange = async (value) => {
        formState.id = value;
      };
      //将站点信息，通过滚动触发加载
      const onScroll = async () => {
        if (pageParam.number <= result.page.totalPages) {
          pageParam.number = pageParam.number + 1;
          result = await getAllStations(
            { cityId: cityId.value },
            { pageSize: pageParam.size, pageNum: pageParam.number }
          );
          result.content.forEach((item) => {
            options.value.push({ value: item.id || '', label: item.name || '' });
          });
        }
      };
      //城市id
      const cityId = ref<string>(userStore.getUserInfo.companyCityId || '');
      // fromRef 获取form
      const formRef = ref();
      const formState = reactive({
        lineId: props.id || '',
        lineName: '',
        id: '',
        name: '',
        cityId: cityId,
        state: _MetroStationConst.EFFECTIVE,
        orderNum: 1,
      });
      //提交
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            try {
              await addLineStation(formState.lineId, formState.id, formState.orderNum);
              success(
                t('model.metroStation.result.addStation'),
                t('model.metroLine.result.success')
              );
            } catch (error: any) {
              failed(error?.response?.data?.message, t('model.metroStation.result.failed'));
            } finally {
              loading.value = false;
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
      let result;
      onMounted(async () => {
        loading.value = true;
        if (props.id) {
          const { content } = await getLine(props.id);
          if (content) {
            formState.lineName = content.name || '';
          }
        }
        result = await getAllStations(
          { cityId: cityId.value },
          { pageSize: pageParam.size, pageNum: pageParam.number }
        );
        result.content.forEach((item) => {
          options.value.push({ value: item.id || '', label: item.name || '' });
        });
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
        metroConst,
        loading,
        tip,
        options,
        stationChange,
        formRef,
        formState,
        onSubmit,
        resetForm,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        cityId,
        disable,
        result,
        onScroll,
      };
    },
  });
</script>
