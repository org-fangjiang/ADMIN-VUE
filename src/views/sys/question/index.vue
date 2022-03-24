// 问题审核管理页面
<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <Tabs v-model:activeKey="activeKey">
      <TabPane key="1" tab="待审核">
        <Button
          v-auth="questionConst._PERMS.EXAMINE"
          @click="mulPass"
          :class="`${prefixCls}-select`"
        >
          {{ t('model.question.pass') }}
        </Button>
        <Button
          v-auth="questionConst._PERMS.EXAMINE"
          @click="mulFail"
          :class="`${prefixCls}-select`"
        >
          {{ t('model.question.fail') }}
        </Button>
        <Table
          :row-selection="{ selectedRowKeys: selected, onChange: onSelectChange }"
          :columns="ColumnsQuestion"
          :data-source="list"
          rowKey="id"
          :pagination="pagination"
          @change="handleTableChange"
        >
          <template #state="{ text: state }">
            <span>
              <Tag :color="questionConst.EXAMINESTATES[state].color">
                {{ questionConst.EXAMINESTATES[state].label }}
              </Tag>
            </span>
          </template>
          <template #operation="{ text: line }">
            <Button
              v-auth="questionConst._PERMS.EXAMINE"
              :class="prefixCls"
              type="link"
              size="small"
              @click="clickPass(line)"
              >{{ t('model.question.pass') }}
            </Button>
            <Button
              v-auth="questionConst._PERMS.EXAMINE"
              type="link"
              size="small"
              :class="prefixCls"
              @click="clickFail(line)"
            >
              {{ t('model.question.fail') }}
            </Button>
          </template>
        </Table>
      </TabPane>
      <TabPane key="2" tab="审核未通过">
        <Button
          v-auth="questionConst._PERMS.EXAMINE"
          :class="`${prefixCls}-select`"
          @click="deleteMul"
        >
          {{ t('model.question.delete') }}
        </Button>
        <Table
          :row-selection="{ selectedRowKeys: selectedFailed, onChange: onSelectChangeFailed }"
          :columns="ColumnsQuestion"
          :data-source="listFailed"
          rowKey="id"
          :pagination="paginationFailed"
          @change="handleTableChangeFailed"
        >
          <template #state="{ text: state }">
            <span>
              <Tag :color="questionConst.EXAMINESTATES[state].color">
                {{ questionConst.EXAMINESTATES[state].label }}
              </Tag>
            </span>
          </template>
          <template #operation="{ text: line }">
            <Button
              v-auth="questionConst._PERMS.EXAMINE"
              :class="prefixCls"
              type="link"
              size="small"
              @click="clickDelete(line)"
              >{{ t('model.question.delete') }}
            </Button>
          </template>
        </Table>
      </TabPane>
    </Tabs>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BaseListResult, BasePageResult, PageParam } from '/@/api/model/baseModel';
  import { Table, Tag, Button, Tabs, TabPane, message } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { processList, success, failed, processListByLine } from '/@/hooks/web/useList';
  import {
    examine,
    pass,
    failedOne,
    passIds,
    failedIds,
    delFailedIds,
    delFailed,
    failedList,
  } from '/@/api/host/question/question';
  import {
    _QuestionConst,
    QuestionModel,
    _Columns as ColumnsQuestion,
  } from '/@/api/host/question/model/questionModel';
  export default defineComponent({
    name: 'QuestionTable',
    components: {
      Table,
      Tag,
      Button,
      Loading,
      Tabs,
      TabPane,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('question');
      const questionConst = ref(_QuestionConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      let activeKey = ref<string>('1');

      watch(
        () => activeKey.value,
        async () => {
          if (activeKey.value === '1') {
            pageParam.pageNum = 1;
            const result = await getList();
            processListByLine(result, list, total);
          } else if (activeKey.value === '2') {
            pageParamFailed.pageNum = 1;
            const result2 = await getListFailed();
            await processListByLine(result2, listFailed, totalFailed);
          }
        }
      );
      // 添加分页
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
        state: '',
      });
      // 列表结果
      const question: QuestionModel[] = [];
      let list = reactive(question);
      const question2: QuestionModel[] = [];
      let listFailed = reactive(question2);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BaseListResult<QuestionModel> | undefined;
        try {
          result = await examine(pageParam);
        } catch (error: any) {
          createErrorModal({
            title: t('sys.api.errorTip'),
            content: error?.response?.data?.message || t('sys.api.networkExceptionMsg'),
            getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
          });
        } finally {
          loading.value = false;
        }
        return result;
      };

      // 获取审核未通过的list
      const pageParamFailed: PageParam = {
        pageNum: 1,
        pageSize: 10,
      };
      const totalFailed = ref<number>(0);
      const paginationFailed = computed(() => ({
        total: totalFailed.value,
        current: pageParamFailed.pageNum,
        pageSize: pageParamFailed.pageSize,
      }));
      const handleTableChangeFailed = async (pag: any) => {
        pageParamFailed.pageSize = pag!.pageSize!;
        pageParamFailed.pageNum = pag?.current;
        const result = await getList();
        processListByLine(result, list, total);
      };
      const getListFailed = async () => {
        loading.value = true;
        let result: BasePageResult<QuestionModel> | undefined;
        try {
          result = await failedList(pageParamFailed);
        } catch (error: any) {
          createErrorModal({
            title: t('sys.api.errorTip'),
            content: error?.response?.data?.message || t('sys.api.networkExceptionMsg'),
            getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
          });
        } finally {
          loading.value = false;
        }
        return result;
      };

      //页面初始化加载
      onMounted(async () => {
        const result = await getList();
        processListByLine(result, list, total);
        const result2 = await getListFailed();
        await processListByLine(result2, listFailed, totalFailed);
      });

      // 通过
      const clickPass = async (record) => {
        try {
          loading.value = true;
          await pass(record.id);
          success(t('model.question.pass'), t('host.action.success'));
          const result = await getList();
          processList(result, list, pageParam);
        } catch (error: any) {
          failed('审核失败', t('model.violation.fail'));
        } finally {
          loading.value = false;
        }
      };

      // 不通过
      const clickFail = async (record) => {
        try {
          loading.value = true;
          await failedOne(record.id);
          success(t('model.question.fail'), t('host.action.success'));
          const result = await getList();
          processList(result, list, pageParam);
        } catch (error: any) {
          failed('审核失败', t('model.violation.fail'));
        } finally {
          loading.value = false;
        }
      };

      // 删除
      const clickDelete = async (record) => {
        try {
          loading.value = true;
          await delFailed(record.id);
          success(t('model.answer.delete'), t('host.action.success'));
          const result2 = await getListFailed();
          await processListByLine(result2, listFailed, totalFailed);
        } catch (error: any) {
          failed('删除失败', t('model.violation.fail'));
        } finally {
          loading.value = false;
        }
      };

      //选中行id
      let selected = ref<string[]>([]);
      const onSelectChange = async (selectedRowKeys) => {
        selected.value = selectedRowKeys;
      };
      let selectedFailed = ref<string[]>([]);
      const onSelectChangeFailed = async (selectedRowKeys) => {
        selectedFailed.value = selectedRowKeys;
      };

      //批量通过
      const mulPass = async () => {
        if (selected.value.length === 0) {
          message.error({ content: '请正确选择信息，然后点击' });
        } else {
          try {
            loading.value = true;
            await passIds(selected.value);
            success(t('model.question.pass'), t('host.action.success'));
            const result = await getList();
            processList(result, list, pageParam);
            selected.value.splice(0);
          } catch (error: any) {
            failed('审核失败，请重试', t('model.violation.fail'));
          } finally {
            loading.value = false;
          }
        }
      };

      //批量不通过
      const mulFail = async () => {
        if (selected.value.length === 0) {
          message.error({ content: '请正确选择信息，然后点击' });
        } else {
          try {
            loading.value = true;
            await failedIds(selected.value);
            success(t('model.question.fail'), t('host.action.success'));
            const result = await getList();
            processList(result, list, pageParam);
            selected.value.splice(0);
          } catch (error: any) {
            failed('审核失败，请重试', t('model.violation.fail'));
          } finally {
            loading.value = false;
          }
        }
      };

      // 批量删除
      const deleteMul = async () => {
        if (!selectedFailed.value) {
          message.error({ content: '请正确选择信息，然后点击', duration: 0 });
        } else {
          try {
            loading.value = true;
            await delFailedIds(selectedFailed.value);
            success(t('model.answer.delete'), t('host.action.success'));
            const result2 = await getListFailed();
            await processListByLine(result2, listFailed, totalFailed);
            selectedFailed.value.splice(0);
          } catch (error: any) {
            failed('审核失败，请重试', t('model.violation.fail'));
          } finally {
            loading.value = false;
          }
        }
      };

      return {
        t,
        prefixCls,
        questionConst,
        ColumnsQuestion,
        loading,
        tip,
        handleTableChange,
        pagination,
        list,
        pageParam,
        // action,
        condition,
        onSelectChange,
        mulPass,
        mulFail,
        selected,
        clickPass,
        clickFail,
        activeKey,
        handleTableChangeFailed,
        paginationFailed,
        pageParamFailed,
        listFailed,
        onSelectChangeFailed,
        selectedFailed,
        clickDelete,
        deleteMul,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-question';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;
    }
  }

  .@{prefix-cls} {
    &-drawer {
      max-width: 500px;
    }

    &-action-menu-item {
      text-align: center;
    }

    &-select {
      margin-top: 20px;
      margin-right: 10px;
      margin-bottom: 20px;
    }
  }
</style>
