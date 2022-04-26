<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <Tabs v-model:activeKey="activeKey">
      <!-- <TabPane key="1" tab="楼盘" v-if="hasPermission(oHouseConst._PERMS.CHANGE)">
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
      </TabPane> -->
      <TabPane key="2" tab="楼栋" v-if="hasPermission(buildConst._PERMS.CHANGE)">
        <Table :columns="ColumnsBuild" :data-source="buildList" rowKey="id" :pagination="false">
          <template #state="{ text: state }">
            <span>
              <Tag :color="buildConst.STATE[state].color">
                {{ buildConst.STATE[state].label }}
              </Tag>
            </span>
          </template>
          <template #operation="{ text: line }">
            <Button
              :class="prefixCls"
              v-auth="buildConst._PERMS.SELECT"
              type="link"
              size="small"
              @click="seeBuild(line)"
            >
              {{ t('host.action.see') }}
            </Button>
            <Button
              :class="prefixCls"
              v-if="line.state === '2' && hasPermission(buildConst._PERMS.CHANGE)"
              type="link"
              size="small"
              @click="clickPass(line)"
            >
              审核通过
            </Button>
            <Button
              :class="prefixCls"
              v-if="line.state === '2' && hasPermission(buildConst._PERMS.CHANGE)"
              type="link"
              size="small"
              @click="clickFail(line)"
            >
              审核不通过
            </Button>
          </template>
        </Table>
      </TabPane>
      <TabPane key="3" tab="单元" v-if="hasPermission(unitConst._PERMS.CHANGE)">
        <Table :columns="ColumnsUnit" :data-source="unitList" rowKey="id" :pagination="false">
          <template #state="{ text: state }">
            <span>
              <Tag :color="unitConst.STATE[state].color">
                {{ unitConst.STATE[state].label }}
              </Tag>
            </span>
          </template>
          <template #operation="{ text: line }">
            <Button
              :class="prefixCls"
              v-auth="unitConst._PERMS.SELECT"
              type="link"
              size="small"
              @click="seeUnit(line)"
            >
              {{ t('host.action.see') }}
            </Button>
            <Button
              :class="prefixCls"
              v-if="line.state === '2' && hasPermission(unitConst._PERMS.CHANGE)"
              type="link"
              size="small"
              @click="clickPass(line)"
            >
              审核通过
            </Button>
            <Button
              :class="prefixCls"
              v-if="line.state === '2' && hasPermission(unitConst._PERMS.CHANGE)"
              type="link"
              size="small"
              @click="clickFail(line)"
            >
              审核不通过
            </Button>
          </template>
        </Table>
      </TabPane>
      <TabPane key="4" tab="房源" v-if="hasPermission(houseConst._PERMS.CHANGE_STATE)">
        <Table :columns="houseColumns" :data-source="houseList" rowKey="id" :pagination="false">
          <template #state="{ text: state }">
            <span>
              <Tag :color="houseConst.STATE[state].color">
                {{ houseConst.STATE[state].label }}
              </Tag>
            </span>
          </template>
          <template #price="{ record }">
            <span @dblclick="clickPrice(record)">{{ record.price }}</span>
          </template>
          <template #userByCreate="{ text: userByCreate }">
            <span>
              {{ userByCreate.nickName }}
            </span>
          </template>
          <template #type="{ text: type }">
            <span>
              <Tag :color="houseConst.TYPES[type - 1].color">
                {{ houseConst.TYPES[type - 1].label }}
              </Tag>
            </span>
          </template>
          <template #operation="{ text: line }">
            <Button
              :class="prefixCls"
              v-auth="houseConst._PERMS.SELECT"
              type="link"
              size="small"
              @click="seeHouse(line)"
            >
              {{ t('host.action.see') }}
            </Button>
            <Button
              :class="prefixCls"
              v-if="line.state === '2' && hasPermission(houseConst._PERMS.CHANGE_STATE)"
              type="link"
              size="small"
              @click="clickPass(line)"
            >
              审核通过
            </Button>
            <Button
              :class="prefixCls"
              v-if="line.state === '2' && hasPermission(houseConst._PERMS.CHANGE_STATE)"
              type="link"
              size="small"
              @click="clickFail(line)"
            >
              审核不通过
            </Button>
          </template>
        </Table>
      </TabPane>
    </Tabs>
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
      <BuildForm v-if="drawerParam.state === '1'" :id="drawerParam.id" :isSee="true" />
      <UnitForm v-if="drawerParam.state === '2'" :id="drawerParam.id" :isSee="true" />
      <HouseForm v-if="drawerParam.state === '3'" :id="drawerParam.id" :isSee="true" />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { oHouseColumns, OProjectConst } from '/@/api/ohouse/project/model/projectModel';
  import { changeState, projectList } from '/@/api/ohouse/project/project';
  import { PageSizeList } from '/@/api/model/baseModel';
  import { failed, processList, success } from '/@/hooks/web/useList';
  import { Loading } from '/@/components/Loading';
  import { Pagination, Table, Tag, Button, Modal, Tabs, TabPane } from 'ant-design-vue';
  import ProjectForm from '../project/components/ProjectForm.vue';
  import {
    oBuildConst,
    BuildColumns as ColumnsBuild,
  } from '/@/api/ohouse/obuild/model/oBuildModel';
  import { UnitConst, UnitColumns as ColumnsUnit } from '/@/api/ohouse/oUnit/model/unitModel';
  import { HouseConst, HouseColumns as houseColumns } from '/@/api/ohouse/house/model/houseModel';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getBuildList } from '/@/api/ohouse/obuild/obuild';
  import { getUnitList } from '/@/api/ohouse/oUnit/unit';
  import { getOHouseList } from '/@/api/ohouse/house/house';
  import { changeState as changeBuild } from '/@/api/ohouse/obuild/obuild';
  import { changeState as changeUnit } from '/@/api/ohouse/oUnit/unit';
  import { changeState as changeHouse } from '/@/api/ohouse/house/house';
  import BuildForm from '../obuild/components/BuildForm.vue';
  import UnitForm from '../obuild/components/UnitForm.vue';
  import HouseForm from '../obuild/components/HouseForm.vue';

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
      Tabs,
      TabPane,
      BuildForm,
      UnitForm,
      HouseForm,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);

      // 权限
      const { hasPermission } = usePermission();

      let activeKey = ref('2');
      const buildConst = ref(oBuildConst);
      const unitConst = ref(UnitConst);
      const houseConst = ref(HouseConst);

      const columns = reactive(oHouseColumns);
      const oHouseConst = reactive(OProjectConst);

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

      let list = reactive([]);
      let buildList = reactive([]);
      let unitList = reactive([]);
      let houseList = reactive([]);
      // 获取列表信息
      const getList = async () => {
        loading.value = true;
        let result;
        try {
          if (activeKey.value === '1') {
            result = await projectList(
              { state: '2' },
              {
                pageSize: pageParam.size,
                pageNum: pageParam.number,
              },
              sortParam
            );
          } else if (activeKey.value === '2') {
            result = await getBuildList(
              { state: '2' },
              {
                pageSize: pageParam.size,
                pageNum: pageParam.number,
              }
            );
          } else if (activeKey.value === '3') {
            result = await getUnitList(
              { state: '2' },
              {
                pageSize: pageParam.size,
                pageNum: pageParam.number,
              }
            );
          } else if (activeKey.value === '4') {
            result = await getOHouseList(
              { state: '2' },
              {
                pageSize: pageParam.size,
                pageNum: pageParam.number,
              }
            );
          }
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
        let result;
        // if (hasPermission(oHouseConst._PERMS.CHANGE)) {
        //   activeKey.value = '1';
        //   result = await getList();
        //   if (result.content) {
        //     processList(result, list, pageParam);
        //   }
        // } else
        if (hasPermission(buildConst.value._PERMS.CHANGE)) {
          activeKey.value = '2';
          result = await getList();
          if (result.content) {
            processList(result, buildList, pageParam);
          }
        } else if (hasPermission(unitConst.value._PERMS.CHANGE)) {
          activeKey.value = '3';
          result = await getList();
          if (result.content) {
            processList(result, unitList, pageParam);
          }
        } else if (hasPermission(houseConst.value._PERMS.CHANGE_STATE)) {
          activeKey.value = '4';
          result = await getList();
          if (result.content) {
            processList(result, houseList, pageParam);
          }
        }
      });

      watch(
        () => activeKey.value,
        async () => {
          pageParam.number = 1;
          let result = await getList();
          if (activeKey.value === '1') {
            processList(result, list, pageParam);
          } else if (activeKey.value === '2') {
            processList(result, buildList, pageParam);
          } else if (activeKey.value === '3') {
            processList(result, unitList, pageParam);
          } else if (activeKey.value === '4') {
            processList(result, houseList, pageParam);
          }
        }
      );

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
      // 查看楼栋
      const seeBuild = (line) => {
        drawerParam.visible = true;
        drawerParam.id = line.id;
        drawerParam.title = t('host.action.see');
        drawerParam.state = '1';
      };
      const seeUnit = (line) => {
        drawerParam.visible = true;
        drawerParam.id = line.id;
        drawerParam.title = t('host.action.see');
        drawerParam.state = '2';
      };
      const seeHouse = (line) => {
        drawerParam.visible = true;
        drawerParam.id = line.id;
        drawerParam.title = t('host.action.see');
        drawerParam.state = '3';
      };

      // 审核通过
      const clickPass = async (line) => {
        loading.value = true;
        try {
          if (activeKey.value === '1') {
            await changeState(line.id, '1');
          } else if (activeKey.value === '2') {
            await changeBuild(line.id, '1');
          } else if (activeKey.value === '3') {
            await changeUnit(line.id, '1');
          } else if (activeKey.value === '4') {
            await changeHouse('1', line.id, line.title, line.keyword, line.description);
          }
          pageParam.number = 1;
          let result = await getList();
          if (activeKey.value === '1') {
            processList(result, list, pageParam);
          } else if (activeKey.value === '2') {
            processList(result, buildList, pageParam);
          } else if (activeKey.value === '3') {
            processList(result, unitList, pageParam);
          } else if (activeKey.value === '4') {
            processList(result, houseList, pageParam);
          }
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
          if (activeKey.value === '1') {
            await changeState(line.id, '4');
          } else if (activeKey.value === '2') {
            await changeBuild(line.id, '3');
          } else if (activeKey.value === '3') {
            await changeUnit(line.id, '3');
          } else if (activeKey.value === '4') {
            await changeHouse('3', line.id, line.title, line.keyword, line.description);
          }
          pageParam.number = 1;
          let result = await getList();
          if (activeKey.value === '1') {
            processList(result, list, pageParam);
          } else if (activeKey.value === '2') {
            processList(result, buildList, pageParam);
          } else if (activeKey.value === '3') {
            processList(result, unitList, pageParam);
          } else if (activeKey.value === '4') {
            processList(result, houseList, pageParam);
          }
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
        activeKey,
        buildConst,
        ColumnsBuild,
        ColumnsUnit,
        unitConst,
        houseColumns,
        houseConst,
        hasPermission,
        buildList,
        unitList,
        houseList,
        seeBuild,
        seeUnit,
        seeHouse,
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
