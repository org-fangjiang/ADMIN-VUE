<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="bannerConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="title" :label="t('host.banner.title')" name="title">
        <Input
          :disabled="isUpdate && !bannerConst._UPDATE_FIELDS.includes('title')"
          v-model:value="formState.title"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="keyword" :label="t('host.banner.keyword')" name="keyword">
        <Select
          v-model:value="tags"
          mode="tags"
          style="width: 100%"
          :token-separators="[',']"
          :options="options"
          :disabled="isUpdate && !bannerConst._UPDATE_FIELDS.includes('keyword')"
          @change="tagsChange"
        />
      </FormItem>
      <FormItem ref="description" :label="t('host.banner.description')" name="description">
        <Textarea
          :disabled="isUpdate && !bannerConst._UPDATE_FIELDS.includes('description')"
          v-model:value="formState.description"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="address" :label="t('host.banner.address')" name="address">
        <Image :src="formState.address" width="100px" />
        <Upload
          :data="{
            cityId: props.companyCityId,
          }"
          :action="ApiSource.UploadBanner"
          :disabled="isUpdate && !bannerConst._UPDATE_FIELDS.includes('address')"
          @change="changeFile"
          :headers="requestHeader"
        >
          <Button> Upload </Button>
        </Upload>
      </FormItem>
      <FormItem ref="hProjectId" :label="t('host.banner.hProjectId')" name="hProjectId">
        <FProjectSelect :projectId="formState.hProjectId" @setProject="setProject" />
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
  import FProjectSelect from '/@/components/FProjectSelect';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Button, Form, FormItem, Input, Textarea, Select, Image, Upload } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { BannerModel, _BannerConst } from '/@/api/host/banner/model/bannerModel';
  import { addBanner, getBanner, updateBanner } from '/@/api/host/banner/banner';
  import { ApiSource } from '/@/api/host/source/source';
  import { success, failed } from '/@/hooks/web/useList';
  import { getAccessToken } from '/@/utils/auth';

  interface Option {
    value: string;
    label: string;
  }

  export default defineComponent({
    name: 'BannerForm',
    components: {
      Button,
      Form,
      FormItem,
      Input,
      Loading,
      Textarea,
      Select,
      Image,
      Upload,
      FProjectSelect,
    },
    props: {
      id: {
        type: String,
        require: true,
      },
      companyCityId: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('banner');
      const bannerConst = ref(_BannerConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //判断是不是更新
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }
      //设置项目
      const setProject = async (value) => {
        formState.hProjectId = value.value;
      };

      //上传图片请求头
      const requestHeader = ref({ Authorization: '' });
      requestHeader.value.Authorization = getAccessToken() as string;

      //关键词
      const options = ref<Option[]>([]);
      let tags = ref<string[]>([]);
      const tagsChange = async (value) => {
        let selectTags = '';
        if (value && value.length > 0) {
          value.forEach((item: string) => {
            selectTags = selectTags + ',' + item;
          });
        }
        const x = selectTags.indexOf(',');
        selectTags = selectTags.substring(x + 1);
        formState.keyword = selectTags;
      };
      //图片地址
      const changeFile = async (info) => {
        if (info.file.status === 'done') {
          formState.address = info.file.response.data;
        }
      };

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<BannerModel> = reactive({
        cityId: props.companyCityId || '',
      });

      //确认
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            if (props.id) {
              loading.value = true;
              try {
                await updateBanner(formState);
                success(t('host.action.update'), t('host.action.success'));
              } catch (error: any) {
                failed(error?.response?.data?.message, t('host.action.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              loading.value = true;
              try {
                const { content } = await addBanner(formState);
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
          const { content } = await getBanner(props.id);
          Object.assign(formState, content);
          //关键词赋值
          if (formState.keyword) {
            const detags = formState.keyword.split(',');
            detags.forEach((tag) => {
              options.value.push({ value: tag, label: tag });
              tags.value.push(tag);
            });
          }
        }
        loading.value = false;
      });

      return {
        t,
        prefixCls,
        bannerConst,
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
        options,
        tags,
        tagsChange,
        changeFile,
        ApiSource,
        setProject,
        requestHeader,
      };
    },
  });
</script>
