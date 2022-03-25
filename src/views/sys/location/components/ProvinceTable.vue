// 省市区信息管理页面

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <Select
      :class="`${prefixCls}-select`"
      ref="select"
      :allowClear="true"
      v-model:value="condition.state"
      style="width: 120px"
      @change="stateHandleChange"
      :options="provinceConst.STATES"
      :pagination="false"
    />
    <Button v-auth="provinceConst._PERMS.ADD" @click="addProvince" :class="`${prefixCls}-select`">
      {{ t('model.location.province.addProvince') }}</Button
    >
    <Table :columns="provinceColumns" :data-source="list" rowKey="id">
      <template #state="{ text: state }">
        <span>
          <Tag :color="provinceConst.STATES[state].color">
            {{ provinceConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #action="{ text: province }">
        <!-- 操作下拉框 -->
        <Dropdown placement="bottomCenter" trigger="click">
          <Button
            v-if="
              hasPermission([
                provinceConst._PERMS.DELETE,
                provinceConst._PERMS.UPDATE,
                provinceConst._PERMS.ADD,
              ])
            "
            type="link"
            >{{ t('model.location.province.action') }}</Button
          >
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem
                v-if="hasPermission(provinceConst._PERMS.DELETE) && deleteOrEnable(province.state)"
                :key="0"
                :data-id="province.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  :class="prefixCls"
                  v-auth="provinceConst._PERMS.DELETE"
                  type="link"
                  size="small"
                  >{{ t('model.location.province.deleteProvince') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="hasPermission(provinceConst._PERMS.UPDATE) && !deleteOrEnable(province.state)"
                :key="1"
                :data-id="province.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  v-auth="provinceConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('model.location.province.recoveryProvince') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="hasPermission(provinceConst._PERMS.ADD)"
                :key="2"
                :data-id="province.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  v-auth="provinceConst._PERMS.ADD"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('model.location.city.addCity') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="hasPermission(provinceConst._PERMS.UPDATE)"
                :key="3"
                :data-id="province.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  v-auth="provinceConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('model.location.province.updateProvince') }}
                </Button>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </template>
      <template #expandedRowRender="{ record }">
        <slot :name="'province'" :province="record"></slot>
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
  import { getProvinces, deleteProvince, reEnableProvince } from '/@/api/sys/province/province';
  import {
    ProvinceConst,
    ProvinceColumns,
    ProvinceModel,
  } from '/@/api/sys/province/model/provinceModel';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { Table, Pagination, Tag, Button, Dropdown, Menu, MenuItem, Select } from 'ant-design-vue';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Loading } from '/@/components/Loading';
  import { processList, success, failed } from '/@/hooks/web/useList';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { deleteOrEnable } from '/@/hooks/web/useButton';

  export default defineComponent({
    name: 'ProvinceTable',
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
    },
    props: {},
    emits: ['onAddCity', 'onUpdateProvince', 'onAddProvince'],
    setup(_props, { emit }) {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('location');
      const provinceConst = ref(ProvinceConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      // 判断权限
      const { hasPermission } = usePermission();
      const pageSizeList = ref<string[]>(PageSizeList);
      //列
      const provinceColumns = reactive(ProvinceColumns);
      //分页
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });
      //加载条件
      const condition = reactive({ state: '1' });
      //根据状态筛选
      const stateHandleChange = async (value) => {
        condition.state = value;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      const provinces: ProvinceModel[] = [];
      let list = reactive(provinces);
      //获取数据
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<ProvinceModel> | undefined;
        try {
          result = await getProvinces(condition, {
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
      //初始加载
      onMounted(async () => {
        const result = await getList();
        processList(result, list, pageParam);
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
              const province: ProvinceModel = { id: id };
              await deleteProvince(province);
              success(
                t('model.location.province.deleteProvince'),
                t('model.location.province.success')
              );
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('model.location.province.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 1:
            // 恢复
            try {
              loading.value = true;
              const province: ProvinceModel = { id: id };
              await reEnableProvince(province);
              success(
                t('model.location.province.recoveryProvince'),
                t('model.location.province.success')
              );
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('model.location.province.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 2:
            // 添加
            addCity(id);
            break;
          case 3:
            // 更新城市
            updateProvince(id);
            break;
        }
      };

      //页码改变
      const onChange = async (page) => {
        pageParam.number = page;
        const result = await getList();
        processList(result, list, pageParam);
      };
      //条数改变
      const onShowSizeChange = async (current, size) => {
        console.log(current);
        pageParam.size = size;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };
      //添加省
      const addProvince = () => {
        emit('onAddProvince');
      };
      // addCity
      const addCity = (provinceId) => {
        emit('onAddCity', { provinceId });
      };
      // updateProvince
      const updateProvince = (provinceId) => {
        emit('onUpdateProvince', { provinceId });
      };
      // refresh list
      const refresh = async () => {
        const result = await getList();
        processList(result, list, pageParam);
      };
      return {
        t,
        prefixCls,
        provinceConst,
        tip,
        provinceColumns,
        condition,
        action,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        loading,
        pageSizeList,
        pageParam,
        list,
        stateHandleChange,
        onChange,
        onShowSizeChange,
        refresh,
        addProvince,
        hasPermission,
        deleteOrEnable,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-location';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;
    }
  }

  .@{prefix-cls} {
    &-select {
      margin-top: 20px;
      margin-right: 10px;
      margin-bottom: 20px;
    }
  }
</style>
