// 友情链接管理页面

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <!-- 省市区筛选 -->
    <FCascader @change="locationChange" :class="`${prefixCls}-select`" />
    <!-- 状态筛选 -->
    <Select
      :class="`${prefixCls}-select`"
      ref="select"
      :allowClear="true"
      v-model:value="condition.state"
      style="width: 120px"
      @change="stateHandleChange"
      :options="linkConst.STATES"
      :pagination="false"
    />
    <!-- 标题筛选 -->
    <InputSearch
      :class="`${prefixCls}-select`"
      v-model:value="condition.title"
      placeholder="search title"
      style="width: 200px"
      @search="selectTitle"
      :allowClear="true"
    />
    <InputSearch
      :class="`${prefixCls}-select`"
      v-model:value="condition.page"
      placeholder="search page"
      style="width: 200px"
      @search="selectPage"
      :allowClear="true"
    />
    <!-- 添加链接 -->
    <Button :class="prefixCls" v-auth="linkConst._PERMS.ADD" @click="addLink">{{
      t('model.link.addLink')
    }}</Button>
    <Table :columns="columns" :data-source="list" rowKey="id" :pagination="false">
      <template #state="{ text: state }">
        <span>
          <Tag :color="linkConst.STATES[state].color">
            {{ linkConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #operation="{ text: link }">
        <!-- 操作下拉框 -->
        <Dropdown placement="bottomCenter" trigger="click">
          <Button type="link">{{ t('model.link.action') }}</Button>
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem :key="0" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button :class="prefixCls" v-auth="linkConst._PERMS.DELETE" type="link" size="small"
                  >{{ t('model.link.deleteLink') }}
                </Button>
              </MenuItem>
              <MenuItem :key="1" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="linkConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('model.link.reEnableLink') }}
                </Button>
              </MenuItem>
              <MenuItem :key="2" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="linkConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('model.link.updateLink') }}
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
      <LinkForm v-if="drawerParam.state === '0'" :id="drawerParam.id" />
    </Drawer>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { deleteLinks, getLinks, reEnableLinks } from '/@/api/sys/link/link';
  import { LinkModel, _Columns, _Const } from '/@/api/sys/link/model/linkModel';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import {
    Table,
    Pagination,
    Tag,
    Button,
    Dropdown,
    Menu,
    MenuItem,
    Select,
    Drawer,
    InputSearch,
  } from 'ant-design-vue';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Loading } from '/@/components/Loading';
  import FCascader from '/@/components/FCascader';
  import LinkForm from './components/LinkForm.vue';

  export default defineComponent({
    name: 'LinkTable',
    components: {
      Table,
      Pagination,
      Tag,
      Button,
      Select,
      Dropdown,
      Menu,
      MenuItem,
      Loading,
      FCascader,
      Drawer,
      LinkForm,
      InputSearch,
    },
    setup() {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('link');
      const linkConst = ref(_Const);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      const columns = reactive(_Columns);
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });
      const condition = reactive({
        state: '',
        title: '',
        page: '',
        provinceId: '',
        cityId: '',
        areaId: '',
      });
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
      });

      //根据状态筛选
      const stateHandleChange = async (value) => {
        condition.state = value;
        const result = await getList();
        processList(result);
      };

      const selectTitle = async (value) => {
        condition.title = value;
        const result = await getList();
        processList(result);
      };
      const selectPage = async (value) => {
        condition.page = value;
        const result = await getList();
        processList(result);
      };
      //省市区筛选
      const locationChange = async (e) => {
        condition.provinceId = e.value[0] || '';
        condition.cityId = e.value[1] || '';
        condition.areaId = e.value[2] || '';
        pageParam.number = 1;
        const result = await getList();
        processList(result);
      };

      const links: LinkModel[] = [];
      let list = reactive(links);

      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<LinkModel> | undefined;
        try {
          result = await getLinks(condition, {
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
      //加载
      onMounted(async () => {
        const result = await getList();
        processList(result);
      });
      // 操作
      const action = async (key) => {
        const code = key.key;
        const id = key?.item['data-id'] || undefined;
        switch (code) {
          case 0:
            // 删除
            try {
              loading.value = true;
              await deleteLinks(id);
              success(t('model.link.deleteLink'), t('model.link.success'));
              const result = await getList();
              processList(result);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('model.link.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 1:
            // 恢复
            try {
              loading.value = true;
              await reEnableLinks(id);
              success(t('model.link.reEnableLink'), t('model.link.success'));
              const result = await getList();
              processList(result);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('model.link.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 2:
            // 更新
            drawerParam.id = id;
            drawerParam.state = '0';
            drawerParam.visible = true;
            drawerParam.title = t('model.link.updateLink');
            break;
        }
      };

      const addLink = () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('model.link.addLink');
      };

      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        const result = await getList();
        processList(result);
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

      function processList(result: any) {
        if (!result) {
          return;
        }
        const { page, content } = result;
        list.splice(0);
        content.forEach((link) => {
          list.push(link);
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

      return {
        t,
        prefixCls,
        linkConst,
        tip,
        columns,
        condition,
        action,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        loading,
        pageSizeList,
        pageParam,
        list,
        stateHandleChange,
        selectTitle,
        selectPage,
        onChange,
        onShowSizeChange,
        locationChange,
        drawerParam,
        addLink,
        onClose,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-link';
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
