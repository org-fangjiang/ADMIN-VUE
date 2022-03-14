// 楼栋信息管理页面
<template>
  <div :class="prefixCls" class="relative w-full h-full px-4 min-h-[500px]">
    <Button v-auth="buildConst._PERMS.ADD" @click="addBuild" :class="`${prefixCls}-sel`">{{
      t('host.action.add')
    }}</Button>
    <div v-if="list && list.length > 0" class="grid grid-cols-2 gap-8">
      <fieldset
        v-for="item in list"
        :key="item.id"
        @click="clickUnit(item.id, item.number)"
        style="border: 1px solid"
      >
        <legend style="width: auto; margin-left: 10%; padding-left: 20px; padding-right: 20px"
          >{{ item.number }}号楼</legend
        >
        <div class="grid grid-cols-3 p-8">
          <div>层高：</div>
          <div class="col-span-2">{{ item.floors }}</div>
          <div>平均价格：</div>
          <div class="col-span-2">{{ item.price }}</div>
          <div>价格描述：</div>
          <div class="col-span-2">{{ item.priceDescription }}</div>
          <div>描述：</div>
          <div class="col-span-2">{{ item.description }}</div>
          <div>销售状态：</div>
          <div v-if="item.saleState === '1'" class="col-span-2">在售</div>
          <div v-if="item.saleState === '2'" class="col-span-2">待售</div>
          <div v-if="item.saleState === '3'" class="col-span-2">售罄</div>
          <div>预售证：</div>
          <div class="col-span-2"><img src="item.licenseId" alt="" /></div>
          <div>开盘时间：</div>
          <div class="col-span-2">{{ item.openTime }}</div>
          <div>交付时间：</div>
          <div class="col-span-2">{{ item.payTime }}</div>
        </div>
      </fieldset>
    </div>
    <Modal
      :bodyStyle="{ overflow: 'auto', margin: '16px' }"
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width="60%"
      :footer="null"
      :destroyOnClose="true"
      centered
    >
      <UnitForm
        v-if="drawerParam.state === '1'"
        :buildId="drawerParam.id"
        :buildName="drawerParam.buildName"
        :projectId="props.id"
        @hiddenModal="hiddenModal"
        @haveModal="haveModal"
      />
      <BuildForm v-if="drawerParam.state === '0'" :id="drawerParam.id" :projectId="props.id" />
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
  import { Button, Modal } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import {
    BuildModel,
    _BuildConst,
    _ColumnsBuild as ColumnsBuild,
  } from '/@/api/host/build/model/buildModel';
  import { getBuilds } from '/@/api/host/build/build';
  import BuildForm from './BuildForm.vue';
  import { processListByLine } from '/@/hooks/web/useList';
  import UnitForm from './UnitForm.vue';

  export default defineComponent({
    name: 'ManageHouse',
    components: {
      Button,
      Modal,
      Loading,
      BuildForm,
      UnitForm,
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

      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //参数权限
      const buildConst = ref(_BuildConst);

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

      // 抽屉参数
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
        selected: [''],
        buildName: '',
      });

      const hiddenModal = () => {
        // drawerParam.visible = false;
      };

      const haveModal = () => {
        // drawerParam.visible = true;
      };

      //关闭抽屉
      const onClose = async () => {
        drawerParam.buildName = '';
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        drawerParam.selected = [''];
        const result = await getList();
        processListByLine(result, list, total);
      };

      // 筛选条件
      const condition = reactive({
        state: '1',
        projectId: props.id || '',
        id: '',
      });
      // 列表结果
      const build: BuildModel[] = [];
      let list = reactive(build);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<BuildModel> | undefined;
        try {
          result = await getBuilds(condition, pageParam);
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

      //初始加载
      onMounted(async () => {
        const result = await getList();
        processListByLine(result, list, total);
      });

      //添加，打开modal
      const addBuild = async () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('host.action.add');
      };

      // dan'yuan
      const clickUnit = (buildId, buildName) => {
        drawerParam.visible = true;
        drawerParam.state = '1';
        drawerParam.id = buildId;
        drawerParam.title = t('host.action.manageUnit');
        drawerParam.buildName = buildName;
      };

      return {
        t,
        prefixCls,
        buildConst,
        condition,
        ColumnsBuild,
        loading,
        tip,
        pagination,
        handleTableChange,
        list,
        drawerParam,
        onClose,
        addBuild,
        props,
        clickUnit,
        hiddenModal,
        haveModal,
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

  .full-modal {
    // height: calc(100vh);

    .ant-modal-content {
      display: flex;
      flex-direction: column;
      padding-bottom: 16px;
    }

    .ant-modal-body {
      flex: 1;
    }
  }
</style>
