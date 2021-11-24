//轮播图管理
<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <!-- 状态筛选 -->
    <Select
      :class="`${prefixCls}-add`"
      ref="select"
      :allowClear="true"
      v-model:value="condition.state"
      style="width: 120px"
      @change="stateHandleChange"
      :options="bannerConst.STATES"
      :pagination="false"
    />
    <Button v-auth="bannerConst._PERMS.ADD" @click="addBanner" :class="`${prefixCls}-add`">{{
      t('host.action.add')
    }}</Button>
    <Table :columns="bannerColumns" :data-source="list" rowKey="id" :pagination="false">
      <template #keyword="{ text: keyword }">
        <span class="mr-1" v-for="(item, index) in keyword.split(',')" :key="index">
          <Tag color="blue">{{ item }}</Tag>
        </span>
      </template>
      <template #address="{ text: address }">
        <Image :src="address" width="63px" />
      </template>
      <template #state="{ text: state }">
        <span>
          <Tag :color="bannerConst.STATES[state].color">
            {{ bannerConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: operation }">
        <!-- 操作下拉框 -->
        <Dropdown placement="bottomCenter" trigger="click">
          <Button type="link">{{ t('host.operation') }}</Button>
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem :key="0" :data-id="operation.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  :class="prefixCls"
                  v-auth="bannerConst._PERMS.DELETE"
                  type="link"
                  size="small"
                  >{{ t('host.action.delete') }}
                </Button>
              </MenuItem>
              <MenuItem :key="1" :data-id="operation.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="bannerConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.reEnable') }}
                </Button>
              </MenuItem>
              <MenuItem :key="2" :data-id="operation.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="bannerConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.update') }}
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
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width=""
      :bodyStyle="{ overflow: 'auto', 'margin-top': '16px' }"
      :destroyOnClose="true"
      :footer="null"
    >
      <BannerForm v-if="drawerParam.state === '0'" :id="drawerParam.id" :companyCityId="cityId" />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  // 用户store
  import { useUserStore } from '/@/store/modules/user';
  import {
    Table,
    Pagination,
    Tag,
    Button,
    Dropdown,
    Menu,
    MenuItem,
    Modal,
    Image,
    Select,
  } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { deleteBanner, getBanners, reEnableBanner } from '/@/api/host/banner/banner';
  import { BannerModel, _BannerColumns, _BannerConst } from '/@/api/host/banner/model/bannerModel';
  import BannerForm from './components/BannerForm.vue';
  import { processList, success, failed } from '/@/hooks/web/useList';

  export default defineComponent({
    name: 'BannerTable',
    components: {
      Select,
      Table,
      Pagination,
      Tag,
      Button,
      Dropdown,
      Loading,
      Menu,
      MenuItem,
      Modal,
      BannerForm,
      Image,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      // 获取用户store
      const userStore = useUserStore();
      const { prefixCls } = useDesign('banner');
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);

      const bannerColumns = reactive(_BannerColumns);
      const bannerConst = ref(_BannerConst);

      // 分页
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });

      //初始加载
      onMounted(async () => {
        const result = await getList();
        processList(result, list, pageParam);
      });

      const cityId = userStore.getUserInfo.companyCityId;
      // 筛选条件
      const condition = reactive({
        state: '1',
        id: '',
        cityId: cityId || '',
      });

      //根据状态筛选
      const stateHandleChange = async (value) => {
        condition.state = value;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      const banner: BannerModel[] = [];
      // 列表结果
      let list = reactive(banner);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<BannerModel> | undefined;
        try {
          result = await getBanners(condition, {
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

      // 操作
      const action = async (key) => {
        const code = key.key;
        const id = key?.item['data-id'] || undefined;
        switch (code) {
          case 0:
            // 删除
            try {
              loading.value = true;
              await deleteBanner(id);
              success(t('host.action.delete'), t('host.action.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('host.action.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 1:
            // 恢复
            try {
              loading.value = true;
              await reEnableBanner(id);
              success(t('host.action.reEnable'), t('host.action.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('host.action.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 2:
            //更新
            drawerParam.visible = true;
            drawerParam.state = '0';
            drawerParam.id = id;
            drawerParam.title = t('host.action.update');
            break;
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
        processList(result, list, pageParam);
      };
      //添加轮播图
      const addBanner = async () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('host.action.add');
      };

      //页码修改
      const onChange = async (page) => {
        pageParam.number = page;
        const result = await getList();
        processList(result, list, pageParam);
      };
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
        bannerConst,
        condition,
        bannerColumns,
        loading,
        tip,
        pageSizeList,
        list,
        pageParam,
        onChange,
        addBanner,
        onShowSizeChange,
        onClose,
        cityId,
        drawerParam,
        failed,
        success,
        action,
        stateHandleChange,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-banner';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;
    }
  }

  .@{prefix-cls} {
    &-action-menu-item {
      text-align: center;
    }

    &-add {
      margin-top: 20px;
      margin-right: 10px;
      margin-bottom: 20px;
    }
  }

  .full-modal {
    .ant-modal {
      max-width: 100%;
      top: 0;
      padding-bottom: 0;
      margin: 0;
    }

    .ant-modal-content {
      display: flex;
      flex-direction: column;
      height: calc(100vh);
    }

    .ant-modal-body {
      flex: 1;
    }
  }
</style>
