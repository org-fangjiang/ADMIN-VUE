// 项目信息管理

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
      :options="hostConst.STATES"
      :pagination="false"
    />
    <!-- 根据名称筛选 -->
    <FProjectSelect @setProject="setProject" @onClear="onClear" :class="`${prefixCls}-add`" />
    <!-- 添加 -->
    <Button :class="`${prefixCls}-add`" v-auth="hostConst._PERMS.ADD" @click="addProject">
      {{ t('host.action.add') }}</Button
    >
    <Table
      :columns="columns"
      :data-source="list"
      rowKey="id"
      :pagination="false"
      @change="sortChange"
    >
      <template #state="{ text: state }">
        <span>
          <Tag :color="hostConst.STATES[state].color">
            {{ hostConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #type="{ text: type }">
        <span>
          <Tag :color="hostConst.TYPES[type - 1].color">
            {{ hostConst.TYPES[type - 1].label }}
          </Tag>
        </span>
      </template>
      <template #price="{ record }">
        <span @dblclick="clickPrice(record)">{{ record.price }}</span>
      </template>
      <template #createTime="{ text: createTime }">
        <span>{{ createTime.replace('T', ' ').replace('.000+08:00', '') }}</span>
      </template>
      <template #orderNum="{ text: orderNum }">
        <span>{{ orderNum }}</span>
      </template>
      <template #operation="{ text: link }">
        <Button
          v-auth="hostConst._PERMS.UPDATE"
          type="link"
          size="small"
          :class="prefixCls"
          @click="clickUpdate(link)"
        >
          {{ t('host.action.update') }}
        </Button>
        <Button
          v-auth="reportRuleConst._PERMS.SELECT"
          type="link"
          size="small"
          :class="prefixCls"
          @click="clickRule(link)"
        >
          {{ t('host.projectRule') }}
        </Button>
        <Button
          v-auth="reportRuleConst._PERMS.SELECT"
          type="link"
          size="small"
          :class="prefixCls"
          @click="clickChannel(link)"
        >
          {{ t('host.projectChannel') }}
        </Button>
        <!-- 操作下拉框 -->
        <Dropdown placement="bottomCenter" trigger="click">
          <Button type="link">{{ t('host.operation') }}</Button>
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem :key="11" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button :class="prefixCls" v-auth="hostConst._PERMS.MANAGE" type="link" size="small"
                  >{{ t('host.action.manageHouse') }}
                </Button>
              </MenuItem>
              <MenuItem :key="0" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button :class="prefixCls" v-auth="hostConst._PERMS.DELETE" type="link" size="small"
                  >{{ t('host.action.delete') }}
                </Button>
              </MenuItem>
              <MenuItem :key="1" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="hostConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.reEnable') }}
                </Button>
              </MenuItem>
              <MenuItem :key="3" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="hostConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.setResource') }}
                </Button>
              </MenuItem>
              <MenuItem :key="6" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="hostConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.setLicense') }}
                </Button>
              </MenuItem>
              <MenuItem :key="4" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="hostConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.setLayout') }}
                </Button>
              </MenuItem>
              <MenuItem :key="5" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="hostConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.setBuild') }}
                </Button>
              </MenuItem>
              <MenuItem :key="8" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="hostConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.setQuestion') }}
                </Button>
              </MenuItem>
              <MenuItem :key="7" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="hostConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.setDynamicNews') }}
                </Button>
              </MenuItem>
              <MenuItem :key="9" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="hostConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.setProjectOrder') }}
                </Button>
              </MenuItem>
              <MenuItem :key="10" :data-id="link.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="hostConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.clearProjectOrder') }}
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
      v-model:visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width="80%"
      :bodyStyle="{ overflow: 'auto', margin: '16px' }"
      :destroyOnClose="true"
      :footer="null"
      wrapClassName="full-modal"
      centered
    >
      <SourceTable
        v-if="drawerParam.state === '1'"
        :id="drawerParam.id"
        :provinceId="drawerParam.provinceId"
        :cityId="drawerParam.cityId"
        :areaId="drawerParam.areaId"
      />
      <LayoutTable v-if="drawerParam.state === '2'" :id="drawerParam.id" />
      <BuildTable
        v-if="drawerParam.state === '3'"
        :id="drawerParam.id"
        :provinceId="drawerParam.provinceId"
        :cityId="drawerParam.cityId"
        :areaId="drawerParam.areaId"
      />
      <LicenseTable
        v-if="drawerParam.state === '4'"
        :id="drawerParam.id"
        :provinceId="drawerParam.provinceId"
        :cityId="drawerParam.cityId"
        :areaId="drawerParam.areaId"
      />
      <DynamicNewsTable
        v-if="drawerParam.state === '5'"
        :id="drawerParam.id"
        :provinceId="drawerParam.provinceId"
        :cityId="drawerParam.cityId"
        :areaId="drawerParam.areaId"
      />
      <QuestionTable v-if="drawerParam.state === '6'" :id="drawerParam.id" />
    </Modal>
    <Modal
      :bodyStyle="{ overflow: 'auto', 'margin-top': '16px' }"
      :visible="smModal"
      :title="drawerParam.title"
      @cancel="onClose"
      width="50%"
      :footer="null"
      :destroyOnClose="true"
    >
      <PriceForm :priceInfo="priceInfo" v-if="updatePrice" />
      <OrderForm :id="drawerParam.id" v-if="updateOrder" />
      <RuleForm :id="drawerParam.id" v-if="drawerParam.setRule" />
      <ChannelForm :id="drawerParam.id" v-if="drawerParam.setChannel" />
      <ManageHouse :id="drawerParam.id" v-if="drawerParam.state === '11'" />
    </Modal>
    <Modal
      v-model:visible="projectModal"
      :title="drawerParam.title"
      @cancel="onClose"
      width="80%"
      :bodyStyle="{ overflowY: 'auto', margin: '16px', height: '700px' }"
      :destroyOnClose="true"
      :footer="null"
    >
      <ProjectForm v-if="drawerParam.state === '0'" :id="drawerParam.id" />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import ChannelForm from './components/ChannelForm.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
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
    Modal,
  } from 'ant-design-vue';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Loading } from '/@/components/Loading';
  import { HostModel, _ColumnsHost, _HostConst } from '/@/api/host/project/model/projectModel';
  import ProjectForm from './components/ProjectForm.vue';
  import SourceTable from './components/SourceTable.vue';
  import LayoutTable from './components/LayoutTable.vue';
  import BuildTable from './components/BuildTable.vue';
  import LicenseTable from './components/LicenseTable.vue';
  import DynamicNewsTable from './components/DynamicNewsTable.vue';
  import QuestionTable from './components/QuestionTable.vue';
  import {
    clearProjectOrder,
    deleteProject,
    getProject,
    reEnableProject,
    search,
    searchWithCondition,
  } from '/@/api/host/project/project';
  // 用户store
  import { useUserStore } from '/@/store/modules/user';
  import { Persistent } from '/@/utils/cache/persistent';
  import { HOUSE_PROJECT } from '/@/enums/cacheEnum';
  import FProjectSelect from '/@/components/FProjectSelect';
  import { processList, success, failed } from '/@/hooks/web/useList';
  import PriceForm from './components/PriceForm.vue';
  import OrderForm from './components/OrderForm.vue';
  import { ReportRuleConst } from '/@/api/host/reportRule/model/reportRuleModel';
  import RuleForm from './components/RuleForm.vue';
  import ManageHouse from './components/ManageHouse.vue';

  export default defineComponent({
    name: 'ProjectTable',
    components: {
      ManageHouse,
      ChannelForm,
      Table,
      Pagination,
      Tag,
      Button,
      Select,
      Dropdown,
      Menu,
      MenuItem,
      Loading,
      Modal,
      ProjectForm,
      SourceTable,
      LayoutTable,
      BuildTable,
      LicenseTable,
      DynamicNewsTable,
      QuestionTable,
      FProjectSelect,
      PriceForm,
      OrderForm,
      RuleForm,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');
      const hostConst = ref(_HostConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      const columns = reactive(_ColumnsHost);

      // 报备规则
      const reportRuleConst = ref(ReportRuleConst);

      //抽屉
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
        provinceId: '',
        cityId: '',
        areaId: '',
        setChannel: false,
        setRule: false,
      });
      //分页参数
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });

      //控制双击更新价格的modal
      let priceInfo = ref<Object>();
      let updatePrice = ref(false);
      let smModal = ref(false);
      const clickPrice = (record) => {
        updatePrice.value = true;
        priceInfo.value = record;
        smModal.value = true;
        drawerParam.title = '更新价格';
      };

      //根据名称筛选
      const setProject = async (value) => {
        loading.value = true;
        let result: BasePageResult<HostModel> | undefined;
        if (value) {
          condition.name = value.label;
          result = await search(condition);
        } else {
          result = await getList();
        }
        processList(result, list, pageParam);
        loading.value = false;
      };
      const onClear = async () => {
        loading.value = true;
        let result: BasePageResult<HostModel> | undefined;
        result = await searchWithCondition(condition, {
          pageSize: pageParam.size,
          pageNum: pageParam.number,
        });
        processList(result, list, pageParam);
        loading.value = false;
      };

      //根据状态筛选
      const stateHandleChange = async (value) => {
        condition.state = value;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      // 获取用户store
      const userStore = useUserStore();
      const cityId = userStore.getUserInfo.companyCityId;
      let provinceId = ref();

      //根据创建时间排序，默认降序
      let sortParam = reactive({
        asc: [] as any[],
        desc: ['createTime'],
      });
      const sortChange = async (pagination, filters, sorter) => {
        //打印可以分别得到上下箭头的数据
        console.log(pagination, filters, sorter);
        if (sorter.order === 'ascend') {
          if (sorter.columnKey === 'createTime') {
            sortParam.asc = ['createTime', 'orderNum'];
          }
          if (sorter.columnKey === 'orderNum') {
            sortParam.asc = ['orderNum', 'createTime'];
          }
          sortParam.desc = [];
        } else if (sorter.order === 'descend') {
          if (sorter.columnKey === 'createTime') {
            sortParam.desc = ['createTime', 'orderNumber'];
          }
          if (sorter.columnKey === 'orderNum') {
            sortParam.desc = ['orderNum', 'createTime'];
          }
          sortParam.asc = [];
        } else if (sorter.order === undefined) {
          sortParam.desc = [];
          sortParam.asc = [];
        }
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      //查询条件
      const condition = reactive({
        state: '1',
        name: '',
        provinceId: provinceId,
        cityId: cityId,
      });

      //初始加载
      onMounted(async () => {
        provinceId.value = ref<string>(userStore.getUserInfo.companyProvinceId || '');
        const result = await getList();
        processList(result, list, pageParam);
      });

      const projects: HostModel[] = [];
      let list = reactive(projects);
      //获取数据
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<HostModel> | undefined;
        try {
          result = await searchWithCondition(
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

      //控制添加更新项目的modal
      let projectModal = ref(false);
      //控制权重
      let updateOrder = ref(false);

      // 操作
      const action = async (key) => {
        const code = key.key;
        const id = key?.item['data-id'] || undefined;
        if (code != 0 && code != 1) {
          const { content } = await getProject(id);
          if (!content.sysAreaByAreaId) {
            content.sysAreaByAreaId = {};
          }
          if (!content.sysProvinceByProvinceId) {
            content.sysProvinceByProvinceId = {};
          }
          if (!content.sysCityByCityId) {
            content.sysCityByCityId = {};
          }
          drawerParam.provinceId = content.sysProvinceByProvinceId.id || '';
          drawerParam.cityId = content.sysCityByCityId.id || '';
          drawerParam.areaId = content.sysAreaByAreaId.id || '';
        }
        switch (code) {
          case 0:
            // 删除
            try {
              loading.value = true;
              await deleteProject(id);
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
              await reEnableProject(id);
              success(t('host.action.reEnable'), t('host.action.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('host.action.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 3:
            // 设置资源
            drawerParam.id = id;
            drawerParam.state = '1';
            drawerParam.visible = true;
            drawerParam.title = t('host.action.setResource');
            break;
          case 4:
            // 户型
            drawerParam.id = id;
            drawerParam.state = '2';
            drawerParam.visible = true;
            drawerParam.title = t('host.action.setLayout');
            break;
          case 5:
            // 户型
            drawerParam.id = id;
            drawerParam.state = '3';
            drawerParam.visible = true;
            drawerParam.title = t('host.action.setBuild');
            break;
          case 6:
            // 预售证
            drawerParam.id = id;
            drawerParam.state = '4';
            drawerParam.visible = true;
            drawerParam.title = t('host.action.setLicense');
            break;
          case 7:
            // 动态文章
            drawerParam.id = id;
            drawerParam.state = '5';
            drawerParam.visible = true;
            drawerParam.title = t('host.action.setDynamicNews');
            break;
          case 8:
            // 动态文章
            drawerParam.id = id;
            drawerParam.state = '6';
            drawerParam.visible = true;
            drawerParam.title = t('host.action.setQuestion');
            break;
          case 9:
            // 设置权重
            drawerParam.title = t('host.action.setProjectOrder');
            smModal.value = true;
            drawerParam.id = id;
            updateOrder.value = true;
            break;
          case 10:
            // 取消权重
            try {
              loading.value = true;
              await clearProjectOrder(id);
              success(t('host.action.clearProjectOrder'), t('host.action.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed(t('host.action.clearProjectOrder'), t('host.action.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 11:
            // 房源管理
            drawerParam.title = t('host.action.manageHouse');
            smModal.value = true;
            drawerParam.id = id;
            drawerParam.state = '11';
            break;
        }
      };

      // 更新
      const clickUpdate = (link) => {
        projectModal.value = true;
        drawerParam.id = link.id;
        drawerParam.state = '0';
        drawerParam.title = t('host.action.update');
      };
      // 报备规则
      const clickRule = (line) => {
        drawerParam.title = '报备规则';
        smModal.value = true;
        drawerParam.setRule = true;
        drawerParam.id = line.id;
      };

      // 渠道
      const clickChannel = (line) => {
        drawerParam.title = '渠道信息';
        drawerParam.setChannel = true;
        drawerParam.id = line.id;
        smModal.value = true;
      };

      //新增项目，打开modal
      const addProject = () => {
        projectModal.value = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('host.action.add');
      };
      //关闭modal，清空数据
      const onClose = async () => {
        if (drawerParam.id != '') {
          Persistent.removeLocal(HOUSE_PROJECT, true);
        }
        drawerParam.visible = false;
        drawerParam.setChannel = false;
        drawerParam.setRule = false;

        drawerParam.id = '';
        drawerParam.title = '';
        updatePrice.value = false;
        projectModal.value = false;
        smModal.value = false;
        if (drawerParam.state === '0' || updateOrder) {
          drawerParam.state = '';
          updateOrder.value = false;
          const result = await getList();
          processList(result, list, pageParam);
        } else {
          drawerParam.state = '';
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

      return {
        clickRule,
        reportRuleConst,
        clickUpdate,
        t,
        prefixCls,
        hostConst,
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
        onChange,
        onShowSizeChange,
        drawerParam,
        addProject,
        onClose,
        provinceId,
        setProject,
        onClear,
        sortChange,
        sortParam,
        clickPrice,
        priceInfo,
        updatePrice,
        projectModal,
        smModal,
        updateOrder,
        clickChannel,
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
    height: calc(100vh);

    .ant-modal-content {
      display: flex;
      flex-direction: column;
    }

    .ant-modal-body {
      flex: 1;
    }
  }
</style>
