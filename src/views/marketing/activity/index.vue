<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <Button
      v-auth="activityCOnst._PERMS.ADD_PC"
      @click="addAllActivity"
      :class="`${prefixCls}-add`"
    >
      {{ t('marketing.action.addPC') }}
    </Button>
    <Button
      v-auth="activityCOnst._PERMS.ADD_USER"
      @click="addUserActivity"
      :class="`${prefixCls}-add`"
    >
      {{ t('marketing.action.addSale') }}
    </Button>
    <Tabs v-model:activeKey="activeKey" type="card">
      <TabPane v-auth="activityCOnst._PERMS.SELECT_CREATE" key="0" tab="自创建">
        <Table :columns="activityColumns" :data-source="list" rowKey="id" :pagination="false">
          <template #projectEntities="{ text: projectEntities }">
            <span v-for="(item, index) in projectEntities" :key="index">
              <Tag color="blue">{{ item.name }}</Tag>
            </span>
          </template>
          <template #type="{ text: type }">
            <span>
              <Tag :color="activityCOnst.TYPES[type - 1].color">
                {{ activityCOnst.TYPES[type - 1].label }}
              </Tag>
            </span>
          </template>
          <template #sort="{ text: sort }">
            <span>
              <Tag :color="activityCOnst.SORTS[sort - 1].color">
                {{ activityCOnst.SORTS[sort - 1].label }}
              </Tag>
            </span>
          </template>
          <template #expireTime="{ text: expireTime }">
            <span>
              {{ expireTime.replace('T', ' ').replace('.000+08:00', '') }}
            </span>
          </template>
          <template #state="{ text: state }">
            <span>
              <Tag :color="activityCOnst.STATES[state].color">
                {{ activityCOnst.STATES[state].label }}
              </Tag>
            </span>
          </template>
          <template #operation="{ text: line }">
            <!-- 操作下拉框 -->
            <Dropdown placement="bottomCenter" trigger="click">
              <Button type="link">{{ t('marketing.operation') }}</Button>
              <template #overlay>
                <Menu mode="horizontal" @click="action">
                  <MenuItem :key="0" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                    <template #icon></template>
                    <Button
                      :class="prefixCls"
                      v-auth="activityCOnst._PERMS.DELETE_USER"
                      type="link"
                      size="small"
                      >{{ t('marketing.action.delete') }}
                    </Button>
                  </MenuItem>
                  <MenuItem :key="1" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                    <template #icon></template>
                    <Button
                      v-auth="activityCOnst._PERMS.UPDATE_USER"
                      type="link"
                      size="small"
                      :class="prefixCls"
                    >
                      {{ t('marketing.action.reEnable') }}
                    </Button>
                  </MenuItem>
                  <MenuItem :key="2" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                    <template #icon></template>
                    <Button
                      v-auth="activityCOnst._PERMS.UPDATE_USER"
                      type="link"
                      size="small"
                      :class="prefixCls"
                    >
                      {{ t('marketing.action.update') }}
                    </Button>
                  </MenuItem>
                  <MenuItem :key="3" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                    <template #icon></template>
                    <Button
                      v-auth="activityCOnst._PERMS.PUBLISH"
                      type="link"
                      size="small"
                      :class="prefixCls"
                    >
                      {{ t('marketing.action.publish') }}
                    </Button>
                  </MenuItem>
                  <MenuItem :key="4" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                    <template #icon></template>
                    <Button
                      v-auth="activityCOnst._PERMS.SELECT"
                      type="link"
                      size="small"
                      :class="prefixCls"
                    >
                      {{ t('marketing.action.see') }}
                    </Button>
                  </MenuItem>
                </Menu>
              </template>
            </Dropdown>
            <Button
              v-auth="activityCOnst._PERMS.PUBLISH"
              type="link"
              size="small"
              :class="prefixCls"
              @click="clickPublish(line)"
            >
              {{ t('marketing.action.publish') }}
            </Button>
            <Button
              v-auth="activityCOnst._PERMS.SELECT"
              type="link"
              size="small"
              :class="prefixCls"
              @click="clickPreview(line)"
            >
              {{ t('marketing.action.preview') }}
            </Button>
          </template>
        </Table>
      </TabPane>
      <TabPane
        v-if="
          hasPermission(activityCOnst._PERMS.SELECT_ALL) ||
          hasPermission(activityCOnst._PERMS.SELECT_CITY)
        "
        v-auth="[activityCOnst._PERMS.SELECT_ALL, activityCOnst._PERMS.SELECT_CITY]"
        key="1"
        tab="所有活动"
      >
        <Table :columns="activityColumns" :data-source="allList" rowKey="id" :pagination="false">
          <template #projectEntities="{ text: projectEntities }">
            <span v-for="(item, index) in projectEntities" :key="index">
              <Tag color="blue">{{ item.name }}</Tag>
            </span>
          </template>
          <template #type="{ text: type }">
            <span>
              <Tag :color="activityCOnst.TYPES[type - 1].color">
                {{ activityCOnst.TYPES[type - 1].label }}
              </Tag>
            </span>
          </template>
          <template #sort="{ text: sort }">
            <span>
              <Tag :color="activityCOnst.SORTS[sort - 1].color">
                {{ activityCOnst.SORTS[sort - 1].label }}
              </Tag>
            </span>
          </template>
          <template #expireTime="{ text: expireTime }">
            <span>
              {{ expireTime.replace('T', ' ').replace('.000+08:00', '') }}
            </span>
          </template>
          <template #state="{ text: state }">
            <span>
              <Tag :color="activityCOnst.STATES[state].color">
                {{ activityCOnst.STATES[state].label }}
              </Tag>
            </span>
          </template>
          <template #operation="{ text: line }">
            <!-- 操作下拉框 -->
            <Dropdown placement="bottomCenter" trigger="click">
              <Button type="link">{{ t('marketing.operation') }}</Button>
              <template #overlay>
                <Menu mode="horizontal" @click="allAction">
                  <MenuItem :key="0" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                    <template #icon></template>
                    <Button
                      :class="prefixCls"
                      v-auth="activityCOnst._PERMS.DELETE_ALL"
                      type="link"
                      size="small"
                      >{{ t('marketing.action.delete') }}
                    </Button>
                  </MenuItem>
                  <MenuItem :key="1" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                    <template #icon></template>
                    <Button
                      v-auth="activityCOnst._PERMS.UPDATE_ALL"
                      type="link"
                      size="small"
                      :class="prefixCls"
                    >
                      {{ t('marketing.action.reEnable') }}
                    </Button>
                  </MenuItem>
                  <MenuItem :key="2" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                    <template #icon></template>
                    <Button
                      v-auth="activityCOnst._PERMS.UPDATE_ALL"
                      type="link"
                      size="small"
                      :class="prefixCls"
                    >
                      {{ t('marketing.action.update') }}
                    </Button>
                  </MenuItem>
                  <MenuItem :key="3" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                    <template #icon></template>
                    <Button
                      v-auth="activityCOnst._PERMS.PUBLISH"
                      type="link"
                      size="small"
                      :class="prefixCls"
                    >
                      {{ t('marketing.action.publish') }}
                    </Button>
                  </MenuItem>
                  <MenuItem :key="4" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                    <template #icon></template>
                    <Button
                      v-auth="activityCOnst._PERMS.SELECT"
                      type="link"
                      size="small"
                      :class="prefixCls"
                    >
                      {{ t('marketing.action.see') }}
                    </Button>
                  </MenuItem>
                </Menu>
              </template>
            </Dropdown>
            <Button
              v-auth="activityCOnst._PERMS.PUBLISH"
              type="link"
              size="small"
              :class="prefixCls"
              @click="allClickPublish(line)"
            >
              {{ t('marketing.action.publish') }}
            </Button>
            <Button
              v-auth="activityCOnst._PERMS.SELECT"
              type="link"
              size="small"
              :class="prefixCls"
              @click="clickPreview(line)"
            >
              {{ t('marketing.action.preview') }}
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
      :bodyStyle="{ overflow: 'auto', margin: '16px' }"
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width="50%"
      :footer="null"
      :destroyOnClose="true"
      centered
    >
      <ActivityForm
        :id="drawerParam.id"
        :isSale="drawerParam.isSale"
        :isSee="drawerParam.isSee"
        v-if="drawerParam.state === '0'"
      />
    </Modal>
    <Modal
      v-model:visible="isPreview"
      :title="drawerParam.title"
      @cancel="onClose"
      width="100%"
      :destroyOnClose="true"
      :footer="null"
      :bodyStyle="{ overflowY: 'auto', margin: '16px' }"
      wrapClassName="full-modal"
    >
      <PreviewActivity v-if="drawerParam.state === '1'" :id="drawerParam.id" />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  // 用户store
  import { useUserStore } from '/@/store/modules/user';
  import {
    Table,
    Pagination,
    Tag,
    Button,
    Modal,
    Dropdown,
    Menu,
    MenuItem,
    Tabs,
    TabPane,
  } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { processList, success, failed } from '/@/hooks/web/useList';
  import {
    ClueActivityCOnst,
    ActivityColumns as activityColumns,
    clueActivityModel,
  } from '/@/api/marketing/clueActivity/model/clueActivityModel';
  import {
    deleteAll,
    deleteUser,
    getAllWithCity,
    getByPage,
    getByPageWithCreateBy,
    publish,
    reEnableAll,
    reEnableUser,
  } from '/@/api/marketing/clueActivity/clueActivity';
  import ActivityForm from './components/ActivityForm.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import PreviewActivity from './components/PreviewActivity.vue';

  export default defineComponent({
    name: 'ActivityTable',
    components: {
      Table,
      Pagination,
      Tag,
      Button,
      Dropdown,
      Menu,
      MenuItem,
      Loading,
      Tabs,
      TabPane,
      ActivityForm,
      Modal,
      PreviewActivity,
    },
    setup() {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      // 获取用户store
      const userStore = useUserStore();
      const { prefixCls } = useDesign('activity');
      const activityCOnst = ref(ClueActivityCOnst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      // 分页
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });

      const cityId = userStore.getUserInfo.companyCityId;
      const provinceId = userStore.getUserInfo.companyProvinceId;
      let activeKey = ref('0');
      // 筛选条件
      const condition = reactive({
        id: '',
        state: '',
        cityId: '',
        createBy: '',
      });

      //初始加载
      onMounted(async () => {
        const result = await getList();
        processList(result, list, pageParam);
      });

      watch(
        () => activeKey.value,
        async () => {
          if (activeKey.value === '1') {
            pageParam.number = 0;
            const allResult = await getCityList();
            processList(allResult, allList, pageParam);
          }
          if (activeKey.value === '0') {
            pageParam.number = 0;
            const result = await getList();
            processList(result, list, pageParam);
          }
          activeKey.value;
        }
      );

      // 列表结果
      const activity: clueActivityModel[] = [];
      let list = reactive(activity);
      const allActivity: clueActivityModel[] = [];
      let allList = reactive(allActivity);

      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<clueActivityModel> | undefined;
        try {
          result = await getByPageWithCreateBy(condition, {
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
      const { hasPermission } = usePermission();
      const getCityList = async () => {
        loading.value = true;
        let allResult: BasePageResult<clueActivityModel> | undefined;
        try {
          if (hasPermission(ClueActivityCOnst._PERMS.SELECT_ALL)) {
            allResult = await getAllWithCity(condition, {
              pageSize: pageParam.size,
              pageNum: pageParam.number,
            });
          } else if (hasPermission(ClueActivityCOnst._PERMS.SELECT_CITY)) {
            allResult = await getByPage(condition, {
              pageSize: pageParam.size,
              pageNum: pageParam.number,
            });
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
        return allResult;
      };

      //sale发布
      const clickPublish = async (line) => {
        try {
          loading.value = true;
          await publish(line.id);
          success(t('marketing.action.publish'), t('marketing.action.success'));
          const result = await getList();
          processList(result, list, pageParam);
        } catch (error: any) {
          failed(t('marketing.action.publish'), t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };
      //all发布
      const allClickPublish = async (line) => {
        try {
          loading.value = true;
          await publish(line.id);
          success(t('marketing.action.publish'), t('marketing.action.success'));
          const allResult = await getCityList();
          processList(allResult, allList, pageParam);
        } catch (error: any) {
          failed(t('marketing.action.publish'), t('host.action.fail'));
        } finally {
          loading.value = false;
        }
      };

      //预览
      let isPreview = ref(false);
      const clickPreview = async (line) => {
        isPreview.value = true;
        drawerParam.title = t('marketing.action.preview');
        drawerParam.state = '1';
        drawerParam.id = line.id;
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
              await deleteUser(id);
              success(t('marketing.action.delete'), t('marketing.action.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed(t('marketing.action.delete'), t('host.action.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 1:
            // 恢复
            try {
              loading.value = true;
              await reEnableUser(id);
              success(t('marketing.action.reEnable'), t('marketing.action.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed(t('marketing.action.reEnable'), t('host.action.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 2:
            // 更新
            drawerParam.visible = true;
            drawerParam.state = '0';
            drawerParam.id = id;
            drawerParam.title = t('marketing.action.update');
            drawerParam.isSale = true;
            drawerParam.isSee = false;
            break;
          case 3:
            // 发布
            try {
              loading.value = true;
              await publish(id);
              success(t('marketing.action.publish'), t('marketing.action.success'));
              const result = await getList();
              processList(result, list, pageParam);
            } catch (error: any) {
              failed(t('marketing.action.publish'), t('host.action.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 4:
            // 查看
            drawerParam.visible = true;
            drawerParam.state = '0';
            drawerParam.id = id;
            drawerParam.title = t('marketing.action.see');
            drawerParam.isSale = true;
            drawerParam.isSee = true;
            break;
        }
      };
      const allAction = async (key) => {
        const code = key.key;
        const id = key?.item['data-id'] || undefined;
        switch (code) {
          case 0:
            // 删除
            try {
              loading.value = true;
              await deleteAll(id);
              success(t('marketing.action.delete'), t('marketing.action.success'));
              const allResult = await getCityList();
              processList(allResult, allList, pageParam);
            } catch (error: any) {
              failed(t('marketing.action.delete'), t('host.action.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 1:
            // 恢复
            try {
              loading.value = true;
              await reEnableAll(id);
              success(t('marketing.action.reEnable'), t('marketing.action.success'));
              const allResult = await getCityList();
              processList(allResult, allList, pageParam);
            } catch (error: any) {
              failed(t('marketing.action.reEnable'), t('host.action.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 2:
            // 更新
            drawerParam.visible = true;
            drawerParam.state = '0';
            drawerParam.id = id;
            drawerParam.title = t('marketing.action.update');
            drawerParam.isSale = false;
            drawerParam.isSee = false;
            break;
          case 3:
            // 发布
            try {
              loading.value = true;
              await publish(id);
              success(t('marketing.action.publish'), t('marketing.action.success'));
              const allResult = await getCityList();
              processList(allResult, allList, pageParam);
            } catch (error: any) {
              failed(t('marketing.action.publish'), t('host.action.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 4:
            // 查看
            drawerParam.visible = true;
            drawerParam.state = '0';
            drawerParam.id = id;
            drawerParam.title = t('marketing.action.see');
            drawerParam.isSale = false;
            drawerParam.isSee = true;
            break;
        }
      };

      //添加活动
      const addUserActivity = () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('marketing.action.add');
        drawerParam.isSale = true;
        drawerParam.isSee = false;
      };
      const addAllActivity = () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('marketing.action.add');
        drawerParam.isSale = false;
        drawerParam.isSee = false;
      };

      // 抽屉参数
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
        isSale: false,
        isSee: false,
      });

      const onClose = async () => {
        isPreview.value = false;
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        drawerParam.isSale = false;
        drawerParam.isSee = false;
        if (activeKey.value === '1') {
          const allResult = await getCityList();
          processList(allResult, allList, pageParam);
        }
        if (activeKey.value === '0') {
          const result = await getList();
          processList(result, list, pageParam);
        }
      };

      //页码改变
      const onChange = async (page) => {
        pageParam.number = page;
        if (activeKey.value === '1') {
          const allResult = await getCityList();
          processList(allResult, allList, pageParam);
        }
        if (activeKey.value === '0') {
          const result = await getList();
          processList(result, list, pageParam);
        }
      };
      const onShowSizeChange = async (current, size) => {
        console.log(current);
        pageParam.size = size;
        pageParam.number = 1;
        if (activeKey.value === '1') {
          const allResult = await getCityList();
          processList(allResult, allList, pageParam);
        }
        if (activeKey.value === '0') {
          const allResult = await getCityList();
          processList(allResult, allList, pageParam);
        }
      };

      return {
        t,
        prefixCls,
        activityCOnst,
        condition,
        activityColumns,
        loading,
        tip,
        pageSizeList,
        list,
        drawerParam,
        pageParam,
        onChange,
        onShowSizeChange,
        onClose,
        action,
        allAction,
        cityId,
        provinceId,
        activeKey,
        addUserActivity,
        addAllActivity,
        allList,
        clickPublish,
        allClickPublish,
        isPreview,
        clickPreview,
        hasPermission,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-activity';
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
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
</style>
