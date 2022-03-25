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
      :options="questionConst.STATES"
      :pagination="false"
    />
    <Button v-auth="questionConst._PERMS.ADD" @click="addquestion" :class="`${prefixCls}-sel`">{{
      t('host.action.add')
    }}</Button>
    <Table
      :columns="ColumnsQuestion"
      :data-source="list"
      rowKey="id"
      :pagination="pagination"
      @change="handleTableChange"
      :scroll="{ y: 'calc(70vh)' }"
    >
      <template #state="{ text: state }">
        <span>
          <Tag :color="questionConst.STATES[state].color">
            {{ questionConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: line }">
        <Button
          :class="prefixCls"
          v-auth="questionConst._PERMS.DELETE"
          type="link"
          size="small"
          @click="deleteOneQuestion(line)"
          v-if="line.state != '0'"
        >
          {{ t('host.action.delete') }}
        </Button>
        <Button
          :class="prefixCls"
          v-else
          v-auth="questionConst._PERMS.UPDATE"
          type="link"
          size="small"
          @click="reEnableOneQuestion(line)"
        >
          {{ t('host.action.reEnable') }}
        </Button>
        <Button
          :class="prefixCls"
          v-auth="questionConst._PERMS.ADD"
          type="link"
          size="small"
          @click="updateQuestion(line)"
        >
          {{ t('host.action.update') }}
        </Button>
        <Button
          :class="prefixCls"
          v-auth="questionConst._PERMS.ADD"
          type="link"
          size="small"
          @click="setAnswer(line)"
        >
          {{ t('host.question.setAnswer') }}
        </Button>
      </template>
    </Table>
    <Modal
      :bodyStyle="{ overflow: 'auto', 'margin-top': '16px' }"
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width="50%"
      :footer="null"
      :destroyOnClose="true"
    >
      <QuestionForm v-if="drawerParam.state === '0'" :id="drawerParam.id" :projectId="props.id" />
      <AnswerTable v-if="drawerParam.state === '1'" :id="drawerParam.id" />
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
    QuestionModel,
    _QuestionConst,
    _ColumnsQuestion as ColumnsQuestion,
  } from '/@/api/host/question/model/questionModel';
  import { deleteQuestion, getQuestions, reEnableQuestion } from '/@/api/host/question/question';
  import QuestionForm from './QuestionForm.vue';
  import AnswerTable from './AnswerTable.vue';
  import { processListByLine, success, failed } from '/@/hooks/web/useList';

  export default defineComponent({
    name: 'QuestionTable',
    components: {
      Table,
      Tag,
      Button,
      Modal,
      Loading,
      QuestionForm,
      AnswerTable,
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
      const questionConst = ref(_QuestionConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //分页
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
      const handleTableChange = async (pag: any) => {
        pageParam.pageSize = pag!.pageSize!;
        pageParam.pageNum = pag?.current;
        const result = await getList();
        processListByLine(result, list, total);
      };

      // 筛选条件
      const condition = reactive({
        state: '1',
        projectId: props.id || '',
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
      const question: QuestionModel[] = [];
      let list = reactive(question);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<QuestionModel> | undefined;
        try {
          result = await getQuestions(condition, pageParam);
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

      onMounted(async () => {
        const result = await getList();
        processListByLine(result, list, total);
      });

      const deleteOneQuestion = async (line) => {
        try {
          loading.value = true;
          await deleteQuestion(line.id);
          success(t('host.action.delete'), t('host.action.success'));
          const result = await getList();
          processListByLine(result, list, total);
        } catch (error: any) {
          failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };
      const reEnableOneQuestion = async (line) => {
        try {
          loading.value = true;
          await reEnableQuestion(line.id);
          success(t('host.action.reEnable'), t('host.action.success'));
          const result = await getList();
          processListByLine(result, list, total);
        } catch (error: any) {
          failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };

      // 抽屉参数
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
      });
      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        const result = await getList();
        processListByLine(result, list, total);
      };

      const addquestion = async () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('host.action.add');
      };

      const updateQuestion = async (line) => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = line.id;
        drawerParam.title = t('host.action.update');
      };

      const setAnswer = async (line) => {
        drawerParam.visible = true;
        drawerParam.state = '1';
        drawerParam.id = line.id;
        drawerParam.title = t('host.question.setAnswer');
      };

      return {
        t,
        prefixCls,
        questionConst,
        condition,
        ColumnsQuestion,
        loading,
        tip,
        pagination,
        handleTableChange,
        list,
        drawerParam,
        deleteOneQuestion,
        reEnableOneQuestion,
        updateQuestion,
        setAnswer,
        onClose,
        addquestion,
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
