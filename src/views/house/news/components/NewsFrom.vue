// 添加文章信息
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
        <div v-if="titleVio" style="border-width: 1px; border-color: red">
          <span>标题中出现{{ titNumber }}个违规词。</span>
          <br />
          <span :key="item.start" v-for="item in titViolations"
            >第{{ item.start }}个字后，违规词为“{{ item.word }}”。</span
          >
        </div>
      </FormItem>
      <FormItem ref="description" :label="t('host.news.description')" name="description">
        <Textarea
          :disabled="isUpdate && !newsConst._UPDATE_FIELDS.includes('description')"
          v-model:value="formState.description"
          autoComplete="off"
        />
        <div v-if="desVio" style="border-width: 1px; border-color: red">
          <span>描述中出现{{ desNumber }}个违规词。</span>
          <br />
          <span :key="item.start" v-for="item in desViolations"
            >第{{ item.start }}个字后，违规词为“{{ item.word }}”。</span
          >
        </div>
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
          :open="false"
        />
      </FormItem>
      <FormItem ref="projects" :label="t('host.news.projects')" name="projects">
        <span v-for="(item, index) in formState.projects" :key="item.id"
          ><Tag color="blue" @close="log(index)" closable>{{ item.name }}</Tag></span
        >
        <Button @click="changeModal">{{ t('host.news.setProject') }}</Button>
      </FormItem>
      <FormItem ref="content" :label="t('host.news.content')" name="content">
        <FTinymce
          :disabled="isUpdate && !newsConst._UPDATE_FIELDS.includes('content')"
          v-model:value="formState.content"
          @change="handleChange"
          width="100%"
          :provinceId="props.provinceId"
          :cityId="props.cityId"
          :contViolations="violations"
        />
        <div v-if="isViolation" style="border-width: 1px; border-color: red">
          <span>正文中出现{{ number }}个违规词。</span>
          <br />
          <span :key="item.start" v-for="item in violations"
            >第{{ item.start }}个字后，违规词为“{{ item.word }}”。</span
          >
        </div>
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
      width="60%"
      :footer="null"
      :destroyOnClose="true"
      :bodyStyle="{ overflow: 'auto', margin: '16px' }"
    >
      <FProject
        v-if="isModal"
        :id="props.id"
        :selected="selected"
        @setNewsProject="setNewsProject"
      />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef, watch } from 'vue';
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
    Tag,
  } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { NewsModel, _NewsConst } from '/@/api/host/news/model/newsModel';
  import { addNews, updateNews, getNews } from '/@/api/host/news/news';
  import { ApiSource } from '/@/api/host/source/source';
  import FProject from '/@/components/FProject';
  import FTinymce from '/@/components/FTinymce';
  import { getProject } from '/@/api/host/project/project';
  import { success, failed } from '/@/hooks/web/useList';
  import { HOUSE_NEWS } from '/@/enums/cacheEnum';
  import { Persistent } from '/@/utils/cache/persistent';

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
      Tag,
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
      const { t } = useI18n();
      const { prefixCls } = useDesign('news');
      const newsConst = ref(_NewsConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      //判断是否为更新
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<NewsModel> = reactive(
        Persistent.getLocal(HOUSE_NEWS) || {
          provinceId: props.provinceId,
          cityId: props.cityId,
          keywords: '',
        }
      );

      //监听表单数据，存储
      watch(
        () => formState,
        (_v1, _v2) => {
          Persistent.setLocal(HOUSE_NEWS, formState, true);
        },
        {
          deep: true,
        }
      );

      const log = (index) => {
        if (formState.projects && formState.projects.length > 0) {
          formState.projects.splice(index, 1);
        }
        debugger;
        formState.projects;
      };

      //控制modal是否打开
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
        selected.value.splice(0);
      };

      const options = ref<Option[]>([]);
      let tags = ref<string[]>([]);

      //标签
      const tagsChange = async (value) => {
        formState.keywords = value.toString();
      };
      //正文
      function handleChange(value: string) {
        formState.content = value;
      }
      //上传图片
      const changeFile = async (info) => {
        if (info.file.status === 'done') {
          formState.img = info.file.response.data;
        }
      };
      //是否在手机端展示
      const inMobileChange = async (value) => {
        formState.inMobile = value;
      };
      //分类展示
      const sortChange = async (value) => {
        formState.sort = value;
      };

      let area = ref<string[]>([]);
      //设置项目
      const setNewsProject = async (value) => {
        loading.value = true;
        if (value.projects && value.projects.length > 0) {
          formState.projects = [];
          value.projects.forEach(async (item) => {
            if (!formState.projects) {
              formState.projects = [];
            }
            if (item.id) {
              const { content } = await getProject(item.id);
              formState.projects.push({ id: item.id, name: content.name });
            }
          });
          success(t('host.news.setProject'), t('host.action.success'));
        }
        loading.value = false;
      };

      //正文违规词
      let isViolation = ref(false);
      let number = ref();
      let violations = ref<string[]>();
      //标题违规
      let titleVio = ref(false);
      let titNumber = ref();
      let titViolations = ref<string[]>();
      //描述违规
      let desVio = ref(false);
      let desNumber = ref();
      let desViolations = ref<string[]>();
      //提交
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            isViolation.value = false;
            titleVio.value = false;
            desVio.value = false;
            if (props.id) {
              loading.value = true;
              try {
                const result = await updateNews(formState);
                if (result.code === 400) {
                  if (result.content.length > 0) {
                    number.value = result.content.length;
                    isViolation.value = true;
                    violations.value = result.content;
                  }
                  if (result.title.length > 0) {
                    titleVio.value = true;
                    titNumber.value = result.title.length;
                    titViolations.value = result.title;
                  }
                  if (result.description.length > 0) {
                    desVio.value = true;
                    desNumber.value = result.description.length;
                    desViolations.value = result.description;
                  }
                  failed('出现违规词', '请根据提示信息进行修改');
                  return;
                }
                success(t('host.action.update'), t('host.action.success'));
                Persistent.removeLocal(HOUSE_NEWS, true);
              } catch (error: any) {
                failed(error?.response?.data?.message, t('host.action.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              loading.value = true;
              try {
                const result = await addNews(formState);
                if (result.code === 400) {
                  if (result.content.length > 0) {
                    number.value = result.content.length;
                    isViolation.value = true;
                    violations.value = result.content;
                  }
                  if (result.title.length > 0) {
                    titleVio.value = true;
                    titNumber.value = result.title.length;
                    titViolations.value = result.title;
                  }
                  if (result.description.length > 0) {
                    desVio.value = true;
                    desNumber.value = result.description.length;
                    desViolations.value = result.description;
                  }
                  failed('出现违规词', '请根据提示信息进行修改');
                  return;
                }
                success(t('host.action.add'), t('host.action.success'));
                Persistent.removeLocal(HOUSE_NEWS, true);
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
        if (formState.keywords) {
          const deTag: string[] = formState.keywords.split(',');
          deTag.forEach((tag) => {
            options.value.push({ value: tag, label: tag });
            tags.value.push(tag);
          });
        }
        if (props.id) {
          options.value.splice(0);
          tags.value.splice(0);
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
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
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
        isViolation,
        number,
        violations,
        titleVio,
        titNumber,
        titViolations,
        desVio,
        desNumber,
        desViolations,
        log,
      };
    },
  });
</script>
