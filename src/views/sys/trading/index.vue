// 商圈信息管理页面

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
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
              <MenuItem :key="0" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="tradingConst._PERMS.DELETE"
                  :class="prefixCls"
                  type="link"
                  size="small"
                  >{{ t('component.action.delete') }}
                </Button>
              </MenuItem>
              <MenuItem :key="1" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
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
              <MenuItem :key="2" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
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
  import { Table, Pagination, Tag, Button, Drawer, Dropdown, Menu, MenuItem } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import FCascader from '/@/components/FCascader';
  import TradingForm from './components/TradingForm.vue';
  import FTrading from '/@/components/FTrading';
  import { getCityWithAllArea } from '/@/api/sys/city/city';

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
    },
    setup() {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      // 获取用户store
      const userStore = useUserStore();
      const { prefixCls } = useDesign('trading');
      const tradingConst = ref(_TradingConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      const tradingArea: TradingModel[] = [];
      //省市
      const cityId = userStore.getUserInfo.companyCityId;
      let province = ref('');
      // 分页
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
        state: '',
        name: '',
        id: '',
      });
      //根据名称筛选，选中并返回的方法
      const changeName = async (value) => {
        if (value.length === 0) {
          //没有选中数据时
          const result = await getList();
          processList(result);
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
      // 列表结果
      let list = reactive(tradingArea);
      // 抽屉参数
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
        provinceId: '',
      });

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
      //获取的数据分页放到列表中
      function processList(result: any) {
        if (!result) {
          return;
        }
        const { page, content } = result;
        list.splice(0);
        content.forEach((trading) => {
          list.push(trading);
        });
        page.number = page.number + 1;
        Object.assign(pageParam, {}, page);
      }

      //省市区筛选
      const locationChange = async (e) => {
        condition.cityId = e.value[1] || userStore.getUserInfo.companyCityId;
        pageParam.number = 1;
        const result = await getList();
        processList(result);
      };
      //页码改变
      const onChange = async (page) => {
        pageParam.number = page;
        const result = await getList();
        processList(result);
      };
      //每页条数改变
      const onShowSizeChange = async (current, size) => {
        console.log(current);
        pageParam.size = size;
        pageParam.number = 1;
        const result = await getList();
        processList(result);
      };
      //页面初始化加载
      onMounted(async () => {
        const { content } = await getCityWithAllArea({ id: cityId });
        province.value = content.provinceId || '';
        const result = await getList();
        processList(result);
      });
      //关闭抽屉
      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        drawerParam.provinceId = '';
        const result = await getList();
        processList(result);
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
              success(t('model.metroLine.result.delete'), t('model.metroLine.result.delete'));
              const result = await getList();
              processList(result);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('model.metroLine.result.failed'));
            } finally {
              loading.value = false;
            }
            break;
          case 1:
            // 恢复
            try {
              loading.value = true;
              await reEnableTradingArea(id);
              success(t('model.metroLine.result.reEnable'), t('model.metroLine.result.reEnable'));
              const result = await getList();
              processList(result);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('model.metroLine.result.failed'));
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
