<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <Tabs v-model:activeKey="activeKey">
      <TabPane key="1" tab="城市" v-auth="cityConst._PERMS.SELECT">
        <Button @click="clickCity" v-auth="cityConst._PERMS.ADD">添加</Button>
        <Table
          :columns="columnsCity"
          :data-source="cityList"
          rowKey="id"
          :pagination="cityPagination"
          @change="handleCityTableChange"
        >
          <template #purpose="{ text: purpose }">
            <span v-if="purpose - 1 > -1">
              <Tag :color="cityConst.PURPOSES[purpose - 1].color">
                {{ cityConst.PURPOSES[purpose - 1].label }}
              </Tag>
            </span>
          </template>
          <template #projectsByIntention="{ text: projectsByIntention }">
            <span v-if="projectsByIntention && projectsByIntention.length > 0">
              <span v-for="i in projectsByIntention" :key="i">
                <Tag color="blue">
                  {{ i.name }}
                </Tag>
              </span>
            </span>
          </template>
          <template #gender="{ text: gender }">
            <span>
              <Tag :color="cityConst.GENDER[gender].color">
                {{ cityConst.GENDER[gender].label }}
              </Tag>
            </span>
          </template>
          <template #state="{ text: state }">
            <span>
              <Tag :color="cityConst.STATES[state].color">
                {{ cityConst.STATES[state].label }}
              </Tag>
            </span>
          </template>
          <template #operation="{ text: line }">
            <Button @click="seeCity(line)">查看</Button>
          </template>
        </Table>
      </TabPane>
      <TabPane key="2" tab="公司" v-auth="companyConst._PERMS.SELECT">
        <Button @click="clickCompany" v-auth="companyConst._PERMS.ADD">添加</Button>
        <Table
          :columns="columnsCompany"
          :data-source="companyList"
          rowKey="id"
          :pagination="companyPagination"
          @change="handleCompanyTableChange"
        >
          <template #purpose="{ text: purpose }">
            <span v-if="purpose - 1 > -1">
              <Tag :color="companyConst.PURPOSES[purpose - 1].color">
                {{ companyConst.PURPOSES[purpose - 1].label }}
              </Tag>
            </span>
          </template>
          <template #projectsByIntention="{ text: projectsByIntention }">
            <span v-if="projectsByIntention && projectsByIntention.length > 0">
              <span v-for="i in projectsByIntention" :key="i">
                <Tag color="blue">
                  {{ i.name }}
                </Tag>
              </span>
            </span>
          </template>
          <template #gender="{ text: gender }">
            <span>
              <Tag :color="companyConst.GENDER[gender].color">
                {{ companyConst.GENDER[gender].label }}
              </Tag>
            </span>
          </template>
          <template #state="{ text: state }">
            <span>
              <Tag :color="companyConst.STATES[state].color">
                {{ companyConst.STATES[state].label }}
              </Tag>
            </span>
          </template>
          <template #operation="{ text: line }">
            <Button @click="seeCompany(line)">查看</Button>
          </template>
        </Table>
      </TabPane>
      <TabPane key="3" tab="小组" v-auth="groupConst._PERMS.SELECT">
        <Button @click="clickGroup" v-auth="groupConst._PERMS.ADD">添加</Button>
        <Table
          :columns="columnsGroup"
          :data-source="groupList"
          rowKey="id"
          :pagination="groupPagination"
          @change="handleGroupTableChange"
        >
          <template #purpose="{ text: purpose }">
            <span v-if="purpose - 1 > -1">
              <Tag :color="groupConst.PURPOSES[purpose - 1].color">
                {{ groupConst.PURPOSES[purpose - 1].label }}
              </Tag>
            </span>
          </template>
          <template #projectsByIntention="{ text: projectsByIntention }">
            <span v-if="projectsByIntention && projectsByIntention.length > 0">
              <span v-for="i in projectsByIntention" :key="i">
                <Tag color="blue">
                  {{ i.name }}
                </Tag>
              </span>
            </span>
          </template>
          <template #gender="{ text: gender }">
            <span>
              <Tag :color="groupConst.GENDER[gender].color">
                {{ groupConst.GENDER[gender].label }}
              </Tag>
            </span>
          </template>
          <template #state="{ text: state }">
            <span>
              <Tag :color="groupConst.STATES[state].color">
                {{ groupConst.STATES[state].label }}
              </Tag>
            </span>
          </template>
          <template #operation="{ text: line }">
            <Button @click="seeGroup(line)">查看</Button>
          </template>
        </Table>
      </TabPane>
      <TabPane key="4" tab="个人" v-auth="privateConst._PERMS.SELECT">
        <Button @click="clickPrivate" v-auth="privateConst._PERMS.ADD">添加</Button>
        <Table
          :columns="columnsPrivate"
          :data-source="privateList"
          rowKey="id"
          :pagination="privatePagination"
          @change="handlePrivateTableChange"
        >
          <template #purpose="{ text: purpose }">
            <span v-if="purpose - 1 > -1">
              <Tag :color="privateConst.PURPOSES[purpose - 1].color">
                {{ privateConst.PURPOSES[purpose - 1].label }}
              </Tag>
            </span>
          </template>
          <template #projectsByIntention="{ text: projectsByIntention }">
            <span v-if="projectsByIntention && projectsByIntention.length > 0">
              <span v-for="i in projectsByIntention" :key="i">
                <Tag color="blue">
                  {{ i.name }}
                </Tag>
              </span>
            </span>
          </template>
          <template #gender="{ text: gender }">
            <span>
              <Tag :color="privateConst.GENDER[gender].color">
                {{ privateConst.GENDER[gender].label }}
              </Tag>
            </span>
          </template>
          <template #state="{ text: state }">
            <span>
              <Tag :color="privateConst.STATES[state].color">
                {{ privateConst.STATES[state].label }}
              </Tag>
            </span>
          </template>
          <template #operation="{ text: line }">
            <Button @click="seePrivate(line)">查看</Button>
          </template>
        </Table>
      </TabPane>
    </Tabs>
    <Modal
      v-model:visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width="70%"
      :bodyStyle="{ overflowY: 'auto', margin: '16px', height: '700px' }"
      :destroyOnClose="true"
      :footer="null"
    >
      <CityForm v-if="drawerParam.state === '0'" :id="drawerParam.id" />
      <CompanyForm v-if="drawerParam.state === '1'" :id="drawerParam.id" />
      <GroupForm v-if="drawerParam.state === '2'" :id="drawerParam.id" />
      <PrivateForm v-if="drawerParam.state === '3'" :id="drawerParam.id" />
      <SelectDetail
        v-if="drawerParam.state === '4'"
        :cityId="drawerParam.cityId"
        :companyId="drawerParam.companyId"
        :groupId="drawerParam.groupId"
        :privateId="drawerParam.privateId"
      />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Loading } from '/@/components/Loading';
  import {
    CityModel,
    CityConst,
    _ColumnsCity as columnsCity,
  } from '/@/api/customer/crmCity/model/CityModel';
  import { getByCity } from '/@/api/customer/crmCity/city';
  import { BasePageResult, PageParam } from '/@/api/model/baseModel';
  import { processListByLine } from '/@/hooks/web/useList';
  import { Tabs, TabPane, Table, Tag, Button, Modal } from 'ant-design-vue';
  import CityForm from './components/CityForm.vue';
  import {
    CompanyModel,
    _ColumnsCompany as columnsCompany,
    CompanyConst,
  } from '/@/api/customer/crmCompany/model/companyModel';
  import { getByCompany } from '/@/api/customer/crmCompany/company';
  import CompanyForm from './components/CompanyForm.vue';
  import {
    GroupModel,
    GroupConst,
    _ColumnsGroup as columnsGroup,
  } from '/@/api/customer/crmGroup/model/groupModel';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getByGroup } from '/@/api/customer/crmGroup/group';
  import GroupForm from './components/GroupForm.vue';
  import {
    PrivateConst,
    PrivateModel,
    _ColumnsPrivate as columnsPrivate,
  } from '/@/api/customer/crmPrivate/model/PrivateModel';
  import { getByPrivate } from '/@/api/customer/crmPrivate/private';
  import PrivateForm from './components/PrivateForm.vue';
  // import SelectDetail from './components/SelectDetail.vue';
  import SelectDetail from './components/SelectDetail.vue';

  export default defineComponent({
    name: 'Customer',
    components: {
      Loading,
      Tabs,
      TabPane,
      Table,
      Tag,
      Button,
      Modal,
      CityForm,
      CompanyForm,
      GroupForm,
      PrivateForm,
      SelectDetail,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('customer');
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      let activeKey = ref('1');
      const cityConst = ref(CityConst);
      const companyConst = ref(CompanyConst);
      const groupConst = ref(GroupConst);
      const privateConst = ref(PrivateConst);

      watch(
        () => activeKey.value,
        async (_v1, _v2) => {
          let result;
          if (activeKey.value === '1') {
            cityPage.pageNum = 1;
            result = await getCityList();
            processListByLine(result, cityList, cityTotal);
          } else if (activeKey.value === '2') {
            companyPage.pageNum = 1;
            result = await getCompanyList();
            processListByLine(result, companyList, companyTotal);
          } else if (activeKey.value === '3') {
            groupPage.pageNum = 1;
            result = await getGroupList();
            await processListByLine(result, groupList, groupTotal);
          } else if (activeKey.value === '4') {
            privatePage.pageNum = 1;
            result = await getPrivateList();
            await processListByLine(result, privateList, privateTotal);
          }
        }
      );

      const seeCity = (line) => {
        // drawerParam.title = '查看城市';
        // drawerParam.state = '0';
        // drawerParam.visible = true;
        // drawerParam.id = line.id;
        drawerParam.title = '查看城市';
        drawerParam.visible = true;
        drawerParam.state = '4';
        drawerParam.cityId = line.id;
      };

      const seeCompany = (line) => {
        // drawerParam.title = '查看公司';
        // drawerParam.state = '1';
        // drawerParam.visible = true;
        // drawerParam.id = line.id;
        drawerParam.title = '查看公司';
        drawerParam.visible = true;
        drawerParam.state = '4';
        drawerParam.companyId = line.id;
      };

      const seeGroup = (line) => {
        // drawerParam.title = '查看小组';
        // drawerParam.state = '2';
        // drawerParam.visible = true;
        // drawerParam.id = line.id;
        drawerParam.title = '查看小组';
        drawerParam.visible = true;
        drawerParam.state = '4';
        drawerParam.groupId = line.id;
      };

      const seePrivate = (line) => {
        // drawerParam.title = '查看个人';
        // drawerParam.state = '3';
        // drawerParam.visible = true;
        // drawerParam.id = line.id;
        drawerParam.title = '查看个人';
        drawerParam.visible = true;
        drawerParam.state = '4';
        drawerParam.privateId = line.id;
      };

      // model
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
        cityId: '',
        companyId: '',
        groupId: '',
        privateId: '',
      });

      const onClose = async () => {
        drawerParam.state = '';
        drawerParam.title = '';
        drawerParam.id = '';
        drawerParam.cityId = '';
        drawerParam.companyId = '';
        drawerParam.groupId = '';
        drawerParam.privateId = '';
        drawerParam.visible = false;
        let result;
        if (activeKey.value === '1') {
          cityPage.pageNum = 1;
          result = await getCityList();
          processListByLine(result, cityList, cityTotal);
        } else if (activeKey.value === '2') {
          companyPage.pageNum = 1;
          result = await getCompanyList();
          processListByLine(result, companyList, companyTotal);
        } else if (activeKey.value === '3') {
          groupPage.pageNum = 1;
          result = await getGroupList();
          await processListByLine(result, groupList, groupTotal);
        } else if (activeKey.value === '4') {
          privatePage.pageNum = 1;
          result = await getPrivateList();
          await processListByLine(result, privateList, privateTotal);
        }
      };

      // 添加城市
      const clickCity = () => {
        drawerParam.title = '添加城市';
        drawerParam.state = '0';
        drawerParam.visible = true;
      };

      const cityCondition = reactive({
        mobile: '',
        liveIn: '',
        workIn: '',
        intentionProvince: '',
        intentionCity: '',
        intentionArea: '',
        intentionProject: '',
        purpose: '',
        demand: '',
        source: '',
        buyIntentionRange: 0,
      });
      // 城市分页
      const cityPage: PageParam = {
        pageNum: 1,
        pageSize: 10,
      };
      const cityTotal = ref<number>(0);
      const cityPagination = computed(() => ({
        total: cityTotal.value,
        current: cityPage.pageNum,
        pageSize: cityPage.pageSize,
      }));
      const handleCityTableChange = async (pag: any) => {
        cityPage.pageSize = pag!.pageSize!;
        cityPage.pageNum = pag?.current;
        const result = await getCityList();
        await processListByLine(result, cityList, cityTotal);
      };

      const cityResult: CityModel[] = [];
      let cityList = reactive(cityResult);
      // 城市列表
      const getCityList = async () => {
        loading.value = true;
        let result: BasePageResult<CityModel> | undefined;
        try {
          result = await getByCity(cityCondition, cityPage);
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

      // 添加企业
      const clickCompany = () => {
        drawerParam.title = '添加企业';
        drawerParam.state = '1';
        drawerParam.visible = true;
      };

      // 企业
      const companyCondition = reactive({
        mobile: '',
        liveIn: '',
        workIn: '',
        intentionProvince: '',
        intentionCity: '',
        intentionArea: '',
        intentionProject: '',
        purpose: '',
        demand: '',
        source: '',
        buyIntentionRange: 0,
        companyId: '',
      });
      // 企业分页
      const companyPage: PageParam = {
        pageNum: 1,
        pageSize: 10,
      };
      const companyTotal = ref<number>(0);
      const companyPagination = computed(() => ({
        total: companyTotal.value,
        current: companyPage.pageNum,
        pageSize: companyPage.pageSize,
      }));
      const handleCompanyTableChange = async (pag: any) => {
        companyPage.pageSize = pag!.pageSize!;
        companyPage.pageNum = pag?.current;
        const result = await getCityList();
        await processListByLine(result, cityList, cityTotal);
      };
      // 获取企业列表
      const companyResult: CompanyModel[] = [];
      let companyList = reactive(companyResult);
      const getCompanyList = async () => {
        loading.value = true;
        let result: BasePageResult<CompanyModel> | undefined;
        try {
          result = await getByCompany(companyCondition, cityPage);
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

      // 添加小组
      const clickGroup = () => {
        drawerParam.title = '添加小组';
        drawerParam.state = '2';
        drawerParam.visible = true;
      };

      // 小组筛选条件
      const groupCondition = reactive({
        mobile: '',
        liveIn: '',
        workIn: '',
        intentionProvince: '',
        intentionCity: '',
        intentionArea: '',
        intentionProject: '',
        purpose: '',
        demand: '',
        source: '',
        buyIntentionRange: 0,
        companyId: '',
        groupId: '',
      });

      // 小组分页
      const groupPage: PageParam = {
        pageNum: 1,
        pageSize: 10,
      };
      const groupTotal = ref<number>(0);
      const groupPagination = computed(() => ({
        total: groupTotal.value,
        current: groupPage.pageNum,
        pageSize: groupPage.pageSize,
      }));
      const handleGroupTableChange = async (pag: any) => {
        groupPage.pageSize = pag!.pageSize!;
        groupPage.pageNum = pag?.current;
        const result = await getGroupList();
        await processListByLine(result, groupList, groupTotal);
      };

      // 小组列表
      const groupResult: GroupModel[] = [];
      let groupList = reactive(groupResult);

      const getGroupList = async () => {
        loading.value = true;
        let result: BasePageResult<CompanyModel> | undefined;
        try {
          result = await getByGroup(groupCondition, groupPage);
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

      // 添加个人
      const clickPrivate = () => {
        drawerParam.title = '添加个人';
        drawerParam.state = '3';
        drawerParam.visible = true;
      };

      // 个人
      const privateCondition = reactive({
        mobile: '',
        liveIn: '',
        workIn: '',
        intentionProvince: '',
        intentionCity: '',
        intentionArea: '',
        intentionProject: '',
        purpose: '',
        demand: '',
        source: '',
        buyIntentionRange: undefined,
        companyId: '',
        groupId: '',
        // crmSaleCustomerRelationsById: {
        //   saleId: '',
        //   customerId: '',
        //   isOwner: '',
        //   saleName: '',
        // },
      });
      // 个人分页
      const privatePage: PageParam = {
        pageNum: 1,
        pageSize: 10,
      };
      const privateTotal = ref<number>(0);
      const privatePagination = computed(() => ({
        total: privateTotal.value,
        current: privatePage.pageNum,
        pageSize: privatePage.pageSize,
      }));
      const handlePrivateTableChange = async (pag: any) => {
        privatePage.pageSize = pag!.pageSize!;
        privatePage.pageNum = pag?.current;
        const result = await getPrivateList();
        await processListByLine(result, privateList, privateTotal);
      };
      const sortParam = reactive({
        desc: [''],
        asc: [''],
      });
      // 个人列表
      const privateResult: PrivateModel[] = [];
      let privateList = reactive(privateResult);

      const getPrivateList = async () => {
        loading.value = true;
        let result: BasePageResult<PrivateModel> | undefined;
        try {
          result = await getByPrivate(privateCondition, privatePage, sortParam);
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

      //页面初始化加载
      const { hasPermission } = usePermission();
      onMounted(async () => {
        let result;
        if (hasPermission(cityConst.value._PERMS.SELECT)) {
          activeKey.value = '1';
          result = await getCityList();
          processListByLine(result, cityList, cityTotal);
        } else if (hasPermission(companyConst.value._PERMS.SELECT)) {
          activeKey.value = '2';
          result = await getCompanyList();
          processListByLine(result, companyList, companyTotal);
        } else if (hasPermission(groupConst.value._PERMS.SELECT)) {
          activeKey.value = '3';
          result = await getGroupList();
          await processListByLine(result, groupList, groupTotal);
        } else if (hasPermission(privateConst.value._PERMS.SELECT)) {
          activeKey.value = '4';
          result = await getPrivateList();
          await processListByLine(result, privateList, privateTotal);
        }
      });

      return {
        t,
        prefixCls,
        loading,
        tip,
        cityCondition,
        cityList,
        cityPage,
        cityTotal,
        activeKey,
        cityConst,
        columnsCity,
        handleCityTableChange,
        cityPagination,
        cityResult,
        drawerParam,
        onClose,
        clickCity,
        companyConst,
        columnsCompany,
        companyCondition,
        companyPage,
        companyTotal,
        companyPagination,
        handleCompanyTableChange,
        companyList,
        getCompanyList,
        clickCompany,
        columnsGroup,
        groupConst,
        groupList,
        groupCondition,
        groupPage,
        groupTotal,
        groupPagination,
        handleGroupTableChange,
        clickGroup,
        privateCondition,
        privatePage,
        privateTotal,
        privatePagination,
        handlePrivateTableChange,
        privateConst,
        clickPrivate,
        columnsPrivate,
        privateList,
        seeCity,
        seeCompany,
        seeGroup,
        seePrivate,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-customer';
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
