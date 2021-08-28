// 省市区信息管理页面

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <ProvinceTable
      ref="provinceRef"
      @onAddProvince="addProvince"
      @onAddCity="addCity"
      @onUpdateProvince="updateProvince"
    >
      <template #province="{ province }">
        <CityTable
          :ref="cityRefFunc"
          :provinceId="province.id"
          @onAddArea="addArea"
          @onUpdateProvince="updateCity"
        >
          <template #city="{ city }">
            <AreaTable :ref="areaRefFunc" :cityId="city.id" @onUpdateArea="updateArea" />
          </template>
        </CityTable>
      </template>
    </ProvinceTable>
    <Drawer
      :zIndex="1"
      :title="drawerParam.title"
      :width="'100%'"
      :destroyOnClose="true"
      :visible="drawerParam.visible"
      :get-container="false"
      :wrapClassName="`${prefixCls}-drawer`"
      :maskStyle="{ background: 'rgba(0, 0, 0, 0)' }"
      :wrap-style="{ position: 'fixed', top: '80px', righ: '0' }"
      @close="onClose"
    >
      <AreaForm
        v-if="drawerParam.state === '0'"
        :cityId="drawerParam.cityId"
        :id="drawerParam.id"
      />
      <CityForm
        v-if="drawerParam.state === '1'"
        :provinceId="drawerParam.provinceId"
        :id="drawerParam.id"
      />
      <ProvinceForm v-if="drawerParam.state === '2'" :id="drawerParam.id" />
    </Drawer>
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, ref, reactive } from 'vue';
  import { Drawer } from 'ant-design-vue';
  import ProvinceTable from './components/ProvinceTable.vue';
  import CityTable from './components/CityTable.vue';
  import AreaTable from './components/AreaTable.vue';
  import AreaForm from './components/AreaForm.vue';
  import CityForm from './components/CityForm.vue';
  import ProvinceForm from './components/ProvinceForm.vue';
  export default defineComponent({
    name: 'Location',
    components: {
      Drawer,
      ProvinceTable,
      CityTable,
      AreaTable,
      AreaForm,
      CityForm,
      ProvinceForm,
    },
    setup() {
      const { t } = useI18n();
      const { prefixCls } = useDesign('location');
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      const cityRefObject = reactive<any>([]);
      const areaRefObject = reactive<any>([]);
      const provinceRef = ref();
      const drawerParam = reactive({
        id: '',
        provinceId: '',
        cityId: '',
        state: '', // 0: area 1: city 2: provice
        title: '',
        visible: false,
      });

      const onClose = () => {
        switch (drawerParam.state) {
          case '2':
            provinceRef.value.refresh();
            break;
          case '1':
            cityRefObject[0].refresh();
            break;
          case '0':
            areaRefObject[0].refresh();
            break;
        }
        cityRefObject.splice(0);
        areaRefObject.splice(0);
        drawerParam.id = '';
        drawerParam.provinceId = '';
        drawerParam.cityId = '';
        drawerParam.state = '';
        drawerParam.title = '';
        drawerParam.visible = false;
      };
      const addProvince = () => {
        drawerParam.visible = true;
        drawerParam.state = '2';
        drawerParam.id = '';
        drawerParam.title = t('model.location.province.addProvince');
      };
      const addCity = (e) => {
        drawerParam.visible = true;
        drawerParam.provinceId = e.provinceId;
        drawerParam.state = '1';
        drawerParam.title = t('model.location.city.addCity');
      };

      const updateProvince = (e) => {
        drawerParam.visible = true;
        drawerParam.id = e.provinceId;
        drawerParam.state = '2';
        drawerParam.title = t('model.location.province.updateProvince');
      };

      const addArea = (e) => {
        drawerParam.visible = true;
        drawerParam.cityId = e.cityId;
        drawerParam.state = '0';
        drawerParam.title = t('model.location.area.addArea');
      };
      const updateCity = (e) => {
        drawerParam.visible = true;
        drawerParam.id = e.cityId;
        drawerParam.state = '1';
        drawerParam.title = t('model.location.city.updateCity');
      };

      const updateArea = (e) => {
        drawerParam.visible = true;
        drawerParam.id = e.areaId;
        drawerParam.state = '0';
        drawerParam.title = t('model.location.area.updateArea');
      };

      const cityRefFunc = (el) => {
        cityRefObject.push(el);
      };
      const areaRefFunc = (el) => {
        areaRefObject.push(el);
      };

      return {
        t,
        prefixCls,
        tip,
        loading,
        provinceRef,
        cityRefFunc,
        areaRefFunc,
        drawerParam,
        onClose,
        addProvince,
        addCity,
        updateProvince,
        addArea,
        updateCity,
        updateArea,
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

  .@{prefix-cls} {
    &-drawer {
      max-width: 500px;
    }

    &-action-menu-item {
      text-align: center;
    }
  }
</style>
