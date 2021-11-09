//热门楼盘
<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
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
          <Button type="link">{{ t('host.operation') }}</Button>
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem
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
    Table,
    Pagination,
    Tag,
    Button,
    Dropdown,
    notification,
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

  export default defineComponent({
    name: 'RecommendTable',
    components: {
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

      let isModal = ref<boolean>(false);
      const addProject = () => {
        isModal.value = true;
      };
      const onClose = async () => {
        isModal.value = false;
        const result = await getList();
        processList(result);
      };

      // 分页
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });
      // const options = ref<Option[]>([]);
      const cityId = userStore.getUserInfo.companyCityId;
      const provinceId = userStore.getUserInfo.companyProvinceId;
      // 筛选条件
      const condition = reactive({
        state: '',
        provinceId: provinceId || '',
        id: '',
        projectName: '',
        cityId: cityId || '',
      });

      const recommend: RecommendModel[] = [];
      // 列表结果
      let list = reactive(recommend);

      const projectInfo = async (value) => {
        try {
          loading.value = true;
          await addRecommend(value.id);
          success(t('host.action.add'), t('host.action.success'));
          const result = await getList();
          processList(result);
        } catch (error: any) {
          failed(error?.response?.data?.message, t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };

      // 操作
      const action = async (key) => {
        debugger;
        const code = key.key;
        const id = key?.item['data-id'] || undefined;
        debugger;
        switch (code) {
          case 0:
            // 删除
            try {
              loading.value = true;
              await deleteRecommend(id);
              success(t('host.action.delete'), t('host.action.success'));
              const result = await getList();
              processList(result);
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
              await reEnableRecommend(id);
              success(t('host.action.reEnable'), t('host.action.success'));
              const result = await getList();
              processList(result);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('host.action.fail'));
            } finally {
              loading.value = false;
            }
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

      function processList(result: any) {
        if (!result) {
          return;
        }
        const { page, content } = result;
        list.splice(0);
        content.forEach((line) => {
          list.push(line);
        });
        page.number = page.number + 1;
        Object.assign(pageParam, {}, page);
      }

      const onChange = async (page) => {
        pageParam.number = page;
        const result = await getList();
        processList(result);
      };
      const onShowSizeChange = async (current, size) => {
        console.log(current);
        pageParam.size = size;
        pageParam.number = 1;
        const result = await getList();
        processList(result);
      };

      onMounted(async () => {
        const result = await getList();
        processList(result);
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
