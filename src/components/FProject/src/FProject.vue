//关联项目信息列表
<template>
  <div :class="prefixCls" class="relative w-full h-full px-4 pt-2">
    <Button @click="handleAdd">保存</Button>
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
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { Table, Tag, Button } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { HostModel, _Columns, _HostConst } from '/@/api/host/project/model/projectModel';
  import { useUserStore } from '/@/store/modules/user';
  import { searchWithCondition } from '/@/api/host/project/project';
  export default defineComponent({
    name: 'FProject',
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
      selected: {
        type: Array,
        require: true,
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

      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });

      const pageSizeList = ref<string[]>(PageSizeList);
      const project: HostModel[] = [];
      const columns = reactive(_Columns);

      // 列表结果
      let list = reactive(project);

      const userStore = useUserStore();
      const cityId = userStore.getUserInfo.companyCityId;
      const provinceId = userStore.getUserInfo.companyProvinceId;
      const condition = reactive({
        state: '',
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

      function processList(result: any) {
        if (!result) {
          return;
        }
        const { page, content } = result;
        list.splice(0);
        content.forEach((link) => {
          list.push(link);
        });
        page.number = page.number + 1;
        Object.assign(pageParam, {}, page);
      }

      onMounted(async () => {
        const result = await getList();
        processList(result);
      });

      let selectedRowKeys = ref<string[]>((props.selected as string[]) || []); //将之前选中的值展示
      let areaId = ref<string[]>([]);
      let names = ref<string[]>([]);
      const onSelectChange = (record, selected) => {
        if (selected) {
          selectedRowKeys.value.push(record.id);
          names.value.push(record.name);
          areaId.value.push(record.sysAreaByAreaId.id);
        } else {
          const flag = selectedRowKeys.value.indexOf(record.id);
          selectedRowKeys.value.splice(flag, 1);
          areaId.value.splice(flag, 1);
          names.value.splice(flag, 1);
        }
      };

      let projects = ref([{ id: '', name: '', area: '' }]);
      const handleAdd = async () => {
        if (selectedRowKeys.value && selectedRowKeys.value.length > 0) {
          let length = selectedRowKeys.value.length;
          debugger;
          while (length > 0) {
            projects.value.push({
              id: selectedRowKeys.value[length - 1],
              name: names.value[length - 1],
              area: areaId.value[length - 1],
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
      };
    },
  });
</script>
