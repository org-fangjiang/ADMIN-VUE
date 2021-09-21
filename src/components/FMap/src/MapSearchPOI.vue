<template>
  <div class="w-full h-full">
    <div class="search">
      <!-- input -->
      <div class="head">
        <div class="input">
          <Input v-model:value="searchContent" autoComplete="off">
            <template #prefix>
              <Icon icon="carbon:search-locate" />
            </template>
          </Input>
        </div>
        <div class="type">
          <Select
            ref="selectType"
            v-model:value="type"
            @change="stateHandleChange"
            :options="option"
            :pagination="false"
          />
        </div>
      </div>
      <!-- list -->
      <div class="list">
        <div v-for="item in searchList" :key="item.id" class="item" @click="selectItem(item.id)">
          <div class="left" :style="[item.id === selectId ? 'color: #015EEA' : '']"
            >{{ item.name }}
          </div>
          <div class="righ" style="color: #999">{{ item.cityname }}-{{ item.adname }}</div>
        </div>
      </div>
      <!-- pagination -->
      <Pagination size="small" :total="count" @change="changePage" />
    </div>
    <div id="fj-map" class="w-full h-full"></div>
  </div>
</template>
<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { debounce } from 'lodash-es';
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import { basicProps } from './props';
  import AMapLoader from '@amap/amap-jsapi-loader';
  import { Input, Select, Pagination } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';

  export default defineComponent({
    name: 'MapSearchPOI',
    components: {
      Input,
      Select,
      Pagination,
      Icon,
    },
    props: basicProps,
    emits: ['change'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('metro');
      const change = (value: any) => {
        emit('change', { value });
      };

      const selectId = ref<string>('');
      const selectItem = (id: string) => {
        if (selectId.value === id) {
          selectId.value = '';
          change('');
        } else {
          selectId.value = id;
          searchList.value.forEach((item: any) => {
            if (item.id === id) {
              change(item);
            }
          });
        }
      };
      const searchContent = ref<string>('');
      const selectType = ref();
      const type = ref<string>(props.type || '');
      const option = ref<any[]>([
        { value: '', label: t('model.poi.0') },
        { value: '150500', label: t('model.poi.150500') },
      ]);
      let map: any = {};
      let FJMap: any = undefined;

      onMounted(() => {
        AMapLoader.load({
          key: 'd856f304f749be9dd547bd563cf8f4b7', // 申请好的Web端开发者Key，首次调用 load 时必填
          version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
          plugins: [
            'AMap.ToolBar',
            'AMap.Marker',
            'AMap.PlaceSearch',
            'AMap.InfoWindow',
            'AMap.TileLaye',
            'AMap.AutoComplete',
            'AMap.Driving',
          ], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        }).then((AMap) => {
          FJMap = AMap;
          map = new AMap.Map('fj-map', {
            zoom: 16,
          });
        });
      });

      const searchList = ref([]);
      const count = ref(0);
      const pageIndex = ref(1);
      const pageSize = ref(10);
      const search = (city: string, pageSize: number, pageIndex: number) => {
        const config: any = {
          pageSize, // 单页显示结果条数
          pageIndex, // 页码
          city, // 兴趣点城市
          citylimit: props.citylimit, //是否强制限制在设置的城市内搜索
          map: map, // 展现结果的地图实例
          autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        };
        if (type.value !== '0') {
          config.type = type.value;
        }
        const placeSearch = new FJMap.PlaceSearch(config);
        if (searchContent.value && searchContent.value !== '') {
          placeSearch.search(searchContent.value, function (_status, result) {
            if (result?.info === 'OK') {
              console.log('poi::::', result.poiList.pois);
              searchList.value = result.poiList.pois;
              count.value = result.poiList.count;
            }
          });
        }
      };

      const stateHandleChange = (value) => {
        type.value = value;
        callSearch();
      };

      const callSearch = debounce(function () {
        map.clearMap();
        search(props.cityId, pageSize.value, pageIndex.value);
      }, 300);

      const changePage = (page) => {
        pageIndex.value = page;
        callSearch();
      };

      watch(searchContent, (_v1, _v2) => {
        pageIndex.value = 1;
        callSearch();
      });

      return {
        prefixCls,
        map,
        change,
        props,
        selectType,
        type,
        option,
        selectId,
        selectItem,
        searchContent,
        search,
        stateHandleChange,
        changePage,
        searchList,
        count,
        pageIndex,
        pageSize,
      };
    },
  });
</script>
<style lang="less">
  .full-modal {
    .ant-modal {
      max-width: 100%;
      top: 0;
      padding-bottom: 0;
      margin: 0;
    }

    .ant-modal-content {
      display: flex;
      flex-direction: column;
      height: calc(100vh);
    }

    .ant-modal-body {
      flex: 1;
    }
  }

  .search {
    @apply absolute top-10 left-10 z-50;
    @apply flex flex-col items-center pt-1;
    @apply bg-white rounded-lg;
    @apply pb-4 pl-4;

    .head {
      @apply flex flex-row justify-items-center;

      .input {
        @apply w-2/3;
      }

      .type {
        @apply w-1/3;
      }
    }

    .list {
      @apply w-full text-center pt-4;

      .item {
        @apply mb-4;
        @apply flex flex-row;

        .left {
          @apply w-1/2 overflow-hidden whitespace-nowrap;
        }

        .right {
          @apply w-1/2 overflow-hidden;
        }
      }
    }
  }
</style>
