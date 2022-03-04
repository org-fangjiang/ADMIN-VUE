<template>
  <div class="px-4 pb-4">
    <div v-if="list && list.length > 0" class="mt-4 space-x-3 space-y-3 h-[300px]">
      <span v-for="(item, index) in list" :key="item.projectId">
        <Tag closable @close="log(item)" :color="colors[index % 5]">
          <span>{{ item.projectById.name }}</span>
          <span v-if="item.projectById.type === '1'" class="ml-2 mt-2">住宅</span>
          <span v-if="item.projectById.type === '2'" class="ml-2 mt-2">公寓</span>
          <span v-if="item.projectById.type === '3'" class="ml-2 mt-2">商铺</span>
          <span v-if="item.projectById.type === '4'" class="ml-2 mt-2">写字楼</span>
          <span v-if="item.projectById.type === '5'" class="ml-2 mt-2">仓库</span>
          <span v-if="item.projectById.type === '6'" class="ml-2 mt-2">别墅</span>
          <span v-if="item.projectById.type === '7'" class="ml-2 mt-2">商业</span>
        </Tag>
      </span>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive } from 'vue';
  import { ResidentModel } from '/@/api/sys/resident/mdoel/residentModel';
  import { deleteProject, getProject } from '/@/api/sys/resident/resident';
  import { Tag } from 'ant-design-vue';
  import { success } from '/@/hooks/web/useList';

  export default defineComponent({
    name: 'ResidentForm',
    components: { Tag },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const projects: ResidentModel[] = [];
      const list = reactive(projects);
      onMounted(async () => {
        const { content } = await getProject(props.id);
        if (content && content.length > 0) {
          list.push(...content);
        }
      });
      const colors = ['red', 'green', 'cyan', 'purple', 'orange'];
      const log = async (item) => {
        await deleteProject(item.userId, item.projectId);
        success('成功', '删除项目信息成功');
      };

      return {
        log,
        list,
        colors,
      };
    },
  });
</script>
