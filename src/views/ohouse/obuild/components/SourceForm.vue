// 添加更改楼栋信息
<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="sourceConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="title" :label="t('ohouse.resource.title')" name="title">
        <Input
          :disabled="isUpdate && !sourceConst._UPDATE_FIELDS.includes('title')"
          v-model:value="formState.title"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="keyword" :label="t('ohouse.resource.keyword')" name="keyword">
        <Select
          v-model:value="tags"
          mode="tags"
          style="width: 100%"
          :token-separators="[',']"
          :options="options"
          :disabled="isUpdate && !sourceConst._UPDATE_FIELDS.includes('keyword')"
          @change="tagsChange"
        />
      </FormItem>
      <FormItem ref="address" :label="t('host.source.address')" name="address">
        <Upload
          :customRequest="customRequest"
          :disabled="isUpdate && !sourceConst._UPDATE_FIELDS.includes('address')"
          @change="changeFile"
          v-model:file-list="fileList"
          :headers="requestHeader"
        >
          <Button> Upload </Button>
        </Upload>
        <img v-if="imgUrl" :src="imgUrl" alt="资源图" />
      </FormItem>
      <FormItem ref="description" :label="t('ohouse.build.description')" name="description">
        <Textarea
          :disabled="isUpdate && !sourceConst._UPDATE_FIELDS.includes('description')"
          v-model:value="formState.description"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="sort" :label="t('ohouse.resource.sort')" name="sort">
        <Select
          :disabled="isUpdate && !sourceConst._UPDATE_FIELDS.includes('sort')"
          ref="select"
          :allowClear="true"
          v-model:value="formState.sort"
          style="width: 120px"
          @change="sortChange"
          :options="sourceConst.SORT"
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
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Button, Form, FormItem, Input, message, Select, Textarea, Upload } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { success, failed } from '/@/hooks/web/useList';
  import {
    ResourceConst,
    ResourceModel,
  } from '/@/api/ohouse/houseResource/model/houseResourceModel';
  import {
    addOResource,
    getResourceId,
    updateOResource,
  } from '/@/api/ohouse/houseResource/houseResource';
  import { getAccessToken } from '/@/utils/auth';
  import { uploadOHouse } from '/@/api/host/source/source';

  interface Option {
    value: String;
    label: String;
  }
  interface FileItem {
    uid: string;
    name?: string;
    status?: string;
    response?: string;
    url?: string;
  }

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
      Upload,
    },
    props: {
      id: {
        type: String,
        require: false,
      },
      houseId: {
        type: String,
        required: true,
      },
      projectId: {
        type: String,
        required: true,
      },
      provinceId: {
        type: String,
        required: true,
      },
      cityId: {
        type: String,
        required: true,
      },
      areaId: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('project');
      const sourceConst = ref(ResourceConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //判断是更新还是添加
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<ResourceModel> = reactive({
        houseId: props.houseId || '',
      });

      //提交
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            if (props.id) {
              loading.value = true;
              try {
                await updateOResource(formState);
                success(t('host.action.update'), t('host.action.success'));
              } catch (error: any) {
                failed(t('host.action.update'), t('host.action.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              loading.value = true;
              try {
                await addOResource(formState);
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
            const { content } = await getResourceId(props.id);
            Object.assign(formState, content);
          } else {
            formRef.value.resetFields();
          }
        } catch (error) {
        } finally {
          loading.value = false;
        }
      };

      // 分类
      const sortChange = (value) => {
        formState.sort = value;
      };
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
      //上传图片请求头
      const requestHeader = ref({ Authorization: '' });
      requestHeader.value.Authorization = getAccessToken() as string;

      const customRequest = (options) => {
        const formData = new FormData();
        formData.append('file', options.file as any);
        formData.append('type', formState.sort || '');
        formData.append('areaId', props.areaId || '');
        formData.append('cityId', props.cityId || '');
        formData.append('provinceId', props.provinceId || '');
        formData.append('houseId', props.houseId || '');
        formData.append('projectId', props.projectId || '');
        uploadOHouse(formData)
          .then((res) => {
            options.onSuccess(res, options.file);
            formState.address = res.data.data;
            imgUrl.value = res.data.data;
            formState.title = options.file.name;
          })
          .catch(() => {
            options.onError();
            message.error('上传失败，请删除重试');
          });
      };

      //上传资源
      const fileList = ref<FileItem[]>([]);
      let imgUrl = ref('');
      const changeFile = async (info) => {
        if (info.file.status === 'done') {
          fileList.value.splice(0);
          formState.title = info.file.name;
          formState.address = info.file.response.data;
          imgUrl.value = info.file.response.data;
        }
      };

      //初始加载
      onMounted(async () => {
        loading.value = true;
        if (props.id) {
          const { content } = await getResourceId(props.id);
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
        sortChange,
        t,
        prefixCls,
        sourceConst,
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
        customRequest,
        imgUrl,
        fileList,
        requestHeader,
      };
    },
  });
</script>
