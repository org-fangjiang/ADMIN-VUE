// 文章信息管理页面
<template>
  <div :class="prefixCls" class="relative w-full h-full px-4 pt-2">
    <!-- <Select
      ref="selectRef"
      label-in-value
      placeholder="Select LineId"
      style="width: 250px"
      :filter-option="false"
      :not-found-content="null"
      :options="options"
      :showSearch="true"
      :labelInValue="false"
      @change="projectChange"
      :allowClear="true"
    /> -->
    <Button v-auth="newsConst._PERMS.ADD" @click="addNews" :class="`${prefixCls}-add`">
      {{ t('host.action.add') }}
    </Button>
    <Table
      :columns="ColumnsNews"
      :data-source="list"
      rowKey="id"
      :pagination="false"
      @change="sortChange"
    >
      <template #img="{ text: img }">
        <Image :src="img" width="63px" />
      </template>
      <template #projects="{ text: projects }">
        <span v-for="item in projects" :key="item.id">{{ item.name }},</span>
      </template>
      <template #inMobile="{ text: inMobile }">
        <span>
          <Tag :color="newsConst.IN_MOBILES[inMobile].color">
            {{ newsConst.IN_MOBILES[inMobile].label }}
          </Tag>
        </span>
      </template>
      <template #sort="{ text: sort }">
        <span>
          <Tag :color="newsConst.SORTS[sort - 1].color">
            {{ newsConst.SORTS[sort - 1].label }}
          </Tag>
        </span>
      </template>
      <template #state="{ text: state }">
        <span>
          <Tag :color="newsConst.STATES[state].color">
            {{ newsConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #createByUser="{ text: createByUser }">
        <span>{{ createByUser.realName }}</span>
      </template>
      <template #createTime="{ text: createTime }">
        <span>{{ createTime.replace('T', ' ').replace('.000+08:00', '') }}</span>
      </template>
      <template #operation="{ text: line }">
        <!-- 操作下拉框 -->
        <Dropdown placement="bottomCenter" trigger="click">
          <Button type="link">{{ t('host.operation') }}</Button>
          <template #overlay>
            <Menu mode="horizontal" @click="action">
              <MenuItem :key="0" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button :class="prefixCls" v-auth="newsConst._PERMS.DELETE" type="link" size="small"
                  >{{ t('host.action.delete') }}
                </Button>
              </MenuItem>
              <MenuItem :key="1" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="newsConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.reEnable') }}
                </Button>
              </MenuItem>
              <MenuItem :key="2" :data-id="line.id" :class="`${prefixCls}-action-menu-item`">
                <template #icon></template>
                <Button
                  v-auth="newsConst._PERMS.UPDATE"
                  type="link"
                  size="small"
                  :class="prefixCls"
                >
                  {{ t('host.action.update') }}
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
      :bodyStyle="{ overflow: 'auto', margin: '16px' }"
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width="50%"
      :footer="null"
      :destroyOnClose="true"
    >
      <NewsForm
        v-if="drawerParam.state === '0'"
        :id="drawerParam.id"
        :provinceId="provinceId"
        :cityId="cityId"
      />
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
  import {
    _NewsConst,
    NewsModel,
    _ColumnsNews as ColumnsNews,
  } from '/@/api/host/news/model/newsModel';
  import { deleteNews, getNewsByCity, reEnableNews } from '/@/api/host/news/news';
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
    // Select,
    Image,
  } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import NewsForm from './components/NewsFrom.vue';

  export default defineComponent({
    name: 'NewsTable',
    components: {
      Table,
      Pagination,
      Tag,
      Button,
      Modal,
      Dropdown,
      Menu,
      MenuItem,
      Loading,
      Image,
      NewsForm,
      // Select,
    },
    setup() {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      // 获取用户store
      const userStore = useUserStore();
      const { prefixCls } = useDesign('news');
      const newsConst = ref(_NewsConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      const news: NewsModel[] = [];

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
        city: userStore.getUserInfo.companyCityId,
        state: '',
        projectId: '',
        inMobile: '',
        id: '',
      });
      // 列表结果
      let list = reactive(news);
      // 抽屉参数
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
      });
      let createBy = ref<string[]>([]);
      // 获取list
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<NewsModel> | undefined;
        try {
          result = await getNewsByCity(
            condition,
            {
              pageSize: pageParam.size,
              pageNum: pageParam.number,
            },
            sortParam
          );
          // if (result.content) {
          //   result.content.forEach(async (item) => {
          //     if (item.createBy) {
          //       const create = await updateUserInfo({ id: item.createBy });
          //       createBy.value.push(create.content.username || '');
          //     }
          //   });
          // }
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

      //根据项目筛选
      // const projectChange = async (value) => {
      //   condition.projectId = value;
      //   let pageResult: BasePageResult<NewsModel> | undefined;
      //   let lineResult: BasePageResult<NewsModel> | undefined;
      //   if (!condition.projectId) {
      //     pageParam.number = 1;
      //     pageResult = await getList();
      //     processList(pageResult);
      //   } else {
      //     condition.projectId = value;
      //     pageParam.number = 1;
      //     lineResult = await getNewsByProject(condition);
      //     processList(lineResult);
      //     condition.projectId = '';
      //   }
      // };

      //根据创建时间排序，默认降序
      const sortParam = reactive({
        asc: [''],
        desc: ['createTime'],
      });
      const sortChange = async (pagination, filters, sorter) => {
        //打印可以分别得到上下箭头的数据
        console.log(pagination, filters, sorter);
        sortParam.asc.splice(0);
        sortParam.desc.splice(0);
        if (sorter.order === 'ascend') {
          sortParam.asc.push('createTime');
        } else if (sorter.order === 'descend') {
          sortParam.desc.push('createTime');
        } else if (sorter.order === undefined) {
          sortParam.asc.splice(0);
          sortParam.desc.splice(0);
        }
        pageParam.number = 1;
        const result = await getList();
        processList(result);
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

      onMounted(async () => {
        const result = await getList();
        processList(result);
      });

      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        const result = await getList();
        processList(result);
      };

      // 添加文章
      const addMetroStation = () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('host.action.add');
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
              await deleteNews(id);
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
              await reEnableNews(id);
              success(t('host.action.reEnable'), t('host.action.success'));
              const result = await getList();
              processList(result);
            } catch (error: any) {
              failed(error?.response?.data?.message, t('host.action.fail'));
            } finally {
              loading.value = false;
            }
            break;
          case 2:
            // 更新
            drawerParam.visible = true;
            drawerParam.state = '0';
            drawerParam.id = id;
            drawerParam.title = t('host.action.update');
            break;
        }
      };

      const addNews = async () => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = '';
        drawerParam.title = t('host.action.add');
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

      return {
        t,
        prefixCls,
        newsConst,
        // options,
        condition,
        ColumnsNews,
        loading,
        tip,
        pageSizeList,
        list,
        drawerParam,
        pageParam,
        onChange,
        addNews,
        onShowSizeChange,
        // projectChange,
        onClose,
        addMetroStation,
        action,
        cityId,
        provinceId,
        createBy,
        sortChange,
        sortParam,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-news';
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
