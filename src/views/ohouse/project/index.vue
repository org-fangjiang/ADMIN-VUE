<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <Button @click="addOld">添加</Button>
    <!-- 状态筛选 -->
    <Select
      :class="`${prefixCls}-add`"
      ref="select"
      :allowClear="true"
      v-model:value="condition.state"
      style="width: 120px"
      @change="stateHandleChange"
      :options="oHouseConst.STATE"
      :pagination="false"
      placeholder="状态"
    />
    <!-- 类型筛选 -->
    <Select
      :class="`${prefixCls}-add`"
      ref="select"
      :allowClear="true"
      v-model:value="condition.type"
      style="width: 120px"
      @change="typeHandleChange"
      :options="oHouseConst.TYPES"
      :pagination="false"
      placeholder="类型"
    />
    <!-- 建筑类型筛选 -->
    <Select
      :class="`${prefixCls}-add`"
      ref="select"
      :allowClear="true"
      v-model:value="condition.buildType"
      style="width: 120px"
      @change="buildTypeHandleChange"
      :options="oHouseConst.BUILD_TYPES"
      :pagination="false"
      placeholder="建筑类型"
    />
    <!-- 供水类型 -->
    <Select
      :class="`${prefixCls}-add`"
      ref="select"
      :allowClear="true"
      v-model:value="condition.waterMethod"
      style="width: 120px"
      @change="waterHandleChange"
      :options="oHouseConst.WATER_METHOD"
      :pagination="false"
      placeholder="供水类型"
    />
    <!-- electHandleChange -->
    <Select
      :class="`${prefixCls}-add`"
      ref="select"
      :allowClear="true"
      v-model:value="condition.electricityMethod"
      style="width: 120px"
      @change="electHandleChange"
      :options="oHouseConst.ELECTRICITY_METHOD"
      :pagination="false"
      placeholder="供电类型"
    />
    <!-- heatHandleChange -->
    <Select
      :class="`${prefixCls}-add`"
      ref="select"
      :allowClear="true"
      v-model:value="condition.heatMethod"
      style="width: 120px"
      @change="heatHandleChange"
      :options="oHouseConst.HEAT_METHOD"
      :pagination="false"
      placeholder="供暖类型"
    />
    <!-- people/driver -->
    <Select
      :class="`${prefixCls}-add`"
      ref="select"
      :allowClear="true"
      v-model:value="condition.divideCar"
      style="width: 120px"
      @change="divideHandleChange"
      :options="oHouseConst.DIVIDE"
      :pagination="false"
      placeholder="是否人车分流"
    />
    <!-- cng -->
    <Select
      :class="`${prefixCls}-add`"
      ref="select"
      :allowClear="true"
      v-model:value="condition.cng"
      style="width: 120px"
      @change="cngHandleChange"
      :options="oHouseConst.CNG"
      :pagination="false"
      placeholder="是否有天然气"
    />
    <!-- 省市区 -->
    <FCascader @change="liveInChange" class="mr-2" placeholder="省市区" />
    <!-- 交房时间 -->
    <DatePicker
      format="YYYY-MM-DD"
      :value="condition.payTime"
      @change="payTimechange"
      style="width: 120px"
    />
    <!-- 产权 -->
    <Input
      v-model:value="condition.property"
      placeholder="产权年限"
      suffix="年"
      @change="properyChange"
      class="inputClass"
    />
    <Select
      v-model:value="selectedDeveloper"
      show-search
      placeholder="开发商"
      style="width: 120px"
      :default-active-first-option="false"
      :show-arrow="false"
      :filter-option="false"
      :not-found-content="null"
      :options="developerData"
      @search="developerSearch"
      @change="developerChange"
    />
    <Select
      v-model:value="selectedBrand"
      show-search
      placeholder="品牌商"
      style="width: 120px"
      :default-active-first-option="false"
      :show-arrow="false"
      :filter-option="false"
      :not-found-content="null"
      :options="brandData"
      @search="brandSearch"
      @change="brandChange"
    />
    <!-- name -->
    <InputSearch
      v-model:value="condition.name"
      placeholder="项目名称"
      style="width: 200px"
      @search="onNameSearch"
    />
    <Table :columns="columns" :data-source="list" rowKey="id" :pagination="false">
      <template #state="{ text: state }">
        <span>
          <Tag :color="oHouseConst.STATE[state].color">
            {{ oHouseConst.STATE[state].label }}
          </Tag>
        </span>
      </template>
      <template #type="{ text: type }">
        <span>
          <Tag :color="oHouseConst.TYPES[type - 1].color">
            {{ oHouseConst.TYPES[type - 1].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: link }">
        <Button
          v-auth="oHouseConst._PERMS.UPDATE"
          type="link"
          size="small"
          :class="prefixCls"
          @click="clickUpdate(link)"
        >
          {{ t('host.action.update') }}
        </Button>
        <Dropdown placement="bottomCenter" trigger="click">
          <Button type="link">{{ t('host.operation') }}</Button>
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem
                v-if="link.state != '0' && hasPermission(oHouseConst._PERMS.DELETE)"
                :key="0"
                :data-id="link.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button :class="prefixCls" type="link" size="small"
                  >{{ t('host.action.delete') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="link.state === '0' && hasPermission(oHouseConst._PERMS.DELETE)"
                :key="1"
                :data-id="link.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button :class="prefixCls" type="link" size="small"
                  >{{ t('host.action.reEnable') }}
                </Button>
              </MenuItem>
              <MenuItem :key="2" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button :class="prefixCls" type="link" size="small"
                  >{{ t('host.action.setResource') }}
                </Button>
              </MenuItem>
              <MenuItem :key="3" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button :class="prefixCls" type="link" size="small"
                  >{{ t('host.action.setBuild') }}
                </Button>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
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
      width="80%"
      :bodyStyle="{ overflowY: 'auto', margin: '16px', height: '700px' }"
      :destroyOnClose="true"
      :footer="null"
    >
      <ProjectForm v-if="drawerParam.state === '0'" :id="drawerParam.id" />
      <ResourceTable
        v-if="drawerParam.state === '1'"
        :id="drawerParam.id"
        :provinceId="drawerParam.provinceId"
        :cityId="drawerParam.cityId"
        :areaId="drawerParam.areaId"
      />
      <OBuildTable
        v-if="drawerParam.state === '2'"
        :id="drawerParam.id"
        :provinceId="drawerParam.provinceId"
        :cityId="drawerParam.cityId"
        :areaId="drawerParam.areaId"
      />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    oHouseColumns,
    OProjectConst,
    OProjectModel,
  } from '/@/api/ohouse/project/model/projectModel';
  import {
    deleteOHouse,
    getOHouse,
    projectList,
    reEnableOHouse,
  } from '/@/api/ohouse/project/project';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { failed, processList, success } from '/@/hooks/web/useList';
  import { Loading } from '/@/components/Loading';
  import {
    Pagination,
    Table,
    Tag,
    Button,
    Select,
    DatePicker,
    Input,
    InputSearch,
    Modal,
    Dropdown,
    Menu,
    MenuItem,
  } from 'ant-design-vue';
  import FCascader from '/@/components/FCascader';
  import { debounce } from 'lodash';
  import { getDevelopers } from '/@/api/host/developer/developer';
  import { getBrands } from '/@/api/host/brand/brand';
  import ProjectForm from './components/ProjectForm.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import ResourceTable from './components/ResourceTable.vue';
  import OBuildTable from '../obuild/index.vue';
  interface Option {
    value: String;
    label: String;
  }
  export default defineComponent({
    name: 'OProject',
    components: {
      InputSearch,
      Loading,
      Pagination,
      Table,
      Tag,
      Button,
      Select,
      FCascader,
      DatePicker,
      Input,
      ProjectForm,
      Modal,
      Dropdown,
      Menu,
      MenuItem,
      ResourceTable,
      OBuildTable,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);

      const { hasPermission } = usePermission();

      const columns = reactive(oHouseColumns);
      const oHouseConst = reactive(OProjectConst);
      const condition = reactive({
        id: '',
        name: '',
        labels: '',
        type: undefined,
        buildType: undefined,
        property: '',
        developerId: undefined,
        brandId: undefined,
        provinceId: '',
        cityId: '',
        areaId: '',
        payTime: '',
        waterMethod: undefined,
        electricityMethod: undefined,
        heatMethod: undefined,
        state: undefined,
        cng: undefined,
        divideCar: undefined,
      });

      // 状态筛选
      const stateHandleChange = async (value) => {
        condition.state = value;
        const result = await getList();
        processList(result, list, pageParam);
      };
      // 类型
      const typeHandleChange = async (value) => {
        condition.type = value;
        const result = await getList();
        processList(result, list, pageParam);
      };
      // 建筑类型
      const buildTypeHandleChange = async (value) => {
        condition.buildType = value;
        const result = await getList();
        processList(result, list, pageParam);
      };
      // 供水
      const waterHandleChange = async (value) => {
        condition.waterMethod = value;
        const result = await getList();
        processList(result, list, pageParam);
      };
      // 供电
      const electHandleChange = async (value) => {
        condition.electricityMethod = value;
        const result = await getList();
        processList(result, list, pageParam);
      };
      // 供暖
      const heatHandleChange = async (value) => {
        condition.heatMethod = value;
        const result = await getList();
        processList(result, list, pageParam);
      };
      // cng
      const cngHandleChange = async (value) => {
        condition.cng = value;
        const result = await getList();
        processList(result, list, pageParam);
      };
      // divide
      const divideHandleChange = async (value) => {
        condition.divideCar = value;
        const result = await getList();
        processList(result, list, pageParam);
      };
      // 地址
      const liveInChange = async (e) => {
        condition.provinceId = e.value[0];
        condition.cityId = e.value[1];
        condition.areaId = e.value[2];
        const result = await getList();
        processList(result, list, pageParam);
      };
      // 交房时间
      const payTimechange = async (_date: string, dateString: string) => {
        condition.payTime = dateString;
        const result = await getList();
        processList(result, list, pageParam);
      };
      // 产权
      const properyChange = debounce(async () => {
        const result = await getList();
        processList(result, list, pageParam);
      }, 800);
      // 开发商
      let selectedDeveloper = ref();
      const developerData = ref<Option[]>([]);
      const developerSearch = debounce(async (value) => {
        const { content } = await getDevelopers({ name: value });
        if (content && content.length > 0) {
          developerData.value.splice(0);
          content.forEach((value) => {
            developerData.value?.push({ value: value.id || '', label: value.name || '' });
          });
        }
      }, 800);
      const developerChange = async (value) => {
        condition.developerId = value;
        const result = await getList();
        processList(result, list, pageParam);
      };
      // 品牌商
      let selectedBrand = ref();
      const brandData = ref<Option[]>([]);
      const brandSearch = debounce(async (value) => {
        const { content } = await getBrands({ name: value });
        if (content && content.length > 0) {
          brandData.value.splice(0);
          content.forEach((item) => {
            brandData.value?.push({ value: item.id || '', label: item.name || '' });
          });
        }
        console.log('brand:', brandData);
      }, 800);
      const brandChange = async (value) => {
        condition.brandId = value;
        const result = await getList();
        processList(result, list, pageParam);
      };
      // 项目名称
      const onNameSearch = async (value) => {
        condition.name = value;
        const result = await getList();
        processList(result, list, pageParam);
      };
      //根据创建时间排序，默认降序
      let sortParam = reactive({
        asc: [] as any[],
        desc: ['createTime'],
      });
      //分页参数
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });

      const projects: OProjectModel[] = [];
      const list = reactive(projects);
      // 获取列表信息
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<OProjectModel> | undefined;
        try {
          result = await projectList(
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

      onMounted(async () => {
        const result = await getList();
        processList(result, list, pageParam);
      });

      //抽屉
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
        provinceId: '',
        cityId: '',
        areaId: '',
      });
      // 添加
      const addOld = () => {
        drawerParam.visible = true;
        drawerParam.id = '';
        drawerParam.title = t('host.action.add');
        drawerParam.state = '0';
      };
      // 更新
      const clickUpdate = (line) => {
        drawerParam.visible = true;
        drawerParam.id = line.id;
        drawerParam.title = t('host.action.update');
        drawerParam.state = '0';
      };
      // 操作
      const action = async (key) => {
        const code = key.key;
        const id = key?.item['data-id'] || undefined;
        const { content } = await getOHouse(id);
        drawerParam.provinceId = content.provinceId || '';
        drawerParam.cityId = content.cityId || '';
        drawerParam.areaId = content.areaId || '';
        switch (code) {
          case 0:
            try {
              // 删除
              loading.value = true;
              await deleteOHouse(id);
              success('成功', '删除成功');
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error) {
              failed('失败', '删除失败');
            } finally {
              loading.value = false;
            }
            break;
          case 1:
            try {
              // 恢复
              loading.value = true;
              await reEnableOHouse(id);
              success('成功', '恢复成功');
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error) {
              failed('失败', '恢复失败');
            } finally {
              loading.value = false;
            }
            break;
          case 2:
            drawerParam.visible = true;
            drawerParam.title = t('host.action.setResource');
            drawerParam.state = '1';
            drawerParam.id = id;
            break;
          case 3:
            drawerParam.visible = true;
            drawerParam.title = t('host.action.setBuild');
            drawerParam.state = '2';
            drawerParam.id = id;
            break;
        }
      };
      // 关闭modal
      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.id = '';
        drawerParam.title = '';
        drawerParam.state = '';
        drawerParam.provinceId = '';
        drawerParam.cityId = '';
        drawerParam.areaId = '';
        const result = await getList();
        processList(result, list, pageParam);
      };

      // 页码改变
      const onChange = async (page) => {
        pageParam.number = page;
        const result = await getList();
        processList(result, list, pageParam);
      };
      // 条数改变
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
        oHouseConst,
        columns,
        sortParam,
        condition,
        list,
        pageParam,
        loading,
        tip,
        pageSizeList,
        onChange,
        onShowSizeChange,
        stateHandleChange,
        typeHandleChange,
        buildTypeHandleChange,
        electHandleChange,
        heatHandleChange,
        waterHandleChange,
        cngHandleChange,
        divideHandleChange,
        liveInChange,
        payTimechange,
        properyChange,
        developerData,
        brandData,
        developerChange,
        developerSearch,
        brandChange,
        brandSearch,
        selectedBrand,
        selectedDeveloper,
        onNameSearch,
        drawerParam,
        addOld,
        onClose,
        clickUpdate,
        action,
        hasPermission,
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

  .inputClass {
    @apply w-32;

    .ant-input-affix-wrapper {
      @apply w-32;
    }
  }
</style>
