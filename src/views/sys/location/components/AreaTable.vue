// 省市区信息管理页面

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <Table :columns="areaColumns" :data-source="list" rowKey="id" size="small">
      <template #state="{ text: state }">
        <span>
          <Tag :color="areaConst.STATES[state].color">
            {{ areaConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #action="{ text: area }">
        <!-- 操作下拉框 -->
        <Dropdown placement="bottomCenter" trigger="click">
          <Button type="link">{{ t('model.location.area.action') }}</Button>
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem :key="0" :data-id="area.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button :class="prefixCls" v-auth="areaConst._PERMS.DELETE" type="link" size="small"
                  >{{ t('model.location.area.deleteArea') }}
                </Button>
              </MenuItem>
              <MenuItem :key="1" :data-id="area.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="areaConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('model.location.area.recoveryArea') }}
                </Button>
              </MenuItem>
              <MenuItem :key="2" :data-id="area.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="areaConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('model.location.area.updateArea') }}
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
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getAreas, deleteArea, reEnableArea } from '/@/api/sys/area/area';
  import { AreaConst, AreaColumns, AreaModel } from '/@/api/sys/area/model/areaModel';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Table, Pagination, Tag, Button, Dropdown, Menu, MenuItem } from 'ant-design-vue';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Loading } from '/@/components/Loading';
  export default defineComponent({
    name: 'AreaTable',
    components: {
      Table,
      Pagination,
      Tag,
      Button,
      Dropdown,
      Menu,
      MenuItem,
      Loading,
    },
    props: {
      cityId: {
        type: String,
        require: true,
      },
    },
    emits: ['onUpdateArea'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('location');
      const areaConst = ref(AreaConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const formRef = ref();
      const rules = reactive(AreaConst._RULES);
      const pageSizeList = ref<string[]>(PageSizeList);
      const areaColumns = reactive(AreaColumns);
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });
      const formState: UnwrapRef<AreaModel> = reactive({
        id: '',
        name: '',
        cityId: '',
        state: '',
      });
      const condition = reactive({
        state: '',
        id: props.cityId,
      });

      const areaModels: AreaModel[] = [];
      let list = reactive(areaModels);

      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<AreaModel> | undefined;
        try {
          result = await getAreas(condition, {
            pageSize: pageParam.size,
            pageNum: pageParam.number,
          });
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
      onMounted(async () => {
        loading.value = true;
        const result = await getList();
        processList(result);
        loading.value = false;
      });

      function processList(result: any) {
        if (!result) {
          return;
        }
        const { page, content } = result;
        list.splice(0);
        content.forEach((company) => {
          list.push(company);
        });
        page.number = page.number + 1;
        Object.assign(pageParam, {}, page);
      }

      // 操作
      const action = async (key) => {
        const code = key.key;
        const id = key?.item['data-id'] || undefined;
        switch (code) {
          case 0:
            // 删除
            try {
              loading.value = true;
              const area: AreaModel = { id: id };
              await deleteArea(area);
              success(t('model.location.area.deleteArea'), t('model.location.area.success'));
              const result = await getList();
              processList(result);
            } catch (error) {
              failed(error?.response?.data?.message, t('model.location.area.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 1:
            // 恢复
            try {
              loading.value = true;
              const area: AreaModel = { id: id };
              await reEnableArea(area);
              success(t('model.location.area.recoveryArea'), t('model.location.area.success'));
              const result = await getList();
              processList(result);
            } catch (error) {
              failed(error?.response?.data?.message, t('model.location.area.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 2:
            updateArea(id);
            break;
        }
      };
      //更新地区
      const updateArea = (areaId) => {
        emit('onUpdateArea', { areaId });
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
      //刷新列表
      const refresh = async () => {
        const result = await getList();
        processList(result);
      };
      return {
        t,
        prefixCls,
        areaConst,
        tip,
        rules,
        formRef,
        areaColumns,
        loading,
        pageSizeList,
        pageParam,
        list,
        onChange,
        onShowSizeChange,
        action,
        deleteArea,
        formState,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        refresh,
      };
    },
  });
</script>
