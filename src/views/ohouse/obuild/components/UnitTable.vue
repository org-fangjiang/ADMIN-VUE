// 楼栋信息管理页面
<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <!-- 状态筛选 -->
    <Select
      :class="`${prefixCls}-sel`"
      ref="select"
      :allowClear="true"
      v-model:value="condition.state"
      style="width: 120px"
      @change="stateHandleChange"
      :options="unitConst.STATE"
      :pagination="false"
    />
    <Button v-auth="unitConst._PERMS.ADD" @click="addBuild" :class="`${prefixCls}-sel`">{{
      t('host.action.add')
    }}</Button>
    <Table
      :columns="ColumnsUnit"
      :data-source="list"
      rowKey="id"
      :pagination="pagination"
      @change="handleTableChange"
      :scroll="{ y: 'calc(70vh)' }"
    >
      <template #state="{ text: state }">
        <span>
          <Tag :color="unitConst.STATE[state].color">
            {{ unitConst.STATE[state].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: line }">
        <Button
          v-if="deleteOrEnable(line.state)"
          :class="prefixCls"
          v-auth="unitConst._PERMS.DELETE"
          type="link"
          size="small"
          @click="deleteOneBuild(line)"
        >
          {{ t('host.action.delete') }}
        </Button>
        <Button
          v-if="!deleteOrEnable(line.state)"
          :class="prefixCls"
          v-auth="unitConst._PERMS.UPDATE"
          type="link"
          size="small"
          @click="reEnableOneBuild(line)"
        >
          {{ t('host.action.reEnable') }}
        </Button>
        <Button
          :class="prefixCls"
          v-auth="unitConst._PERMS.UPDATE"
          type="link"
          size="small"
          @click="updateBuild(line)"
        >
          {{ t('host.action.update') }}
        </Button>
        <Button :class="prefixCls" type="link" size="small" @click="manageHouse(line)">
          {{ t('host.action.manageHouse') }}
        </Button>
        <Button
          :class="prefixCls"
          v-if="line.state === '2' && hasPermission(unitConst._PERMS.CHANGE)"
          type="link"
          size="small"
          @click="clickPass(line)"
        >
          审核通过
        </Button>
        <Button
          :class="prefixCls"
          v-if="line.state === '2' && hasPermission(unitConst._PERMS.CHANGE)"
          type="link"
          size="small"
          @click="clickFail(line)"
        >
          审核不通过
        </Button>
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
      <UnitForm
        v-if="drawerParam.state === '0'"
        :buildId="props.id"
        :projectId="props.projectId"
        :id="drawerParam.id"
      />
      <HouseTable
        v-if="drawerParam.state === '1'"
        :buildId="props.id"
        :projectId="props.projectId"
        :unitId="drawerParam.id"
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
  import { BasePageResult, PageParam } from '/@/api/model/baseModel';
  import { Table, Tag, Button, Modal, Select } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { processListByLine, success, failed } from '/@/hooks/web/useList';
  import { deleteOrEnable } from '/@/hooks/web/useButton';
  import {
    UnitConst,
    UnitModel,
    UnitColumns as ColumnsUnit,
  } from '/@/api/ohouse/oUnit/model/unitModel';
  import { changeState, deleteUnit, getUnitList, reEnableUnit } from '/@/api/ohouse/oUnit/unit';
  import UnitForm from './UnitForm.vue';
  import HouseTable from './HouseTable.vue';
  import { usePermission } from '/@/hooks/web/usePermission';

  export default defineComponent({
    name: 'OBuildTable',
    components: {
      Table,
      Tag,
      Button,
      Modal,
      Loading,
      Select,
      UnitForm,
      HouseTable,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
      projectId: {
        type: String,
        required: true,
      },
      provinceId: {
        type: String,
        required: true,
      },
      cityId: {
        type: String,
        required: true,
      },
      areaId: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');

      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //参数权限
      const unitConst = ref(UnitConst);
      // 权限
      const { hasPermission } = usePermission();

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
      });

      //根据状态筛选
      const stateHandleChange = async (value) => {
        condition.state = value;
        pageParam.pageNum = 1;
        const result = await getList();
        processListByLine(result, list, total);
      };

      //关闭抽屉
      const onClose = async () => {
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
        number: '',
        floors: '',
      });
      // 列表结果
      const build: UnitModel[] = [];
      let list = reactive(build);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<UnitModel> | undefined;
        try {
          result = await getUnitList(condition, pageParam);
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
      const deleteOneBuild = async (line) => {
        try {
          loading.value = true;
          await deleteUnit(line.id);
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
      const reEnableOneBuild = async (line) => {
        try {
          loading.value = true;
          await reEnableUnit(line.id);
          success(t('host.action.reEnable'), t('host.action.success'));
          const result = await getList();
          processListByLine(result, list, total);
        } catch (error: any) {
          failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };

      // 审核不通过
      const clickFail = async (line) => {
        try {
          loading.value = true;
          await changeState(line.id, '3');
          success('审核不通过', t('host.action.success'));
          const result = await getList();
          processListByLine(result, list, total);
        } catch (error: any) {
          failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };
      // 审核通过
      const clickPass = async (line) => {
        try {
          loading.value = true;
          await changeState(line.id, '1');
          success('审核通过', t('host.action.success'));
          const result = await getList();
          processListByLine(result, list, total);
        } catch (error: any) {
          failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };

      //添加，打开modal
      const addBuild = async () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('host.action.add');
      };
      //更新
      const updateBuild = async (line) => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = line.id;
        drawerParam.title = t('host.action.update');
      };
      // 设置房号
      const manageHouse = (line) => {
        drawerParam.visible = true;
        drawerParam.state = '1';
        drawerParam.id = line.id;
        drawerParam.title = t('host.action.manageHouse');
      };

      return {
        t,
        prefixCls,
        unitConst,
        condition,
        ColumnsUnit,
        loading,
        tip,
        pagination,
        handleTableChange,
        list,
        drawerParam,
        deleteOneBuild,
        reEnableOneBuild,
        updateBuild,
        onClose,
        addBuild,
        props,
        stateHandleChange,
        deleteOrEnable,
        manageHouse,
        hasPermission,
        clickPass,
        clickFail,
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
    height: calc(100vh);

    .ant-modal-content {
      display: flex;
      flex-direction: column;
    }

    .ant-modal-body {
      flex: 1;
    }
  }
</style>
