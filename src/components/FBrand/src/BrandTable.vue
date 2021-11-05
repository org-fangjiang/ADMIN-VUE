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
      :row-selection="{ selectedRowKeys: selectedRowKeys, onSelect: onSelectChange, type: 'radio' }"
    >
      <template #state="{ text: state }">
        <span>
          <Tag :color="brandConst.STATES[state].color">
            {{ brandConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
    </Table>
    <Modal
      v-model:visible="isNew"
      title="添加品牌商"
      width="800px"
      :footer="null"
      :bodyStyle="{ overflow: 'auto', 'margin-top': '16px' }"
      :destroyOnClose="true"
    >
      <BrandForm @addBrand="addBrand" />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { computed, defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BaseListResult, PageParam, PageSizeList } from '/@/api/model/baseModel';
  import { Table, Tag, Button, Modal } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { _BrandConst, BrandModel, _Columns as Columns } from '/@/api/host/brand/model/brandModel';
  import { getBrands } from '/@/api/host/brand/brand';
  import BrandForm from './BrandForm.vue';

  export default defineComponent({
    name: 'BrandTable',
    components: {
      Table,
      Tag,
      Loading,
      Button,
      Modal,
      BrandForm,
    },
    props: {
      checkedKeys: {
        type: String,
        require: true,
      },
    },
    emits: ['setBrandName'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');
      const brandConst = ref(_BrandConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      const brand: BrandModel[] = [];
      //新建开发商
      let isNew = ref(false);
      const handleNew = async () => {
        isNew.value = true;
      };
      const addBrand = async () => {
        const result = await getList();
        processList(result);
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
        processList(result);
      };

      // const formRef = ref();
      const formState: UnwrapRef<BrandModel> = reactive({});
      // 列表结果
      let list = reactive(brand);
      const condition = {
        id: '',
        name: '',
        state: '',
      };

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BaseListResult<BrandModel> | undefined;
        try {
          result = await getBrands(condition, pageParam);
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

      function processList(result: any) {
        if (!result) {
          return;
        }
        const { page, content } = result;
        list.splice(0);
        if (content) {
          content.forEach((line) => {
            list.push(line);
          });
        }
        // page.number = page.number + 1;
        // Object.assign(pageParam, {}, page);
        total.value = Number(page.totalElements);
      }

      onMounted(async () => {
        const result = await getList();
        processList(result);
      });

      let selectedRowKeys = ref<string>(props.checkedKeys || '');

      const onSelectChange = (record, selected) => {
        if (selectedRowKeys.value) {
          selectedRowKeys.value = '';
        }
        if (selected) {
          selectedRowKeys.value = record.id;
        }
      };

      const handleAdd = async () => {
        emit('setBrandName', { id: selectedRowKeys.value });
      };

      return {
        t,
        prefixCls,
        brandConst,
        condition,
        Columns,
        loading,
        tip,
        pageSizeList,
        list,
        onSelectChange,
        handleAdd,
        props,
        formState,
        selectedRowKeys,
        handleTableChange,
        pagination,
        handleNew,
        isNew,
        addBrand,
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
