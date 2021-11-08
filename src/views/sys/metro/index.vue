// 地铁信息管理页面

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <!-- 根据地区进行筛选 -->
    <FCascader @change="locationChange" class="mr-2" :class="`${prefixCls}-select`" />
    <!-- 添加地铁线路 -->
    <Button v-auth="metroConst._PERMS.ADD" @click="addMetroLine" :class="`${prefixCls}-select`">{{
      t('component.action.add')
    }}</Button>
    <Table :columns="ColumnsMetroLine" :data-source="list" rowKey="id" :pagination="false">
      <template #startStation="{ text: startStation }">
        <span v-if="startStation.name">
          {{ startStation.name }}
        </span>
        <span v-else> 暂无 </span>
      </template>
      <template #endStation="{ text: endStation }">
        <span v-if="endStation.name">
          {{ endStation.name }}
        </span>
        <span v-else> 暂无 </span>
      </template>
      <template #state="{ text: state }">
        <span>
          <Tag :color="metroConst.STATES[state].color">
            {{ metroConst.STATES[state].label }}
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
                  v-auth="metroConst._PERMS.DELETE"
                  type="link"
                  size="small"
                  >{{ t('component.action.delete') }}
                </Button>
              </MenuItem>
              <MenuItem :key="1" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="metroConst._PERMS.UPDATE"
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
                  v-auth="metroConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('component.action.update') }}
                </Button>
              </MenuItem>
              <MenuItem :key="3" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button v-auth="metroConst._PERMS.ADD" type="link" size="small" :class="prefixCls">
                  {{ t('model.metroLine.result.addStation') }}
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
      <MetroLineForm v-if="drawerParam.state === '0'" :id="drawerParam.id" />
      <StationTable v-if="drawerParam.state === '1'" :lineId="drawerParam.id" />
    </Drawer>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import {
    MetroLineModel,
    _ColumnsMetroLine as ColumnsMetroLine,
    _MetroLineConst,
  } from '/@/api/sys/metro/model/metroModel';
  import { getLines, deleteLine, reEnableLine } from '/@/api/sys/metro/metro';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  // 用户store
  import { useUserStore } from '/@/store/modules/user';
  import { Table, Pagination, Tag, Button, Drawer, Dropdown, Menu, MenuItem } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import FCascader from '/@/components/FCascader';
  import MetroLineForm from './components/MetroLineForm.vue';
  import StationTable from './components/StationTable.vue';

  export default defineComponent({
    name: 'LinkTable',
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
      MetroLineForm,
      StationTable,
    },
    setup() {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      // 获取用户store
      const userStore = useUserStore();
      const { prefixCls } = useDesign('metro');
      const metroConst = ref(_MetroLineConst);
      //加载动画
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      const metroLine: MetroLineModel[] = [];

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
        cityId: userStore.getUserInfo.companyCityId,
        state: '',
      });
      // 列表结果
      let list = reactive(metroLine);
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
        let result: BasePageResult<MetroLineModel> | undefined;
        try {
          result = await getLines(condition, {
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

      //将获取到的数据按照分页展示列表中
      function processList(result: any) {
        if (!result) {
          return;
        }
        const { page, content } = result;
        //每次先将列表清空，在进行赋值
        list.splice(0);
        content.forEach((line) => {
          list.push(line);
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

      //页面修改
      const onChange = async (page) => {
        pageParam.number = page;
        const result = await getList();
        processList(result);
      };
      //每页条数修改
      const onShowSizeChange = async (current, size) => {
        console.log(current);
        pageParam.size = size;
        pageParam.number = 1;
        const result = await getList();
        processList(result);
      };

      //页面初始加载
      onMounted(async () => {
        const result = await getList();
        processList(result);
      });

      //关闭抽屉
      const onClose = async () => {
        drawerParam.visible = false;
        if (drawerParam.state === '1') {
          //如果是添加站点信息，和主页面没有关系，不需要重新加载
          drawerParam.state = '';
          drawerParam.id = '';
          drawerParam.title = '';
          return;
        }
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        const result = await getList();
        processList(result);
      };

      // 添加地铁线路
      const addMetroLine = () => {
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
              await deleteLine(id);
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
              await reEnableLine(id);
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
            break;
          case 3:
            // 添加站点
            drawerParam.visible = true;
            drawerParam.state = '1';
            drawerParam.id = id;
            drawerParam.title = t('model.metro.stationInfo');
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
        metroConst,
        ColumnsMetroLine,
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
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-metro';
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
