// 添加更改楼栋信息
<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="newsConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="title" :label="t('host.news.title')" name="title">
        <Input
          :disabled="isUpdate && !newsConst._UPDATE_FIELDS.includes('title')"
          v-model:value="formState.title"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="description" :label="t('host.news.description')" name="description">
        <Textarea
          :disabled="isUpdate && !newsConst._UPDATE_FIELDS.includes('description')"
          v-model:value="formState.description"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="keywords" :label="t('host.news.keywords')" name="keywords">
        <Select
          v-model:value="tags"
          mode="tags"
          style="width: 100%"
          :token-separators="[',']"
          :options="options"
          :disabled="isUpdate && !newsConst._UPDATE_FIELDS.includes('keywords')"
          @change="tagsChange"
        />
      </FormItem>
      <FormItem ref="projects" :label="t('host.news.projects')" name="projects">
        <span v-for="item in formState.projects" :key="item.id">{{ item.name }}</span>
        <Button @click="changeModal">{{ t('host.news.setProject') }}</Button>
      </FormItem>
      <FormItem ref="content" :label="t('host.news.content')" name="content">
        <FTinymce
          :disabled="isUpdate && !newsConst._UPDATE_FIELDS.includes('content')"
          v-model="formState.content"
          @change="handleChange"
          width="100%"
          :provinceId="props.provinceId"
          :cityId="props.cityId"
        />
      </FormItem>
      <FormItem ref="img" :label="t('host.news.img')" name="img">
        <Image :src="formState.img" width="100px" />
        <Upload
          :data="{
            provinceId: props.provinceId,
            cityId: props.cityId,
          }"
          :action="ApiSource.UploadNews"
          :disabled="isUpdate && !newsConst._UPDATE_FIELDS.includes('img')"
          @change="changeFile"
        >
          <Button> Upload </Button>
        </Upload>
      </FormItem>
      <FormItem ref="sort" :label="t('host.news.sort')" name="sort">
        <Select
          :disabled="isUpdate && !newsConst._UPDATE_FIELDS.includes('sort')"
          ref="select"
          :allowClear="true"
          v-model:value="formState.sort"
          style="width: 120px"
          @change="sortChange"
          :options="newsConst.SORTS"
          :pagination="false"
        />
      </FormItem>
      <FormItem ref="source" :label="t('host.news.source')" name="source">
        <Input
          :disabled="isUpdate && !newsConst._UPDATE_FIELDS.includes('source')"
          v-model:value="formState.source"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="author" :label="t('host.news.author')" name="author">
        <Input
          :disabled="isUpdate && !newsConst._UPDATE_FIELDS.includes('author')"
          v-model:value="formState.author"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="inMobile" :label="t('host.news.inMobile')" name="inMobile">
        <Select
          :disabled="isUpdate && !newsConst._UPDATE_FIELDS.includes('inMobile')"
          ref="select"
          :allowClear="true"
          v-model:value="formState.inMobile"
          style="width: 120px"
          @change="inMobileChange"
          :options="newsConst.IN_MOBILES"
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
    <Modal
      :visible="isModal"
      title=""
      @cancel="onClose"
      width="100%"
      wrapClassName="full-modal"
      :footer="null"
      :destroyOnClose="true"
    >
      <FProject
        v-if="isModal"
        :id="props.id"
        :checkedKeys="selected"
        @setNewsProject="setNewsProject"
      />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    Button,
    Form,
    FormItem,
    Input,
    Select,
    Textarea,
    Image,
    Upload,
    Modal,
  } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { NewsModel, _NewsConst } from '/@/api/host/news/model/newsModel';
  import { addNews, updateNews, getNews } from '/@/api/host/news/news';
  import { ApiSource } from '/@/api/host/source/source';
  import FProject from '/@/components/FProject';
  import FTinymce from '/@/components/FTinymce';

  interface Option {
    value: string;
    label: string;
  }
  export default defineComponent({
    name: 'NewsForm',
    components: {
      Button,
      Form,
      FormItem,
      Input,
      Loading,
      Select,
      Textarea,
      Image,
      Upload,
      Modal,
      FProject,
      FTinymce,
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
    },
    setup(props) {
      debugger;
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('news');
      const newsConst = ref(_NewsConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      let isModal = ref<boolean>(false);
      let selected = ref<string[]>([]);
      const changeModal = () => {
        if (formState.projects) {
          formState.projects.forEach((item) => {
            selected.value.push(item.id || '');
          });
        }
        isModal.value = true;
      };
      const onClose = () => {
        isModal.value = false;
      };

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<NewsModel> = reactive({
        provinceId: props.provinceId,
        cityId: props.cityId,
        keywords: '',
      });

      const options = ref<Option[]>([]);
      let tags = ref<string[]>([]);

      const tagsChange = async (value) => {
        debugger;
        let selectTags = '';
        if (value && value.length > 0) {
          value.forEach((item: string) => {
            selectTags = selectTags + ',' + item;
          });
        }
        const x = selectTags.indexOf(',');
        selectTags = selectTags.substring(x + 1);
        formState.keywords = selectTags;
      };

      function handleChange(value: string) {
        formState.content = value;
      }

      const changeFile = async (info) => {
        if (info.file.status === 'done') {
          formState.img = info.file.response.data;
        }
      };

      const inMobileChange = async (value) => {
        formState.inMobile = value;
      };

      const sortChange = async (value) => {
        formState.sort = value;
      };

      let area = ref<string[]>([]);

      const setNewsProject = async (value) => {
        loading.value = true;
        if (value.projects && value.projects.length > 0) {
          formState.projects = [];
          value.projects.forEach((item) => {
            if (!item.id || !item.name) {
              return;
            }
            if (!formState.projects) {
              formState.projects = [];
            }
            formState.projects.push({ id: item.id, name: item.name });
          });
          success(t('host.news.setProject'), t('host.action.success'));
        }
        debugger;
        console.log(',,,,,,,,,,,,,,', formState.projects);
        loading.value = false;
      };

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            if (props.id) {
              loading.value = true;
              try {
                const { content } = await updateNews(formState);
                success(t('host.action.update'), t('host.action.success'));
                Object.assign(formState, content);
              } catch (error) {
                failed(error?.response?.data?.message, t('host.action.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              loading.value = true;
              try {
                const { content } = await addNews(formState);
                success(t('host.action.add'), t('host.action.success'));
                Object.assign(formState, content);
              } catch (error) {
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

      const resetForm = async () => {
        loading.value = true;
        try {
          formRef.value.resetFields();
        } catch (error) {
        } finally {
          loading.value = false;
        }
      };

      onMounted(async () => {
        loading.value = true;
        if (props.id) {
          const { content } = await getNews(props.id);
          Object.assign(formState, content);
          if (!formState.keywords) {
            formState.keywords = '';
          }
          const deTag: string[] = formState.keywords.split(',');
          deTag.forEach((tag) => {
            options.value.push({ value: tag, label: tag });
            tags.value.push(tag);
          });
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

      return {
        t,
        prefixCls,
        newsConst,
        loading,
        tip,
        formRef,
        formState,
        changeFile,
        inMobileChange,
        sortChange,
        setNewsProject,
        onSubmit,
        resetForm,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        isUpdate,
        props,
        ApiSource,
        onClose,
        changeModal,
        isModal,
        selected,
        area,
        handleChange,
        options,
        tags,
        tagsChange,
      };
    },
  });
</script>
