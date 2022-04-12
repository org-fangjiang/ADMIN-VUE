<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <Table :columns="columns" :data-source="list" rowKey="id" :pagination="false">
      <template #state="{ text: state }">
        <span>
          <Tag :color="oHouseConst.STATE[state].color">
            {{ oHouseConst.STATE[state].label }}
          </Tag>
        </span>
      </template>
      <template #type="{ text: type }">
        <span>
          <Tag :color="oHouseConst.TYPES[type - 1].color">
            {{ oHouseConst.TYPES[type - 1].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: link }">
        <Button
          v-auth="oHouseConst._PERMS.CHANGE"
          type="link"
          size="small"
          :class="prefixCls"
          @click="clickUpdate(link)"
        >
          {{ t('host.action.see') }}
        </Button>
        <Button
          v-auth="oHouseConst._PERMS.CHANGE"
          type="link"
          size="small"
          :class="prefixCls"
          @click="clickPass(link)"
        >
          审核通过
        </Button>
        <Button
          v-auth="oHouseConst._PERMS.CHANGE"
          type="link"
          size="small"
          :class="prefixCls"
          @click="clickFail(link)"
        >
          审核不通过
        </Button>
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
      v-model:visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width="80%"
      :bodyStyle="{ overflowY: 'auto', margin: '16px', height: '700px' }"
      :destroyOnClose="true"
      :footer="null"
    >
      <ProjectForm v-if="drawerParam.state === '0'" :id="drawerParam.id" :isSee="true" />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    oHouseColumns,
    OProjectConst,
    OProjectModel,
  } from '/@/api/ohouse/project/model/projectModel';
  import { changeState, projectList } from '/@/api/ohouse/project/project';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { failed, processList, success } from '/@/hooks/web/useList';
  import { Loading } from '/@/components/Loading';
  import { Pagination, Table, Tag, Button, Modal } from 'ant-design-vue';
  import ProjectForm from '../project/components/ProjectForm.vue';

  export default defineComponent({
    name: 'OProject',
    components: {
      Loading,
      Pagination,
      Table,
      Tag,
      Button,
      ProjectForm,
      Modal,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);

      const columns = reactive(oHouseColumns);
      const oHouseConst = reactive(OProjectConst);
      const condition = reactive({
        id: '',
        name: '',
        labels: '',
        type: undefined,
        buildType: undefined,
        property: '',
        developerId: undefined,
        brandId: undefined,
        provinceId: '',
        cityId: '',
        areaId: '',
        payTime: '',
        waterMethod: undefined,
        electricityMethod: undefined,
        heatMethod: undefined,
        state: '2',
        cng: undefined,
        divideCar: undefined,
      });

      //根据创建时间排序，默认降序
      let sortParam = reactive({
        asc: [] as any[],
        desc: ['createTime'],
      });
      //分页参数
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });

      const projects: OProjectModel[] = [];
      const list = reactive(projects);
      // 获取列表信息
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<OProjectModel> | undefined;
        try {
          result = await projectList(
            condition,
            {
              pageSize: pageParam.size,
              pageNum: pageParam.number,
            },
            sortParam
          );
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

      onMounted(async () => {
        const result = await getList();
        processList(result, list, pageParam);
      });

      //抽屉
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
      });

      // 查看
      const clickUpdate = (line) => {
        drawerParam.visible = true;
        drawerParam.id = line.id;
        drawerParam.title = t('host.action.see');
        drawerParam.state = '0';
      };

      // 审核通过
      const clickPass = async (line) => {
        loading.value = true;
        try {
          await changeState(line.id, '1');
          success('成功', '审核通过成功');
        } catch (error) {
          failed('失败', '审核通过失败');
        } finally {
          loading.value = false;
        }
      };
      // 审核不通过
      const clickFail = async (line) => {
        loading.value = true;
        try {
          await changeState(line.id, '4');
          success('成功', '审核不通过成功');
        } catch (error) {
          failed('失败', '审核不通过失败');
        } finally {
          loading.value = false;
        }
      };

      // 关闭modal
      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.id = '';
        drawerParam.title = '';
        drawerParam.state = '';
        const result = await getList();
        processList(result, list, pageParam);
      };

      // 页码改变
      const onChange = async (page) => {
        pageParam.number = page;
        const result = await getList();
        processList(result, list, pageParam);
      };
      // 条数改变
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
        oHouseConst,
        columns,
        sortParam,
        condition,
        list,
        pageParam,
        loading,
        tip,
        pageSizeList,
        onChange,
        onShowSizeChange,
        drawerParam,
        onClose,
        clickUpdate,
        clickPass,
        clickFail,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-project';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;
    }
  }

  .inputClass {
    @apply w-32;

    .ant-input-affix-wrapper {
      @apply w-32;
    }
  }
</style>
