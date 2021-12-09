<template>
  <div :class="prefixCls" :style="{ width: containerWidth }">
    <ImgUpload
      :fullscreen="fullscreen"
      @uploading="handleImageUploading"
      @done="handleDone"
      v-if="showImageUpload"
      v-show="editorRef"
      :disabled="disabled"
      :provinceId="props.provinceId"
      :cityId="props.cityId"
    />
    <textarea :id="tinymceId" ref="elRef" :style="{ visibility: 'hidden' }">
      <Img ref="imgref" :src="address" width="100px" />
    </textarea>
    <Modal
      title="设置项目信息"
      :visible="isOk"
      @cancel="onClose"
      :footer="null"
      :bodyStyle="{ overflow: 'auto', 'margin-top': '16px' }"
      :destroyOnClose="true"
    >
      <ProjectForm @projectInfo="projectInfo" />
    </Modal>
    <Modal
      title="设置图片alt"
      :visible="isShow"
      ok-text="保存"
      cancel-text="取消"
      @ok="setAltText"
      @cancel="onCloseImg"
      :bodyStyle="{ overflow: 'auto', 'margin-top': '16px' }"
      :destroyOnClose="true"
    >
      <Input
        v-model:value="curAlt"
        style="width: 60%; height: 128; margin-left: 20%; margin-bottom: 16px"
        placeholder="请输入图片alt"
      />
    </Modal>
  </div>
</template>

