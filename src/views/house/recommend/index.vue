//热门楼盘
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
      :options="recommendConst.STATES"
      :pagination="false"
    />
    <Button :class="`${prefixCls}-add`" v-auth="recommendConst._PERMS.ADD" @click="addProject">
      {{ t('host.action.add') }}</Button
    >
    <Table :columns="columnsRecommend" :data-source="list" rowKey="id" :pagination="false">
      <template #state="{ text: state }">
        <span>
          <Tag :color="recommendConst.STATES[state].color">
            {{ recommendConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: operation }">
        <!-- 操作下拉框 -->
        <Dropdown placement="bottomCenter" trigger="click">
          <Button
            v-if="hasPermission([recommendConst._PERMS.DELETE, recommendConst._PERMS.UPDATE])"
            type="link"
            >{{ t('host.operation') }}</Button
          >
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem
                v-if="
                  hasPermission(recommendConst._PERMS.DELETE) && deleteOrEnable(operation.state)
                "
                :key="0"
                :data-id="operation.projectId"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  :class="prefixCls"
                  v-auth="recommendConst._PERMS.DELETE"
                  type="link"
                  size="small"
                  >{{ t('host.action.delete') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="
                  hasPermission(recommendConst._PERMS.UPDATE) && !deleteOrEnable(operation.state)
                "
                :key="1"
                :data-id="operation.projectId"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  v-auth="recommendConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.reEnable') }}
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
      v-model:visible="isModal"
      title="添加热门楼盘"
      @cancel="onClose"
      width=""
      :bodyStyle="{ overflow: 'auto', 'margin-top': '16px' }"
      :destroyOnClose="true"
      :footer="null"
    >
      <ProjectForm @projectInfo="projectInfo" />
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
    Select,
    Table,
    Pagination,
    Tag,
    Button,
    Dropdown,
    Modal,
    Menu,
    MenuItem,
  } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import {
    addRecommend,
    deleteRecommend,
    getByPage,
    reEnableRecommend,
  } from '/@/api/host/recommend/recommend';
  import ProjectForm from '/@/components/FTinymce/src/ProjectForm.vue';
  import {
    RecommendModel,
    _ColumnsRecommend,
    _RecommendConst,
  } from '/@/api/host/recommend/model/recommendModel';

  import { processList, success, failed } from '/@/hooks/web/useList';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { deleteOrEnable } from '/@/hooks/web/useButton';

  export default defineComponent({
    name: 'RecommendTable',
    components: {
      Select,
      Table,
      Pagination,
      Tag,
      Button,
      Dropdown,
      Loading,
      ProjectForm,
      Modal,
      Menu,
      MenuItem,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      // 获取用户store
      const userStore = useUserStore();
      const { prefixCls } = useDesign('recommend');
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);

      const columnsRecommend = reactive(_ColumnsRecommend);
      const recommendConst = ref(_RecommendConst);

      // 判断权限
      const { hasPermission } = usePermission();

      //控制添加热门楼盘的modal
      let isModal = ref<boolean>(false);
      const addProject = () => {
        isModal.value = true;
      };
      const onClose = async () => {
        isModal.value = false;
        const result = await getList();
        processList(result, list, pageParam);
      };
      //添加热门楼盘返回的信息
      const projectInfo = async (value) => {
        try {
          loading.value = true;
          await addRecommend(value.id);
          success(t('host.action.add'), t('host.action.success'));
          const result = await getList();
          processList(result, list, pageParam);
        } catch (error: any) {
          // failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };

      // 分页
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });

      //省市id
      const cityId = userStore.getUserInfo.companyCityId;
      const provinceId = userStore.getUserInfo.companyProvinceId;
      // 筛选条件
      const condition = reactive({
        state: '1',
        provinceId: provinceId || '',
        id: '',
        projectName: '',
        cityId: cityId || '',
      });

      //根据状态筛选
      const stateHandleChange = async (value) => {
        condition.state = value;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      const recommend: RecommendModel[] = [];
      // 列表结果
      let list = reactive(recommend);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<RecommendModel> | undefined;
        try {
          result = await getByPage(condition, {
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
              await deleteRecommend(id);
              success(t('host.action.delete'), t('host.action.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              // failed(error?.response?.data?.message, t('host.action.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 1:
            // 恢复
            try {
              loading.value = true;
              await reEnableRecommend(id);
              success(t('host.action.reEnable'), t('host.action.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              // failed(error?.response?.data?.message, t('host.action.fail'));
            } finally {
              loading.value = false;
            }
            break;
        }
      };

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

      onMounted(async () => {
        const result = await getList();
        processList(result, list, pageParam);
      });

      return {
        t,
        prefixCls,
        recommendConst,
        condition,
        columnsRecommend,
        loading,
        tip,
        pageSizeList,
        list,
        pageParam,
        onChange,
        addProject,
        onShowSizeChange,
        onClose,
        cityId,
        provinceId,
        isModal,
        projectInfo,
        failed,
        success,
        action,
        stateHandleChange,
        hasPermission,
        deleteOrEnable,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-recommend';
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
