// 站点信息管理页面
<template>
  <div :class="prefixCls" class="relative w-full h-full px-4 pt-2">
    <Button v-auth="stationConst._PERMS.ADD" @click="addMetroStation">{{
      t('component.action.add')
    }}</Button>
    <Table :columns="ColumnsLineStation" :data-source="list" rowKey="id" :pagination="false">
      <template #state="{ text: state }">
        <span>
          <Tag :color="stationConst.STATES[state].color">
            {{ stationConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: line }">
        <Button
          :class="prefixCls"
          v-auth="stationConst._PERMS.DELETE"
          type="link"
          size="small"
          @click="deleteStation(line)"
        >
          {{ t('component.action.delete') }}
        </Button>
      </template>
    </Table>
    <Modal
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      :bodyStyle="{ overflow: 'auto', 'margin-top': '16px' }"
      width=""
      :footer="null"
      :destroyOnClose="true"
    >
      <AddStation v-if="drawerParam.state === '0'" :id="drawerParam.id" />
    </Modal>
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
    _ColumnsLineStation as ColumnsLineStation,
  } from '/@/api/sys/metro/model/metroModel';
  import { getStationsByLine, removeStation } from '/@/api/sys/metro/metro';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BaseListResult, PageSizeList } from '/@/api/model/baseModel';
  // 用户store
  import { useUserStore } from '/@/store/modules/user';
  import { Table, Tag, Button, Modal } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import AddStation from './AddStation.vue';

  interface Option {
    value: string;
    label: string;
  }
  export default defineComponent({
    name: 'StationTable',
    components: {
      Table,
      Tag,
      Button,
      Modal,
      Loading,
      AddStation,
    },
    props: {
      lineId: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      // 获取用户store
      const userStore = useUserStore();
      const { prefixCls } = useDesign('metro');
      const stationConst = ref(_MetroStationConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      const metroStation: MetroStationModel[] = [];

      const options = ref<Option[]>([]);
      // 筛选条件
      const condition = reactive({
        cityId: userStore.getUserInfo.companyCityId,
        state: '',
        lineId: props.lineId || '',
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
      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        const result = await getList();
        processListByLine(result);
      };

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BaseListResult<MetroStationModel> | undefined;
        try {
          result = await getStationsByLine(condition);
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

      function processListByLine(result: any) {
        if (!result) {
          return;
        }
        const { content } = result;
        list.splice(0);
        content.forEach((line) => {
          list.push(line);
        });
      }

      onMounted(async () => {
        const result = await getList();
        processListByLine(result);
      });

      // 添加站点
      const addMetroStation = () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = props.lineId || '';
        drawerParam.title = t('component.action.add');
      };

      const deleteStation = async (line) => {
        try {
          loading.value = true;
          await removeStation(props.lineId || '', line.id);
          success(t('model.metroStation.result.delete'), t('model.metroStation.result.delete'));
          const result = await getList();
          processListByLine(result);
        } catch (error: any) {
          failed(error?.response?.data?.message, t('model.metroStation.result.failed'));
        } finally {
          loading.value = false;
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
        ColumnsLineStation,
        loading,
        tip,
        pageSizeList,
        list,
        drawerParam,
        addMetroStation,
        deleteStation,
        onClose,
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
  }
</style>
