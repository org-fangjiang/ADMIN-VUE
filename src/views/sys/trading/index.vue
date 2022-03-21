// 商圈信息管理页面

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <!-- 状态筛选 -->
    <Select
      :class="`${prefixCls}-select`"
      ref="select"
      :allowClear="true"
      v-model:value="condition.state"
      style="width: 120px"
      @change="stateHandleChange"
      :options="tradingConst.STATES"
      :pagination="false"
    />
    <FCascader @change="locationChange" class="mr-2" :class="`${prefixCls}-select`" />
    <Button v-auth="tradingConst._PERMS.ADD" @click="addMetroLine" :class="`${prefixCls}-select`">{{
      t('component.action.add')
    }}</Button>
    <FTrading
      @change="changeName"
      :cityId="cityId"
      :provinceId="province"
      :class="`${prefixCls}-select`"
    />
    <Table :columns="ColumnsTrading" :data-source="list" rowKey="id" :pagination="false">
      <template #state="{ text: state }">
        <span>
          <Tag :color="tradingConst.STATES[state].color">
            {{ tradingConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: line }">
        <!-- 操作下拉框 -->
        <Dropdown placement="bottomCenter" trigger="click">
          <Button type="link">{{ t('component.action.index') }}</Button>
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem
                v-if="hasPermission(tradingConst._PERMS.DELETE)"
                :key="0"
                :data-id="line.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  v-auth="tradingConst._PERMS.DELETE"
                  :class="prefixCls"
                  type="link"
                  size="small"
                  >{{ t('component.action.delete') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="hasPermission(tradingConst._PERMS.UPDATE)"
                :key="1"
                :data-id="line.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  v-auth="tradingConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('component.action.reEnable') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="hasPermission(tradingConst._PERMS.UPDATE)"
                :key="2"
                :data-id="line.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  v-auth="tradingConst._PERMS.UPDATE"
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
      <TradingForm
        v-if="drawerParam.state === '0'"
        :id="drawerParam.id"
        :provinceId="drawerParam.provinceId"
      />
    </Drawer>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import {
    _TradingConst,
    TradingModel,
    _ColumnsTrading as ColumnsTrading,
  } from '/@/api/sys/trading/model/tradingModel';
  import {
    deleteTradingArea,
    getTradingsByName,
    getTradings,
    reEnableTradingArea,
  } from '/@/api/sys/trading/trading';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
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
  import TradingForm from './components/TradingForm.vue';
  import FTrading from '/@/components/FTrading';
  import { getCityWithAllArea } from '/@/api/sys/city/city';
  import { processList, success, failed } from '/@/hooks/web/useList';
  import { usePermission } from '/@/hooks/web/usePermission';

  export default defineComponent({
    name: 'TradingTable',
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
      TradingForm,
      FTrading,
      Select,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      // 判断权限
      const { hasPermission } = usePermission();
      // 获取用户store
      const userStore = useUserStore();
      const { prefixCls } = useDesign('trading');
      const tradingConst = ref(_TradingConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //省市
      const cityId = userStore.getUserInfo.companyCityId;
      let province = ref('');
      // 分页
      const pageSizeList = ref<string[]>(PageSizeList);
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });
      // 筛选条件
      const condition = reactive({
        cityId: cityId,
        provinceId: province,
        state: '1',
        name: '',
        id: '',
      });

      //根据状态筛选
      const stateHandleChange = async (value) => {
        condition.state = value;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      //根据名称筛选，选中并返回的方法
      const changeName = async (value) => {
        if (value.length === 0) {
          //没有选中数据时
          const result = await getList();
          processList(result, list, pageParam);
        } else {
          //先将列表信息清空
          list.splice(0);
          if (value.length > 0) {
            //应该发送一次网络请求
            value.forEach(async (element) => {
              condition.name = element.label;
              condition.state = tradingConst.value.EFFECTIVE;
              const result = await getTradingsByName(condition, {
                pageSize: pageParam.size,
                pageNum: pageParam.number,
              });
              if (result) {
                const { page, content } = result;
                content.forEach((trading) => {
                  if (!list.includes(trading)) {
                    list.push(trading);
                  }
                });
                page.number = page.number + 1;
                Object.assign(pageParam, {}, page);
              }
            });
          }
        }
      };

      //省市区筛选
      const locationChange = async (e) => {
        condition.cityId = e.value[1] || userStore.getUserInfo.companyCityId;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      // 列表结果
      const tradingArea: TradingModel[] = [];
      let list = reactive(tradingArea);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<TradingModel> | undefined;
        try {
          result = await getTradings(condition, {
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

      //页面初始化加载
      onMounted(async () => {
        const { content } = await getCityWithAllArea({ id: cityId });
        province.value = content.provinceId || '';
        const result = await getList();
        processList(result, list, pageParam);
      });

      // 抽屉参数
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
        provinceId: '',
      });
      //关闭抽屉
      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        drawerParam.provinceId = '';
        const result = await getList();
        processList(result, list, pageParam);
      };

      // 添加
      const addMetroLine = () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('component.action.add');
        drawerParam.provinceId = province.value;
      };

      // 操作
      const action = async (key) => {
        const code = key.key;
        const id = key?.item['data-id'] || undefined;
        switch (code) {
          case 0:
            // 删除
            try {
              loading.value = true;
              await deleteTradingArea(id);
              success(t('model.trading.delete'), t('model.trading.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed(t('model.trading.delete'), t('model.trading.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 1:
            // 恢复
            try {
              loading.value = true;
              await reEnableTradingArea(id);
              success(t('model.trading.reenable'), t('model.trading.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed(t('model.trading.reenable'), t('model.trading.fail'));
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
            drawerParam.provinceId = province.value;
            break;
        }
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
        t,
        prefixCls,
        tradingConst,
        ColumnsTrading,
        loading,
        tip,
        pageSizeList,
        list,
        drawerParam,
        pageParam,
        onChange,
        onShowSizeChange,
        locationChange,
        onClose,
        addMetroLine,
        action,
        condition,
        changeName,
        cityId,
        province,
        stateHandleChange,
        hasPermission,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-trading';
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
