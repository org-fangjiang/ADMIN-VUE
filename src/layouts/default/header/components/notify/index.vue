<template>
  <div :class="prefixCls">
    <Popover title="" trigger="click" :overlayClassName="`${prefixCls}__overlay`">
      <Badge :count="count" dot :numberStyle="numberStyle">
        <BellOutlined />
      </Badge>
      <template #content>
        <Tabs>
          <template v-for="item in listData" :key="item.key">
            <TabPane>
              <template #tab>
                {{ item.name }}
                <span v-if="item.list.length !== 0">({{ item.list.length }})</span>
              </template>
              <!-- 绑定title-click事件的通知列表中标题是“可点击”的-->
              <NoticeList :list="item.list" v-if="item.key === '1'" @title-click="onNoticeClick" />
              <NoticeList :list="item.list" v-else />
            </TabPane>
          </template>
        </Tabs>
      </template>
    </Popover>
    <audio controls="controls" hidden src="/src/assets/mp3/tip.mp3" ref="audio"></audio>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, getCurrentInstance, ref } from 'vue';
  import { Popover, Tabs, Badge } from 'ant-design-vue';
  import { BellOutlined } from '@ant-design/icons-vue';
  import { tabListData, ListItem } from './data';
  import NoticeList from './NoticeList.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { initStomp as wsInit } from '/@/websocket/socket';
  import { Client } from '@stomp/stompjs';

  export default defineComponent({
    components: { Popover, BellOutlined, Tabs, TabPane: Tabs.TabPane, Badge, NoticeList },
    setup() {
      const userStore = useUserStore();
      const userId = userStore.userInfo?.id || '';
      const roleName = userStore.userInfo?.roleName || 'temp';
      const audio = ref();

      // websocket 消息回调
      const onMessage = function (message) {
        audio.value.currentTime = 0;
        audio.value.play();
        console.log('onMessage', message.body);
      };
      const instance = getCurrentInstance();
      const client: Client = wsInit(roleName, userId, onMessage, instance);

      const { prefixCls } = useDesign('header-notify');
      const { createMessage } = useMessage();
      const listData = ref(tabListData);

      const count = computed(() => {
        let count = 0;
        for (let i = 0; i < tabListData.length; i++) {
          count += tabListData[i].list.length;
        }
        return count;
      });

      function onNoticeClick(record: ListItem) {
        createMessage.success('你点击了通知，ID=' + record.id);
        // 可以直接将其标记为已读（为标题添加删除线）,此处演示的代码会切换删除线状态
        record.titleDelete = !record.titleDelete;
        // 推送信息
        const data = { aaa: 'hello world' };
        client.publish({
          destination: '/message/receive',
          body: JSON.stringify(data),
        });
      }

      return {
        prefixCls,
        listData,
        count,
        onNoticeClick,
        numberStyle: {},
        audio,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-notify';

  .@{prefix-cls} {
    padding-top: 2px;

    &__overlay {
      max-width: 360px;
    }

    .ant-tabs-content {
      width: 300px;
    }

    .ant-badge {
      font-size: 18px;

      .ant-badge-multiple-words {
        padding: 0 4px;
      }

      svg {
        width: 0.9em;
      }
    }
  }
</style>
