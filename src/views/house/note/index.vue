// 项目信息管理

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <!-- 状态筛选 -->
    <Select
      :class="`${prefixCls}-add`"
      ref="select"
      :allowClear="true"
      v-model:value="condition.state"
      style="width: 120px"
      @change="stateHandleChange"
      :options="hostConst.STATES"
      :pagination="false"
    />
    <!-- 根据名称筛选 -->
    <FProjectSelect @setProject="setProject" @onClear="onClear" :class="`${prefixCls}-add`" />
    <Table
      :scroll="{ x: true }"
      :columns="columns"
      :data-source="list"
      rowKey="id"
      :pagination="false"
      @change="sortChange"
      :customRow="clickRow"
    >
      <template #state="{ text: state }">
        <span>
          <Tag :color="hostConst.STATES[state].color">
            {{ hostConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #type="{ text: type }">
        <span>
          <Tag :color="hostConst.TYPES[type - 1].color">
            {{ hostConst.TYPES[type - 1].label }}
          </Tag>
        </span>
      </template>
      <template #price="{ record }">
        <span>{{ record.price }}</span>
      </template>
      <template #createTime="{ text: createTime }">
        <span>{{ createTime.replace('T', ' ').replace('.000+08:00', '') }}</span>
      </template>
      <!-- <template #operation="{ text: link }">
        <Button type="link" @click="seeProject(link)">{{ t('host.action.see') }}</Button>
      </template> -->
    </Table>
    <Pagination
      show-size-changer
      size="large"
      :show-total="(total) => t('component.table.total', { total })"
      :pageSizeOptions="pageSizeList"
      :current="pageParam.number"
      :pageSize="pageParam.size"
      :total="pageParam.totalElements"
      @change="onChange"
      @showSizeChange="onShowSizeChange"
    />
    <Modal
      v-model:visible="projectModal"
      :title="drawerParam.title"
      @cancel="onClose"
      width="100%"
      :destroyOnClose="true"
      :footer="null"
      :bodyStyle="{ overflowY: 'auto' }"
      wrapClassName="full-modal"
    >
      <ProjectForm v-if="drawerParam.state === '0'" :id="drawerParam.id" />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { Table, Pagination, Tag, Select, Modal } from 'ant-design-vue';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Loading } from '/@/components/Loading';
  import { HostModel, NoteColumns, _HostConst } from '/@/api/host/project/model/projectModel';
  import { search, searchWithCondition } from '/@/api/host/project/project';
  // 用户store
  import { useUserStore } from '/@/store/modules/user';
  import FProjectSelect from '/@/components/FProjectSelect';
  import { processList } from '/@/hooks/web/useList';
  import ProjectForm from './components/ProjectForm.vue';

  export default defineComponent({
    name: 'ProjectTable',
    components: {
      Table,
      Pagination,
      Tag,
      Select,
      Loading,
      Modal,
      FProjectSelect,
      ProjectForm,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');
      const hostConst = ref(_HostConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      const columns = reactive(NoteColumns);

      //抽屉
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        provinceId: '',
        cityId: '',
        areaId: '',
      });
      //分页参数
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });

      // 点击行
      const clickRow = (record) => {
        return {
          onClick: (_e) => {
            projectModal.value = true;
            drawerParam.state = '0';
            drawerParam.id = record.id;
            drawerParam.title = t('host.action.see');
          },
        };
      };

      //根据名称筛选
      const setProject = async (value) => {
        let result: BasePageResult<HostModel> | undefined;
        if (value) {
          condition.name = value.label;
          result = await search(condition);
        } else {
          result = await getList();
        }
        processList(result, list, pageParam);
      };
      const onClear = async () => {
        let result: BasePageResult<HostModel> | undefined;
        result = await searchWithCondition(condition, {
          pageSize: pageParam.size,
          pageNum: pageParam.number,
        });
        processList(result, list, pageParam);
      };

      //根据状态筛选
      const stateHandleChange = async (value) => {
        condition.state = value;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      // 获取用户store
      const userStore = useUserStore();
      const cityId = userStore.getUserInfo.companyCityId;
      let provinceId = ref();

      //根据创建时间排序，默认降序
      const sortParam = reactive({
        asc: [''],
        desc: ['createTime'],
      });
      const sortChange = async (pagination, filters, sorter) => {
        //打印可以分别得到上下箭头的数据
        console.log(pagination, filters, sorter);
        sortParam.asc.splice(0);
        sortParam.desc.splice(0);
        if (sorter.order === 'ascend') {
          sortParam.asc.push('createTime');
        } else if (sorter.order === 'descend') {
          sortParam.desc.push('createTime');
        } else if (sorter.order === undefined) {
          sortParam.asc.splice(0);
          sortParam.desc.splice(0);
        }
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      //查询条件
      const condition = reactive({
        state: '1',
        name: '',
        provinceId: provinceId,
        cityId: cityId,
      });

      //初始加载
      onMounted(async () => {
        provinceId.value = ref<string>(userStore.getUserInfo.companyProvinceId || '');
        const result = await getList();
        processList(result, list, pageParam);
      });

      const projects: HostModel[] = [];
      let list = reactive(projects);
      //获取数据
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<HostModel> | undefined;
        try {
          result = await searchWithCondition(
            condition,
            {
              pageSize: pageParam.size,
              pageNum: pageParam.number,
            },
            sortParam
          );
        } catch (error: any) {
          createErrorModal({
            title: t('sys.api.errorTip'),
            content: error?.response?.data?.message || t('sys.api.networkExceptionMsg'),
            getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
          });
        } finally {
          loading.value = false;
        }
        return result;
      };

      //控制查询项目的modal
      let projectModal = ref(false);

      //查询项目，打开modal
      const seeProject = (link) => {
        projectModal.value = true;
        drawerParam.state = '0';
        drawerParam.id = link.id;
        drawerParam.title = t('host.action.see');
      };
      //关闭modal，清空数据
      const onClose = async () => {
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        const result = await getList();
        processList(result, list, pageParam);
        projectModal.value = false;
      };

      const onChange = async (page) => {
        pageParam.number = page;
        const result = await getList();
        processList(result, list, pageParam);
      };
      const onShowSizeChange = async (current, size) => {
        console.log(current);
        pageParam.size = size;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      return {
        t,
        prefixCls,
        hostConst,
        tip,
        columns,
        condition,
        loading,
        pageSizeList,
        pageParam,
        list,
        stateHandleChange,
        onChange,
        onShowSizeChange,
        drawerParam,
        seeProject,
        onClose,
        provinceId,
        setProject,
        onClear,
        sortChange,
        sortParam,
        projectModal,
        clickRow,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-project';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;
    }
  }

  .@{prefix-cls} {
    &-action-menu-item {
      text-align: center;
    }

    &-add {
      margin-top: 20px;
      margin-right: 10px;
      margin-bottom: 20px;
    }
  }

  .full-modal {
    .ant-modal {
      max-width: 100%;
      top: 0;
      padding-bottom: 0;
      margin: 0;
    }

    .ant-modal-content {
      display: flex;
      flex-direction: column;
      height: calc(100vh);
    }

    .ant-modal-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
</style>
