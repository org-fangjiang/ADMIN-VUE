// 资源信息管理页面
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
      :options="sourceConst.STATE"
      :pagination="false"
    />
    <Button @click="handleAdd" :class="`${prefixCls}-add`">保存</Button>
    <Table
      :columns="ColumnsHost"
      :data-source="list"
      rowKey="id"
      :pagination="pagination"
      @change="handleTableChange"
      :row-selection="{ selectedRowKeys: rows, onChange: onSelectChange, type: 'radio' }"
      :scroll="{ y: 'calc(70vh)' }"
    >
      <template #address="scope">
        <Image
          v-if="scope.record.sort !== '6' && scope.record.sort !== '7'"
          :src="scope.text"
          width="60px"
        />
        <div v-else>{{ address }}</div>
      </template>
      <template #sort="{ text: sort }">
        <span>
          <Tag :color="sourceConst.SORT[sort - 1].color">
            {{ sourceConst.SORT[sort - 1].label }}
          </Tag>
        </span>
      </template>
      <template #state="{ text: state }">
        <span>
          <Tag :color="sourceConst.STATE[state].color">
            {{ sourceConst.STATE[state].label }}
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
  import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasePageResult, PageParam } from '/@/api/model/baseModel';
  import { Table, Tag, Button, Image, Select } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { processListByLine } from '/@/hooks/web/useList';
  import {
    ProjectResourceConst,
    ProjectResourceModel,
    ResourceColumns as ColumnsHost,
  } from '/@/api/ohouse/projectResource/model/projectResourceModel';
  import { getResources } from '/@/api/ohouse/projectResource/projectRecource';

  interface Option {
    value: string;
    label: string;
  }
  export default defineComponent({
    name: 'OProjectSource',
    components: {
      Table,
      Tag,
      Button,
      Loading,
      Image,
      Select,
    },
    props: {
      checkedKeys: {
        type: String,
        required: true,
      },
      projectId: {
        type: String,
        required: true,
      },
    },
    emits: ['setAddress'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');
      const sourceConst = ref(ProjectResourceConst);
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

      const options = ref<Option[]>([]);
      // 筛选条件
      const condition = reactive({
        state: '1',
        projectId: props.projectId,
        title: '',
        id: '',
        sort: '',
      });

      //根据状态筛选
      const stateHandleChange = async (value) => {
        condition.state = value;
        pageParam.pageNum = 1;
        const result = await getList();
        processListByLine(result, list, total);
      };

      //初始加载
      onMounted(async () => {
        const result = await getList();
        processListByLine(result, list, total);
      });
      // 列表结果
      const source: ProjectResourceModel[] = [];
      let list = reactive(source);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<ProjectResourceModel> | undefined;
        try {
          result = await getResources(condition, pageParam);
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

      let rows = reactive<string[]>([]);
      let names = reactive<string[]>([]);
      if (props.checkedKeys) {
        rows.push(props.checkedKeys);
      }

      const onSelectChange = (_record, selected, _selectedRows, _nativeEvent) => {
        rows.splice(0);
        names.splice(0);
        selected.forEach((item) => {
          names.push(item.address);
          rows.push(item.id);
        });
      };

      const handleAdd = async () => {
        emit('setAddress', { id: rows[0], name: names[0] });
      };

      return {
        t,
        prefixCls,
        sourceConst,
        options,
        condition,
        ColumnsHost,
        loading,
        tip,
        pagination,
        handleTableChange,
        list,
        props,
        stateHandleChange,
        rows,
        onSelectChange,
        handleAdd,
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
      margin-top: 4px;
      margin-right: 10px;
      margin-bottom: 20px;
      margin-left: 0;
    }
  }
</style>
