<template>
  <div>
    <Button v-auth="houseConst._PERMS.ADD" @click="addHouse" :class="`${prefixCls}-sel`">{{
      t('host.action.add')
    }}</Button>
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
      <template #type="{ text: type }">
        <span>
          <Tag :color="houseConst.TYPES[type - 1].color">
            {{ houseConst.TYPES[type - 1].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: line }">
        <Button
          v-if="deleteOrEnable(line.state)"
          :class="prefixCls"
          v-auth="houseConst._PERMS.DELETE"
          type="link"
          size="small"
          @click="deleteOneHouse(line)"
        >
          {{ t('host.action.delete') }}
        </Button>
        <Button
          v-if="!deleteOrEnable(line.state)"
          :class="prefixCls"
          v-auth="houseConst._PERMS.UPDATE"
          type="link"
          size="small"
          @click="reEnableOneHouse(line)"
        >
          {{ t('host.action.reEnable') }}
        </Button>
        <Button
          :class="prefixCls"
          v-auth="houseConst._PERMS.UPDATE"
          type="link"
          size="small"
          @click="updateHouse(line)"
        >
          {{ t('host.action.update') }}
        </Button>
        <Button
          :class="prefixCls"
          v-if="line.state === '2' && hasPermission(houseConst._PERMS.CHANGE_STATE)"
          type="link"
          size="small"
          @click="clickPass(line)"
        >
          审核通过
        </Button>
        <Button
          :class="prefixCls"
          v-if="line.state === '2' && hasPermission(houseConst._PERMS.CHANGE_STATE)"
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
      <HouseForm
        v-if="drawerParam.state === '0'"
        :id="drawerParam.id"
        :projectId="props.projectId"
        :buildId="props.buildId"
        :unitId="props.unitId"
        :provinceId="props.provinceId"
        :cityId="props.cityId"
        :areaId="props.areaId"
      />
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
  import {
    changeState,
    deleteOHouse,
    getOHouseList,
    reEnableOHouse,
  } from '/@/api/ohouse/house/house';
  import HouseForm from './HouseForm.vue';
  import { deleteOrEnable } from '/@/hooks/web/useButton';
  import { usePermission } from '/@/hooks/web/usePermission';

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
    props: {
      projectId: {
        type: String,
        required: true,
      },
      buildId: {
        type: String,
        required: true,
      },
      unitId: {
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

      // 权限
      const { hasPermission } = usePermission();

      const houseConst = ref(HouseConst);
      const condition = reactive({
        identifier: '',
        title: '',
        number: '',
        floor: '',
        floorType: '',
        lowPrice: '',
        heightPrice: '',
        lowTotalPrice: '',
        heightTotalPrice: '',
        lowArea: '',
        heightArea: '',
        lowBuildArea: '',
        heightBuildArea: '',
        rooms: undefined,
        hall: undefined,
        toilet: undefined,
        orientation: '',
        renovation: '',
        type: '',
        isOnly: '',
        fullYears: '',
        projectId: props.projectId,
        buildId: props.buildId,
        unitId: props.unitId,
        provinceId: '',
        cityId: '',
        areaId: '',
      });

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
        selected: [''],
      });

      //删除
      const deleteOneHouse = async (line) => {
        try {
          loading.value = true;
          await deleteOHouse(line.id);
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
      const reEnableOneHouse = async (line) => {
        try {
          loading.value = true;
          await reEnableOHouse(line.id);
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
          await changeState('3', line.id, line.title, line.keyword, line.description);
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
          await changeState('1', line.id, line.title, line.keyword, line.description);
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
      const addHouse = async () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('host.action.add');
      };
      //更新
      const updateHouse = async (line) => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = line.id;
        drawerParam.title = t('host.action.update');
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
        deleteOneHouse,
        reEnableOneHouse,
        addHouse,
        updateHouse,
        list,
        props,
        deleteOrEnable,
        hasPermission,
        clickPass,
        clickFail,
      };
    },
  });
</script>
