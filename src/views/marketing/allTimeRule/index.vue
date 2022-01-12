<template>
  <div class="p-4">
    <Button class="my-4" type="default" @click="addRule">{{ t('host.action.add') }}</Button>
    <Table :columns="columns" :data-source="list" rowKey="companyId" :pagination="false">
      <template #clueDropLevel="{ text: clue }">
        <span>{{ clue.clueDropLevel }}分钟</span>
      </template>
      <template #clueUnFollow="{ text: clue }">
        <span>{{ clue.clueUnFollow }}分钟</span>
      </template>
      <template #clueUnclaimed="{ text: clue }">
        <span>{{ clue.clueUnclaimed }}分钟</span>
      </template>
      <template #companyId="{ text: comId }">
        <span>{{ comId.companyById?.name || comId.companyId }}</span>
      </template>
      <template #operation="{ text: link }">
        <Button type="link" @click="updateRule(link)">{{ t('host.action.update') }}</Button>
      </template>
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
      v-model:visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      :destroyOnClose="true"
      :footer="null"
      :bodyStyle="{ overflowY: 'auto', margin: '16px' }"
    >
      <RuleForm v-if="drawerParam.state === '0'" :id="drawerParam.id" />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import {
    TimeRuleModel,
    TimeRuleConst as timeRuleConst,
  } from '/@/api/marketing/timeRule/model/timeRuleModel';
  import { processList } from '/@/hooks/web/useList';
  import { useI18n } from 'vue-i18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { Loading } from '/@/components/Loading';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { getByPage } from '/@/api/marketing/timeRule/timeRule';
  import { TimeRuleColumns } from '/@/api/marketing/timeRule/model/timeRuleModel';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { Button, Table, Pagination, Modal } from 'ant-design-vue';
  import RuleForm from './components/RuleForm.vue';

  export default defineComponent({
    name: 'TimeRuleForm',
    components: {
      Loading,
      Button,
      Pagination,
      Table,
      Modal,
      RuleForm,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      const { prefixCls } = useDesign('timeRule');
      // 获取用户store
      const userStore = useUserStore();
      const companyId = userStore.getUserInfo.companyId;
      const columns = reactive(TimeRuleColumns);
      //分页参数
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });

      //初始加载
      onMounted(async () => {
        const result = await getList();
        processList(result, list, pageParam);
      });

      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<TimeRuleModel> | undefined;
        try {
          result = await getByPage({
            pageNum: pageParam.number,
            pageSize: pageParam.size,
          });
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

      // 抽屉参数
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
      });

      const addRule = () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.title = t('marketing.action.add');
        drawerParam.id = '';
      };

      const updateRule = (link) => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.title = t('marketing.action.update');
        drawerParam.id = link.companyId;
      };

      const onClose = () => {
        drawerParam.visible = false;
        drawerParam.title = '';
        drawerParam.id = '';
        drawerParam.state = '';
      };

      const timeRule: TimeRuleModel[] = [];
      // 列表结果
      let list = reactive(timeRule);

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
        loading,
        tip,
        pageSizeList,
        companyId,
        list,
        timeRuleConst,
        pageParam,
        columns,
        onChange,
        onShowSizeChange,
        drawerParam,
        addRule,
        updateRule,
        onClose,
      };
    },
  });
</script>
