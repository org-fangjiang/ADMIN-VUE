<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <Button @click="handleAdd" :class="`${prefixCls}-add`">保存</Button>
    <Button @click="handleNew" :class="`${prefixCls}-add`">添加</Button>
    <Table
      hideDefaultSelections="true"
      :columns="Columns"
      :data-source="list"
      rowKey="id"
      :pagination="pagination"
      @change="handleTableChange"
      :row-selection="{ selectedRowKeys: rows, onChange: onSelectChange, type: 'radio' }"
    >
      <template #state="{ text: state }">
        <span>
          <Tag :color="developerConst.STATES[state].color">
            {{ developerConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
    </Table>
    <Modal
      v-model:visible="isNew"
      title="添加开发商"
      width="800px"
      :footer="null"
      :bodyStyle="{ overflow: 'auto', 'margin-top': '16px' }"
      :destroyOnClose="true"
    >
      <DeveloperForm @addDeveloper="addDeveloper" />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { computed, defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BaseListResult, PageParam } from '/@/api/model/baseModel';
  import { Table, Tag, Button, Modal } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import {
    DeveloperModel,
    _DeveloperConst,
    _Columns as Columns,
  } from '/@/api/host/developer/model/developerModel';
  import { getDevelopers } from '/@/api/host/developer/developer';
  import DeveloperForm from './DeveloperForm.vue';
  import { processListByLine } from '/@/hooks/web/useList';

  export default defineComponent({
    name: 'DeveloperTable',
    components: {
      Table,
      Tag,
      Loading,
      Button,
      Modal,
      DeveloperForm,
    },
    props: {
      checkedKeys: {
        type: String,
        require: true,
      },
    },
    emits: ['setDeveloper'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');
      const developerConst = ref(_DeveloperConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //新建开发商
      let isNew = ref(false);
      const handleNew = async () => {
        isNew.value = true;
      };
      const addDeveloper = async () => {
        const result = await getList();
        processListByLine(result, list, total);
        isNew.value = false;
      };

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

      // const formRef = ref();
      const formState: UnwrapRef<DeveloperModel> = reactive({});
      // 列表结果
      const developer: DeveloperModel[] = [];
      let list = reactive(developer);
      const condition = {
        id: '',
        name: '',
        state: '',
      };

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BaseListResult<DeveloperModel> | undefined;
        try {
          result = await getDevelopers(condition, pageParam);
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

      onMounted(async () => {
        const result = await getList();
        processListByLine(result, list, total);
      });

      let rows = reactive<string[]>([]);
      if (props.checkedKeys) {
        rows.push(props.checkedKeys);
      }

      const onSelectChange = (selectedRowKeys: string[]) => {
        rows.splice(0);
        selectedRowKeys.forEach((item) => {
          rows.push(item);
        });
      };

      const handleAdd = async () => {
        emit('setDeveloper', { id: rows[0] });
      };

      return {
        t,
        prefixCls,
        developerConst,
        condition,
        Columns,
        loading,
        tip,
        list,
        onSelectChange,
        handleAdd,
        props,
        formState,
        rows,
        handleTableChange,
        pagination,
        handleNew,
        isNew,
        addDeveloper,
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
    &-add {
      margin-right: 10px;
      margin-bottom: 20px;
    }
  }
</style>
