// 户型信息管理页面
<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <Button v-auth="layoutConst._PERMS.ADD" @click="addLayout" :class="`${prefixCls}-sel`">{{
      t('host.action.add')
    }}</Button>
    <!-- 状态筛选 -->
    <Select
      ref="select"
      :allowClear="true"
      v-model:value="condition.state"
      style="width: 120px"
      @change="stateHandleChange"
      :options="layoutConst.STATES"
      :pagination="false"
    />
    <Table
      :columns="ColumnsLayout"
      :data-source="list"
      rowKey="id"
      :pagination="pagination"
      @change="handleTableChange"
      :scroll="{ y: 'calc(70vh)' }"
    >
      <template #hResourceByResourceId="{ text: hResourceByResourceId }">
        <Image
          v-if="hResourceByResourceId.sort !== '6' && hResourceByResourceId.sort !== '7'"
          :src="hResourceByResourceId.address"
          width="100px"
        />
        <div v-else>{{ hResourceByResourceId.address }}</div>
      </template>
      <template #face="{ text: face }">
        <span>
          <Tag :color="layoutConst.FACES[face - 1].color">
            {{ layoutConst.FACES[face - 1].label }}
          </Tag>
        </span>
      </template>
      <template #saleState="{ text: saleState }">
        <span>
          <Tag :color="layoutConst.SALE_STATES[saleState - 1].color">
            {{ layoutConst.SALE_STATES[saleState - 1].label }}
          </Tag>
        </span>
      </template>
      <template #state="{ text: state }">
        <span>
          <Tag :color="layoutConst.STATES[state].color">
            {{ layoutConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: line }">
        <Button
          :class="prefixCls"
          v-auth="layoutConst._PERMS.DELETE"
          type="link"
          size="small"
          @click="deleteOneLayout(line)"
        >
          {{ t('host.action.delete') }}
        </Button>
        <Button
          :class="prefixCls"
          v-auth="layoutConst._PERMS.UPDATE"
          type="link"
          size="small"
          @click="reEnableOneLayout(line)"
        >
          {{ t('host.action.reEnable') }}
        </Button>
        <Button
          :class="prefixCls"
          v-auth="layoutConst._PERMS.ADD"
          type="link"
          size="small"
          @click="updateLayout(line)"
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
      <LayoutForm v-if="drawerParam.state === '0'" :id="drawerParam.id" :projectId="props.id" />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasePageResult, PageParam } from '/@/api/model/baseModel';
  import { Table, Tag, Button, Modal, Image, Select } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import {
    LayoutModel,
    _LayoutConst,
    _ColumnsLayout as ColumnsLayout,
  } from '/@/api/host/layout/model/layoutModel';
  import { deleteLayout, getLayoutList, reEnableLayout } from '/@/api/host/layout/layout';
  import LayoutForm from './LayoutForm.vue';
  import { processListByLine, success, failed } from '/@/hooks/web/useList';

  export default defineComponent({
    name: 'LayoutTable',
    components: {
      Table,
      Tag,
      Button,
      Modal,
      Loading,
      LayoutForm,
      Image,
      Select,
    },
    props: {
      id: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');
      const layoutConst = ref(_LayoutConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

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
      // 筛选条件
      const condition = reactive({
        state: '1',
        projectId: props.id || '',
        id: '',
      });

      //状态修改
      const stateHandleChange = async (value) => {
        condition.state = value;
        pageParam.pageNum = 1;
        const result = await getList();
        processListByLine(result, list, total);
      };

      // 列表结果
      const layout: LayoutModel[] = [];
      let list = reactive(layout);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<LayoutModel> | undefined;
        try {
          result = await getLayoutList(condition);
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

      //初始加载
      onMounted(async () => {
        const result = await getList();
        processListByLine(result, list, total);
      });

      //删除
      const deleteOneLayout = async (line) => {
        try {
          loading.value = true;
          await deleteLayout(line.id);
          success(t('host.action.delete'), t('host.action.success'));
          const result = await getList();
          processListByLine(result, list, total);
        } catch (error: any) {
          failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };
      //恢复
      const reEnableOneLayout = async (line) => {
        try {
          loading.value = true;
          await reEnableLayout(line.id);
          success(t('host.action.reEnable'), t('host.action.success'));
          const result = await getList();
          processListByLine(result, list, total);
        } catch (error: any) {
          failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };

      // 抽屉参数
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
      });
      //关闭抽屉
      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        const result = await getList();
        processListByLine(result, list, total);
      };
      //添加
      const addLayout = async (line) => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = line.id;
        drawerParam.title = t('host.action.add');
      };
      //更新
      const updateLayout = async (line) => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = line.id;
        drawerParam.title = t('host.action.update');
      };

      return {
        t,
        prefixCls,
        layoutConst,
        condition,
        ColumnsLayout,
        loading,
        tip,
        pagination,
        handleTableChange,
        list,
        drawerParam,
        deleteOneLayout,
        reEnableOneLayout,
        stateHandleChange,
        updateLayout,
        onClose,
        addLayout,
        props,
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
    &-sel {
      margin-right: 10px;
      margin-bottom: 20px;
    }
  }
</style>
