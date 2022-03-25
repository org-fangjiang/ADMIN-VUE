// 视频管理页面
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
      :options="videoConst.STATES"
      :pagination="false"
    />
    <!-- 是否是热门筛选 -->
    <Select
      placeholder="是否热门"
      :class="`${prefixCls}-add`"
      ref="select"
      :allowClear="true"
      v-model:value="condition.isTop"
      style="width: 120px"
      @change="isTopHandleChange"
      :options="videoConst.isTop"
    />
    <!-- 根据项目筛选 -->
    <FProjectSelect @onClear="proClear" @setProject="setProject" :class="`${prefixCls}-add`" />
    <Button v-auth="videoConst._PERMS.ADD" @click="addVideo" :class="`${prefixCls}-add`">
      {{ t('host.action.add') }}</Button
    >
    <Table :columns="Columns" :data-source="list" rowKey="id" :pagination="false">
      <template #sort="{ text: sort }">
        <span>
          <Tag :color="videoConst.SORTS[sort - 1].color">
            {{ videoConst.SORTS[sort - 1].label }}
          </Tag>
        </span>
      </template>
      <template #isTop="{ text: isTop }">
        <span>
          <Tag :color="videoConst.isTop[isTop].color">
            {{ videoConst.isTop[isTop].label }}
          </Tag>
        </span>
      </template>
      <template #keyword="{ text: keyword }">
        <span class="mr-1" v-for="(item, index) in keyword.split(',')" :key="index">
          <Tag color="blue">{{ item }}</Tag>
        </span>
      </template>
      <template #operation="{ text: line }">
        <!-- 操作下拉框 -->
        <Dropdown placement="bottomCenter" trigger="click">
          <Button
            v-if="hasPermission([videoConst._PERMS.DELETE, videoConst._PERMS.UPDATE])"
            type="link"
            >{{ t('host.operation') }}</Button
          >
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem
                v-if="hasPermission(videoConst._PERMS.DELETE) && deleteOrEnable(line.state)"
                :key="0"
                :data-id="line.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  :class="prefixCls"
                  v-auth="videoConst._PERMS.DELETE"
                  type="link"
                  size="small"
                  >{{ t('host.action.delete') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="hasPermission(videoConst._PERMS.UPDATE) && !deleteOrEnable(line.state)"
                :key="1"
                :data-id="line.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  v-auth="videoConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.reEnable') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="hasPermission(videoConst._PERMS.UPDATE)"
                :key="2"
                :data-id="line.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  v-auth="videoConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.update') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="hasPermission(videoConst._PERMS.UPDATE)"
                :key="3"
                :data-id="line.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  v-auth="videoConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.video.setTop') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="hasPermission(videoConst._PERMS.UPDATE)"
                :key="4"
                :data-id="line.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  v-auth="videoConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.video.cancelTop') }}
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
      :bodyStyle="{ overflow: 'auto', 'margin-top': '16px' }"
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width=""
      :footer="null"
      :destroyOnClose="true"
    >
      <VideoForm v-if="drawerParam.state === '0'" :id="drawerParam.id" />
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
  import {
    Select,
    Table,
    Pagination,
    Tag,
    Button,
    Modal,
    Dropdown,
    Menu,
    MenuItem,
  } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { processList, success, failed } from '/@/hooks/web/useList';
  import {
    VideoModel,
    _VideoConst,
    VideoColumns as Columns,
  } from '/@/api/host/video/model/videoModel';
  import { cancel, deleteVideo, GetByPage, reEnableVideo, setTop } from '/@/api/host/video/video';
  import VideoForm from './components/VideoForm.vue';
  import FProjectSelect from '/@/components/FProjectSelect';
  import { useUserStore } from '/@/store/modules/user';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { deleteOrEnable } from '/@/hooks/web/useButton';

  export default defineComponent({
    name: 'VideoTable',
    components: {
      Select,
      Table,
      Pagination,
      Tag,
      Button,
      Modal,
      Dropdown,
      Menu,
      MenuItem,
      Loading,
      VideoForm,
      FProjectSelect,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('brand');
      const videoConst = ref(_VideoConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);

      // 判断权限
      const { hasPermission } = usePermission();

      // 分页
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });

      onMounted(async () => {
        const result = await getList();
        processList(result, list, pageParam);
      });

      const userInfo = useUserStore();
      const provinceId = userInfo.getUserInfo.companyProvinceId;
      const cityId = userInfo.getUserInfo.companyCityId;

      // 筛选条件
      const condition = reactive({
        cityId: '',
        isTop: undefined,
        project: '',
        state: '1',
      });

      //根据状态筛选
      const stateHandleChange = async (value) => {
        condition.state = value;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      //是否是热门筛选
      const isTopHandleChange = async (value) => {
        condition.isTop = value;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      //根据项目筛选
      const setProject = async (value) => {
        condition.project = value.value;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      const proClear = async () => {
        condition.project = '';
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      // 列表结果
      const videos: VideoModel[] = [];
      let list = reactive(videos);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<VideoModel> | undefined;
        try {
          result = await GetByPage(condition, {
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
              await deleteVideo(id);
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
              await reEnableVideo(id);
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
            // 更新
            drawerParam.visible = true;
            drawerParam.state = '0';
            drawerParam.id = id;
            drawerParam.title = t('host.action.update');
            break;
          case 3:
            // 恢复
            try {
              loading.value = true;
              await setTop(id);
              success(t('host.video.setTop'), t('host.action.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('host.action.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 4:
            // 恢复
            try {
              loading.value = true;
              await cancel(id);
              success(t('host.video.cancelTop'), t('host.action.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('host.action.fail'));
            } finally {
              loading.value = false;
            }
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

      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        const result = await getList();
        processList(result, list, pageParam);
      };

      // 添加
      const addVideo = () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('host.action.add');
      };

      //页码改变
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
        videoConst,
        condition,
        Columns,
        loading,
        tip,
        pageSizeList,
        list,
        drawerParam,
        pageParam,
        onChange,
        onShowSizeChange,
        onClose,
        addVideo,
        action,
        stateHandleChange,
        isTopHandleChange,
        setProject,
        provinceId,
        cityId,
        proClear,
        hasPermission,
        deleteOrEnable,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-brand';
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
