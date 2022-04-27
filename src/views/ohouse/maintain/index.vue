<template>
  <div>
    <Table
      :columns="houseColumns"
      :data-source="list"
      rowKey="id"
      :pagination="pagination"
      @change="handleTableChange"
      :scroll="{ y: 'calc(70vh)' }"
    >
      <template #state="{ text: state }">
        <span>
          <Tag :color="houseConst.STATE[state].color">
            {{ houseConst.STATE[state].label }}
          </Tag>
        </span>
      </template>
      <template #price="{ record }">
        <span @dblclick="clickPrice(record)">{{ record.price }}</span>
      </template>
      <template #userByCreate="{ text: userByCreate }">
        <span>
          {{ userByCreate.nickName }}
        </span>
      </template>
      <template #type="{ text: type }">
        <span>
          <Tag :color="houseConst.TYPES[type - 1].color">
            {{ houseConst.TYPES[type - 1].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: line }">
        <Button
          v-if="hasPermission('ohouse:check:state')"
          :class="prefixCls"
          type="link"
          size="small"
          @click="clickFail(line)"
          >不通过
        </Button>
        <Button
          v-if="hasPermission('ohouse:check:state')"
          :class="prefixCls"
          type="link"
          size="small"
          @click="clickSuccess(line)"
          >通过
        </Button>
        <Button :class="prefixCls" type="link" size="small" @click="clickSee(line)"> 查看 </Button>
      </template>
    </Table>
    <Modal
      :bodyStyle="{ overflow: 'auto', margin: '16px' }"
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width="70%"
      :footer="null"
      :destroyOnClose="true"
      wrapClassName="full-modal"
      centered
    >
      <HouseForm v-if="drawerParam.state === '0'" :id="drawerParam.id" :isSee="true" />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
  import { Table, Tag, Button, Modal } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDesign } from '/@/hooks/web/useDesign';
  import {
    HouseConst,
    HouseColumns as houseColumns,
    HouseModel,
  } from '/@/api/ohouse/house/model/houseModel';
  import { BasePageResult, PageParam } from '/@/api/model/baseModel';
  import { failed, processListByLine, success } from '/@/hooks/web/useList';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getOHouseList, maintainFail, maintainOk } from '/@/api/ohouse/house/house';
  import HouseForm from '../obuild/components/HouseForm.vue';
  import { deleteOrEnable } from '/@/hooks/web/useButton';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'HouseTable',
    components: {
      Table,
      Tag,
      Button,
      Modal,
      Loading,
      HouseForm,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');

      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      // 权限
      const { hasPermission } = usePermission();

      const userStore = useUserStore();
      const userId = userStore.getUserInfo.id;

      const houseConst = ref(HouseConst);
      const condition = reactive({ state: '5' });

      const house: HouseModel[] = [];
      let list = reactive(house);

      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<HouseModel> | undefined;
        try {
          result = await getOHouseList(condition, pageParam);
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

      const refreshList = async () => {
        pageParam.pageNum = 1;
        const result = await getList();
        processListByLine(result, list, total);
      };

      onMounted(async () => {
        const result = await getList();
        processListByLine(result, list, total);
      });

      // 抽屉参数
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
      });

      //不通过
      const clickFail = async (line) => {
        try {
          loading.value = true;
          await maintainFail(line.id);
          success('', t('host.action.success'));
          const result = await getList();
          processListByLine(result, list, total);
        } catch (error: any) {
          failed('', t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };

      //恢复
      const clickSuccess = async (line) => {
        try {
          loading.value = true;
          await maintainOk(line.id);
          success('', t('host.action.success'));
          const result = await getList();
          processListByLine(result, list, total);
        } catch (error: any) {
          failed('', t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };

      // 查看
      const clickSee = (line) => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = line.id;
        drawerParam.title = t('host.action.see');
      };

      //关闭抽屉
      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        const result = await getList();
        processListByLine(result, list, total);
      };
      // 添加分页
      const pageParam: PageParam = reactive({
        pageNum: 1,
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
        processListByLine(result, list, total);
      };

      return {
        onClose,
        drawerParam,
        houseConst,
        t,
        loading,
        tip,
        prefixCls,
        houseColumns,
        pageParam,
        pagination,
        handleTableChange,
        clickFail,
        clickSuccess,
        list,
        deleteOrEnable,
        hasPermission,
        condition,
        refreshList,
        userId,
        clickSee,
      };
    },
  });
</script>
<style>
  .classGroup {
    @apply w-[500px] flex-shrink-0;
  }
</style>
