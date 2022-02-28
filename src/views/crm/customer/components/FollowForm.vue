<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="followConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="description" :label="t('marketing.follow.description')" name="description">
        <Textarea
          :disabled="isUpdate && !followConst._UPDATE_FIELDS.includes('description')"
          v-model:value="formState.description"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="resultType" :label="t('marketing.follow.resultType')" name="resultType">
        <Select :options="followConst.RESULT_TYPES" v-model:value="formState.resultType" />
      </FormItem>
      <FormItem ref="state" :label="t('marketing.follow.state')" name="state">
        <Select :options="followConst.STATES" v-model:value="formState.state" />
      </FormItem>
      <!-- <FormItem ref="videoAddress" :label="t('marketing.follow.videoAddress')" name="videoAddress">
        <Upload accept="video/*" :customRequest="customRequest" list-type="picture-card">
          <img v-if="formState.videoAddress" :src="formState.videoAddress" />
          <div v-else>Upload</div>
        </Upload>
      </FormItem> -->
      <FormItem ref="projectId" :label="t('marketing.follow.projectId')" name="projectId">
        <FProjectSelect
          :projectId="formState.projectId"
          @setProject="setProject"
          :disable="isUpdate && !followConst._UPDATE_FIELDS.includes('projectId')"
        />
      </FormItem>
      <FormItem
        ref="nextFollowTime"
        :label="t('marketing.follow.nextFollowTime')"
        name="nextFollowTime"
      >
        <DatePicker
          show-time
          :disabled="isUpdate && !followConst._UPDATE_FIELDS.includes('nextFollowTime')"
          format="YYYY-MM-DD HH:mm:ss"
          :value="formState.nextFollowTime"
          @change="onChange"
        />
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
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import {
    Button,
    Form,
    FormItem,
    DatePicker,
    message,
    // Upload,
    Textarea,
    Select,
  } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { success } from '/@/hooks/web/useList';
  import { ApiSource, uploadVideo } from '/@/api/host/source/source';
  import { useUserStore } from '/@/store/modules/user';
  import { getAccessToken } from '/@/utils/auth';
  import { FollowConst, FollowModel } from '/@/api/customer/crmFollow/model/followModel';
  import moment, { Moment } from 'moment';
  import { addMy, AddOther, getMyFollow, updateFollow } from '/@/api/customer/crmFollow/follow';
  import FProjectSelect from '/@/components/FProjectSelect';

  export default defineComponent({
    name: 'FollowForm',
    components: {
      Button,
      Form,
      FormItem,
      Loading,
      // Upload,
      Textarea,
      DatePicker,
      FProjectSelect,
      Select,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
      fromType: {
        type: String,
        required: true,
      },
      followId: {
        type: String,
        required: false,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('customer');
      const followConst = ref(FollowConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //判断更新还是新增
      let isUpdate = ref<boolean>(false);
      if (props.followId && props.followId !== '') {
        isUpdate.value = true;
      }

      const startTime = ref<Moment>();
      const onChange = (value) => {
        startTime.value = value;
        formState.nextFollowTime = value.toISOString();
      };

      // 获取用户store
      const userStore = useUserStore();
      const provinceId = userStore.getUserInfo.companyProvinceId;
      const cityId = userStore.getUserInfo.companyCityId;
      //上传图片请求头
      const requestHeader = ref({ Authorization: '' });
      requestHeader.value.Authorization = getAccessToken() as string;

      const customRequest = (options) => {
        const formData = new FormData();
        formData.append('file', options.file as any);
        formData.append('provinceId', provinceId || '');
        formData.append('cityId', cityId || '');
        uploadVideo(formData)
          .then((res) => {
            options.onSuccess(res, options.file);
            formState.videoAddress = res.data.data;
          })
          .catch(() => {
            options.onError();
            message.error('上传失败，请删除重试');
          });
      };

      //设置项目
      const setProject = async (value) => {
        formState.projectId = value.value;
      };

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<FollowModel> = reactive({});

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            formState.customerId = props.id;
            if (props.followId) {
              loading.value = true;
              await updateFollow(formState);
              success(t('host.action.update'), t('host.action.success'));
              loading.value = false;
            } else {
              loading.value = true;
              if (props.fromType === 'my') {
                await addMy(formState);
                success(t('host.action.add'), t('host.action.success'));
              } else if (props.fromType === 'other') {
                await AddOther(formState);
                success(t('host.action.add'), t('host.action.success'));
              }
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
          if (props.followId) {
            const { content } = await getMyFollow(props.id);
            if (content && content.length > 0) {
              content.forEach((item) => {
                if (props.followId === item.id) {
                  Object.assign(formState, item);
                }
              });
            }
            if (formState.nextFollowTime) {
              startTime.value = moment(formState.nextFollowTime, 'YYYY-MM-DD HH:mm:ss');
            }
          }
        } catch (error) {
        } finally {
          loading.value = false;
        }
      };

      //初始加载
      onMounted(async () => {
        loading.value = true;
        if (props.followId) {
          const { content } = await getMyFollow(props.id);
          if (content && content.length > 0) {
            content.forEach((item) => {
              if (props.followId === item.id) {
                Object.assign(formState, item);
              }
            });
          }
          if (formState.nextFollowTime) {
            startTime.value = moment(formState.nextFollowTime, 'YYYY-MM-DD HH:mm:ss');
          }
        }
        loading.value = false;
      });

      return {
        startTime,
        onChange,
        t,
        prefixCls,
        followConst,
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
        ApiSource,
        cityId,
        provinceId,
        setProject,
        userStore,
        requestHeader,
        customRequest,
      };
    },
  });
</script>
