<template>
  <div>
    <Button v-auth="houseConst._PERMS.ADD" @click="addHouse">{{ t('host.action.add') }}</Button>
    <!-- <Button @click="clickAllTransfer"> 全部转移 </Button> -->
    <div class="grid grid-cols-5 gap-y-2">
      <!-- 房号 -->
      <InputSearch
        v-model:value="condition.number"
        placeholder="房号"
        style="width: 200px"
        @search="refreshList"
      />
      <!-- title -->
      <InputSearch
        v-model:value="condition.title"
        placeholder="标题"
        style="width: 200px"
        @search="refreshList"
      />
      <!-- 层高 -->
      <InputSearch
        v-model:value="condition.floor"
        placeholder="层高"
        style="width: 200px"
        @search="refreshList"
      />
      <!-- floorType -->
      <Select
        ref="select"
        placeholder="层高类型"
        :allowClear="true"
        v-model:value="condition.floorType"
        style="width: 200px"
        @change="refreshList"
        :options="houseConst.FLOORS"
        :pagination="false"
      />
      <!-- identifier -->
      <InputSearch
        v-model:value="condition.identifier"
        placeholder="编号"
        style="width: 200px"
        @search="refreshList"
      />
      <InputSearch
        v-model:value="condition.rooms"
        placeholder="几室"
        style="width: 200px"
        @search="refreshList"
      />
      <InputSearch
        v-model:value="condition.hall"
        placeholder="几厅"
        style="width: 200px"
        @search="refreshList"
      />
      <InputSearch
        v-model:value="condition.toilet"
        placeholder="几卫"
        style="width: 200px"
        @search="refreshList"
      />
      <Select
        ref="select"
        placeholder="朝向"
        :allowClear="true"
        v-model:value="condition.orientation"
        style="width: 200px"
        @change="refreshList"
        :options="houseConst.ORIENTATION"
        :pagination="false"
      />
      <Select
        ref="select"
        placeholder="装修程度"
        :allowClear="true"
        v-model:value="condition.renovation"
        style="width: 200px"
        @change="refreshList"
        :options="houseConst.RENOVATION_"
        :pagination="false"
      />
      <Select
        ref="select"
        placeholder="类型"
        :allowClear="true"
        v-model:value="condition.type"
        style="width: 200px"
        @change="refreshList"
        :options="houseConst.TYPES"
        :pagination="false"
      />
      <Select
        ref="select"
        placeholder="是否唯一"
        :allowClear="true"
        v-model:value="condition.isOnly"
        style="width: 200px"
        @change="refreshList"
        :options="houseConst.ONLY"
        :pagination="false"
      />
      <Select
        ref="select"
        placeholder="年限"
        :allowClear="true"
        v-model:value="condition.fullYears"
        style="width: 200px"
        @change="refreshList"
        :options="houseConst.FULL_YEARS"
        :pagination="false"
      />
    </div>
    <div class="grid grid-cols-2 gap-y-2 my-2">
      <InputGroup compact class="classGroup">
        <Button>价格区间(万元)</Button>
        <InputSearch
          v-model:value="condition.lowPrice"
          style="width: 120px; text-align: center"
          placeholder="最低价"
          @search="refreshList"
        />
        <Input
          value=""
          style="width: 30px; border-left: 0; pointer-events: none; background-color: #fff"
          placeholder="~"
          disabled
        />
        <InputSearch
          v-model:value="condition.heightPrice"
          style="width: 120px; text-align: center; border-left: 0"
          placeholder="最高价"
          @search="refreshList"
        />
      </InputGroup>
      <InputGroup compact class="classGroup">
        <Button>总价区间(万元)</Button>
        <InputSearch
          v-model:value="condition.lowTotalPrice"
          style="width: 120px; text-align: center"
          placeholder="最低价"
          @search="refreshList"
        />
        <Input
          value=""
          style="width: 30px; border-left: 0; pointer-events: none; background-color: #fff"
          placeholder="~"
          disabled
        />
        <InputSearch
          v-model:value="condition.heightTotalPrice"
          style="width: 120px; text-align: center; border-left: 0"
          placeholder="最高价"
          @search="refreshList"
        />
      </InputGroup>
      <InputGroup compact class="classGroup">
        <Button>屋内面积(平方米)</Button>
        <InputSearch
          v-model:value="condition.lowArea"
          style="width: 120px; text-align: center"
          placeholder="最小面积"
          @search="refreshList"
        />
        <Input
          value=""
          style="width: 30px; border-left: 0; pointer-events: none; background-color: #fff"
          placeholder="~"
          disabled
        />
        <InputSearch
          v-model:value="condition.heightArea"
          style="width: 120px; text-align: center; border-left: 0"
          placeholder="最大面积"
          @search="refreshList"
        />
      </InputGroup>
      <InputGroup compact class="classGroup">
        <Button>建筑面积(平方米)</Button>
        <InputSearch
          v-model:value="condition.lowBuildArea"
          style="width: 120px; text-align: center"
          placeholder="最小面积"
          @search="refreshList"
        />
        <Input
          value=""
          style="width: 30px; border-left: 0; pointer-events: none; background-color: #fff"
          placeholder="~"
          disabled
        />
        <InputSearch
          v-model:value="condition.heightBuildArea"
          style="width: 120px; text-align: center; border-left: 0"
          placeholder="最大面积"
          @search="refreshList"
        />
      </InputGroup>
    </div>
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
          {{ t('host.action.see') }}
        </Button>
        <Button
          :class="prefixCls"
          v-auth="houseConst._PERMS.DEAL"
          type="link"
          size="small"
          @click="dealHouse(line)"
        >
          {{ t('host.action.deal') }}
        </Button>
        <!-- <Button
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
        </Button> -->
        <!-- <Button :class="prefixCls" type="link" size="small" @click="clickTransfer(line)">
          转移
        </Button> -->
        <Button :class="prefixCls" type="link" size="small" @click="clickResource(line)">
          资源
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
        :isSee="isSee"
      />
      <SourceTable
        v-if="drawerParam.state === '3'"
        :id="drawerParam.id"
        :projectId="props.projectId"
        :provinceId="props.provinceId"
        :cityId="props.cityId"
        :areaId="props.areaId"
      />
    </Modal>
    <Modal
      :bodyStyle="{ overflow: 'auto', margin: '16px' }"
      :visible="drawerParam.smModal"
      :title="drawerParam.title"
      @cancel="onClose"
      :footer="null"
      :destroyOnClose="true"
      centered
    >
      <PriceForm v-if="drawerParam.state === '1'" :priceInfo="drawerParam.priceInfo" />
      <TransferForm v-if="drawerParam.state === '2'" :id="drawerParam.id" />
      <DealForm
        v-if="drawerParam.state === '4'"
        :houseId="drawerParam.id"
        :projectId="props.projectId"
      />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
  import {
    Table,
    Tag,
    Button,
    Modal,
    Select,
    InputSearch,
    InputGroup,
    Input,
  } from 'ant-design-vue';
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
  import PriceForm from './PriceForm.vue';
  import TransferForm from './TransferForm.vue';
  import SourceTable from './SourceTable.vue';
  import DealForm from './DealForm.vue';

  export default defineComponent({
    name: 'HouseTable',
    components: {
      Table,
      Tag,
      Button,
      Modal,
      Loading,
      HouseForm,
      Select,
      InputSearch,
      InputGroup,
      Input,
      PriceForm,
      TransferForm,
      SourceTable,
      DealForm,
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

      // 查看
      let isSee = ref(false);

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
        floorType: undefined,
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
        orientation: undefined,
        renovation: undefined,
        type: undefined,
        isOnly: undefined,
        fullYears: undefined,
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

      const refreshList = async () => {
        pageParam.pageNum = 1;
        const result = await getList();
        processListByLine(result, list, total);
      };

      onMounted(async () => {
        const result = await getList();
        processListByLine(result, list, total);
      });

      // // 全部转移
      // const clickAllTransfer = async () => {
      //   drawerParam.smModal = true;
      //   drawerParam.title = '全部转移';
      //   drawerParam.state = '2';
      // };
      // // 单个转移
      // const clickTransfer = async (line) => {
      //   drawerParam.smModal = true;
      //   drawerParam.title = '转移';
      //   drawerParam.state = '2';
      //   drawerParam.id = line.id;
      // };

      // 成交
      const dealHouse = (item) => {
        drawerParam.smModal = true;
        drawerParam.title = '成交';
        drawerParam.state = '4';
        drawerParam.id = item.id;
      };

      // 抽屉参数
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
        selected: [''],
        priceInfo: { id: '', price: '' },
        smModal: false,
      });

      // 更新价格
      const clickPrice = async (line) => {
        drawerParam.title = '更新价格';
        drawerParam.state = '1';
        drawerParam.smModal = true;
        drawerParam.priceInfo.id = line.id;
        drawerParam.priceInfo.price = line.price;
      };
      // 资源
      const clickResource = async (line) => {
        drawerParam.visible = true;
        drawerParam.title = '资源列表';
        drawerParam.state = '3';
        drawerParam.id = line.id;
      };

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
        isSee.value = false;
        drawerParam.title = t('host.action.add');
      };
      //更新
      const updateHouse = async (line) => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = line.id;
        isSee.value = true;
        drawerParam.title = t('host.action.see');
      };

      //关闭抽屉
      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        drawerParam.selected = [''];
        drawerParam.smModal = false;
        drawerParam.priceInfo = { id: '', price: '' };
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
        condition,
        refreshList,
        clickPrice,
        dealHouse,
        clickResource,
        isSee,
      };
    },
  });
</script>
<style>
  .classGroup {
    @apply w-[500px] flex-shrink-0;
  }
</style>
