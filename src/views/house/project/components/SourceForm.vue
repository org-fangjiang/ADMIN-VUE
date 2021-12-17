<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="sourceConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="title" :label="t('host.source.title')" name="title">
        <Input
          :disabled="isUpdate && !sourceConst._UPDATE_fIELD.includes('title')"
          v-model:value="formState.title"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="keyword" :label="t('host.source.keyword')" name="keyword">
        <Select
          v-model:value="tags"
          mode="tags"
          style="width: 100%"
          :token-separators="[',']"
          :options="options"
          :disabled="isUpdate && !sourceConst._UPDATE_fIELD.includes('keyword')"
          @change="tagsChange"
        />
      </FormItem>
      <FormItem ref="description" :label="t('host.source.description')" name="description">
        <Input
          :disabled="isUpdate && !sourceConst._UPDATE_fIELD.includes('description')"
          v-model:value="formState.description"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="sort" :label="t('host.source.sort')" name="sort">
        <Select
          :disabled="isUpdate && !sourceConst._UPDATE_fIELD.includes('sort')"
          ref="select"
          :allowClear="true"
          v-model:value="formState.sort"
          style="width: 120px"
          @change="sortChange"
          :options="sourceConst.SORTS"
          :pagination="false"
        />
      </FormItem>
      <FormItem ref="address" :label="t('host.source.address')" name="address">
        <Upload
          :data="{
            projectId: props.projectId,
            provinceId: props.provinceId,
            cityId: props.cityId,
            areaId: props.areaId,
            type: formState.sort,
          }"
          :action="ApiSource.Upload"
          :disabled="isUpdate && !sourceConst._UPDATE_fIELD.includes('address')"
          @change="changeFile"
          v-model:file-list="fileList"
        >
          <Button> Upload </Button>
        </Upload>
        <img v-if="imgUrl" :src="imgUrl" alt="资源图" />
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
  import { Button, Form, FormItem, Input, Select, Upload } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { SourceModel, _SourceConst } from '/@/api/host/source/model/sourceModel';
  import { updateResource, addResource, getResource, ApiSource } from '/@/api/host/source/source';
  import { success, failed } from '/@/hooks/web/useList';

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
  }

  export default defineComponent({
    name: 'SourceForm',
    components: {
      Button,
      Form,
      FormItem,
      Input,
      Loading,
      Select,
      Upload,
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
      cityId: {
        type: String,
        require: true,
      },
      areaId: {
        type: String,
        require: true,
      },
      projectId: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('project');
      const sourceConst = ref(_SourceConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

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
      //上传资源
      const fileList = ref<FileItem[]>([]);
      let imgUrl = ref('');
      const changeFile = async (info) => {
        if (info.file.status === 'done') {
          fileList.value.splice(0);
          formState.title = info.file.name;
          formState.projectId = props.projectId;
          formState.address = info.file.response.data;
          imgUrl.value = info.file.response.data;
        }
      };
      //类型选择
      const sortChange = async (value) => {
        formState.sort = value;
      };

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<SourceModel> = reactive({});
      //提交
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            if (props.id) {
              loading.value = true;
              try {
                const { content } = await updateResource(formState);
                success(t('host.action.update'), t('host.action.success'));
                Object.assign(formState, content);
              } catch (error: any) {
                failed(error?.response?.data?.message, t('host.action.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              loading.value = true;
              try {
                const { content } = await addResource(formState);
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
          const { content } = await getResource(props.id);
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
        sourceConst,
        loading,
        tip,
        sortChange,
        formRef,
        formState,
        onSubmit,
        resetForm,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        isUpdate,
        changeFile,
        ApiSource,
        props,
        tagsChange,
        tags,
        options,
        fileList,
        imgUrl,
      };
    },
  });
</script>
