<template>
  <div :class="prefixCls" class="p-4">
    <Button @click="setChannel">设置</Button>
    <div class="mt-4 lg:grid lg:grid-cols-2 lg:p-4 gap-x-4">
      <div v-if="formState.channelEntities && formState.channelEntities.length > 0">
        <div class="text-[20px] font-medium">渠道信息:</div>
        <div
          class="p-2 mt-2 border-b border-dotted"
          v-for="item in formState.channelEntities"
          :key="item.id"
        >
          <div>
            <span>名称：</span>
            <span>{{ item.name }}</span>
          </div>
          <div>
            <span>用户名：</span>
            <span>{{ item.username }}</span>
          </div>
          <div>
            <span>联系方式：</span>
            <span>{{ item.contact }}</span>
          </div>
          <div>
            <span>描述：</span>
            <span>{{ item.description }}</span>
          </div>
          <div>
            <span>状态：</span>
            <span v-if="item.state === '1'">有效</span>
            <span v-if="item.state === '0'">无效</span>
          </div>
        </div>
      </div>
      <div
        class="pl-4 border-l-2"
        v-if="formState.channelCaseEntities && formState.channelCaseEntities.length > 0"
      >
        <div class="text-[20px] font-medium">驻场信息:</div>
        <div
          class="p-2 mt-2 border-b border-dotted"
          v-for="item in formState.channelCaseEntities"
          :key="item.id"
        >
          <div>
            <span>名称：</span>
            <span>{{ item.name }}</span>
          </div>
          <div>
            <span>联系方式：</span>
            <span>{{ item.contact }}</span>
          </div>
          <div>
            <span>状态：</span>
            <span v-if="item.state === '1'">有效</span>
            <span v-if="item.state === '0'">无效</span>
          </div>
        </div>
      </div>
    </div>
    <Modal
      :bodyStyle="{ overflow: 'auto' }"
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width="60%"
      :footer="null"
      :destroyOnClose="true"
    >
      <ChannelTable :id="drawerParam.id" v-if="drawerParam.state === '0'" />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { getProjectChannel } from '/@/api/host/projectChannel/projectChannel';
  import { ChannelAndCase } from '/@/api/host/projectChannel/model/projectChannelModel';
  import {
    Button,
    Modal,
    //   Form,
    //   FormItem,
    //   InputNumber,
    //   RadioGroup,
    //   Radio,
    //   Textarea,
    //   TimePicker,
  } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  // import { success, failed } from '/@/hooks/web/useList';
  // import moment, { Moment } from 'moment';
  import ChannelTable from './ChannelTable.vue';

  export default defineComponent({
    name: 'ChannelForm',
    components: {
      Button,
      Modal,
      ChannelTable,
      // Form,
      // FormItem,
      // InputNumber,
      Loading,
      // RadioGroup,
      // Radio,
      // Textarea,
      // TimePicker,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('reportRule');
      // const reportRuleConst = ref(ReportRuleConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<ChannelAndCase> = reactive({
        id: props.id,
      });

      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
      });

      const onClose = async () => {
        drawerParam.id = '';
        drawerParam.state = '';
        drawerParam.title = '';
        drawerParam.visible = false;
        const result = await getProjectChannel(props.id);
        Object.assign(formState, result.content);
      };

      // 设置渠道
      const setChannel = () => {
        drawerParam.title = '设置渠道信息';
        drawerParam.state = '0';
        drawerParam.visible = true;
        drawerParam.id = props.id;
      };

      onMounted(async () => {
        try {
          loading.value = true;
          let result;
          result = await getProjectChannel(props.id);
          Object.assign(formState, result.content);
          console.log(result);
        } catch (error) {
        } finally {
          loading.value = false;
        }
      });

      return {
        t,
        prefixCls,
        // reportRuleConst,
        loading,
        tip,
        formRef,
        formState,
        // onSubmit,
        // resetForm,
        labelCol: { span: 9 },
        wrapperCol: { span: 14 },
        props,
        onClose,
        drawerParam,
        setChannel,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-reportRule';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;
    }
  }

  .@{prefix-cls} {
    &-action-menu-item {
      text-align: center;
    }

    &-add {
      margin-top: 20px;
      margin-right: 10px;
      margin-bottom: 20px;
    }
  }
</style>
