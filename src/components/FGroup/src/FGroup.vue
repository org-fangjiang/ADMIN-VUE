<template>
  <Select
    v-model:value="result"
    mode="multiple"
    label-in-value
    placeholder=""
    style="width: 185.95px"
    :filter-option="false"
    :options="data"
    @change="change"
  />
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { Select } from 'ant-design-vue';
  import { getAllSysDictGroups } from '/@/api/sys/dict/dict';
  import { SysDictDetailBean } from '/@/api/host/project/model/SysDictDetailBean';
  import { Options } from './types/Option';

  export default defineComponent({
    name: 'FGroup',
    components: {
      Select,
    },
    props: {
      detialsId: {
        type: Array as PropType<SysDictDetailBean[]>,
        require: false,
      },
      selectedLabel: {
        type: Array,
        require: false,
      },
    },
    emits: ['change'],
    setup(props, { emit }) {
      const data = ref<any[]>([]);
      let result = ref<any[]>([]);
      onMounted(async () => {
        const { content } = await getAllSysDictGroups();
        if (content && content.length > 0) {
          content.forEach((item) => {
            const opt = ref<Options[]>([]);
            item.sysDictDetails?.forEach((e) => {
              opt.value.push({ label: e.value, value: e.id });
            });
            if (!data.value) {
              data.value = [];
            }
            const option = { label: item.name, options: opt.value };
            data.value.push(option);
          });
        }
        if (props.selectedLabel) {
          debugger;
          props.selectedLabel.forEach((item) => {
            result.value.push({ value: item, key: item });
          });
        }
        if (props.detialsId) {
          props.detialsId.forEach((item) => {
            result.value.push({ value: item.id, label: item.value, key: item.groupId });
          });
        }
      });

      const change = (value) => {
        debugger;
        emit('change', value);
      };

      return {
        change,
        data,
        result,
        props,
      };
    },
  });
</script>
