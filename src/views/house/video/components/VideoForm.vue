<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="videoConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="title" :label="t('host.video.title')" name="title">
        <Input
          :disabled="isUpdate && !videoConst._UPDATE_FIELDS.includes('title')"
          v-model:value="formState.title"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="description" :label="t('host.video.description')" name="description">
        <Textarea
          :disabled="isUpdate && !videoConst._UPDATE_FIELDS.includes('description')"
          v-model:value="formState.description"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="keyword" :label="t('host.video.keyword')" name="keyword">
        <Select
          v-model:value="tags"
          mode="tags"
          style="width: 100%"
          :token-separators="[',']"
          :options="options"
          :disabled="isUpdate && !videoConst._UPDATE_FIELDS.includes('keyword')"
          @change="tagsChange"
          :defaultOpen="false"
          :open="false"
        />
      </FormItem>
      <FormItem ref="projectId" :label="t('host.video.projectId')" name="projectId">
        <FProjectSelect
          :projectId="formState.projectId"
          @setProject="setProject"
          :disable="isUpdate && !videoConst._UPDATE_FIELDS.includes('projectId')"
        />
      </FormItem>
      <FormItem ref="sort" :label="t('host.video.sort')" name="sort">
        <Select
          ref="select"
          :allowClear="true"
          v-model:value="formState.sort"
          style="width: 120px"
          @change="sortHandleChange"
          :options="videoConst.SORTS"
          :pagination="false"
          :disabled="isUpdate && !videoConst._UPDATE_FIELDS.includes('sort')"
        />
      </FormItem>
      <FormItem ref="videoAddress" :label="t('host.video.videoAddress')" name="videoAddress">
        <Upload
          :before-upload="beforeUpload"
          :remove="handleRemove"
          :file-list="fileList"
          :multiple="false"
          :disabled="isUpdate && !videoConst._UPDATE_FIELDS.includes('videoAddress')"
        >
          <Button> Select File </Button>
        </Upload>
      </FormItem>
      <FormItem ref="photoAddress" :label="t('host.video.photoAddress')" name="photoAddress">
        <Image :src="formState.photoAddress" width="100px" />
        <Upload
          :data="{
            provinceId: provinceId,
            cityId: cityId,
          }"
          :action="ApiSource.UpdateVideo"
          :disabled="isUpdate && !videoConst._UPDATE_FIELDS.includes('photoAddress')"
          @change="changeFile"
          :showUploadList="false"
        >
          <Button> Upload </Button>
        </Upload>
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
  import { Button, Form, FormItem, Input, Textarea, Select, Image, Upload } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { success, failed } from '/@/hooks/web/useList';
  import { VideoModel, _VideoConst } from '/@/api/host/video/model/videoModel';
  import FProjectSelect from '/@/components/FProjectSelect';
  import { ApiSource, uploadVideo } from '/@/api/host/source/source';
  import { useUserStore } from '/@/store/modules/user';
  import { updateVideo, addVideo, getById } from '/@/api/host/video/video';

  interface Option {
    value: string;
    label: string;
  }

  interface FileItem {
    uid: string;
    name?: string;
    status?: string;
    response?: string;
    url?: string;
    preview?: string;
    originFileObj?: any;
    file: string | Blob;
  }
  export default defineComponent({
    name: 'VideoForm',
    components: {
      Button,
      Form,
      FormItem,
      Input,
      Loading,
      Textarea,
      Select,
      FProjectSelect,
      Image,
      Upload,
    },
    props: {
      id: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('video');
      const videoConst = ref(_VideoConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //判断更新还是新增
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      const userInfo = useUserStore();
      const provinceId = userInfo.getUserInfo.companyProvinceId;
      const cityId = userInfo.getUserInfo.companyCityId;

      const fileList = ref<FileItem[]>([]);

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<VideoModel> = reactive({
        provinceId: provinceId,
        cityId: cityId,
        isTop: '0',
        state: '1',
      });

      const options = ref<Option[]>([]);
      let tags = ref<string[]>([]);
      //标签
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

      //设置项目
      const setProject = async (value) => {
        formState.projectId = value.value;
      };

      //设置类型
      const sortHandleChange = async (value) => {
        formState.sort = value;
      };

      //上传图片
      const changeFile = async (info) => {
        if (info.file.status === 'done') {
          formState.photoAddress = info.file.response.data;
        }
      };

      //视频
      const handleRemove = (file: FileItem) => {
        const index = fileList.value.indexOf(file);
        const newFileList = fileList.value.slice();
        newFileList.splice(index, 1);
        fileList.value = newFileList;
      };

      const beforeUpload = (file: FileItem) => {
        fileList.value = [];
        fileList.value = [...fileList.value, file];
        formState.videoAddress = '';
        return false;
      };

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            if (props.id) {
              loading.value = true;
              try {
                await updateVideo(formState);
                success(t('host.action.update'), t('host.action.success'));
              } catch (error: any) {
                failed(error?.response?.data?.message, t('host.action.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              loading.value = true;
              const formData = new FormData();
              if (fileList.value.length === 0) {
                failed(t('host.video.videoNull'), t('host.video.selectVideo'));
                loading.value = false;
                return;
              }
              fileList.value.forEach((file: FileItem) => {
                formData.append('file', file as any);
                formData.append('provinceId', provinceId || '');
                formData.append('cityId', cityId || '');
                formData.append('projectId', formState.projectId || '');
              });
              try {
                const result = await uploadVideo(formData);
                formState.videoAddress = result;
                fileList.value = [];
              } catch (error: any) {
                failed(t('host.video.videoAddress'), t('host.action.fail'));
                return;
              } finally {
                loading.value = false;
              }
              try {
                await addVideo(formState);
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
        if (props.id) {
          try {
            const { content } = await getById(props.id);
            Object.assign(formState, content);
          } catch (error) {
          } finally {
            loading.value = false;
          }
        } else {
          formRef.value.resetFields();
        }
      };

      //初始加载
      onMounted(async () => {
        loading.value = true;
        if (props.id) {
          const { content } = await getById(props.id);
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
        videoConst,
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
        provinceId,
        cityId,
        tags,
        options,
        setProject,
        tagsChange,
        changeFile,
        sortHandleChange,
        beforeUpload,
        fileList,
        handleRemove,
      };
    },
  });
</script>
