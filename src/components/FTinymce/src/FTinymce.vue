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
          content_css:
            publicPath + 'resource/tinymce/skins/ui/' + skinName.value + '/content.min.css',
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
        const html = `<div style="width:75%;margin:auto;background-color:#fff;margin-top:16px">
          <div style="width:100%;height:192px;margin:auto;">
            <div style="display:flex;flex-direction:row;width:100%;height:100%">
              <div style="width:40%;height:100%">
                <img src="${value.firstImg}" alt="${value.name.label}" style="object-fit:cover;width:100%;height:100%" >
              </div>
              <div style="width:40%;height:100%;padding-left:16px;">
                <div>
                  <a href="/house/${value.id}.html" target="_blank" style="width:100%;font-size:18px;font-weight:700;">${value.name.label}</a>
                </div>
                <div style="margin-top: 8px;">
                  <span>${value.area} | ${value.address}</span>
                </div>
                <div style="margin-top: 8px;">
                  <span>热门户型：</span>
                  <span>${value.hLayoutsById}</span>
                </div>
                <div style="margin-top: 8px;width: 100%;display: flex;flex-direction: row;">
                  <div style="width: auto;">
                    <svg t="1633400753682" style="width: 16px;height: 16px;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15995" width="32" height="32"><path d="M649.745 673.15l31.413-31.378L814.23 774.995l-31.413 31.377zM631.7 691.2l-20.2 20.2c-33 33.1-86.6 33.1-119.6 0L312.4 531.9c-33.1-33.1-33-86.6 0-119.7l20.2-20.2-133-133c-96.1 99.4-95.2 257.7 2.9 355.9l206.4 206.4c98.1 98.1 256.5 99 355.9 2.8L631.7 691.2zM350.5 374.1l31.5-31.4-133.2-133.1-31.4 31.4zM818 203.9l16.3 116.8L725 276.4zM780.3 212.3c-59.7-52.5-138-84.3-223.7-84.3-94.5 0-179.9 38.7-241.5 101l39.2 39.2c51.5-52.3 123-84.9 202.2-84.9 67.9 0 130.3 23.9 179.1 63.7l44.7-34.7z" fill="#015eea" p-id="15996" data-spm-anchor-id="a313x.7781069.0.i0" class="selected"></path><path d="M847 291.8l3.7 26.6 4 28.5-26.6-10.8-25.3-10.3c24 41.6 37.7 89.9 37.7 141.4 0 79.2-32.5 150.8-84.9 202.3l39.1 39.1c62.4-61.5 101.1-146.9 101.1-241.4C895.8 403 878 343 847 291.8zM565.6 470.2H436.4c1.5-12.8 6-24.7 13.5-36 7.5-11.2 21.6-24.5 42.2-39.8 12.6-9.4 20.7-16.5 24.2-21.4 3.5-4.9 5.3-9.5 5.3-13.8 0-4.7-1.7-8.8-5.2-12.1-3.5-3.4-7.9-5-13.2-5-5.5 0-10 1.7-13.5 5.2s-5.8 9.6-7 18.3l-43.1-3.5c1.7-12.1 4.8-21.6 9.3-28.4 4.5-6.8 10.9-12 19.1-15.6 8.2-3.6 19.6-5.5 34.1-5.5 15.2 0 26.9 1.7 35.4 5.2 8.4 3.4 15.1 8.7 19.9 15.9 4.9 7.2 7.2 15.2 7.2 24.1 0 9.4-2.8 18.5-8.3 27.1-5.5 8.6-15.6 18-30.2 28.3-8.7 6-14.5 10.2-17.4 12.6-2.9 2.4-6.4 5.5-10.3 9.4h67.2v35zM658 441.2h-78.5v-35.4l78.5-93.3h37.5v95.3H715v33.4h-19.5v29H658v-29z m0-33.4V359l-41.5 48.8H658zM436.4 497.7h23.7v26.9h26v-26.9H510v76.9h-23.9v-31.1h-26v31.1h-23.7v-76.9zM521.7 546.9c0-8.5 2.9-15.5 8.6-21 5.7-5.5 13.5-8.3 23.2-8.3 11.2 0 19.6 3.2 25.3 9.7 4.6 5.2 6.9 11.6 6.9 19.2 0 8.6-2.9 15.6-8.5 21.1-5.7 5.5-13.5 8.2-23.6 8.2-8.9 0-16.2-2.3-21.7-6.8-6.8-5.6-10.2-13-10.2-22.1z m21.4-0.1c0 5 1 8.6 3 11 2 2.4 4.5 3.6 7.6 3.6 3.1 0 5.6-1.2 7.6-3.5 2-2.4 2.9-6.1 2.9-11.3 0-4.8-1-8.4-3-10.8-2-2.3-4.5-3.5-7.4-3.5-3.1 0-5.7 1.2-7.7 3.6-2 2.4-3 6.1-3 10.9zM654.7 574.6h-19.9v-9c-3 3.7-6 6.4-9 7.9-3 1.6-6.7 2.3-11.1 2.3-5.9 0-10.5-1.8-13.8-5.3-3.3-3.5-5-8.9-5-16.2v-35.5h21.5v30.6c0 3.5 0.6 6 2 7.5 1.3 1.5 3.1 2.2 5.4 2.2 2.5 0 4.6-1 6.3-2.9 1.6-1.9 2.4-5.5 2.4-10.5v-26.8h21.3v55.7zM667.8 518.9h20v9.1c1.9-3.9 3.9-6.7 6-8.2 2-1.5 4.6-2.2 7.6-2.2 3.2 0 6.6 1 10.3 3l-6.6 15.2c-2.5-1-4.5-1.6-6-1.6-2.8 0-5 1.1-6.5 3.5-2.2 3.2-3.3 9.3-3.3 18.2v18.7h-21.5v-55.7z" fill="#015eea" p-id="15997" data-spm-anchor-id="a313x.7781069.0.i3" class="selected"></path></svg>
                  </div>
                  <span>${value.number}</span>
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
          failed('设置图片alt', '未选择的图片标签');
          return;
        }
        let curWidth: string = element.style.width;
        if (!curWidth || curWidth === '' || !curWidth.endsWith('%')) {
          curWidth = '30%';
        }
        if (curWidth.endsWith('%')) {
          curWidth = curWidth.replace('%', '');
          const result = Number(curWidth) + 5;
          editor.selection.getNode().style.width = result + '%';
        }
      }

      function zoomOut() {
        const editor = unref(editorRef);
        const element = editor.selection.getNode();
        if (element.tagName !== 'IMG') {
          failed('设置图片alt', '未选择的图片标签');
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
          editor.selection.getNode().style.width = result + '%';
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
        debugger;
        const editor = unref(editorRef);
        const element = editor.selection.getNode();
        if (element.tagName !== 'IMG') {
          failed('设置图片alt', '未选择的图片标签');
          return;
        }
        element.alt = curAlt.value;
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
