// 省市区信息管理页面

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <ProvinceTable>
      <template #province="{ province }">
        <CityTable :provinceId="province.id">
          <template #city="{ city }">
            <AreaTable :cityId="city" />
          </template>
        </CityTable>
      </template>
    </ProvinceTable>
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getProvinces } from '/@/api/sys/province/province';
  import {
    ProvinceConst,
    ProvinceColumns,
    ProvinceModel,
  } from '/@/api/sys/province/model/provinceModel';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ProvinceTable from './components/ProvinceTable.vue';
  import CityTable from './components/CityTable.vue';
  import AreaTable from './components/AreaTable.vue';
  export default defineComponent({
    name: 'Location',
    components: {
      ProvinceTable,
      CityTable,
      AreaTable,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('location');
      const provinceConst = ref(ProvinceConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      const provinceColumns = reactive(ProvinceColumns);
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });
      const condition = reactive({ state: '' });

      const stateHandleChange = async (value) => {
        condition.state = value;
        const result = await getList();
        processList(result);
      };

      const provinces: ProvinceModel[] = [];
      let list = reactive(provinces);

      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<ProvinceModel> | undefined;
        try {
          result = await getProvinces(condition, {
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
        // const result = await getList();
        // processList(result);
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
        provinceConst,
        tip,
        provinceColumns,
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

<style lang="less">
  @prefix-cls: ~'@{namespace}-location';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;
    }
  }
</style>
