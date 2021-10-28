// 动态文章信息管理页面
<template>
  <div :class="prefixCls" class="relative w-full h-full px-4 pt-2">
    <Button v-auth="dynamicNewsConst._PERMS.ADD" @click="addDynamicNew">{{
      t('host.action.add')
    }}</Button>
    <Table
      :columns="ColumnsDynamicNews"
      :data-source="list"
      rowKey="id"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template #sort="{ text: sort }">
        <span>
          <Tag :color="dynamicNewsConst.dynamicSort[sort - 1].color">
            {{ dynamicNewsConst.dynamicSort[sort - 1].label }}
          </Tag>
        </span>
      </template>
      <template #state="{ text: state }">
        <span>
          <Tag :color="dynamicNewsConst.STATES[state].color">
            {{ dynamicNewsConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: line }">
        <Button
          :class="prefixCls"
          v-auth="dynamicNewsConst._PERMS.DELETE"
          type="link"
          size="small"
          @click="deleteOneDynamicNew(line)"
        >
          {{ t('host.action.delete') }}
        </Button>
        <Button
          :class="prefixCls"
          v-auth="dynamicNewsConst._PERMS.UPDATE"
          type="link"
          size="small"
          @click="reEnableOneDynamicNew(line)"
        >
          {{ t('host.action.reEnable') }}
        </Button>
        <Button
          :class="prefixCls"
          v-auth="dynamicNewsConst._PERMS.UPDATE"
          type="link"
          size="small"
          @click="updateDynamicNew(line)"
        >
          {{ t('host.action.update') }}
        </Button>
      </template>
    </Table>
    <Modal
      :bodyStyle="{ overflow: 'auto', 'margin-top': '16px' }"
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width=""
      :footer="null"
      :destroyOnClose="true"
    >
      <DynamicNewsForm
        v-if="drawerParam.state === '0'"
        :id="drawerParam.id"
        :projectId="props.id"
        :provinceId="props.provinceId"
        :cityId="props.cityId"
        :areaId="props.areaId"
      />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasePageResult, PageParam, PageSizeList } from '/@/api/model/baseModel';
  import { Table, Tag, Button, Modal } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import {
    _DynamicNewsConst,
    _ColumnsDynamicNews as ColumnsDynamicNews,
    DynamicNewsModel,
  } from '/@/api/host/dynamicNews/model/dynamicNewsModel';
  import {
    deleteDynamicNew,
    getDynamicNews,
    reEnableDynamicNew,
  } from '/@/api/host/dynamicNews/dynamicNews';
  import DynamicNewsForm from './DynamicNewsForm.vue';

  export default defineComponent({
    name: 'DynamicNewsTable',
    components: {
      Table,
      Tag,
      Button,
      Modal,
      Loading,
      DynamicNewsForm,
    },
    props: {
      id: {
        type: String,
        require: true,
      },
      provinceId: {
        type: String,
        require: true,
      },
      cityId: {
        type: String,
        require: true,
      },
      areaId: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');
      const dynamicNewsConst = ref(_DynamicNewsConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      const dynamicNews: DynamicNewsModel[] = [];

      // 添加分页
      const pageParam: PageParam = reactive({
        pageNum: 0,
        pageSize: 10,
      });
      const total = ref<number>(0);
      const pagination = computed(() => ({
        total: total.value,
        current: pageParam.pageNum,
        pageSize: pageParam.pageSize,
      }));
      const handleTableChange = async (pag: any) => {
        pageParam.pageSize = pag!.pageSize!;
        pageParam.pageNum = pag?.current;
        const result = await getList();
        processList(result);
      };

      // 筛选条件
      const condition = reactive({
        state: '',
        projectId: props.id || '',
        id: '',
        sort: '',
      });
      // 列表结果
      let list = reactive(dynamicNews);
      // 抽屉参数
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
      });
      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        const result = await getList();
        processList(result);
      };

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<DynamicNewsModel> | undefined;
        try {
          result = await getDynamicNews(condition, pageParam);
        } catch (error: any) {
          createErrorModal({
            title: t('sys.api.errorTip'),
            content: error?.response?.data?.message || t('sys.api.networkExceptionMsg'),
            // getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
          });
        } finally {
          loading.value = false;
        }
        return result;
      };

      function processList(result: any) {
        if (!result) {
          return;
        }
        const { page, content } = result;
        list.splice(0);
        if (content) {
          content.forEach((line) => {
            list.push(line);
          });
        }
        total.value = page.totalElements;
      }

      onMounted(async () => {
        const result = await getList();
        processList(result);
      });

      const deleteOneDynamicNew = async (line) => {
        try {
          loading.value = true;
          await deleteDynamicNew(line.id);
          success(t('host.action.delete'), t('host.action.success'));
          const result = await getList();
          processList(result);
        } catch (error: any) {
          failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };
      const reEnableOneDynamicNew = async (line) => {
        try {
          loading.value = true;
          await reEnableDynamicNew(line.id);
          success(t('host.action.reEnable'), t('host.action.success'));
          const result = await getList();
          processList(result);
        } catch (error: any) {
          failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };

      const addDynamicNew = async () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('host.action.add');
      };

      const updateDynamicNew = async (line) => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = line.id;
        drawerParam.title = t('host.action.update');
      };

      const success = (message: any, description: any) => {
        notification.success({
          message: message,
          description: description,
          duration: 3,
        });
      };

      const failed = (title: any, content: any) => {
        createErrorModal({
          title: title || t('sys.api.errorTip'),
          content: content || t('sys.api.networkExceptionMsg'),
          // getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
      };

      return {
        t,
        prefixCls,
        dynamicNewsConst,
        condition,
        ColumnsDynamicNews,
        processList,
        loading,
        tip,
        pageSizeList,
        pagination,
        handleTableChange,
        list,
        drawerParam,
        deleteOneDynamicNew,
        reEnableOneDynamicNew,
        updateDynamicNew,
        onClose,
        addDynamicNew,
        props,
      };
    },
  });
</script>