<script lang="ts">
  import type { RawEditorSettings } from 'tinymce';
  import tinymce from 'tinymce/tinymce';
  import 'tinymce/themes/silver';
  import 'tinymce/icons/default/icons';
  import 'tinymce/plugins/advlist';
  import 'tinymce/plugins/anchor';
  import 'tinymce/plugins/autolink';
  import 'tinymce/plugins/autosave';
  import 'tinymce/plugins/code';
  import 'tinymce/plugins/codesample';
  import 'tinymce/plugins/directionality';
  import 'tinymce/plugins/fullscreen';
  import 'tinymce/plugins/hr';
  import 'tinymce/plugins/insertdatetime';
  import 'tinymce/plugins/link';
  import 'tinymce/plugins/lists';
  import 'tinymce/plugins/media';
  import 'tinymce/plugins/nonbreaking';
  import 'tinymce/plugins/noneditable';
  import 'tinymce/plugins/pagebreak';
  import 'tinymce/plugins/paste';
  import 'tinymce/plugins/preview';
  import 'tinymce/plugins/print';
  import 'tinymce/plugins/save';
  import 'tinymce/plugins/searchreplace';
  import 'tinymce/plugins/spellchecker';
  import 'tinymce/plugins/tabfocus';
  // import 'tinymce/plugins/table';
  import 'tinymce/plugins/template';
  import 'tinymce/plugins/textpattern';
  import 'tinymce/plugins/visualblocks';
  import 'tinymce/plugins/visualchars';
  import 'tinymce/plugins/wordcount';

  import {
    defineComponent,
    computed,
    nextTick,
    ref,
    unref,
    watch,
    onUnmounted,
    onDeactivated,
  } from 'vue';
  import { toolbar, plugins } from './tinymce';
  import { buildShortUUID } from '/@/utils/uuid';
  import { bindHandlers } from './helper';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { isNumber } from '/@/utils/is';
  import { useLocale } from '/@/locales/useLocale';
  import { useAppStore } from '/@/store/modules/app';
  import { ApiSource } from '/@/api/host/source/source';
  import ImgUpload from './ImgUpload.vue';
  import ProjectForm from './ProjectForm.vue';
  import { Modal, Input } from 'ant-design-vue';

  const tinymceProps = {
    contViolations: {
      type: Array,
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
    options: {
      type: Object as PropType<Partial<RawEditorSettings>>,
      default: {},
    },
    value: {
      type: String,
    },

    toolbar: {
      type: Array as PropType<string[]>,
      default: toolbar,
    },
    plugins: {
      type: Array as PropType<string[]>,
      default: plugins,
    },
    modelValue: {
      type: String,
    },
    height: {
      type: [Number, String] as PropType<string | number>,
      required: false,
      default: 400,
    },
    width: {
      type: [Number, String] as PropType<string | number>,
      required: false,
      default: 'auto',
    },
    showImageUpload: {
      type: Boolean,
      default: true,
    },
  };

  export default defineComponent({
    name: 'FTinymce',
    components: { ImgUpload, ProjectForm, Modal, Input },
    inheritAttrs: false,
    props: tinymceProps,
    emits: ['change', 'update:modelValue'],
    setup(props, { emit, attrs }) {
      const { notification, createErrorModal } = useMessage();
      const editorRef = ref();
      const fullscreen = ref(false);
      const tinymceId = ref<string>(buildShortUUID('tiny-vue'));
      const elRef = ref<Nullable<HTMLElement>>(null);

      const { prefixCls } = useDesign('tinymce-container');
      const curAlt = ref<string>('');

      const appStore = useAppStore();

      const tinymceContent = computed(() => props.modelValue);

      const containerWidth = computed(() => {
        const width = props.width;
        if (isNumber(width)) {
          return `${width}px`;
        }
        return width;
      });

      const skinName = computed(() => {
        return appStore.getDarkMode === 'light' ? 'oxide' : 'oxide-dark';
      });

      const langName = computed(() => {
        const lang = useLocale().getLocale.value;
        //LocalType都有 'zh_CN' | 'en' | 'ru' | 'ja' | 'ko'几种
        return ['zh_CN', 'en'].includes(lang) ? lang : 'zh_CN';
      });

      function getUploadingImgName(name: string) {
        return `[uploading:${name}]`;
      }
      const imgRef = ref('');

      //上传图片
      function handleImageUploading(name: string) {
        const editor = unref(editorRef);
        if (!editor) {
          return;
        }
        // const content = editor?.getContent() ?? '';
        const element = editor.getDoc().createElement('div');
        element.innerText = `${getUploadingImgName(name)}`;
        editor.selection.getRng().insertNode(element);
        // setValue(editor, `${content}\n${getUploadingImgName(name)}`);
        // setValue(imgRef, data);
      }
      function handleDone(name: string, url: string) {
        const editor = unref(editorRef);
        if (!editor) {
          return;
        }
        const content = editor?.getContent() ?? '';
        const val =
          content?.replace(getUploadingImgName(name), `<img style="width:30%" src="${url}"/>`) ??
          '';
        setValue(editor, val); //满足条件，将val赋值给editor的content
      }

      const initOptions = computed((): RawEditorSettings => {
        const { height, options, toolbar, plugins } = props;
        const publicPath = import.meta.env.VITE_PUBLIC_PATH || '/';
        return {
          fontsize_formats:
            '8pt 9pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 18pt 19pt 20pt 21pt 22pt 23pt 24pt 25pt 26pt 27pt 28pt 29pt 30pt 36pt',
          selector: `#${unref(tinymceId)}`,
          height,
          toolbar,
          menubar: 'file edit insert view format table',
          plugins,
          language_url: publicPath + 'resource/tinymce/langs/' + langName.value + '.js',
          language: langName.value,
          branding: false,
          default_link_target: '_blank',
          link_title: false,
          object_resizing: false,
          auto_focus: true,
          skin: skinName.value,
          skin_url: publicPath + 'resource/tinymce/skins/ui/' + skinName.value,
          content_css: publicPath + 'src/components/FTinymce/css/contentCSS.css',
          // publicPath + 'resource/tinymce/skins/ui/' + skinName.value + '/content.min.css',
          ...options,
          setup: (editor) => {
            editorRef.value = editor;
            editor.on('init', (e) => initSetup(e));

            editor.ui.registry.addButton('addProject', {
              icon: 'duplicate',
              tooltip: '添加推荐楼盘',
              onAction: () => {
                addProject();
              },
            });

            editor.ui.registry.addButton('big', {
              icon: 'zoom-in',
              tooltip: '放大图片',
              onAction: () => {
                zoomIn();
              },
            });

            editor.ui.registry.addButton('small', {
              icon: 'zoom-out',
              tooltip: '缩小图片',
              onAction: () => {
                zoomOut();
              },
            });

            editor.ui.registry.addButton('setImgAlt', {
              icon: 'comment-add',
              tooltip: '设置图片alt',
              onAction: () => {
                setImgAlt();
              },
            });
          },
        };
      });

      const disabled = computed(() => {
        const { options } = props;
        const getdDisabled = options && Reflect.get(options, 'readonly');
        const editor = unref(editorRef);
        if (editor) {
          editor.setMode(getdDisabled ? 'readonly' : 'design');
        }
        return getdDisabled ?? false;
      });

      watch(
        () => attrs.disabled,
        () => {
          const editor = unref(editorRef);
          if (!editor) {
            return;
          }
          editor.setMode(attrs.disabled ? 'readonly' : 'design');
        }
      );

      onMountedOrActivated(() => {
        tinymceId.value = buildShortUUID('tiny-vue');
        nextTick(() => {
          setTimeout(() => {
            initEditor();
          }, 30);
        });
      });

      onUnmounted(() => {
        destory();
      });

      onDeactivated(() => {
        destory();
      });

      function destory() {
        if (tinymce !== null) {
          tinymce?.remove?.(unref(editorRef));
        }
      }

      let isOk = ref<boolean>(false);
      const onClose = () => {
        isOk.value = false;
      };

      let isShow = ref<boolean>(false);
      const onCloseImg = () => {
        isShow.value = false;
      };

      function addProject() {
        isOk.value = true;
      }

      const success = (message: any, description: any) => {
        notification.success({
          message: message,
          description: description,
          duration: 3,
        });
      };

      const failed = (title: any, content: any) => {
        createErrorModal({
          title: title,
          content: content,
        });
      };

      const projectInfo = async (value) => {
        const editor = unref(editorRef);
        const element = editor.getDoc().createElement('div');
        const labelsArray = value.labels.split(',');
        let labelHtml = '';
        let i = 0;
        for (i; i < labelsArray.length; i++) {
          labelHtml = labelHtml + '<span class="labelStyle">' + labelsArray[i] + '</span>';
        }
        let saleState = '';
        if (value.saleState) {
          if (value.saleState === '1') {
            saleState = '在售';
          }
          if (value.saleState === '2') {
            saleState = '待售';
          }
          if (value.saleState === '3') {
            saleState = '售罄';
          }
        }
        if (!value.hLayoutsById) {
          value.hLayoutsById = '暂无数据';
        }
        let html = `<div class="pdiv">
          <div class="mdiv">
            <div class="sdiv">
              <div class="imgdiv">
                <img src="${value.firstImg}" alt="${value.name.label}" class="imgstyle" >
              </div>
              <div class="rightDiv">
                <div class="title">
                  <a href="/house/${value.id}.html" target="_blank" class="nameStyle">${value.name.label}</a>
                  <span class="hcss">${saleState}</span>
                </div>
                <div class="setbo">
                <div class="areaStyle">
                  <span class="mrt">[${value.area}]</span>
                  <span class="mrt"> ${value.address}</span>
                </div>
                <div class="areaStyle">
                  <span>户型：</span>
                  <span>${value.hLayoutsById}</span>
                </div>
                <div class="areaStyle">
                  <span class="fontcolor">${value.price}</span>
                  <span>元/㎡</span>
                </div>
                <div class="labelDiv">`;
        html =
          html +
          labelHtml +
          `</div>
              </div>
              </div>
            </div>
          </div>
        </div>`;
        // const content = editor?.getContent() ?? '';
        element.innerHTML = html;
        editor.selection.getRng().insertNode(element);
        // setValue(editor, html);
        isOk.value = false;
      };

      function zoomIn() {
        const editor = unref(editorRef);
        const element = editor.selection.getNode();
        if (element.tagName !== 'IMG') {
          failed('放大图片', '未选择的图片标签');
          return;
        }
        let curWidth: string = element.style.width;
        if (!curWidth || curWidth === '' || !curWidth.endsWith('%')) {
          curWidth = '30%';
        }
        if (curWidth.endsWith('%')) {
          curWidth = curWidth.replace('%', '');
          const result = Number(curWidth) + 5;
          element.style.width = result + '%';
          editor.dom.setStyles(editor.selection.getNode(), {
            width: result + '%',
          });
        }
      }

      function zoomOut() {
        const editor = unref(editorRef);
        const element = editor.selection.getNode();
        if (element.tagName !== 'IMG') {
          failed('缩小图片', '未选择的图片标签');
          return;
        }
        let curWidth: string = element.style.width;
        if (!curWidth || curWidth === '' || !curWidth.endsWith('%')) {
          curWidth = '30%';
        }
        if (curWidth.endsWith('%')) {
          curWidth = curWidth.replace('%', '');
          if (Number(curWidth) - 5 < 1) {
            return;
          }
          const result = Number(curWidth) - 5;
          element.style.width = result + '%';
          editor.dom.setStyles(editor.selection.getNode(), {
            width: result + '%',
          });
        }
      }

      function setImgAlt() {
        const editor = unref(editorRef);
        const element = editor.selection.getNode();
        if (element.tagName !== 'IMG') {
          failed('设置图片alt', '未选择的图片标签');
          return;
        }
        curAlt.value = element.alt;
        isShow.value = true;
      }
      function setAltText() {
        const editor = unref(editorRef);
        const element = editor.selection.getNode();
        if (element.tagName !== 'IMG') {
          failed('设置图片alt', '未选择的图片标签');
          return;
        }
        element.alt = curAlt.value;
        editor.dom.setAttribs(editor.selection.getNode(), { alt: curAlt.value });
        success('设置图片alt', '设置alt成功');
      }

      function initEditor() {
        const el = unref(elRef);
        if (el) {
          el.style.visibility = '';
        }
        tinymce.init(unref(initOptions));
      }

      function initSetup(e) {
        const editor = unref(editorRef);
        if (!editor) {
          return;
        }
        const value = props.modelValue || '';
        // editor.getBody().style.fontSize = '14pt';
        editor.setContent(value);
        bindModelHandlers(editor);
        bindHandlers(e, attrs, unref(editorRef));
      }

      function setValue(editor: Recordable, val: string, prevVal?: string) {
        if (
          editor &&
          typeof val === 'string' &&
          val !== prevVal &&
          val !== editor.getContent({ format: attrs.outputFormat })
        ) {
          editor.setContent(val);
        }
      }

      function bindModelHandlers(editor: any) {
        const modelEvents = attrs.modelEvents ? attrs.modelEvents : null;
        const normalizedEvents = Array.isArray(modelEvents) ? modelEvents.join(' ') : modelEvents;

        watch(
          () => props.modelValue,
          (val: string, prevVal: string) => {
            setValue(editor, val, prevVal);
          }
        );

        watch(
          () => props.value,
          (val: string, prevVal: string) => {
            setValue(editor, val, prevVal);
          },
          {
            immediate: true,
          }
        );

        editor.on(normalizedEvents ? normalizedEvents : 'change keyup undo redo', () => {
          const content = editor.getContent({ format: attrs.outputFormat });
          emit('update:modelValue', content);
          emit('change', content);
        });

        editor.on('FullscreenStateChanged', (e) => {
          fullscreen.value = e.state;
        });
      }

      watch(
        () => props.contViolations,
        (_v1, _v2) => {}
      );

      return {
        prefixCls,
        containerWidth,
        initOptions,
        tinymceContent,
        elRef,
        tinymceId,
        editorRef,
        fullscreen,
        disabled,
        ApiSource,
        props,
        handleImageUploading,
        handleDone,
        imgRef,
        onClose,
        isShow,
        onCloseImg,
        setAltText,
        isOk,
        projectInfo,
        curAlt,
      };
    },
  });
</script>

<style lang="less" scoped></style>

<style lang="less">
  @prefix-cls: ~'@{namespace}-tinymce-container';

  .@{prefix-cls} {
    position: relative;
    line-height: normal;

    textarea {
      z-index: -1;
      visibility: hidden;
    }
  }
</style>
