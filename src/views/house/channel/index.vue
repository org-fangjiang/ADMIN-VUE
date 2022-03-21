//渠道管理
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
      :options="channelConst.STATES"
      :pagination="false"
    />
    <Button v-auth="channelConst._PERMS.ADD" @click="addChannel" :class="`${prefixCls}-add`">{{
      t('host.action.add')
    }}</Button>
    <Table :columns="channelColumns" :data-source="list" rowKey="id" :pagination="false">
      <template #state="{ text: state }">
        <span>
          <Tag :color="channelConst.STATES[state].color">
            {{ channelConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: operation }">
        <!-- 操作下拉框 -->
        <Dropdown placement="bottomCenter" trigger="click">
          <Button type="link">{{ t('host.operation') }}</Button>
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem
                v-if="hasPermission(channelConst._PERMS.DELETE)"
                :key="0"
                :data-id="operation.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  :class="prefixCls"
                  v-auth="channelConst._PERMS.DELETE"
                  type="link"
                  size="small"
                  >{{ t('host.action.delete') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="hasPermission(channelConst._PERMS.UPDATE)"
                :key="1"
                :data-id="operation.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  v-auth="channelConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.reEnable') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="hasPermission(channelConst._PERMS.UPDATE)"
                :key="2"
                :data-id="operation.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  v-auth="channelConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.update') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="hasPermission(channelConst._PERMS.UPDATE)"
                :key="3"
                :data-id="operation.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  v-auth="channelConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.channel.channelCase') }}
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
      wrapClassName="full-modal"
      centered
    >
      <ChannelCase v-if="drawerParam.state === '1'" :channelId="drawerParam.id" />
      <ChannelForm v-if="drawerParam.state === '0'" :id="drawerParam.id" />
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
    Table,
    Pagination,
    Tag,
    Button,
    Dropdown,
    Menu,
    MenuItem,
    Modal,
    Select,
  } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { processList, success, failed } from '/@/hooks/web/useList';
  import {
    _ColumnsChannel,
    _ChannelConst,
    ChannelModel,
  } from '/@/api/host/channel/model/channelModel';
  import { deleteChannel, getChannels, reEnableChannel } from '/@/api/host/channel/channel';
  import ChannelForm from './components/ChannelForm.vue';
  import ChannelCase from './components/ChannelCase.vue';
  import { usePermission } from '/@/hooks/web/usePermission';

  export default defineComponent({
    name: 'ChannelTable',
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
      ChannelForm,
      ChannelCase,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('channel');
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);

      const channelColumns = reactive(_ColumnsChannel);
      const channelConst = ref(_ChannelConst);

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

      //初始加载
      onMounted(async () => {
        const result = await getList();
        processList(result, list, pageParam);
      });

      // 筛选条件
      const condition = reactive({
        state: '1',
        id: '',
        name: '',
      });

      //根据状态筛选
      const stateHandleChange = async (value) => {
        condition.state = value;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      const channel: ChannelModel[] = [];
      // 列表结果
      let list = reactive(channel);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<ChannelModel> | undefined;
        try {
          result = await getChannels(condition, {
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
              await deleteChannel(id);
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
              await reEnableChannel(id);
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
          case 3:
            //设置案场负责人
            drawerParam.visible = true;
            drawerParam.state = '1';
            drawerParam.id = id;
            drawerParam.title = t('host.channel.channelCase');
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
      //添加渠道信息
      const addChannel = async () => {
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
        channelConst,
        condition,
        channelColumns,
        loading,
        tip,
        pageSizeList,
        list,
        pageParam,
        onChange,
        addChannel,
        onShowSizeChange,
        onClose,
        drawerParam,
        failed,
        success,
        action,
        stateHandleChange,
        hasPermission,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-channel';
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
      width: 70%;
      // height: 40%;
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
