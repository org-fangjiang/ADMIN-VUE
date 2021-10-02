// 户型信息管理页面
<template>
  <div :class="prefixCls" class="relative w-full h-full px-4 pt-2">
    <Button v-auth="layoutConst._PERMS.ADD" @click="addLayout">{{ t('host.action.add') }}</Button>
    <!-- 状态筛选 -->
    <Select
      ref="select"
      :allowClear="true"
      v-model:value="condition.state"
      style="width: 120px"
      @change="stateHandleChange"
      :options="layoutConst.STATES"
      :pagination="false"
    />
    <Table :columns="ColumnsLayout" :data-source="list" rowKey="id" :pagination="false">
      <template #hResourceByResourceId="{ text: hResourceByResourceId }">
        <Image
          v-if="hResourceByResourceId.sort !== '6' && hResourceByResourceId.sort !== '7'"
          :src="hResourceByResourceId.address"
          width="100px"
        />
        <div v-else>{{ hResourceByResourceId.address }}</div>
      </template>
      <template #face="{ text: face }">
        <span>
          <Tag :color="layoutConst.FACES[face - 1].color">
            {{ layoutConst.FACES[face - 1].label }}
          </Tag>
        </span>
      </template>
      <template #saleState="{ text: saleState }">
        <span>
          <Tag :color="layoutConst.SALE_STATES[saleState - 1].color">
            {{ layoutConst.SALE_STATES[saleState - 1].label }}
          </Tag>
        </span>
      </template>
      <template #state="{ text: state }">
        <span>
          <Tag :color="layoutConst.STATES[state].color">
            {{ layoutConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: line }">
        <Button
          :class="prefixCls"
          v-auth="layoutConst._PERMS.DELETE"
          type="link"
          size="small"
          @click="deleteOneLayout(line)"
        >
          {{ t('host.action.delete') }}
        </Button>
        <Button
          :class="prefixCls"
          v-auth="layoutConst._PERMS.UPDATE"
          type="link"
          size="small"
          @click="reEnableOneLayout(line)"
        >
          {{ t('host.action.reEnable') }}
        </Button>
        <Button
          :class="prefixCls"
          v-auth="layoutConst._PERMS.ADD"
          type="link"
          size="small"
          @click="updateLayout(line)"
        >
          {{ t('host.action.update') }}
        </Button>
      </template>
    </Table>
    <Modal
      :bodyStyle="{ overflow: 'auto', 'margin-top': '16px' }"
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width="100%"
      wrapClassName="full-modal"
      :footer="null"
      :destroyOnClose="true"
    >
      <LayoutForm v-if="drawerParam.state === '0'" :id="drawerParam.id" :projectId="props.id" />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BaseListResult, PageSizeList } from '/@/api/model/baseModel';
  import { Table, Tag, Button, Modal, Image, Select } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import {
    LayoutModel,
    _LayoutConst,
    _ColumnsLayout as ColumnsLayout,
  } from '/@/api/host/layout/model/layoutModel';
  import { deleteLayout, getLayoutList, reEnableLayout } from '/@/api/host/layout/layout';
  import LayoutForm from './LayoutForm.vue';

  export default defineComponent({
    name: 'LayoutTable',
    components: {
      Table,
      Tag,
      Button,
      Modal,
      Loading,
      LayoutForm,
      Image,
      Select,
    },
    props: {
      id: {
        type: String,
        require: true,
      },
      provinceId: {
        type: String,
        require: true,
      },
      cityId: {
        type: String,
        require: true,
      },
      areaId: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');
      const layoutConst = ref(_LayoutConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      const layout: LayoutModel[] = [];

      // 筛选条件
      const condition = reactive({
        state: '',
        projectId: props.id || '',
        id: '',
      });
      // 列表结果
      let list = reactive(layout);
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
        let result: BaseListResult<LayoutModel> | undefined;
        try {
          result = await getLayoutList(condition);
        } catch (error) {
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
        if (content) {
          content.forEach((line) => {
            list.push(line);
          });
        }
      }

      onMounted(async () => {
        const result = await getList();
        processListByLine(result);
      });

      const deleteOneLayout = async (line) => {
        try {
          loading.value = true;
          await deleteLayout(line.id);
          success(t('host.action.delete'), t('host.action.success'));
          const result = await getList();
          processListByLine(result);
        } catch (error) {
          failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };
      const reEnableOneLayout = async (line) => {
        try {
          loading.value = true;
          await reEnableLayout(line.id);
          success(t('host.action.reEnable'), t('host.action.success'));
          const result = await getList();
          processListByLine(result);
        } catch (error) {
          failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };

      const addLayout = async (line) => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = line.id;
        drawerParam.title = t('host.action.add');
      };

      const updateLayout = async (line) => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = line.id;
        drawerParam.title = t('host.action.update');
      };

      const stateHandleChange = async (value) => {
        condition.state = value;
        const result = await getList();
        processListByLine(result);
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
        layoutConst,
        condition,
        ColumnsLayout,
        loading,
        tip,
        pageSizeList,
        list,
        drawerParam,
        deleteOneLayout,
        reEnableOneLayout,
        stateHandleChange,
        updateLayout,
        onClose,
        addLayout,
        props,
      };
    },
  });
</script>
