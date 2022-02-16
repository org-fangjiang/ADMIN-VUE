// 回复审核管理页面

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <Button v-auth="answerConst._PERMS.EXAMINE" @click="mulPass" :class="`${prefixCls}-select`">
      {{ t('model.question.pass') }}
    </Button>
    <Button v-auth="answerConst._PERMS.EXAMINE" @click="mulFail" :class="`${prefixCls}-select`">
      {{ t('model.question.fail') }}
    </Button>
    <Table
      :row-selection="{ selectedRowKeys: selected, onChange: onSelectChange }"
      :columns="ColumnsAnswer"
      :data-source="list"
      rowKey="id"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template #state="{ text: state }">
        <span>
          <Tag :color="answerConst.EXAMINESTATES[state].color">
            {{ answerConst.EXAMINESTATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: line }">
        <!-- <Button
          v-auth="answerConst._PERMS.EXAMINE"
          :class="prefixCls"
          type="link"
          size="small"
          @click="clickPass(record)"
          >{{ t('model.question.pass') }}
        </Button>
        <Button
          v-auth="answerConst._PERMS.EXAMINE"
          type="link"
          size="small"
          :class="prefixCls"
          @click="clickFail(record)"
        >
          {{ t('model.question.fail') }}
        </Button> -->
        <!-- 操作下拉框 -->
        <Dropdown placement="bottomCenter" trigger="click">
          <Button type="link">{{ t('component.action.index') }}</Button>
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem :key="0" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="answerConst._PERMS.EXAMINE"
                  :class="prefixCls"
                  type="link"
                  size="small"
                  >{{ t('model.question.pass') }}
                </Button>
              </MenuItem>
              <MenuItem :key="1" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="answerConst._PERMS.EXAMINE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('model.question.fail') }}
                </Button>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </template>
    </Table>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BaseListResult, PageParam } from '/@/api/model/baseModel';
  import { Table, Tag, Button, Dropdown, Menu, MenuItem } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { processList, success, failed, processListByLine } from '/@/hooks/web/useList';
  import { examine, pass, failedOne, passIds, failedIds } from '/@/api/host/answer/answer';
  import {
    _AnswerConst,
    AnswerModel,
    _Columns as ColumnsAnswer,
  } from '/@/api/host/answer/model/answerModel';
  export default defineComponent({
    name: 'AnswerTable',
    components: {
      Table,
      Tag,
      Button,
      Dropdown,
      Menu,
      MenuItem,
      Loading,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('answer');
      const answerConst = ref(_AnswerConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      // 添加分页
      const pageParam: PageParam = reactive({
        pageNum: 0,
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
      const answer: AnswerModel[] = [];
      let list = reactive(answer);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BaseListResult<AnswerModel> | undefined;
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

      //页面初始化加载
      onMounted(async () => {
        const result = await getList();
        console.log(result?.content);
        processListByLine(result, list, total);
      });

      // 通过
      // const clickPass = async (record) => {
      //   debugger;
      //   try {
      //     loading.value = true;
      //     await pass(record.id);
      //     success(t('model.question.pass'), t('host.action.success'));
      //     const result = await getList();
      //     processList(result, list, pageParam);
      //   } catch (error: any) {
      //     failed('审核失败', t('model.violation.fail'));
      //   } finally {
      //     loading.value = false;
      //   }
      // };

      // // 不通过
      // const clickFail = async (record) => {
      //   try {
      //     loading.value = true;
      //     await failedOne(record.id);
      //     success(t('model.question.fail'), t('host.action.success'));
      //     const result = await getList();
      //     processList(result, list, pageParam);
      //   } catch (error: any) {
      //     failed('审核失败', t('model.violation.fail'));
      //   } finally {
      //     loading.value = false;
      //   }
      // };

      // 操作
      const action = async (key) => {
        const code = key.key;
        const id = key?.item['data-id'] || undefined;
        switch (code) {
          case 0:
            // 通过
            try {
              loading.value = true;
              await pass(id);
              success(t('model.answer.pass'), t('host.action.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed('审核失败', t('model.violation.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 1:
            // 不通过
            try {
              loading.value = true;
              await failedOne(id);
              success(t('model.answer.fail'), t('host.action.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed('审核失败', t('model.violation.fail'));
            } finally {
              loading.value = false;
            }
            break;
        }
      };

      //选中行id
      let selected = ref<string[]>([]);
      const onSelectChange = async (selectedRowKeys) => {
        selected.value = selectedRowKeys;
      };

      //批量通过
      const mulPass = async () => {
        try {
          loading.value = true;
          await passIds(selected.value);
          success(t('model.answer.pass'), t('host.action.success'));
          const result = await getList();
          processList(result, list, pageParam);
          selected.value.splice(0);
        } catch (error: any) {
          failed('审核失败，请重试', t('model.violation.fail'));
        } finally {
          loading.value = false;
        }
      };

      //批量不通过
      const mulFail = async () => {
        try {
          loading.value = true;
          await failedIds(selected.value);
          success(t('model.answer.fail'), t('host.action.success'));
          const result = await getList();
          processList(result, list, pageParam);
          selected.value.splice(0);
        } catch (error: any) {
          failed('审核失败，请重试', t('model.violation.fail'));
        } finally {
          loading.value = false;
        }
      };

      return {
        t,
        prefixCls,
        answerConst,
        ColumnsAnswer,
        loading,
        tip,
        handleTableChange,
        pagination,
        list,
        pageParam,
        action,
        condition,
        onSelectChange,
        mulPass,
        mulFail,
        selected,
        // clickPass,
        // clickFail,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-answer';
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
