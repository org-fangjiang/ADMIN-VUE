<template>
  <div :class="prefixCls" class="relative w-full h-full px-4 pt-2">
    <Button @click="handleAdd">保存</Button>
    <Button @click="handleNew">添加</Button>
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
          <Tag :color="estateConst.STATES[state].color">
            {{ estateConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
    </Table>
    <Modal
      v-model:visible="isNew"
      title="添加物业公司"
      width="800px"
      :footer="null"
      :bodyStyle="{ overflow: 'auto', 'margin-top': '16px' }"
      :destroyOnClose="true"
    >
      <EstateForm @addEstate="addEstate" />
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
  import {
    EstateCompanyModel,
    _EstateCompanyConst,
    _Columns as Columns,
  } from '/@/api/host/estateCompany/model/estateCompanyModel';
  import { getEstateCompanies } from '/@/api/host/estateCompany/estateCompany';
  import EstateForm from './EstateForm.vue';

  export default defineComponent({
    name: 'EstateTable',
    components: {
      Table,
      Tag,
      Loading,
      Button,
      Modal,
      EstateForm,
    },
    props: {
      checkedKeys: {
        type: String,
        require: true,
      },
    },
    emits: ['setEstateName'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');
      const estateConst = ref(_EstateCompanyConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      const estate: EstateCompanyModel[] = [];
      //新建物业
      let isNew = ref(false);
      const handleNew = async () => {
        isNew.value = true;
      };
      const addEstate = async () => {
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
      const formState: UnwrapRef<EstateCompanyModel> = reactive({});
      // 列表结果
      let list = reactive(estate);
      const condition = {
        id: '',
        name: '',
        state: '',
      };

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BaseListResult<EstateCompanyModel> | undefined;
        try {
          result = await getEstateCompanies(condition, pageParam);
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
        emit('setEstateName', { id: selectedRowKeys.value });
      };

      return {
        t,
        prefixCls,
        estateConst,
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
        addEstate,
      };
    },
  });
</script>
