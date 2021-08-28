<template>
  <Cascader
    v-model:value="value"
    :options="options"
    :loadData="loadData"
    :size="props.size"
    @change="change"
    :placeholder="props.placeholder"
    change-on-select
  />
</template>
<script lang="ts">
  import { Cascader } from 'ant-design-vue';
  import { defineComponent, onMounted, ref } from 'vue';
  import { getAllProvinces } from '/@/api/sys/province/province';
  import { getAllCities } from '/@/api/sys/city/city';
  import { getAllAreas } from '/@/api/sys/area/area';
  import { basicProps } from './props';
  import { Option } from './types/Option';
  import { CityModel } from '/@/api/sys/city/model/cityModel';
  import { AreaModel } from '/@/api/sys/area/model/areaModel';

  export default defineComponent({
    name: 'FCascader',
    components: {
      Cascader,
    },
    props: basicProps,
    emits: ['changeProivnce', 'changeCity', 'changeArea', 'change'],
    setup(props, { emit }) {
      // set default value
      const value = ref<string[]>([props.provinceId || '', props.cityId || '', props.areaId || '']);
      const options = ref<Option[]>([]);

      const change = (value, _selectedOptions) => {
        if (value[0]) {
          emit('changeProivnce', { id: value[0] });
        }
        if (value[1]) {
          emit('changeCity', { id: value[1] });
        }
        if (value[2]) {
          emit('changeArea', { id: value[2] });
        }
        emit('change', { value });
      };

      const loadData = async (selectedOptions: Option[]) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        switch (selectedOptions.length - 1) {
          case 0:
            const contentCity = await getCity(targetOption.value);
            if (contentCity && contentCity.length && contentCity.length > 0) {
              contentCity.forEach((item: CityModel) => {
                if (!targetOption.children) {
                  targetOption.children = [];
                }
                targetOption.children.push({ value: item.id, label: item.name, isLeaf: false });
              });
            } else {
              targetOption.isLeaf = true;
            }
            break;
          case 1:
            const contentArea = await getArea(targetOption.value);
            if (contentArea && contentArea.length && contentArea.length > 0) {
              contentArea.forEach((item: AreaModel) => {
                if (!targetOption.children) {
                  targetOption.children = [];
                }
                targetOption.children.push({ value: item.id, label: item.name, isLeaf: true });
              });
            } else {
              targetOption.isLeaf = true;
            }
            break;
        }
        targetOption.loading = false;
      };

      const getCity = async (provinceId) => {
        const { content } = await getAllCities({ id: provinceId });
        return content;
      };

      const getArea = async (cityId) => {
        const { content } = await getAllAreas({ id: cityId });
        return content;
      };

      onMounted(async () => {
        const { content } = await getAllProvinces();
        content.forEach((item) => {
          options.value?.push({ value: item.id, label: item.name, isLeaf: false });
        });
        console.log('options: ', options);
      });
      return {
        change,
        value,
        options,
        loadData,
        props,
      };
    },
  });
</script>
