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
          defaultIds.push(item); //默认出现的数据id数组
        }
      });

      const selectItem = ref<string[]>(defaultIds); //筛选框中的数据
      const treeData = ref<Option[]>([]);
      const fields = { children: 'children', title: 'title', key: 'id', value: 'id' }; //更改字段名

      const change = (value) => {
        emit('change', { value });
      };

      watch(
        //监听方法
        () => props.ids,
        async (_v1, _v2) => {
          if (props.ids.length > 0) {
            //props.ids发生改变，重新获取
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
              //判断获取到的值是否已经在下拉框中，防止重复赋值
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
              //将传过来的ids，赋值给ids数组
              ids.push(item);
            }
          });
          if (ids.length > 0) {
            const { content } = await getSysDictDetailsByArray(ids);
            content.forEach((item) => {
              let isIncludes = false;
              treeData.value.forEach((data) => {
                if (item === data?.id) {
                  //判断获取到的item是否已经在筛选框中，避免重复
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
        //获取父级数据，存储
        const { content } = await getSysDictGroups({ state: '' });
        content.forEach((item) => {
          treeData.value?.push({ id: item.id, title: item.name, isLeaf: false, selectable: false });
        });
        if (props.ids.length > 0) {
          //有初始值，放到筛选框中
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
