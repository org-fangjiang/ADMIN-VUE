//问题
<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <!-- 状态筛选 -->
    <Select
      :class="`${prefixCls}-sel`"
      ref="select"
      :allowClear="true"
      v-model:value="condition.state"
      style="width: 120px"
      @change="stateHandleChange"
      :options="answerConst.STATES"
      :pagination="false"
    />
    <Button v-auth="answerConst._PERMS.ADD" @click="addAnswer" :class="`${prefixCls}-sel`">{{
      t('host.action.add')
    }}</Button>
    <Table
      :columns="ColumnsAnswer"
      :data-source="list"
      rowKey="id"
      :pagination="pagination"
      @change="handleTableChange"
      :scroll="{ y: 'calc(70vh)' }"
    >
      <template #state="{ text: state }">
        <span>
          <Tag :color="answerConst.STATES[state].color">
            {{ answerConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: line }">
        <Button
          :class="prefixCls"
          v-auth="answerConst._PERMS.DELETE"
          type="link"
          size="small"
          @click="deleteOneAnswer(line)"
        >
          {{ t('host.action.delete') }}
        </Button>
        <Button
          :class="prefixCls"
          v-auth="answerConst._PERMS.UPDATE"
          type="link"
          size="small"
          @click="reEnableOneAnswer(line)"
        >
          {{ t('host.action.reEnable') }}
        </Button>
      </template>
    </Table>
    <Modal
      :bodyStyle="{ overflow: 'auto', 'margin-top': '16px' }"
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width=""
      :footer="null"
      :destroyOnClose="true"
    >
      <AnswerForm v-if="drawerParam.state === '0'" :id="drawerParam.id" :questionId="props.id" />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasePageResult, PageParam } from '/@/api/model/baseModel';
  import { Table, Tag, Button, Modal, Select } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import {
    AnswerModel,
    _AnswerConst,
    _ColumnsAnswer as ColumnsAnswer,
  } from '/@/api/host/answer/model/answerModel';
  import { deleteAnswer, getAnswers, reEnableAnswer } from '/@/api/host/answer/answer';
  import AnswerForm from './AnswerForm.vue';
  import { processListByLine, success, failed } from '/@/hooks/web/useList';

  export default defineComponent({
    name: 'AnswerTable',
    components: {
      Table,
      Tag,
      Button,
      Modal,
      Loading,
      AnswerForm,
      Select,
    },
    props: {
      id: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');
      const answerConst = ref(_AnswerConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //设置分页
      const pageParam: PageParam = reactive({
        pageNum: 1,
        pageSize: 10,
      });
      const total = ref<number>(0);
      const pagination = computed(() => ({
        total: total.value,
        current: pageParam.pageNum,
        pageSize: pageParam.pageSize,
      }));
      //页码修改
      const handleTableChange = async (pag: any) => {
        pageParam.pageSize = pag!.pageSize!;
        pageParam.pageNum = pag?.current;
        const result = await getList();
        processListByLine(result, list, total);
      };

      // 筛选条件
      const condition = reactive({
        state: '1',
        questionId: props.id || '',
        id: '',
      });

      //根据状态筛选
      const stateHandleChange = async (value) => {
        condition.state = value;
        pageParam.pageNum = 1;
        const result = await getList();
        processListByLine(result, list, total);
      };

      // 列表结果
      const answer: AnswerModel[] = [];
      let list = reactive(answer);
      // 抽屉参数
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
      });
      //打开modal，添加回答
      const addAnswer = async () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('host.action.add');
      };
      //关闭modal，清空数据
      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        const result = await getList();
        processListByLine(result, list, total);
      };

      //初始加载
      onMounted(async () => {
        const result = await getList();
        processListByLine(result, list, total);
      });

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<AnswerModel> | undefined;
        try {
          result = await getAnswers(condition, pageParam);
        } catch (error: any) {
          createErrorModal({
            title: t('sys.api.errorTip'),
            content: error?.response?.data?.message || t('sys.api.networkExceptionMsg'),
            // getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
          });
        } finally {
          loading.value = false;
        }
        return result;
      };

      //删除
      const deleteOneAnswer = async (line) => {
        try {
          loading.value = true;
          await deleteAnswer(line.id);
          success(t('host.action.delete'), t('host.action.success'));
          const result = await getList();
          processListByLine(result, list, total);
        } catch (error: any) {
          failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };
      //恢复
      const reEnableOneAnswer = async (line) => {
        try {
          loading.value = true;
          await reEnableAnswer(line.id);
          success(t('host.action.reEnable'), t('host.action.success'));
          const result = await getList();
          processListByLine(result, list, total);
        } catch (error: any) {
          failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };

      return {
        t,
        prefixCls,
        answerConst,
        condition,
        ColumnsAnswer,
        loading,
        tip,
        pagination,
        handleTableChange,
        list,
        drawerParam,
        deleteOneAnswer,
        reEnableOneAnswer,
        onClose,
        addAnswer,
        props,
        stateHandleChange,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-project';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;
    }
  }

  .@{prefix-cls} {
    &-sel {
      margin-right: 10px;
      margin-bottom: 20px;
    }
  }
</style>
