<template>
  <Select
    v-model:value="value"
    mode="multiple"
    label-in-value
    placeholder=""
    style="width: 700px"
    :filter-option="false"
    :options="data"
    @search="fetchUser"
    @change="change"
  >
    <template v-if="fetching" #notFoundContent>
      <Spin />
    </template>
  </Select>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { debounce } from 'lodash-es';
  import { Select, Spin } from 'ant-design-vue';
  import { getTradingsByName } from '/@/api/sys/trading/trading';
  import { Option } from './types/Option';

  export default defineComponent({
    name: 'FTrading',
    components: {
      Select,
      Spin,
    },
    props: {
      cityId: {
        type: String,
        require: true,
      },
      provinceId: {
        type: String,
        require: true,
      },
    },
    emits: ['change'],
    setup(props, { emit }) {
      const data = ref<Option[]>([]);
      const value = ref<string[]>([]);
      //是否正在加载，显示加载动画
      const fetching = ref<boolean>();
      //根据输入的数据搜索
      const fetchUser = debounce(async (value) => {
        if (!value) {
          data.value.splice(0);
          return;
        }
        //每次将下拉数据清空
        data.value.splice(0);
        fetching.value = true;
        try {
          const { content } = await getTradingsByName({
            cityId: props.cityId,
            provinceId: props.provinceId,
            name: value,
          });
          if (content && content.length > 0) {
            content.forEach((item) => {
              data.value.push({ value: item.id || '', label: item.name || '' });
            });
          } else {
            data.value = [];
          }
        } catch (error) {
          console.log('error:', error);
        } finally {
          fetching.value = false;
        }
        //防止抖动
      }, 300);

      //抛出方法以及选择的数据
      const change = (value) => {
        emit('change', value);
      };

      return {
        fetchUser,
        change,
        data,
        value,
        fetching,
      };
    },
  });
</script>
