<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <InputSearch
      :class="`${prefixCls}-select`"
      v-model:value="contactValue"
      placeholder="手机号"
      style="width: 200px"
      @search="contactSearch"
      @change="contactChange"
      :loading="loading"
      :allowClear="true"
    />
    <FCascader
      @change="liveInChange"
      class="mr-2"
      :class="`${prefixCls}-add`"
      placeholder="居住地"
    />
    <FCascader
      @change="workInChange"
      class="mr-2"
      :class="`${prefixCls}-add`"
      placeholder="工作地"
    />
    <FCascader
      @change="intentionChange"
      class="mr-2"
      :class="`${prefixCls}-add`"
      placeholder="意向地"
    />
    <!-- 意向楼盘 -->
    <FProjectSelect @setProject="setProject" @onClear="onClear" :class="`${prefixCls}-add`" />
    <!-- 购房用途 -->
    <Select
      :class="`${prefixCls}-add`"
      ref="select"
      :allowClear="true"
      style="width: 120px"
      @change="purposeChange"
      :options="cityConst.PURPOSES"
      :pagination="false"
      placeholder="购房用途"
    />
    <InputSearch
      :class="`${prefixCls}-select`"
      v-model:value="intentionRange"
      placeholder="意向强度"
      style="width: 200px"
      @search="intentionRangeSearch"
      :loading="loading"
      :allowClear="true"
    />
    <Tabs v-model:activeKey="activeKey">
      <TabPane
        key="1"
        tab="城市"
        v-auth="cityConst._PERMS.SELECT"
        v-if="hasPermission(cityConst._PERMS.SELECT)"
      >
        <Button @click="clickCity" v-auth="cityConst._PERMS.ADD">添加</Button>
        <Button @click="distributeMul" v-auth="cityConst._PERMS.DISTRIBUTE">分配</Button>
        <Table
          :columns="columnsCity"
          :data-source="cityList"
          rowKey="id"
          :pagination="cityPagination"
          @change="handleCityTableChange"
          :row-selection="{ selectedRowKeys: selectedCity, onChange: onSelectChangeCity }"
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
            <Button @click="distributeOne(line)" v-auth="cityConst._PERMS.DISTRIBUTE">分配</Button>
            <Button @click="transferLevel(line)" v-auth="cityConst._PERMS.TRANSFER_LEVEL"
              >领取</Button
            >
            <Button @click="clickFollow(line)">跟进</Button>
          </template>
        </Table>
      </TabPane>
      <TabPane
        key="2"
        tab="公司"
        v-auth="companyConst._PERMS.SELECT"
        v-if="hasPermission(companyConst._PERMS.SELECT)"
      >
        <Button @click="clickCompany" v-auth="companyConst._PERMS.ADD">添加</Button>
        <Button @click="distributeMul" v-auth="companyConst._PERMS.DISTRIBUTE">分配</Button>
        <Table
          :columns="columnsCompany"
          :data-source="companyList"
          rowKey="id"
          :pagination="companyPagination"
          @change="handleCompanyTableChange"
          :row-selection="{ selectedRowKeys: selectedCompany, onChange: onSelectChangeCompany }"
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
            <Button @click="distributeOne(line)" v-auth="companyConst._PERMS.DISTRIBUTE"
              >分配</Button
            >
            <Button @click="transferLevel(line)" v-auth="companyConst._PERMS.TRANSFER_LEVEL"
              >领取</Button
            >
            <Button @click="clickFollow(line)">跟进</Button>
          </template>
        </Table>
      </TabPane>
      <TabPane
        key="3"
        tab="小组"
        v-auth="groupConst._PERMS.SELECT"
        v-if="hasPermission(groupConst._PERMS.SELECT)"
      >
        <Button @click="clickGroup" v-auth="groupConst._PERMS.ADD">添加</Button>
        <Button @click="distributeMul" v-auth="groupConst._PERMS.DISTRIBUTE">分配</Button>
        <Table
          :columns="columnsGroup"
          :data-source="groupList"
          rowKey="id"
          :pagination="groupPagination"
          @change="handleGroupTableChange"
          :row-selection="{ selectedRowKeys: selectedGroup, onChange: onSelectChangeGroup }"
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
            <Button @click="distributeOne(line)" v-auth="groupConst._PERMS.DISTRIBUTE">分配</Button>
            <Button @click="transferLevel(line)" v-auth="groupConst._PERMS.TRANSFER_LEVEL"
              >领取</Button
            >
            <Button @click="clickFollow(line)">跟进</Button>
          </template>
        </Table>
      </TabPane>
      <TabPane
        key="4"
        tab="个人"
        v-auth="privateConst._PERMS.SELECT"
        v-if="hasPermission(privateConst._PERMS.SELECT)"
      >
        <Button @click="clickPrivate" v-auth="privateConst._PERMS.ADD">添加</Button>
        <!-- <Button @click="distributeMul" v-auth="privateConst._PERMS.TRANSFER">转移</Button> -->
        <Table
          :columns="columnsPrivate"
          :data-source="privateList"
          rowKey="id"
          :pagination="privatePagination"
          @change="handlePrivateTableChange"
        >
          <!-- :row-selection="{ selectedRowKeys: selectedPrivate, onChange: onSelectChangePrivate }" -->
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
            <Button @click="updateCustomer(line)" v-auth="privateConst._PERMS.UPDATE">编辑</Button>
            <Button @click="distributeOne(line)" v-auth="privateConst._PERMS.TRANSFER">转移</Button>
            <Button @click="customerDeal(line)" v-auth="privateConst._PERMS.DEAL">成交</Button>
            <Button @click="customerInvalid(line)" v-auth="privateConst._PERMS.INVALID"
              >无效</Button
            >
            <Button @click="clickFollow(line)">跟进</Button>
          </template>
        </Table>
      </TabPane>
    </Tabs>
    <Modal
      v-model:visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width="40%"
      :bodyStyle="{ overflowY: 'auto', margin: '16px' }"
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
      <DistributeForm
        v-if="drawerParam.state === '5'"
        :id="drawerParam.id"
        :ids="ids"
        :fromType="fromType"
      />
      <FollowDetail :fromType="fromType" v-if="drawerParam.state === '6'" :id="drawerParam.id" />
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
  import { getByCity, transferLevelTo } from '/@/api/customer/crmCity/city';
  import { BasePageResult, PageParam } from '/@/api/model/baseModel';
  import { failed, processListByLine, success } from '/@/hooks/web/useList';
  import { Tabs, TabPane, Table, Tag, Button, Modal, InputSearch, Select } from 'ant-design-vue';
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
  import { getByGroup } from '/@/api/customer/crmGroup/group';
  import GroupForm from './components/GroupForm.vue';
  import {
    PrivateConst,
    PrivateModel,
    _ColumnsPrivate as columnsPrivate,
  } from '/@/api/customer/crmPrivate/model/PrivateModel';
  import { deal, getByPrivate, invalid } from '/@/api/customer/crmPrivate/private';
  import PrivateForm from './components/PrivateForm.vue';
  // import SelectDetail from './components/SelectDetail.vue';
  import SelectDetail from './components/SelectDetail.vue';
  import DistributeForm from './components/DistributeForm.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import FCascader from '/@/components/FCascader';
  import FProjectSelect from '/@/components/FProjectSelect';
  import FollowDetail from './components/FollowDetail.vue';

  export default defineComponent({
    name: 'Customer',
    components: {
      FCascader,
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
      DistributeForm,
      InputSearch,
      FProjectSelect,
      Select,
      FollowDetail,
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

      const clickFollow = (line) => {
        if (activeKey.value === '4') {
          fromType.value = 'my';
        } else {
          fromType.value = 'other';
        }
        drawerParam.state = '6';
        drawerParam.title = '跟进信息';
        drawerParam.visible = true;
        drawerParam.id = line.id;
      };

      //手机号
      const contactValue = ref<String>('');
      const contactChange = (_value) => {
        if (contactValue.value.length === 3) {
          contactValue.value = contactValue.value + '****';
        }
        if (!contactValue.value) {
          refreshList();
        }
      };
      const contactSearch = async (value: string) => {
        value = value.replace('****', '');
        if (activeKey.value === '1') {
          cityCondition.mobile = value;
        } else if (activeKey.value === '2') {
          companyCondition.mobile = value;
        } else if (activeKey.value === '3') {
          groupCondition.mobile = value;
        } else if (activeKey.value === '4') {
          privateCondition.mobile = value;
        }
        refreshList();
      };

      //  住址
      const liveInChange = (e) => {
        if (activeKey.value === '1') {
          cityCondition.liveIn = e.value.toString();
        } else if (activeKey.value === '2') {
          companyCondition.liveIn = e.value.toString();
        } else if (activeKey.value === '3') {
          groupCondition.liveIn = e.value.toString();
        } else if (activeKey.value === '4') {
          privateCondition.liveIn = e.value.toString();
        }
        refreshList();
      };
      // 工作地
      const workInChange = (e) => {
        if (activeKey.value === '1') {
          cityCondition.workIn = e.value.toString();
        } else if (activeKey.value === '2') {
          companyCondition.workIn = e.value.toString();
        } else if (activeKey.value === '3') {
          groupCondition.workIn = e.value.toString();
        } else if (activeKey.value === '4') {
          privateCondition.workIn = e.value.toString();
        }
        refreshList();
      };
      // 意向地
      const intentionChange = (e) => {
        if (activeKey.value === '1') {
          cityCondition.intentionProvince = e.value[0];
          cityCondition.intentionCity = e.value[1];
          cityCondition.intentionArea = e.value[2];
        } else if (activeKey.value === '2') {
          companyCondition.intentionProvince = e.value[0];
          companyCondition.intentionCity = e.value[1];
          companyCondition.intentionArea = e.value[2];
        } else if (activeKey.value === '3') {
          groupCondition.intentionProvince = e.value[0];
          groupCondition.intentionCity = e.value[1];
          groupCondition.intentionArea = e.value[2];
        } else if (activeKey.value === '4') {
          privateCondition.intentionProvince = e.value[0];
          privateCondition.intentionCity = e.value[1];
          privateCondition.intentionArea = e.value[2];
        }
        refreshList();
      };
      // 意向楼盘
      const setProject = async (value) => {
        if (activeKey.value === '1') {
          cityCondition.intentionProject = value.key.toString();
        } else if (activeKey.value === '2') {
          companyCondition.intentionProject = value.key.toString();
        } else if (activeKey.value === '3') {
          groupCondition.intentionProject = value.key.toString();
        } else if (activeKey.value === '4') {
          privateCondition.intentionProject = value.key.toString();
        }
        refreshList();
      };
      const onClear = async () => {
        if (activeKey.value === '1') {
          cityCondition.intentionProject = '';
        } else if (activeKey.value === '2') {
          companyCondition.intentionProject = '';
        } else if (activeKey.value === '3') {
          groupCondition.intentionProject = '';
        } else if (activeKey.value === '4') {
          privateCondition.intentionProject = '';
        }
        refreshList();
      };

      //购房目的
      const purposeChange = async (value) => {
        if (activeKey.value === '1') {
          cityCondition.purpose = value;
        } else if (activeKey.value === '2') {
          companyCondition.purpose = value;
        } else if (activeKey.value === '3') {
          groupCondition.purpose = value;
        } else if (activeKey.value === '4') {
          privateCondition.purpose = value;
        }
        refreshList();
      };

      // 意向强度
      let intentionRange = ref(undefined);
      const intentionRangeSearch = async (value: number) => {
        if (activeKey.value === '1') {
          cityCondition.buyIntentionRange = value;
        } else if (activeKey.value === '2') {
          companyCondition.buyIntentionRange = value;
        } else if (activeKey.value === '3') {
          groupCondition.buyIntentionRange = value;
        } else if (activeKey.value === '4') {
          privateCondition.buyIntentionRange = value;
        }
        refreshList();
      };

      const refreshList = async () => {
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

      // 成交
      const customerDeal = async (line) => {
        try {
          await deal(line.id);
          success('成功', '客户处理成功');
          privatePage.pageNum = 1;
          const result = await getPrivateList();
          await processListByLine(result, privateList, privateTotal);
        } catch (error) {}
      };
      // 无效
      const customerInvalid = async (line) => {
        try {
          await invalid(line.id);
          success('成功', '客户处理成功');
          privatePage.pageNum = 1;
          const result = await getPrivateList();
          await processListByLine(result, privateList, privateTotal);
        } catch (error) {}
      };

      // 领取客户
      const transferLevel = async (line) => {
        let from = '';
        if (activeKey.value === '3') {
          from = 'group';
        } else if (activeKey.value === '2') {
          from = 'company';
        } else if (activeKey.value === '1') {
          from = 'city';
        }
        const result = await transferLevelTo(line.id, from, 'private');
        if (result.code === 200) {
          success('成功', '领取成功');
        } else {
          failed('失败', '领取客户失败');
        }
        refreshList();
      };

      const sortCity = {
        asc: [''],
        desc: ['createTime'],
      };
      const sortCompany = {
        asc: [''],
        desc: ['createTime'],
      };
      const sortGroup = {
        asc: [''],
        desc: ['createTime'],
      };

      //选中行id
      let selectedCity = ref<string[]>([]);
      const onSelectChangeCity = async (selectedRowKeys) => {
        selectedCity.value = selectedRowKeys;
      };
      let selectedCompany = ref<string[]>([]);
      const onSelectChangeCompany = async (selectedRowKeys) => {
        selectedCompany.value = selectedRowKeys;
      };
      let selectedGroup = ref<string[]>([]);
      const onSelectChangeGroup = async (selectedRowKeys) => {
        selectedGroup.value = selectedRowKeys;
      };
      let selectedPrivate = ref<string[]>([]);
      const onSelectChangePrivate = async (selectedRowKeys) => {
        selectedPrivate.value = selectedRowKeys;
      };

      // 更新
      const updateCustomer = (line) => {
        if (activeKey.value === '1') {
          drawerParam.state = '0';
        } else if (activeKey.value === '2') {
          drawerParam.state = '1';
        } else if (activeKey.value === '3') {
          drawerParam.state = '2';
        } else if (activeKey.value === '4') {
          drawerParam.state = '3';
        }
        drawerParam.id = line.id;
        drawerParam.title = '更新客户信息';
        drawerParam.visible = true;
      };

      // 多个分配
      const distributeMul = () => {
        drawerParam.state = '5';
        if (activeKey.value === '4') {
          fromType.value = 'private';
          ids.value = selectedPrivate.value;
        } else if (activeKey.value === '3') {
          fromType.value = 'group';
          ids.value = selectedGroup.value;
        } else if (activeKey.value === '2') {
          fromType.value = 'company';
          ids.value = selectedCompany.value;
        } else if (activeKey.value === '1') {
          fromType.value = 'city';
          ids.value = selectedCity.value;
        }
        drawerParam.title = '分配客户';
        drawerParam.visible = true;
      };

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

      const ids = ref(['']);
      const fromType = ref('');
      const distributeOne = (line) => {
        drawerParam.title = '分配客户';
        drawerParam.state = '5';
        if (activeKey.value === '4') {
          fromType.value = 'private';
          drawerParam.title = '转移客户';
        } else if (activeKey.value === '3') {
          fromType.value = 'group';
        } else if (activeKey.value === '2') {
          fromType.value = 'company';
        } else if (activeKey.value === '1') {
          fromType.value = 'city';
        }
        drawerParam.id = line.id;
        drawerParam.visible = true;
      };

      const seeCity = (line) => {
        // drawerParam.title = '查看城市';
        // drawerParam.state = '0';
        // drawerParam.visible = true;
        // drawerParam.id = line.id;
        drawerParam.title = '查看客户信息';
        drawerParam.visible = true;
        drawerParam.state = '4';
        drawerParam.cityId = line.id;
      };

      const seeCompany = (line) => {
        // drawerParam.title = '查看公司';
        // drawerParam.state = '1';
        // drawerParam.visible = true;
        // drawerParam.id = line.id;
        drawerParam.title = '查看客户信息';
        drawerParam.visible = true;
        drawerParam.state = '4';
        drawerParam.companyId = line.id;
      };

      const seeGroup = (line) => {
        // drawerParam.title = '查看小组';
        // drawerParam.state = '2';
        // drawerParam.visible = true;
        // drawerParam.id = line.id;
        drawerParam.title = '查看客户信息';
        drawerParam.visible = true;
        drawerParam.state = '4';
        drawerParam.groupId = line.id;
      };

      const seePrivate = (line) => {
        // drawerParam.title = '查看个人';
        // drawerParam.state = '3';
        // drawerParam.visible = true;
        // drawerParam.id = line.id;
        drawerParam.title = '查看客户信息';
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
        fromType.value = '';
        ids.value.splice(0);
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
        drawerParam.title = '添加客户信息';
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
          result = await getByCity(cityCondition, cityPage, sortCity);
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
        drawerParam.title = '添加客户信息';
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
          result = await getByCompany(companyCondition, cityPage, sortCompany);
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
        drawerParam.title = '添加客户信息';
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
          result = await getByGroup(groupCondition, groupPage, sortGroup);
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
        drawerParam.title = '添加客户信息';
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
        buyIntentionRange: 0,
        companyId: '',
        groupId: '',
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
        desc: ['createTime'],
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
        clickFollow,
        intentionRange,
        intentionRangeSearch,
        purposeChange,
        setProject,
        onClear,
        intentionChange,
        workInChange,
        liveInChange,
        contactSearch,
        contactChange,
        contactValue,
        transferLevel,
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
        ids,
        fromType,
        distributeOne,
        onSelectChangePrivate,
        onSelectChangeGroup,
        onSelectChangeCompany,
        onSelectChangeCity,
        selectedCity,
        selectedCompany,
        selectedGroup,
        selectedPrivate,
        distributeMul,
        hasPermission,
        updateCustomer,
        customerInvalid,
        customerDeal,
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
      margin-bottom: 20px;
    }
  }
</style>
