// 省市区信息管理页面

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <Table :columns="cityColumns" :data-source="list" rowKey="id" size="small">
      <template #state="{ text: state }">
        <span>
          <Tag :color="cityConst.STATES[state].color">
            {{ cityConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #action="{ text: info }">
        <span>
          <Button v-auth="cityConst._PERMS.UPDATE" type="link" size="small">
            {{ info.id }}
          </Button>
        </span>
      </template>
      <template #expandedRowRender="{ record }">
        <slot name="city" :city="record"></slot>
      </template>
    </Table>
    <Pagination
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
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getCities } from '/@/api/sys/city/city';
  import { CityConst, CityColumns, CityModel } from '/@/api/sys/city/model/cityModel';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { Table, Pagination, Tag, Button } from 'ant-design-vue';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    name: 'CityTable',
    components: {
      Table,
      Pagination,
      Tag,
      Button,
    },
    props: {
      provinceId: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('location');
      const cityConst = ref(CityConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      const cityColumns = reactive(CityColumns);
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });
      const condition = reactive({
        id: props.provinceId,
        state: '',
      });

      const stateHandleChange = async (value) => {
        condition.state = value;
        const result = await getList();
        processList(result);
      };

      const cities: CityModel[] = [];
      let list = reactive(cities);

      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<CityModel> | undefined;
        try {
          result = await getCities(condition, {
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
      onMounted(async () => {
        const result = await getList();
        processList(result);
      });

      function processList(result: any) {
        if (!result) {
          return;
        }
        const { page, content } = result;
        list.splice(0);
        content.forEach((company) => {
          list.push(company);
        });
        page.number = page.number + 1;
        Object.assign(pageParam, {}, page);
      }

      const onChange = async (page) => {
        pageParam.number = page;
        const result = await getList();
        processList(result);
      };
      const onShowSizeChange = async (current, size) => {
        console.log(current);
        pageParam.size = size;
        pageParam.number = 1;
        const result = await getList();
        processList(result);
      };
      return {
        t,
        prefixCls,
        cityConst,
        tip,
        cityColumns,
        loading,
        pageSizeList,
        pageParam,
        list,
        stateHandleChange,
        onChange,
        onShowSizeChange,
      };
    },
  });
</script>
