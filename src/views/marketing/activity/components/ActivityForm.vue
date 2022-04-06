<template>
  <div :class="prefixCls" style="overflow: scroll; height: 500px">
    <Form
      :rules="clueActivityConst._RULES"
      ref="formRef"
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="title" :label="t('marketing.clueActivity.title')" name="title">
        <Input
          :disabled="isUpdate && !clueActivityConst._UPDATE_FIELDS.includes('title')"
          v-model:value="formState.title"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="userNumber" :label="t('marketing.clueActivity.userNumber')" name="userNumber">
        <InputNumber
          :disabled="isUpdate && !clueActivityConst._UPDATE_FIELDS.includes('userNumber')"
          v-model:value="formState.userNumber"
          autoComplete="off"
        />
      </FormItem>
      <FormItem
        ref="description"
        :label="t('marketing.clueActivity.description')"
        name="description"
      >
        <Textarea
          :disabled="isUpdate && !clueActivityConst._UPDATE_FIELDS.includes('description')"
          v-model:value="formState.description"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="sort" :label="t('marketing.clueActivity.sort')" name="sort">
        <Select
          :disabled="isUpdate && !clueActivityConst._UPDATE_FIELDS.includes('sort')"
          ref="select"
          :allowClear="true"
          v-model:value="formState.sort"
          style="width: 120px"
          :options="clueActivityConst.SORTS"
          :pagination="false"
        />
      </FormItem>
      <FormItem ref="expireTime" :label="t('marketing.clueActivity.expireTime')" name="expireTime">
        <DatePicker
          showTime
          :disabled="isUpdate && !clueActivityConst._UPDATE_FIELDS.includes('expireTime')"
          format="YYYY-MM-DD HH:mm:ss"
          :value="formState.expireTime"
          @change="expireTimeChange"
          :disabled-date="disabledDate"
        />
      </FormItem>
      <FormItem ref="headImg" :label="t('marketing.clueActivity.headImg')" name="headImg">
        <Upload
          accept="image/*"
          :customRequest="customRequest"
          :headers="requestHeader"
          :data="{
            userId: userId,
            companyId: companyId,
          }"
          :action="ApiSource.UploadActivityImg"
          :disabled="isUpdate && !clueActivityConst._UPDATE_FIELDS.includes('headImg')"
          @change="changeFile"
          :showUploadList="false"
        >
          <Image v-if="formState.headImg" :src="formState.headImg" width="100px" />
          <Button v-else> Upload </Button>
        </Upload>
      </FormItem>
      <FormItem
        ref="projectEntities"
        :label="t('marketing.clueActivity.projectEntities')"
        name="projectEntities"
      >
        <Select
          :showSearch="true"
          v-model:value="projects"
          :options="data"
          :filter-option="false"
          mode="multiple"
          @search="projectSearch"
          style="width: 200px"
          :not-found-content="fetching ? undefined : null"
          @change="projectChange"
        >
          <template v-if="fetching" #notFoundContent>
            <Spin size="small" />
          </template>
        </Select>
      </FormItem>
      <FormItem v-if="!isSee" :wrapper-col="{ span: 12, offset: 6 }">
        <Button type="primary" @click="onSubmit">{{ t('component.action.save') }}</Button>
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
    Form,
    FormItem,
    Input,
    Select,
    Button,
    Textarea,
    Spin,
    DatePicker,
    Upload,
    Image,
    InputNumber,
    message,
  } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import {
    ClueActivityCOnst,
    clueActivityModel,
  } from '/@/api/marketing/clueActivity/model/clueActivityModel';
  import { debounce } from 'lodash-es';
  import { search, searchWithCondition } from '/@/api/host/project/project';
  import { useUserStore } from '/@/store/modules/user';
  import moment from 'moment';
  import {
    getById,
    updateUser,
    updateAll,
    addPC,
    addUser,
  } from '/@/api/marketing/clueActivity/clueActivity';
  import { failed, success } from '/@/hooks/web/useList';
  import { ApiSource, uploadActivityImg } from '/@/api/host/source/source';
  import { getAccessToken } from '/@/utils/auth';

  interface Option {
    value: string;
    label: string;
  }
  export default defineComponent({
    name: 'ActivityForm',
    components: {
      Form,
      FormItem,
      Input,
      Loading,
      Select,
      Spin,
      Button,
      Textarea,
      DatePicker,
      Upload,
      Image,
      InputNumber,
    },
    props: {
      id: {
        type: String,
        required: false,
      },
      isSee: {
        type: Boolean,
        required: false,
      },
      isSale: {
        type: Boolean,
        required: false,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('clue');
      const clueActivityConst = ref(ClueActivityCOnst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //判断更新还是新增
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      const data = ref<Option[]>([]);
      const projects = ref<String[]>([]);
      const userStore = useUserStore();
      const provinceId = userStore.getUserInfo.companyProvinceId;
      const cityId = userStore.getUserInfo.companyCityId;
      const companyId = userStore.getUserInfo.companyId;
      const userId = userStore.getUserInfo.id;
      const requestHeader = ref({ Authorization: '' });
      requestHeader.value.Authorization = getAccessToken() as string;

      const customRequest = (options) => {
        const formData = new FormData();
        formData.append('file', options.file as any);
        formData.append('userId', userId);
        formData.append('companyId', companyId);
        uploadActivityImg(formData)
          .then((res) => {
            options.onSuccess(res, options.file);
            formState.headImg = res.data.data;
          })
          .catch(() => {
            options.onError();
            message.error('上传失败，请删除重试');
          });
      };

      //搜索项目
      let fetching = ref<boolean>(false);
      const projectSearch = debounce(async (value) => {
        fetching.value = true;
        let result;
        if (value) {
          result = await search({
            name: value,
            provinceId: provinceId || '',
            cityId: cityId,
            state: '1',
          });
        } else {
          result = await searchWithCondition({
            provinceId: provinceId || '',
            cityId: cityId,
            state: '1',
          });
        }
        if (result.content && result.content.length > 0) {
          data.value.splice(0);
          result.content.forEach((item) => {
            data.value.push({ value: item.id || '', label: item.name || '' });
          });
        }
        fetching.value = false;
      }, 800);

      const projectChange = (value) => {
        if (value && value.length > 0) {
          formState.projectEntities?.splice(0);
          value.forEach((e) => {
            formState.projectEntities?.push({ id: e });
          });
        }
      };

      //上传图片，结果赋值
      const changeFile = async (info) => {
        if (info.file.status === 'done') {
          formState.headImg = info.file.response.data;
        }
      };

      //不可选的日期
      const disabledDate = (current: any) => {
        // Can not select days before today and today
        return current && current < moment().add('day', -1).endOf('day');
      };

      //过期时间
      const expireTimeChange = (_date: any | string, dateString: string) => {
        formState.expireTime = dateString;
      };

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<clueActivityModel> = reactive({
        cityId: cityId,
        projectEntities: [],
      });

      //初始加载
      onMounted(async () => {
        loading.value = true;
        if (props.id) {
          const { content } = await getById(props.id);
          Object.assign(formState, content);
          if (formState.projectEntities && formState.projectEntities.length > 0) {
            formState.projectEntities.forEach((item) => {
              data.value.push({ value: item.id || '', label: item.name || '' });
              projects.value.push(item.id || '');
            });
          }
        }
        loading.value = false;
      });

      const onSubmit = () => {
        formRef.value.validate().then(async () => {
          if (props.id) {
            loading.value = true;
            if (props.isSale) {
              try {
                await updateUser(formState);
                success(t('marketing.action.update'), t('marketing.action.success'));
              } catch (error) {
                failed(t('marketing.action.update'), t('marketing.action.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              try {
                await updateAll(formState);
                success(t('marketing.action.update'), t('marketing.action.success'));
              } catch (error) {
                failed(t('marketing.action.update'), t('marketing.action.fail'));
              } finally {
                loading.value = false;
              }
            }
          } else {
            loading.value = true;
            if (props.isSale) {
              try {
                await addUser(formState);
                success(t('marketing.action.add'), t('marketing.action.success'));
              } catch (error) {
                failed(t('marketing.action.add'), t('marketing.action.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              try {
                await addPC(formState);
                success(t('marketing.action.add'), t('marketing.action.success'));
              } catch (error) {
                failed(t('marketing.action.add'), t('marketing.action.fail'));
              } finally {
                loading.value = false;
              }
            }
          }
        });
      };

      const resetForm = async () => {
        loading.value = true;
        if (props.id) {
          const { content } = await getById(props.id);
          Object.assign(formState, content);
        } else {
          formRef.value.resetFields();
        }
        loading.value = false;
      };

      return {
        t,
        prefixCls,
        clueActivityConst,
        loading,
        tip,
        formRef,
        formState,
        onSubmit,
        resetForm,
        labelCol: { span: 8 },
        wrapperCol: { span: 12 },
        isUpdate,
        props,
        projectSearch,
        disabledDate,
        expireTimeChange,
        data,
        fetching,
        projects,
        projectChange,
        ApiSource,
        companyId,
        changeFile,
        userId,
        requestHeader,
        customRequest,
      };
    },
  });
</script>
