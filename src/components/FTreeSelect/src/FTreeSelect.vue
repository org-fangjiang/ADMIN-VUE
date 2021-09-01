<template>
  <TreeSelect
    v-model:value="selectItem"
    :replaceFields="fields"
    tree-data-simple-mode
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :tree-data="treeData"
    @change="change"
    placeholder=""
    multiple
    :load-data="onLoadData"
  />
</template>
<script lang="ts">
  import { TreeSelect } from 'ant-design-vue';
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import {
    getSysDictGroups,
    getSysDictDetails,
    getSysDictDetailsByArray,
  } from '/@/api/sys/dict/dict';
  import { DictDetailModel } from '/@/api/sys/dict/model/dictModel';
  import { basicProps } from './props';
  import { Option } from './types/Option';

  export default defineComponent({
    name: 'FTreeSelect',
    components: {
      TreeSelect,
    },
    props: basicProps,
    emits: ['change'],
    setup(props, { emit }) {
      const defaultIds: string[] = [];
      props.ids.forEach((item) => {
        if (item && item !== '') {
          defaultIds.push(item);
        }
      });

      const selectItem = ref<string[]>(defaultIds);
      const treeData = ref<Option[]>([]);
      const fields = { children: 'children', title: 'title', key: 'id', value: 'id' };

      const change = (value) => {
        emit('change', { value });
      };

      watch(
        () => props.ids,
        async (_v1, _v2) => {
          if (props.ids.length > 0) {
            getDefaultArray();
          }
        }
      );

      const onLoadData = async (treeNode: any) => {
        const { id } = treeNode.dataRef;
        const { content } = await getSysDictDetails({ groupId: id });
        content.forEach((item: DictDetailModel) => {
          let isIncludes = false;
          treeData.value.forEach((data) => {
            if (item.id === data?.id) {
              isIncludes = true;
              return;
            }
          });
          if (!isIncludes) {
            treeData.value.push({
              id: item.id,
              value: item.value,
              isLeaf: true,
              pId: item.groupId,
              title: item.value,
            });
          }
        });
      };

      const getDefaultArray = async () => {
        let ids: string[] = [];
        if (props.ids.length > 0) {
          props.ids.forEach((item) => {
            if (item && item !== '') {
              ids.push(item);
            }
          });
          if (ids.length > 0) {
            const { content } = await getSysDictDetailsByArray(ids);
            content.forEach((item) => {
              let isIncludes = false;
              treeData.value.forEach((data) => {
                if (item === data?.id) {
                  isIncludes = true;
                  return;
                }
              });
              if (!isIncludes) {
                treeData.value.push({
                  id: item.id,
                  value: item.value,
                  isLeaf: true,
                  pId: item.groupId,
                  title: item.value,
                });
              }
            });
          }
        }
      };

      onMounted(async () => {
        const { content } = await getSysDictGroups({ state: '' });
        content.forEach((item) => {
          treeData.value?.push({ id: item.id, title: item.name, isLeaf: false, selectable: false });
        });
        if (props.ids.length > 0) {
          getDefaultArray();
        }
      });
      return {
        props,
        fields,
        selectItem,
        treeData,
        onLoadData,
        change,
      };
    },
  });
</script>
