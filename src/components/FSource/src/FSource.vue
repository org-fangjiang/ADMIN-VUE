// 资源信息管理页面
<template>
  <div :class="prefixCls" class="relative w-full h-full px-4 pt-2">
    <Button @click="handleAdd">保存</Button>
    <Select
      ref="select"
      :allowClear="true"
      v-model:value="formState.sort"
      style="width: 120px"
      @change="sortChange"
      :options="sourceConst.SORTS"
      :pagination="false"
    />
    <Table
      hideDefaultSelections="true"
      :columns="ColumnsHost"
      :data-source="list"
      rowKey="id"
      :pagination="false"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onSelect: onSelectChange, type: 'radio' }"
    >
      <template #address="{ text: address }">
        <Image v-if="type !== '6' && type !== '7'" :src="address" width="100px" />
        <div v-else>{{ address }}</div>
      </template>
      <template #sort="{ text: sort }">
        <span>
          <Tag :color="sourceConst.SORTS[sort].color">
            {{ sourceConst.SORTS[sort].label }}
          </Tag>
        </span>
      </template>
      <template #state="{ text: state }">
        <span>
          <Tag :color="sourceConst.STATES[state].color">
            {{ sourceConst.STATES[state].label }}
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
  import { Table, Tag, Select, Button, Image } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import {
    SourceModel,
    _SourceConst,
    _CSource as ColumnsHost,
  } from '/@/api/host/source/model/sourceModel';
  import { getResources } from '/@/api/host/source/source';
  import { LayoutModel } from '/@/api/host/layout/model/layoutModel';

  export default defineComponent({
    name: 'FSource',
    components: {
      Table,
      Tag,
      Loading,
      Select,
      Button,
      Image,
    },
    props: {
      projectId: {
        type: String,
        require: true,
      },
    },
    emits: ['setSource'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');
      const sourceConst = ref(_SourceConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      const source: SourceModel[] = [];

      // const formRef = ref();
      const formState: UnwrapRef<LayoutModel> = reactive({});

      // 筛选条件
      const condition = reactive({
        state: '',
        projectId: props.projectId || '',
        title: '',
        id: '',
        sort: '',
      });
      // 列表结果
      let list = reactive(source);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BaseListResult<SourceModel> | undefined;
        try {
          result = await getResources(condition);
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

      const sortChange = async (value) => {
        condition.sort = value;
        const result = await getList();
        processListByLine(result);
      };

      let selectedRowKeys = ref<string>();
      let address = ref<string>();
      let type = ref();

      const onSelectChange = (record, selected) => {
        if (selectedRowKeys.value) {
          selectedRowKeys.value = '';
        }
        if (selected) {
          selectedRowKeys.value = record.id;
          address.value = record.address;
          type.value = record.sort;
        }
      };

      const handleAdd = async () => {
        emit('setSource', { id: selectedRowKeys.value, address: address.value, type: type.value });
      };

      // let selectedRowKeys = ref<string[]>([]);

      // const onSelectChange = (record, selected) => {
      //   if (selected) {
      //     selectedRowKeys.value.push(record.id);
      //   } else {
      //     const flag = selectedRowKeys.value.indexOf(record.id);
      //     selectedRowKeys.value.splice(flag, 1);
      //   }
      // };

      // const handleAdd = async () => {
      //   debugger;
      //   emit('setSource', selectedRowKeys.value[0]);
      // };

      return {
        t,
        prefixCls,
        sourceConst,
        condition,
        ColumnsHost,
        loading,
        tip,
        pageSizeList,
        list,
        sortChange,
        onSelectChange,
        handleAdd,
        props,
        formState,
        selectedRowKeys,
      };
    },
  });
</script>
