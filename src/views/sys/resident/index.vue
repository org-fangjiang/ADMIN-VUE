<template>
  <div class="p-4">
    <Table :pagination="false" :columns="columns" :data-source="list" rowKey="id">
      <template #state="{ text: state }">
        <Tag :color="residentConst.STATES[state].color">
          {{ residentConst.STATES[state].label }}
        </Tag>
      </template>
      <template #operation="{ text: user }">
        <Button type="link" @click="clickSet(user)">查看项目信息</Button>
        <Button type="link" @click="clickAdd(user)">添加项目信息</Button>
        <Button type="link" @click="clickDelete(user)">删除项目信息</Button>
      </template>
    </Table>
    <Pagination
      class="mt-4"
      show-size-changer
      size="large"
      :pageSizeOptions="pageSizeList"
      :pageSize="pageParam.size"
      :current="pageParam.number"
      :total="pageParam.totalElements"
      @change="onChange"
      @showSizeChange="onShowSizeChange"
      :show-total="(total) => `共 ${total} 条`"
    />
    <Modal
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      :destroyOnClose="true"
      @cancel="onClose"
      :footer="null"
      width="40%"
    >
      <ResidentForm :id="drawerParam.id" v-if="drawerParam.state === '0'" />
      <FProject
        v-if="drawerParam.state === '1'"
        @setNewsProject="setNewsProject"
        :resident="drawerParam.id"
        :selected="[]"
        :id="''"
      />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { GetUserModel } from '/@/api/sys/user/model/userModel';
  import { getUsersByResident } from '/@/api/sys/user/user';
  import { failed, processList, success } from '/@/hooks/web/useList';
  import { Loading } from '/@/components/Loading';
  import { ResidentColumns, ResidentConst } from '/@/api/sys/resident/mdoel/residentModel';
  import { Table, Tag, Button, Pagination, Modal } from 'ant-design-vue';
  import ResidentForm from './components/ResidentForm.vue';
  import FProject from '/@/components/FProject';
  import {
    addProject,
    addProjectBatch,
    deleteProject,
    deleteProjectBatch,
  } from '/@/api/sys/resident/resident';

  export default defineComponent({
    name: 'Resident',
    components: {
      Loading,
      Table,
      Tag,
      Button,
      Pagination,
      Modal,
      ResidentForm,
      FProject,
    },
    setup() {
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const sales: GetUserModel[] = [];
      const list = reactive(sales);
      const residentConst = ref(ResidentConst);
      const columns = reactive(ResidentColumns);

      const pageSizeList = ref<string[]>(PageSizeList);
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });

      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<GetUserModel> | undefined;
        try {
          result = result = await getUsersByResident('', {
            pageSize: pageParam.size,
            pageNum: pageParam.number,
          });
        } catch (error: any) {
        } finally {
          loading.value = false;
        }
        return result;
      };

      onMounted(async () => {
        const result = await getList();
        processList(result, list, pageParam);
      });

      // 弹窗
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
        fromType: '',
      });
      // 关闭弹窗
      const onClose = () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        drawerParam.fromType = '';
      };

      const clickSet = (line) => {
        drawerParam.visible = true;
        drawerParam.title = '查看项目信息';
        drawerParam.id = line.id;
        drawerParam.state = '0';
      };

      const clickAdd = (line) => {
        drawerParam.visible = true;
        drawerParam.title = '添加项目信息';
        drawerParam.id = line.id;
        drawerParam.state = '1';
        drawerParam.fromType = 'add';
      };

      const clickDelete = (line) => {
        drawerParam.visible = true;
        drawerParam.title = '删除项目信息';
        drawerParam.id = line.id;
        drawerParam.state = '1';
        drawerParam.fromType = 'delete';
      };

      //设置项目
      const setNewsProject = async (value) => {
        loading.value = true;
        value.projects.splice(0, 1);
        try {
          if (value.projects && value.projects.length > 0) {
            if (drawerParam.fromType === 'add') {
              if (value.projects.length === 1 && value.projects[0].id) {
                await addProject(drawerParam.id, value.projects[0].id);
                success('成功', '添加项目信息成功');
              } else if (value.projects.length > 1) {
                let ids: string[] = [];
                value.projects.forEach((item) => {
                  if (item.id) {
                    ids.push(item.id);
                  }
                });
                await addProjectBatch(drawerParam.id, ids);
                success('成功', '添加项目信息成功');
              }
            } else if (drawerParam.fromType === 'delete') {
              if (value.projects.length === 1 && value.projects[0].id) {
                await deleteProject(drawerParam.id, value.projects[0].id);
                success('成功', '删除项目信息成功');
              } else if (value.projects.length > 1) {
                let ids: string[] = [];
                value.projects.forEach((item) => {
                  if (item.id) {
                    ids.push(item.id);
                  }
                });
                await deleteProjectBatch(drawerParam.id, ids);
                success('成功', '删除项目信息成功');
              }
            }
          }
        } catch (error) {
          failed('失败', '操作失败');
        } finally {
          loading.value = false;
        }
        loading.value = false;
      };

      //页码改变
      const onChange = async (page) => {
        pageParam.number = page;
        const result = await getList();
        processList(result, list, pageParam);
      };
      //每页条数改变
      const onShowSizeChange = async (current, size) => {
        console.log(current);
        pageParam.size = size;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      return {
        loading,
        tip,
        list,
        pageParam,
        onChange,
        onShowSizeChange,
        pageSizeList,
        drawerParam,
        onClose,
        residentConst,
        columns,
        clickSet,
        clickAdd,
        clickDelete,
        setNewsProject,
      };
    },
  });
</script>
