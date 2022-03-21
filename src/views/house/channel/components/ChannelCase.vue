//渠道负责人管理
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
      :options="channelCaseConst.STATES"
      :pagination="false"
    />
    <Select
      :showSearch="true"
      ref="select"
      :allowClear="true"
      v-model:value="condition.contact"
      style="width: 120px"
      @search="contactChange"
      :pagination="false"
      :filter-option="false"
      :not-found-content="fetching ? undefined : null"
      placeholder="联系方式"
      :class="`${prefixCls}-add`"
    >
      <template v-if="fetching" #notFoundContent>
        <Spin size="small" />
      </template>
    </Select>
    <Button
      v-auth="channelCaseConst._PERMS.ADD"
      @click="addChannelCase"
      :class="`${prefixCls}-add`"
    >
      {{ t('host.action.add') }}
    </Button>
    <Table
      :columns="channelCaseColumns"
      :data-source="list"
      rowKey="id"
      :pagination="false"
      :scroll="{ y: 'calc(70vh)' }"
    >
      <template #avatar="{ text: avatar }">
        <Image :src="avatar" width="63px" />
      </template>
      <template #state="{ text: state }">
        <span>
          <Tag :color="channelCaseConst.STATES[state].color">
            {{ channelCaseConst.STATES[state].label }}
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
                v-if="hasPermission(channelCaseConst._PERMS.DELETE)"
                :key="0"
                :data-id="operation.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  :class="prefixCls"
                  v-auth="channelCaseConst._PERMS.DELETE"
                  type="link"
                  size="small"
                  >{{ t('host.action.delete') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="hasPermission(channelCaseConst._PERMS.UPDATE)"
                :key="1"
                :data-id="operation.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  v-auth="channelCaseConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.reEnable') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="hasPermission(channelCaseConst._PERMS.UPDATE)"
                :key="2"
                :data-id="operation.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  v-auth="channelCaseConst._PERMS.UPDATE"
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
      <ChannelCaseForm
        v-if="drawerParam.state === '0'"
        :id="drawerParam.id"
        :channelId="props.channelId"
      />
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
    Image,
    Spin,
  } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { processList, success, failed } from '/@/hooks/web/useList';
  import {
    ChannelCaseModel,
    _ChannelCaseConst,
    _ColumnsChannelCase,
  } from '/@/api/host/channelCase/model/channelCaseModel';
  import {
    deleteChannelCase,
    getChannelCases,
    reEnableChannelCase,
  } from '/@/api/host/channelCase/channelCase';
  import ChannelCaseForm from './ChannelCaseForm.vue';
  import { debounce } from 'lodash-es';
  import { usePermission } from '/@/hooks/web/usePermission';

  export default defineComponent({
    name: 'ChannelCase',
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
      ChannelCaseForm,
      Image,
      // FProjectSelect,
      Spin,
    },
    props: {
      channelId: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('channel');
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);

      const channelCaseColumns = reactive(_ColumnsChannelCase);
      const channelCaseConst = ref(_ChannelCaseConst);

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
        channelId: props.channelId,
        projectId: '',
        contact: undefined,
      });

      //根据状态筛选
      const stateHandleChange = async (value) => {
        condition.state = value;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      //根据联系方式筛选
      let fetching = ref<boolean>(false);
      const contactChange = debounce(async (value) => {
        fetching.value = true;
        condition.contact = value;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
        // condition.contact = '';
        fetching.value = false;
      }, 1000);

      const channelCase: ChannelCaseModel[] = [];
      // 列表结果
      let list = reactive(channelCase);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<ChannelCaseModel> | undefined;
        try {
          result = await getChannelCases(condition, {
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
              await deleteChannelCase(id);
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
              await reEnableChannelCase(id);
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
      //添加负责人
      const addChannelCase = async () => {
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
        channelCaseConst,
        condition,
        channelCaseColumns,
        loading,
        tip,
        pageSizeList,
        list,
        pageParam,
        onChange,
        addChannelCase,
        onShowSizeChange,
        onClose,
        drawerParam,
        failed,
        success,
        action,
        stateHandleChange,
        props,
        contactChange,
        fetching,
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
