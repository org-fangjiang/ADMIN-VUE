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
    @clear="onClear"
    placeholder="项目名称"
  >
    <template v-if="fetching" #notFoundContent>
      <Spin size="small" />
    </template>
  </Select>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
  import { Select, Spin } from 'ant-design-vue';
  import { getProject, search, searchWithCondition } from '/@/api/host/project/project';
  import { useUserStore } from '/@/store/modules/user';
  import { debounce } from 'lodash';
  interface Option {
    value: string;
    label: string;
  }

  export default defineComponent({
    name: 'FProjectSelect',
    components: {
      Select,
      Spin,
    },
    props: {
      projectId: {
        type: String,
        require: true,
      },
    },
    emits: ['setProject', 'onClear'],
    setup(props, { emit }) {
      const data = ref<Option[]>([]);
      const selected = ref();

      const userStore = useUserStore();
      const cityId = ref<string>(userStore.getUserInfo.companyCityId || '');
      let provinceId = ref<string>(userStore.getUserInfo.companyProvinceId || '');

      const condition = reactive({
        name: '',
        state: '',
        provinceId: provinceId,
        cityId: cityId,
      });

      const onClear = async () => {
        emit('onClear');
      };

      watch(
        () => props.projectId,
        async (_v1, _v2) => {
          if (props.projectId) {
            const { content } = await getProject(props.projectId);
            data.value.splice(0);
            if (content) {
              selected.value = {
                value: props.projectId,
                label: content.name || '',
                key: props.projectId,
              };
              data.value.push({ value: content.id || '', label: content.name || '' });
            }
          }
        }
      );

      onMounted(async () => {
        if (props.projectId) {
          const { content } = await getProject(props.projectId);
          data.value.splice(0);
          if (content) {
            selected.value = {
              value: props.projectId,
              label: content.name || '',
              key: props.projectId,
            };
            data.value.push({ value: content.id || '', label: content.name || '' });
          }
        }
      });
      let fetching = ref<boolean>(false);
      const nameChange = debounce(async (value) => {
        fetching.value = true;
        if (value) {
          // 通过名称搜索
          condition.name = value;
          const { content } = await search(condition);
          data.value.splice(0);
          if (content && content.length > 0) {
            content.forEach((item) => {
              data.value.push({ value: item.id || '', label: item.name || '' });
            });
          }
        } else {
          //名称为空
          const { content } = await searchWithCondition(condition);
          data.value.splice(0);
          if (content && content.length > 0) {
            content.forEach((item) => {
              data.value.push({ value: item.id || '', label: item.name || '' });
            });
          }
        }
        fetching.value = false;
      }, 1000);

      const nameSelect = async (value) => {
        emit('setProject', value);
      };

      return {
        nameChange,
        data,
        props,
        nameSelect,
        fetching,
        selected,
        onClear,
      };
    },
  });
</script>
