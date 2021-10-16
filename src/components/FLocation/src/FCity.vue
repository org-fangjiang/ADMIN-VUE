<template>
  <Select
    ref="selectRef"
    :disabled="props.disabledCity"
    v-model:value="props.cityId"
    :options="options"
    :size="props.size"
    @change="change"
    :placeholder="props.placeholder"
    change-on-select
  />
</template>
<script lang="ts">
  import { Select } from 'ant-design-vue';
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import { getAllCities } from '/@/api/sys/city/city';
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
      const selectRef = ref();

      const change = (value, _selectedOptions) => {
        emit('change', { value });
      };
      // const condition = reactive({
      //   id: props.provinceId,
      // });
      watch(
        () => props.provinceId,
        async (_v1, _v2) => {
          if (props.provinceId) {
            options.value.splice(0);
            const { content } = await getAllCities({ id: props.provinceId });
            if (content && content.length > 0) {
              content.forEach((item) => {
                options.value?.push({ value: item.id, label: item.name });
              });
            }
          }
        }
      );

      onMounted(async () => {
        const { content } = await getAllCities({ id: props.provinceId });
        if (content && content.length > 0) {
          content.forEach((item) => {
            options.value?.push({ value: item.id, label: item.name });
          });
        }
      });
      return {
        selectRef,
        change,
        options,
        props,
      };
    },
  });
</script>
