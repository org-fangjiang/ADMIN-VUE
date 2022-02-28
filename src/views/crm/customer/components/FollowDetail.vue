<template>
  <div class="h-[700px]">
    <Button @click="clickAdd">添加跟进信息</Button>
    <div v-if="resultList" class="p-3">
      <div v-for="item in resultList" :key="item.id" class="border-b border-dotted pb-3">
        <div class="grid grid-cols-5 mt-3">
          <div class="place-self-center">描述： </div>
          <div class="col-span-4">{{ item.description }}</div>
          <div class="place-self-center">状态： </div>
          <div v-if="item.resultType === '1'" class="col-span-4">未接听</div>
          <div v-else-if="item.resultType === '2'" class="col-span-4">接听后挂断</div>
          <div v-else-if="item.resultType === '3'" class="col-span-4">通话中</div>
          <div v-else-if="item.resultType === '4'" class="col-span-4">拉黑</div>
          <div v-else-if="item.resultType === '5'" class="col-span-4">空号</div>
          <div v-else-if="item.resultType === '6'" class="col-span-4">不买房</div>
          <div v-else-if="item.resultType === '7'" class="col-span-4">同行</div>
          <div v-else>其他</div>
          <div class="place-self-center">下次跟进： </div>
          <div class="col-span-4">{{
            item.nextFollowTime.replace('T', ' ').replace('.000+08:00', '')
          }}</div>
          <div class="place-self-center">跟进人： </div>
          <div class="col-span-4">{{ item.userBySaleId.realName }}</div>
        </div>
        <Button v-if="curFollow.includes(item.id)" @click="clickUpdate(item)" class="mt-3"
          >更新</Button
        >
      </div>
    </div>
    <Modal
      v-model:visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width="40%"
      :bodyStyle="{ overflowY: 'auto', margin: '16px' }"
      :destroyOnClose="true"
      :footer="null"
    >
      <FollowForm
        :id="props.id"
        :fromType="props.fromType"
        v-if="drawerParam.state === '0'"
        :followId="drawerParam.id"
      />
    </Modal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { getAll } from '/@/api/customer/crmFollow/follow';
  import { Button, Modal } from 'ant-design-vue';
  import FollowForm from './FollowForm.vue';
  import { FollowModel } from '/@/api/customer/crmFollow/model/followModel';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'FollowDetail',
    components: {
      Button,
      Modal,
      FollowForm,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
      fromType: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      let result: FollowModel[] = [];
      let resultList = reactive(result);

      const drawerParam = reactive({
        id: '',
        state: '',
        visible: false,
        title: '',
      });

      const clickUpdate = (item) => {
        drawerParam.id = item.id;
        drawerParam.visible = true;
        drawerParam.title = '更新信息';
        drawerParam.state = '0';
      };

      const clickAdd = () => {
        drawerParam.visible = true;
        drawerParam.title = '跟进信息';
        drawerParam.state = '0';
      };

      const onClose = async () => {
        const { content } = await getAll(props.id);
        resultList.splice(0);
        resultList.push(...content);
        drawerParam.visible = false;
        drawerParam.title = '';
        drawerParam.state = '';
        drawerParam.id = '';
      };

      let curFollow = ref<string[]>([]);
      const userStore = useUserStore();
      const userId = userStore.getUserInfo.id;

      onMounted(async () => {
        const { content } = await getAll(props.id);
        if (content) {
          resultList.push(...content);
          content.forEach((item) => {
            if (item.userBySaleId.id === userId) {
              curFollow.value.push(item.id || '');
            }
          });
        }
      });

      return {
        result,
        clickAdd,
        props,
        drawerParam,
        onClose,
        resultList,
        curFollow,
        clickUpdate,
      };
    },
  });
</script>
