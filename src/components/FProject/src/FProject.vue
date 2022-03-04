//关联项目信息列表
<template>
  <div :class="prefixCls" class="relative w-full h-full px-4 pt-2">
    <Button @click="handleAdd" class="setMargin">保存</Button>
    <FProjectSelect @setProject="setProject" @onClear="onClear" class="setMargin" />
    <Table
      :columns="columns"
      :data-source="list"
      rowKey="id"
      :pagination="false"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onSelect: onSelectChange }"
    >
      <template #state="{ text: state }">
        <span>
          <Tag :color="hostConst.STATES[state].color">
            {{ hostConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #type="{ text: type }">
        <span>
          <Tag :color="hostConst.TYPES[type - 1].color">
            {{ hostConst.TYPES[type - 1].label }}
          </Tag>
        </span>
      </template>
    </Table>
    <Pagination
      class="setMargin"
      show-size-changer
      size="large"
      :show-total="(total) => t('component.table.total', { total })"
      :pageSizeOptions="pageSizeList"
      :current="pageParam.number"
      :pageSize="pageParam.size"
      :total="pageParam.totalElements"
      @change="onChange"
      @showSizeChange="onShowSizeChange"
    />
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { Table, Tag, Button, Pagination } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { HostModel, _Columns, _HostConst } from '/@/api/host/project/model/projectModel';
  import { useUserStore } from '/@/store/modules/user';
  import { search, searchWithCondition } from '/@/api/host/project/project';
  import { processList } from '/@/hooks/web/useList';
  import FProjectSelect from '/@/components/FProjectSelect';
  import { getProject } from '/@/api/sys/resident/resident';

  export default defineComponent({
    name: 'FProject',
    components: {
      Table,
      Tag,
      Loading,
      Button,
      Pagination,
      FProjectSelect,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
      selected: {
        type: Array,
        required: true,
      },
      resident: {
        type: String,
        required: false,
      },
    },
    emits: ['setNewsProject'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');
      const hostConst = ref(_HostConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //通过名称筛选
      const setProject = async (value) => {
        condition.name = value.label;
        pageParam.number = 1;
        loading.value = true;
        let result: BasePageResult<HostModel> | undefined;
        try {
          result = await search(condition, {
            pageSize: pageParam.size,
            pageNum: pageParam.number,
          });
        } catch (error: any) {
          createErrorModal({
            title: t('sys.api.errorTip'),
            content: error?.response?.data?.message || t('sys.api.networkExceptionMsg'),
            getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
          });
        } finally {
          loading.value = false;
        }
        processList(result, list, pageParam);
      };
      //清空项目名称
      const onClear = async () => {
        condition.name = '';
        const result = await getList();
        processList(result, list, pageParam);
      };

      //设置分页
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });

      const onChange = async (page) => {
        pageParam.number = page;
        const result = await getList();
        processList(result, list, pageParam);
      };
      const onShowSizeChange = async (current, size) => {
        console.log(current);
        pageParam.size = size;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      const pageSizeList = ref<string[]>(PageSizeList);
      const project: HostModel[] = [];
      const columns = reactive(_Columns);

      // 列表结果
      let list = reactive(project);

      const userStore = useUserStore();
      const cityId = userStore.getUserInfo.companyCityId;
      const provinceId = userStore.getUserInfo.companyProvinceId;
      const condition = reactive({
        state: '1',
        name: '',
        provinceId: provinceId || '',
        cityId: cityId || '',
      });

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<HostModel> | undefined;
        try {
          result = await searchWithCondition(condition, {
            pageSize: pageParam.size,
            pageNum: pageParam.number,
          });
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
        processList(result, list, pageParam);
        if (props.resident) {
          const { content } = await getProject(props.resident);
          if (content && content.length > 0) {
            content.forEach((item) => {
              selectedRowKeys.value.push(item.projectId || '');
            });
          }
        }
      });

      let selectedRowKeys = ref<string[]>((props.selected as string[]) || []); //将之前选中的值展示
      console.log(props.selected);
      const onSelectChange = (record, selected) => {
        if (selected) {
          selectedRowKeys.value.push(record.id);
        } else {
          const flag = selectedRowKeys.value.indexOf(record.id);
          selectedRowKeys.value.splice(flag, 1);
        }
      };

      let projects = ref([{ id: '' }]);
      const handleAdd = async () => {
        if (selectedRowKeys.value && selectedRowKeys.value.length > 0) {
          let length = selectedRowKeys.value.length;
          while (length > 0) {
            projects.value.push({
              id: selectedRowKeys.value[length - 1],
            });
            length = length - 1;
          }
        }
        emit('setNewsProject', { projects: projects.value });
      };

      return {
        t,
        prefixCls,
        hostConst,
        condition,
        columns,
        loading,
        tip,
        pageSizeList,
        list,
        onSelectChange,
        handleAdd,
        props,
        selectedRowKeys,
        pageParam,
        projects,
        onChange,
        onShowSizeChange,
        setProject,
        onClear,
      };
    },
  });
</script>
<style lang="less">
  .setMargin {
    @apply mb-5 mr-2;
  }
</style>
