<template>
  <div :class="[prefixCls, { fullscreen }]">
    <!-- <a-button type="primary" @click="onOK" v-bind="{ ...getButtonProps }">
      {{ t('component.upload.imgUpload') }}
    </a-button>
    <Modal :visible="isOk" @cancel="onClose" :footer="null">
      <h4>图片宽度百分比</h4>
      <Slider id="width" v-model:value="width" :disabled="disabled" />
      <Upload
        name="file"
        multiple
        :data="{
          provinceId: props.provinceId,
          cityId: props.cityId,
        }"
        :action="ApiSource.UploadNews"
        @change="handleChange"
        :showUploadList="false"
      >
        <a-button type="primary">
          {{ t('component.upload.imgUpload') }}
        </a-button>
      </Upload>
    </Modal> -->
    <Upload
      name="file"
      multiple
      :data="{
        provinceId: props.provinceId,
        cityId: props.cityId,
      }"
      :action="ApiSource.UploadNews"
      @change="handleChange"
      :showUploadList="false"
    >
      <a-button type="primary">
        {{ t('component.upload.imgUpload') }}
      </a-button>
    </Upload>
  </div>
</template>
<script lang="ts">
  import { defineComponent, computed, ref } from 'vue';
  import { ApiSource } from '/@/api/host/source/source';
  import { Upload } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useI18n } from '/@/hooks/web/useI18n';

  export default defineComponent({
    name: 'TinymceImageUpload',
    components: { Upload },
    props: {
      fullscreen: {
        type: Boolean,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      provinceId: {
        type: String,
        required: true,
      },
      cityId: {
        type: String,
        required: true,
      },
    },
    emits: ['uploading', 'done', 'error'],
    setup(props, { emit }) {
      debugger;
      let uploading = false;
      let width = ref(0);
      let isOk = ref<boolean>(false);

      const onOK = async () => {
        isOk.value = true;
      };
      const onClose = async () => {
        isOk.value = false;
      };

      const { uploadUrl } = useGlobSetting();
      const { t } = useI18n();
      const { prefixCls } = useDesign('tinymce-img-upload');

      const getButtonProps = computed(() => {
        const { disabled } = props;
        return {
          disabled,
        };
      });

      function handleChange(info: Recordable) {
        const file = info.file;
        const status = file?.status;
        const name = file?.name;

        if (status === 'uploading') {
          if (!uploading) {
            emit('uploading', name);
            uploading = true;
          }
        } else if (status === 'done') {
          const url = file?.response?.data;
          debugger;
          emit('done', name, url, width.value + '%');
          uploading = false;
        } else if (status === 'error') {
          emit('error');
          uploading = false;
        }
      }

      return {
        prefixCls,
        handleChange,
        uploadUrl,
        t,
        getButtonProps,
        ApiSource,
        props,
        width,
        isOk,
        onOK,
        onClose,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-tinymce-img-upload';

  .@{prefix-cls} {
    position: absolute;
    top: 4px;
    right: 10px;
    z-index: 20;

    &.fullscreen {
      position: fixed;
      z-index: 10000;
    }
  }
</style>
