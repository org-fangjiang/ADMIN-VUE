<template>
  <Select
    v-model:value="props.areaId"
    :options="options"
    :size="props.size"
    @change="change"
    :placeholder="props.placeholder"
    change-on-select
  />
</template>
<script lang="ts">
  import { Select } from 'ant-design-vue';
  import { defineComponent, watch, ref } from 'vue';
  import { getAllAreas } from '/@/api/sys/area/area';
  import { basicProps } from './props';
  import { Option } from './types/Option';

  export default defineComponent({
    name: 'FCity',
    components: {
      Select,
    },
    props: basicProps,
    emits: ['change'],
    setup(props, { emit }) {
      // set default value
      const options = ref<Option[]>([]);

      const change = (value, _selectedOptions) => {
        emit('change', { value });
      };

      watch(
        () => props.cityId,
        async (_v1, _v2) => {
          if (props.cityId) {
            options.value.splice(0);
            const { content } = await getAllAreas({ id: props.cityId });
            if (content) {
              content.forEach((item) => {
                options.value?.push({ value: item.id, label: item.name });
              });
            }
          }
        }
      );

      return {
        change,
        options,
        props,
      };
    },
  });
</script>
