<template>
  <Cascader
    v-model:value="value"
    :options="options"
    :loadData="loadData"
    @change="change"
    change-on-select
    :cityId="props.cityId"
  />
</template>
<script lang="ts">
  import { Cascader } from 'ant-design-vue';
  import { defineComponent, onMounted, ref } from 'vue';
  import { getLines, getStationsByLine } from '/@/api/sys/metro/metro';
  import { MetroStationModel } from '/@/api/sys/metro/model/metroModel';
  interface Option {
    value?: string;
    label?: string;
    isLeaf?: boolean;
    loading?: boolean;
    children?: Option[];
  }
  export default defineComponent({
    name: 'FMetro',
    components: {
      Cascader,
    },
    props: {
      cityId: {
        type: String,
        require: true,
      },
      lineId: {
        type: String,
        require: true,
      },
      stationId: {
        type: String,
        require: true,
      },
    },
    emits: ['changeLine', 'changeStation', 'change'],
    setup(props, { emit }) {
      // set default value
      const value = ref<string[]>([props.lineId || '', props.stationId || '']);
      const options = ref<Option[]>([]);

      const change = (value, _selectedOptions) => {
        if (value[0]) {
          emit('changeLine', { id: value[0] });
        }
        if (value[1]) {
          emit('changeStation', { id: value[1] });
        }
        emit('change', value);
      };

      const loadData = async (selectedOption) => {
        if (selectedOption.length === 1) {
          selectedOption.loading = true;
          console.log(' selectedOption.value', selectedOption[0].value);
          const contentStation = await getStationsByLine({
            lineId: selectedOption[0].value,
            cityId: props.cityId,
          });
          const content = contentStation.content;
          if (content && content.length && content.length > 0) {
            content.forEach((item: MetroStationModel) => {
              if (!selectedOption[0].children) {
                selectedOption[0].children = [];
              }
              selectedOption[0].children.push({ value: item.id, label: item.name, isLeaf: true });
            });
          } else {
            selectedOption[0].isLeaf = true;
          }

          selectedOption[0].loading = false;
        }
      };

      onMounted(async () => {
        const { content } = await getLines({ cityId: props.cityId });
        content.forEach((item) => {
          options.value?.push({ value: item.id, label: item.name, isLeaf: false });
        });
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
