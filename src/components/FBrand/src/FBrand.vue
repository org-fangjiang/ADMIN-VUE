<template>
  <Select
    :showSearch="true"
    ref="select"
    :allowClear="true"
    v-model:value="selected"
    style="width: 120px"
    @search="nameChange"
    :options="data"
    :pagination="false"
    @select="nameSelect"
    label-in-value
    :filter-option="false"
    :not-found-content="fetching ? undefined : null"
  >
    <template v-if="fetching" #notFoundContent>
      <Spin size="small" />
    </template>
  </Select>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
  import { Select, Spin } from 'ant-design-vue';
  import { getBrand, getBrands } from '/@/api/host/brand/brand';
  interface Option {
    value: string;
    label: string;
  }

  export default defineComponent({
    name: 'FBrand',
    components: {
      Select,
      Spin,
    },
    props: {
      brandId: {
        type: String,
        required: true,
      },
    },
    emits: ['setProjectBrand'],
    setup(props, { emit }) {
      const data = ref<Option[]>([]);
      const selected = ref({});

      const condition = reactive({
        name: '',
        state: '',
      });

      watch(
        () => props.brandId,
        async (_v1, _v2) => {
          if (props.brandId) {
            props.brandId;
            const { content } = await getBrand(props.brandId);
            data.value.splice(0);
            if (content) {
              selected.value = {
                value: props.brandId,
                label: content.name,
                key: props.brandId,
              };
              data.value.push({ value: content.id || '', label: content.name || '' });
            }
          }
        }
      );

      onMounted(async () => {
        if (props.brandId) {
          const { content } = await getBrand(props.brandId);
          selected.value = {
            value: props.brandId,
            label: content.name,
            key: props.brandId,
          };
          data.value.push({ value: content.id || '', label: content.name || '' });
        } else {
          const { content } = await getBrands(condition);
          if (content && content.length > 0) {
            content.forEach((item) => {
              data.value.push({ value: item.id || '', label: item.name || '' });
            });
          }
        }
      });
      let fetching = ref<boolean>(false);
      const nameChange = async (value) => {
        fetching.value = true;
        condition.name = value;
        const { content } = await getBrands(condition);
        data.value.splice(0);
        if (content && content.length > 0) {
          content.forEach((item) => {
            data.value.push({ value: item.id || '', label: item.name || '' });
          });
        }
        fetching.value = false;
      };

      const nameSelect = async (value) => {
        emit('setProjectBrand', value);
      };

      return {
        nameChange,
        data,
        props,
        nameSelect,
        fetching,
        selected,
      };
    },
  });
</script>
