//关联楼栋信息列表
<template>
  <div :class="prefixCls" class="relative w-full h-full px-4 pt-2">
    <Button @click="handleAdd">保存</Button>
    <Table
      :columns="ColumnsBuild"
      :data-source="list"
      rowKey="id"
      :pagination="false"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onSelect: onSelectChange }"
    >
      <template #saleState="{ text: saleState }">
        <span>
          <Tag :color="buildConst.SALE_STATES[saleState].color">
            {{ buildConst.SALE_STATES[saleState].label }}
          </Tag>
        </span>
      </template>
      <template #state="{ text: state }">
        <span>
          <Tag :color="buildConst.STATES[state].color">
            {{ buildConst.STATES[state].label }}
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
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BaseListResult, PageSizeList } from '/@/api/model/baseModel';
  import { Table, Tag, Button } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import {
    BuildModel,
    _BuildConst,
    _Columns as ColumnsBuild,
  } from '/@/api/host/build/model/buildModel';
  import { getBuilds } from '/@/api/host/build/build';
  export default defineComponent({
    name: 'FBuild',
    components: {
      Table,
      Tag,
      Loading,
      Button,
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
    emits: ['setLicenseBuild'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');
      const buildConst = ref(_BuildConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      const build: BuildModel[] = [];

      // 筛选条件
      const condition = reactive({
        state: '',
        projectId: props.projectId || '',
        id: '',
      });
      // 列表结果
      let list = reactive(build);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BaseListResult<BuildModel> | undefined;
        try {
          result = await getBuilds(condition);
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
        if (selected) {
          selectedRowKeys.value.push(record.id);
        } else {
          const flag = selectedRowKeys.value.indexOf(record.id);
          selectedRowKeys.value.splice(flag, 1);
        }
      };

      const handleAdd = async () => {
        emit('setLicenseBuild', {
          ids: selectedRowKeys.value,
          licenseId: props.id,
          projectId: props.projectId,
        });
      };

      return {
        t,
        prefixCls,
        buildConst,
        condition,
        ColumnsBuild,
        loading,
        tip,
        pageSizeList,
        list,
        onSelectChange,
        handleAdd,
        props,
        selectedRowKeys,
      };
    },
  });
</script>
