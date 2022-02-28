<template>
  <PageWrapper>
    <template #headerContent> <WorkbenchHeader /> </template>
    <Calendar v-if="isShow" v-model:value="value" @select="onSelect" :disabled-date="disabledDate">
      <template #headerRender>
        <div></div>
      </template>
      <template #dateCellRender="{ current: value2 }">
        <ul class="events">
          <li v-for="item in getListData(value2)" :key="item.content">
            <Badge :status="'success'" :text="item.content.description" />
          </li>
        </ul>
      </template>
    </Calendar>
    <Modal
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width=""
      :bodyStyle="{ overflow: 'auto', 'margin-top': '16px' }"
      :destroyOnClose="true"
      :footer="null"
    >
      <FollowForm v-if="drawerParam.state === '0'" :id="drawerParam.id" />
    </Modal>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { Calendar, Badge, Modal } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import WorkbenchHeader from './components/WorkbenchHeader.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { getNextFollow } from '/@/api/customer/crmFollow/follow';
  import moment, { Moment } from 'moment';
  import FollowForm from './components/FollowForm.vue';

  export default defineComponent({
    components: {
      PageWrapper,
      WorkbenchHeader,
      Calendar,
      Badge,
      FollowForm,
      Modal,
    },
    setup() {
      const loading = ref(true);

      const userStore = useUserStore();
      const userInfo = userStore.getUserInfo;
      const isShow = ref(false);
      if (userInfo.roleName === 'sale') {
        isShow.value = true;
      }

      let list: any[] = reactive([]);

      onMounted(async () => {
        const result = await getNextFollow();
        if (result.content && result.content.length > 0) {
          list.push(...result.content);
        }
      });

      const disabledDate = (current: any) => {
        return current && current < moment();
      };

      const value = ref<Moment>();
      const curTime = moment();

      const getListData = (value: Moment) => {
        let listData;
        if (value.month() === curTime.month()) {
          switch (value.date()) {
            case curTime.date():
              listData = [...list];
              break;
            default:
          }
        }
        return listData || [];
      };

      const onSelect = async (value: Moment) => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.id = value;
        drawerParam.title = '今日待跟进';
      };

      const drawerParam = reactive({
        id: moment().millisecond(0).second(0).minute(0).hour(0),
        state: '',
        title: '',
        visible: false,
      });
      //关闭抽屉
      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = moment().millisecond(0).second(0).minute(0).hour(0);
        drawerParam.title = '';
      };

      setTimeout(() => {
        loading.value = false;
      }, 1500);

      return {
        loading,
        isShow,
        drawerParam,
        onClose,
        list,
        getListData,
        value,
        onSelect,
        disabledDate,
      };
    },
  });
</script>
<style scoped>
  .events {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .events .ant-badge-status {
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    text-overflow: ellipsis;
    font-size: 12px;
  }

  .notes-month {
    text-align: center;
    font-size: 28px;
  }

  .notes-month section {
    font-size: 28px;
  }
</style>
