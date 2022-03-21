// 省市区信息管理页面

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <Table :columns="cityColumns" :data-source="list" rowKey="id" size="small" :pagination="false">
      <template #state="{ text: state }">
        <span>
          <Tag :color="cityConst.STATES[state].color">
            {{ cityConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #action="{ text: city }">
        <!-- 操作下拉框 -->
        <Dropdown placement="bottomCenter" trigger="click">
          <Button type="link">{{ t('model.location.city.action') }}</Button>
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem
                v-if="hasPermission(cityConst._PERMS.DELETE)"
                :key="0"
                :data-id="city.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button :class="prefixCls" v-auth="cityConst._PERMS.DELETE" type="link" size="small"
                  >{{ t('model.location.city.deleteCity') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="hasPermission(cityConst._PERMS.UPDATE)"
                :key="1"
                :data-id="city.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  v-auth="cityConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('model.location.city.recoveryCity') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="hasPermission(areaConst._PERMS.ADD)"
                :key="2"
                :data-id="city.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button v-auth="areaConst._PERMS.ADD" type="link" size="small" :class="prefixCls">
                  {{ t('model.location.area.addArea') }}
                </Button>
              </MenuItem>
              <MenuItem
                v-if="hasPermission(cityConst._PERMS.UPDATE)"
                :key="3"
                :data-id="city.id"
                :class="`${prefixCls}-action-menu-item`"
              >
                <template #icon></template>
                <Button
                  v-auth="cityConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('model.location.city.updateCity') }}
                </Button>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </template>
      <template #expandedRowRender="{ record }">
        <slot name="city" :city="record"></slot>
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
  import { getCities, deleteCity, reEnableCity, addCity } from '/@/api/sys/city/city';
  import { CityConst, CityColumns, CityModel } from '/@/api/sys/city/model/cityModel';
  import { AreaConst } from '/@/api/sys/area/model/areaModel';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Table, Pagination, Tag, Button, Dropdown, Menu, MenuItem } from 'ant-design-vue';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';
  import { Loading } from '/@/components/Loading';
  import { processList, success, failed } from '/@/hooks/web/useList';
  import { usePermission } from '/@/hooks/web/usePermission';

  export default defineComponent({
    name: 'CityTable',
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
      provinceId: {
        type: String,
        require: true,
      },
    },
    emits: ['onAddArea', 'onUpdateProvince'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('location');
      const cityConst = ref(CityConst);
      const areaConst = ref(AreaConst);
      // 判断权限
      const { hasPermission } = usePermission();
      //加载动画
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const formRef = ref();

      const formState: UnwrapRef<CityModel> = reactive({
        id: '',
        name: '',
        provinceId: '',
        firstLetter: '',
        state: '',
      });
      const pageSizeList = ref<string[]>(PageSizeList);
      //列
      const cityColumns = reactive(CityColumns);
      //分页
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });
      //获取数据参数
      const condition = reactive({
        id: props.provinceId,
        state: '',
      });

      const cities: CityModel[] = [];
      let list = reactive(cities);
      //获取数据
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<CityModel> | undefined;
        try {
          result = await getCities(condition, {
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
      //提交
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            try {
              const { content } = await addCity(formState);
              success(t('model.location.city.addCity'), t('model.location.city.success'));
              Object.assign(formState, content);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('model.location.city.fail'));
            } finally {
              loading.value = false;
            }
          })
          .catch((error: ValidateErrorEntity<CityModel>) => {
            console.log('error', error);
          });
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
              const city: CityModel = { id: id };
              await deleteCity(city);
              success(t('model.location.city.deleteCity'), t('model.location.city.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('model.location.city.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 1:
            // 恢复
            try {
              loading.value = true;
              const city: CityModel = { id: id };
              await reEnableCity(city);
              success(t('model.location.city.recoveryCity'), t('model.location.city.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('model.location.city.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 2:
            addArea(id);
            break;
          case 3:
            updateCity(id);
            break;
        }
      };

      //页码改变
      const onChange = async (page) => {
        pageParam.number = page;
        const result = await getList();
        processList(result, list, pageParam);
      };
      //每页条数修改
      const onShowSizeChange = async (current, size) => {
        console.log(current);
        pageParam.size = size;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };
      //添加地区
      const addArea = (cityId) => {
        emit('onAddArea', { cityId });
      };
      //更新城市
      const updateCity = (cityId) => {
        emit('onUpdateProvince', { cityId });
      };
      //刷新列表
      const refresh = async () => {
        const result = await getList();
        processList(result, list, pageParam);
      };
      return {
        t,
        prefixCls,
        cityConst,
        areaConst,
        tip,
        cityColumns,
        loading,
        pageSizeList,
        pageParam,
        list,
        onChange,
        onShowSizeChange,
        action,
        addArea,
        updateCity,
        onSubmit,
        formState,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        refresh,
        hasPermission,
      };
    },
  });
</script>
