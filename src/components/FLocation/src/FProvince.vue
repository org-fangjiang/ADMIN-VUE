<template>
  <Select
    ref="selectRef"
    :disabled="props.disabledProvince"
    v-model:value="props.provinceId"
    :options="options"
    :size="props.size"
    @change="change"
    :placeholder="props.placeholder"
    change-on-select
  />
</template>
<script lang="ts">
  import { Select } from 'ant-design-vue';
  import { defineComponent, ref, onMounted } from 'vue';
  import { getAllProvinces } from '/@/api/sys/province/province';
  import { basicProps } from './props';
  import { Option } from './types/Option';

  export default defineComponent({
    name: 'FProvince',
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
      onMounted(async () => {
        const { content } = await getAllProvinces();
        content.forEach((item) => {
          options.value?.push({ value: item.id, label: item.name });
        });
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
