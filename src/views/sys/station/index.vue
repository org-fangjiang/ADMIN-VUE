// 站点信息管理页面
<template>
  <div :class="prefixCls" class="relative w-full h-full px-4 pt-2">
    <FCascader @change="locationChange" class="mr-2" :class="`${prefixCls}-select`" />
    <Select
      :class="`${prefixCls}-select`"
      ref="selectRef"
      label-in-value
      placeholder="Select LineId"
      style="width: 250px"
      :filter-option="false"
      :not-found-content="null"
      :options="options"
      :showSearch="true"
      :labelInValue="false"
      @change="lineChange"
      :allowClear="true"
    />
    <Button
      v-auth="stationConst._PERMS.ADD"
      @click="addMetroStation"
      :class="`${prefixCls}-select`"
    >
      {{ t('component.action.add') }}</Button
    >
    <FMetro :cityId="cityId" @change="changeStation" :class="`${prefixCls}-select`" />
    <Table :columns="ColumnsMetroStation" :data-source="list" rowKey="id" :pagination="false">
      <template #state="{ text: state }">
        <span>
          <Tag :color="stationConst.STATES[state].color">
            {{ stationConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: line }">
        <!-- 操作下拉框 -->
        <Dropdown placement="bottomCenter" trigger="click">
          <Button type="link">{{ t('component.action.index') }}</Button>
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem :key="0" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  :class="prefixCls"
                  v-auth="stationConst._PERMS.DELETE"
                  type="link"
                  size="small"
                  >{{ t('component.action.delete') }}
                </Button>
              </MenuItem>
              <MenuItem :key="1" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="stationConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('component.action.reEnable') }}
                </Button>
              </MenuItem>
              <MenuItem :key="2" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="stationConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('component.action.update') }}
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
    <Drawer
      :title="drawerParam.title"
      :width="'100%'"
      :destroyOnClose="true"
      :get-container="false"
      :visible="drawerParam.visible"
      :wrapClassName="`${prefixCls}-drawer`"
      :maskStyle="{ background: 'rgba(0, 0, 0, 0)' }"
      :wrap-style="{ position: 'absolute' }"
      @close="onClose"
    >
      <StationForm v-if="drawerParam.state === '0'" :id="drawerParam.id" />
    </Drawer>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import {
    MetroStationModel,
    _MetroStationConst,
    _ColumnsMetroStation as ColumnsMetroStation,
  } from '/@/api/sys/metro/model/metroModel';
  import {
    deleteStation,
    getAllStations,
    getLines,
    getStation,
    getStationsByLine,
    reEnableStation,
  } from '/@/api/sys/metro/metro';
  import FMetro from '/@/components/FMetro';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BaseListResult, BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  // 用户store
  import { useUserStore } from '/@/store/modules/user';
  import {
    Table,
    Pagination,
    Tag,
    Button,
    Drawer,
    Dropdown,
    Menu,
    MenuItem,
    Select,
  } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import FCascader from '/@/components/FCascader';
  import StationForm from './components/StationForm.vue';

  interface Option {
    value: string;
    label: string;
  }
  export default defineComponent({
    name: 'StationTable',
    components: {
      Table,
      Pagination,
      Tag,
      Button,
      Drawer,
      Dropdown,
      Menu,
      MenuItem,
      Loading,
      FCascader,
      StationForm,
      Select,
      FMetro,
    },
    setup() {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      // 获取用户store
      const userStore = useUserStore();
      const { prefixCls } = useDesign('station');
      const stationConst = ref(_MetroStationConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      const metroStation: MetroStationModel[] = [];

      // 分页
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });
      const options = ref<Option[]>([]);
      const cityId = userStore.getUserInfo.companyCityId;
      // 筛选条件
      const condition = reactive({
        cityId: userStore.getUserInfo.companyCityId,
        state: '',
        lineId: '',
        name: '',
        id: '',
      });
      // 列表结果
      let list = reactive(metroStation);
      // 抽屉参数
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
      });

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<MetroStationModel> | undefined;
        try {
          result = await getAllStations(condition, {
            pageSize: pageParam.size,
            pageNum: pageParam.number,
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

      function processList(result: any) {
        if (!result) {
          return;
        }
        const { page, content } = result;
        list.splice(0);
        content.forEach((line) => {
          list.push(line);
        });
        page.number = page.number + 1;
        Object.assign(pageParam, {}, page);
      }
      function processListByLine(result: any) {
        if (!result) {
          return;
        }
        const { content } = result;
        list.splice(0);
        content.forEach((line) => {
          list.push(line);
        });
        pageParam.number = 1;
        pageParam.totalPages = 1;
        pageParam.totalElements = content.length;
      }

      //省市区筛选
      const locationChange = async (e) => {
        condition.cityId = e.value[1] || userStore.getUserInfo.companyCityId;
        pageParam.number = 1;
        const result = await getList();
        processList(result);
      };
      //线路筛选
      const lineChange = async (value) => {
        condition.lineId = value;
        let result2: BasePageResult<MetroStationModel> | undefined;
        let lineResult: BaseListResult<MetroStationModel> | undefined;
        if (!condition.lineId) {
          pageParam.number = 1;
          result2 = await getList();
          processList(result2);
        } else {
          lineResult = await getStationsByLine({ lineId: value });
          processListByLine(lineResult);
        }
      };

      const changeStation = async (e) => {
        if (e.length === 0) {
          const result = await getList();
          processList(result);
          return;
        }
        condition.lineId = e[0] || '';
        condition.id = e[1] || '';
        if (e.length === 1) {
          const lineResult = await getStationsByLine({ lineId: condition.lineId });
          processListByLine(lineResult);
        } else {
          const result = await getStation(e[1]);
          pageParam.number = 1;
          pageParam.totalPages = 1;
          pageParam.totalElements = 1;
          list.splice(0);
          list.push(result.content);
        }
      };

      const onChange = async (page) => {
        pageParam.number = page;
        const result = await getList();
        processList(result);
      };
      const onShowSizeChange = async (current, size) => {
        console.log(current);
        pageParam.size = size;
        pageParam.number = 1;
        const result = await getList();
        processList(result);
      };

      onMounted(async () => {
        const result = await getList();
        processList(result);
        const { content } = await getLines({ cityId: condition.cityId });
        content.forEach((item) => {
          options.value.push({ value: item.id || '', label: item.name || '' });
        });
      });

      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        const result = await getList();
        processList(result);
      };

      // 添加地铁线路
      const addMetroStation = () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('component.action.add');
      };

      // 地铁线路操作
      const action = async (key) => {
        const code = key.key;
        const id = key?.item['data-id'] || undefined;
        switch (code) {
          case 0:
            // 删除
            try {
              loading.value = true;
              await deleteStation(id);
              success(t('model.metroStation.result.delete'), t('model.metroStation.result.delete'));
              const result = await getList();
              processList(result);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('model.metroStation.result.failed'));
            } finally {
              loading.value = false;
            }
            break;
          case 1:
            // 恢复
            try {
              loading.value = true;
              await reEnableStation(id);
              success(
                t('model.metroStation.result.reEnable'),
                t('model.metroStation.result.reEnable')
              );
              const result = await getList();
              processList(result);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('model.metroStation.result.failed'));
            } finally {
              loading.value = false;
            }
            break;
          case 2:
            // 更新
            drawerParam.visible = true;
            drawerParam.state = '0';
            drawerParam.id = id;
            drawerParam.title = t('component.action.update');
            break;
          case 3:
            // 添加站点
            break;
        }
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
          getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
      };

      return {
        t,
        prefixCls,
        stationConst,
        options,
        condition,
        ColumnsMetroStation,
        loading,
        tip,
        pageSizeList,
        list,
        drawerParam,
        pageParam,
        onChange,
        onShowSizeChange,
        locationChange,
        lineChange,
        onClose,
        addMetroStation,
        action,
        cityId,
        changeStation,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-station';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;
    }
  }

  .@{prefix-cls} {
    &-drawer {
      max-width: 500px;
    }

    &-action-menu-item {
      text-align: center;
    }

    &-select {
      margin-top: 20px;
      margin-right: 10px;
      margin-bottom: 20px;
    }
  }
</style>
