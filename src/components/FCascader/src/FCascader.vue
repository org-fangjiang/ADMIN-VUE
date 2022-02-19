<template>
  <Cascader
    v-model:value="selected"
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
  import { defineComponent, onMounted, ref, watch } from 'vue';
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
      const selected = ref<Array<string | undefined>>([]);
      if (props.provinceId) {
        selected.value.push(props.provinceId);
      }
      if (props.cityId) {
        selected.value.push(props.cityId);
      }
      if (props.areaId) {
        selected.value.push(props.areaId);
      }

      watch(
        () => props,
        async () => {
          if (props.provinceId && props.cityId) {
            const city = await getCity(props.provinceId);
            let cityChild = ref<Option[]>([]);
            city.forEach((item) => {
              cityChild.value.push({
                value: item.id,
                label: item.name,
                isLeaf: false,
                disabled: props.disProCity,
              });
            });
            const area = await getArea(props.cityId);
            let areaChild = ref<Option[]>([]);
            area.forEach((q) => {
              areaChild.value.push({ value: q.id, label: q.name });
            });
            for (let i = 0; i < options.value.length; i++) {
              if (options.value[i].value === props.provinceId) {
                options.value[i].isLeaf = false;
                options.value[i].children = cityChild.value;
                for (let j = 0; j < cityChild.value.length; j++) {
                  if (cityChild.value[j].value === props.cityId) {
                    if (options.value[i].children) {
                      (options.value[i].children as Option[])[j].children = areaChild.value;
                    }
                  }
                }
              }
            }
          }
          if (props.provinceId) {
            selected.value.push(props.provinceId);
          }
          if (props.cityId) {
            selected.value.push(props.cityId);
          }
          if (props.areaId) {
            selected.value.push(props.areaId);
          }
        },
        {
          deep: true,
        }
      );

      const options = ref<Option[]>([]);

      const change = (value, _selectedOptions) => {
        if (!value[0]) {
          if (props.provinceId) {
            selected.value.push(props.provinceId);
          }
          if (props.cityId) {
            selected.value.push(props.cityId);
          }
          if (props.areaId) {
            selected.value.push(props.areaId);
          }
        }
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
          options.value?.push({
            value: item.id,
            label: item.name,
            isLeaf: false,
            disabled: props.disProCity,
          });
        });
        if (props.provinceId && props.cityId) {
          const city = await getCity(props.provinceId);
          let cityChild = ref<Option[]>([]);
          city.forEach((item) => {
            cityChild.value.push({
              value: item.id,
              label: item.name,
              isLeaf: false,
              disabled: props.disProCity,
            });
          });
          const area = await getArea(props.cityId);
          let areaChild = ref<Option[]>([]);
          area.forEach((q) => {
            areaChild.value.push({ value: q.id, label: q.name });
          });
          for (let i = 0; i < options.value.length; i++) {
            if (options.value[i].value === props.provinceId) {
              options.value[i].isLeaf = false;
              options.value[i].children = cityChild.value;
              // if (props.areaId) {
              for (let j = 0; j < cityChild.value.length; j++) {
                if (cityChild.value[j].value === props.cityId) {
                  if (options.value[i].children) {
                    (options.value[i].children as Option[])[j].children = areaChild.value;
                  }
                }
              }
              // }
            }
          }
        }
      });
      return {
        change,
        selected,
        options,
        loadData,
        props,
        // clear,
        // cascader,
      };
    },
  });
</script>
