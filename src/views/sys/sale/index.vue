<template>
  <div class="px-4">
    <Table :pagination="false" :columns="columns" :data-source="list" rowKey="id">
      <template #state="{ text: state }">
        <Tag :color="saleConst.STATES[state].color">
          {{ saleConst.STATES[state].label }}
        </Tag>
      </template>
      <template #operation="{ text: user }">
        <Button type="link" @click="clickSet(user)">设置信息</Button>
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
    >
      <SaleForm :id="drawerParam.id" v-if="drawerParam.state === '0'" />
    </Modal>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  import { Columns, SaleConst, SaleModel } from '/@/api/sys/sale/model/saleModel';
  import { getUsersBySale } from '/@/api/sys/user/user';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { useI18n } from 'vue-i18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { processList } from '/@/hooks/web/useList';
  import { Button, Table, Tag, Pagination, Modal } from 'ant-design-vue';
  import SaleForm from './components/SaleForm.vue';

  export default defineComponent({
    name: 'SaleTable',
    components: {
      Button,
      Table,
      Tag,
      Pagination,
      Modal,
      SaleForm,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const columns = reactive(Columns);
      const saleConst = ref(SaleConst);

      const userStore = useUserStore();
      const companyId = userStore.getUserInfo.companyId;

      const sales: SaleModel[] = [];
      const list = reactive(sales);

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
        let result: BasePageResult<SaleModel> | undefined;
        try {
          result = result = await getUsersBySale('', {
            pageSize: pageParam.size,
            pageNum: pageParam.number,
          });
        } catch (error: any) {
          createErrorModal({
            title: t('sys.api.errorTip'),
            content: error?.response?.data?.message || t('sys.api.networkExceptionMsg'),
          });
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
      });
      // 关闭弹窗
      const onClose = () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
      };
      const clickSet = (user) => {
        drawerParam.visible = true;
        drawerParam.title = '设置信息';
        drawerParam.id = user.id;
        drawerParam.state = '0';
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
        companyId,
        loading,
        tip,
        list,
        columns,
        saleConst,
        clickSet,
        pageParam,
        onChange,
        onShowSizeChange,
        pageSizeList,
        drawerParam,
        onClose,
      };
    },
  });
</script>
