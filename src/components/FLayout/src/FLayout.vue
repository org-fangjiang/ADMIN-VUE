//关联户型信息列表
<template>
  <div :class="prefixCls" class="relative w-full h-full px-4 pt-2">
    <Button @click="handleAdd">保存</Button>
    <Table
      :columns="ColumnsLayout"
      :data-source="list"
      rowKey="id"
      :pagination="false"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onSelect: onSelectChange }"
    >
      <template #hResourceByResourceId="{ text: hResourceByResourceId }">
        <Image
          v-if="hResourceByResourceId.sort !== '6' && hResourceByResourceId.sort !== '7'"
          :src="hResourceByResourceId.address"
          width="100px"
        />
        <div v-else>{{ hResourceByResourceId.address }}</div>
      </template>
      <template #face="{ text: face }">
        <span>
          <Tag :color="layoutConst.FACES[face - 1].color">
            {{ layoutConst.FACES[face - 1].label }}
          </Tag>
        </span>
      </template>
      <template #saleState="{ text: saleState }">
        <span>
          <Tag :color="layoutConst.SALE_STATES[saleState - 1].color">
            {{ layoutConst.SALE_STATES[saleState - 1].label }}
          </Tag>
        </span>
      </template>
      <template #state="{ text: state }">
        <span>
          <Tag :color="layoutConst.STATES[state].color">
            {{ layoutConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
    </Table>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BaseListResult, PageSizeList } from '/@/api/model/baseModel';
  import { Table, Tag, Button, Image } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import {
    LayoutModel,
    _LayoutConst,
    _Columns as ColumnsLayout,
  } from '/@/api/host/layout/model/layoutModel';
  import { getLayoutList } from '/@/api/host/layout/layout';
  export default defineComponent({
    name: 'FLayout',
    components: {
      Table,
      Tag,
      Loading,
      Button,
      Image,
    },
    props: {
      id: {
        type: String,
        require: true,
      },
      projectId: {
        type: String,
        require: true,
      },
      selected: {
        type: Array,
        require: true,
      },
    },
    emits: ['setBuildLayout'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');
      const layoutConst = ref(_LayoutConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      const source: LayoutModel[] = [];

      // const formRef = ref();
      const formState: UnwrapRef<LayoutModel> = reactive({});

      // 筛选条件
      const condition = reactive({
        state: '',
        projectId: props.projectId || '',
        id: '',
      });
      // 列表结果
      let list = reactive(source);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BaseListResult<LayoutModel> | undefined;
        try {
          result = await getLayoutList(condition);
        } catch (error) {
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

      function processListByLine(result: any) {
        if (!result) {
          return;
        }
        const { content } = result;
        list.splice(0);
        if (content) {
          content.forEach((line) => {
            list.push(line);
          });
        }
      }

      onMounted(async () => {
        const result = await getList();
        processListByLine(result);
      });

      let selectedRowKeys = ref<string[]>(props.selected as string[]); //将之前选中的值展示

      const onSelectChange = (record, selected) => {
        debugger;
        if (selected) {
          selectedRowKeys.value.push(record.id);
        } else {
          const flag = selectedRowKeys.value.indexOf(record.id);
          selectedRowKeys.value.splice(flag, 1);
        }
      };

      const handleAdd = async () => {
        emit('setBuildLayout', {
          ids: selectedRowKeys.value,
          buildId: props.id,
        });
      };

      return {
        t,
        prefixCls,
        layoutConst,
        condition,
        ColumnsLayout,
        loading,
        tip,
        pageSizeList,
        list,
        onSelectChange,
        handleAdd,
        props,
        formState,
        selectedRowKeys,
      };
    },
  });
</script>
