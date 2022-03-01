<template>
  <PageWrapper>
    <template #headerContent> <WorkbenchHeader /> </template>
    <Calendar v-if="isShow" v-model:value="value" @select="onSelect" :disabled-date="disabledDate">
      <template #headerRender>
        <div></div>
      </template>
      <template #dateCellRender="{ current: value2 }">
        <ul class="events" @click.stop="onStop">
          <li v-for="item in getListData(value2)" :key="item.content">
            <Badge
              :status="'success'"
              :text="item.content.description"
              @click="onClick(item.content)"
            />
          </li>
        </ul>
      </template>
    </Calendar>
    <Modal
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width=""
      :bodyStyle="{ overflow: 'auto' }"
      :destroyOnClose="true"
      :footer="null"
    >
      <FollowForm v-if="drawerParam.state === '0'" :item="drawerParam.content" />
      <!-- <SelectDetail v-if="drawerParam.state === '0'" :privateId="drawerParam.content.customerId" /> -->
    </Modal>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { Calendar, Badge, Modal } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import WorkbenchHeader from './components/WorkbenchHeader.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { getNextFollow, getNextFollowInDay } from '/@/api/customer/crmFollow/follow';
  import moment, { Moment } from 'moment';
  import FollowForm from './components/FollowForm.vue';
  // import SelectDetail from '../../crm/customer/components/SelectDetail.vue';

  export default defineComponent({
    components: {
      PageWrapper,
      WorkbenchHeader,
      Calendar,
      Badge,
      FollowForm,
      Modal,
      // SelectDetail,
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
        if (isShow.value) {
          const result = await getNextFollow();
          if (result.content && result.content.length > 0) {
            list.push(...result.content);
          }
        }
      });

      const onStop = () => {
        const evt = window.event;
        if (evt && evt.preventDefault) {
          evt.preventDefault();
          evt.stopPropagation ? evt.stopPropagation() : (evt.cancelBubble = true);
        }
      };

      const disabledDate = (current: any) => {
        return current < moment().subtract(1, 'day');
      };

      const value = ref<Moment>(moment());
      const curTime = moment();
      const clickList: any[] = reactive([]);

      const getListData = (value3: Moment) => {
        let listData;
        switch (value3.date()) {
          case curTime.date():
            listData = [...list];
            if (value3.month() != curTime.month()) {
              listData.splice(0);
            }
            break;
          case value.value.date():
            if (value3.month() === value.value.month()) {
              listData = [...clickList];
            }
            break;
          default:
        }
        return listData || [];
      };

      const onClick = (e) => {
        drawerParam.visible = true;
        drawerParam.state = '0';
        drawerParam.content = e;
        drawerParam.title = '今日待跟进';
      };

      const onSelect = async (value: Moment) => {
        clickList.splice(0);
        const result = await getNextFollowInDay(value);
        clickList.push(...result.content);
      };

      const drawerParam = reactive({
        content: undefined,
        state: '',
        title: '',
        visible: false,
      });
      //关闭抽屉
      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.content = undefined;
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
        onClick,
        onStop,
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
