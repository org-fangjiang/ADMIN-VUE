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
  import { getEstateCompanies, getEstateCompany } from '/@/api/host/estateCompany/estateCompany';
  interface Option {
    value: string;
    label: string;
  }

  export default defineComponent({
    name: 'FEstateCompany',
    components: {
      Select,
      Spin,
    },
    props: {
      estateCompany: {
        type: String,
        required: true,
      },
    },
    emits: ['setProjectEstateCompany'],
    setup(props, { emit }) {
      const data = ref<Option[]>([]);
      const selected = ref();

      const condition = reactive({
        name: '',
        state: '',
      });

      watch(
        () => props.estateCompany,
        async (_v1, _v2) => {
          if (props.estateCompany) {
            props.estateCompany;
            const { content } = await getEstateCompany(props.estateCompany);
            data.value.splice(0);
            if (content) {
              selected.value = {
                value: props.estateCompany,
                label: content.name,
                key: props.estateCompany,
              };
              data.value.push({ value: content.id || '', label: content.name || '' });
            }
          }
        }
      );

      onMounted(async () => {
        if (props.estateCompany) {
          const { content } = await getEstateCompany(props.estateCompany);
          if (content) {
            selected.value = { value: props.estateCompany, label: content.name };
            data.value.push({ value: content.id || '', label: content.name || '' });
          }
        } else {
          const { content } = await getEstateCompanies(condition);
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
        const { content } = await getEstateCompanies(condition);
        data.value.splice(0);
        if (content && content.length > 0) {
          content.forEach((item) => {
            data.value.push({ value: item.id || '', label: item.name || '' });
          });
        }
        fetching.value = false;
      };

      const nameSelect = async (value) => {
        emit('setProjectEstateCompany', value);
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
