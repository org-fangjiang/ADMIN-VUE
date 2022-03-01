<template>
  <div class="p-4">
    <div class="mb-3 text-[16px] font-medium">跟进信息：</div>
    <div class="grid grid-cols-5 mt-3 gap-y-3">
      <div class="place-self-center">上次跟进结果 </div>
      <div v-if="props.item.resultType === '1'" class="place-self-center">未接听</div>
      <div v-else-if="props.item.resultType === '2'" class="place-self-center">接听后挂断</div>
      <div v-else-if="props.item.resultType === '3'" class="place-self-center">通话中</div>
      <div v-else-if="props.item.resultType === '4'" class="place-self-center">拉黑</div>
      <div v-else-if="props.item.resultType === '5'" class="place-self-center">空号</div>
      <div v-else-if="props.item.resultType === '6'" class="place-self-center">不买房</div>
      <div v-else-if="props.item.resultType === '7'" class="place-self-center">同行</div>
      <div v-else class="place-self-center">其他</div>
      <div class="place-self-end col-span-2">下次跟进时间： </div>
      <div class="">{{ props.item.nextFollowTime.split('T')[0] }}</div>
      <div class="place-self-center">描述： </div>
      <div class="col-span-4">{{ props.item.description }}</div>
    </div>
    <div class="my-3 text-[16px] font-medium">客户信息：</div>
    <div class="grid grid-cols-4 mt-3 gap-y-3">
      <div class="place-self-center">意向楼盘： </div>
      <div class="">{{ projectName }}</div>
      <div class="place-self-center">客户名称： </div>
      <div class="">{{ formState.username }}</div>
      <div class="place-self-center">联系方式： </div>
      <div class="">{{ formState.contact }}</div>
      <div class="place-self-center">性别： </div>
      <div class="">
        <span v-if="formState.gender === '0'">女</span>
        <span v-if="formState.gender === '1'">男</span>
      </div>
      <div class="place-self-center">购房目的：</div>
      <div class="">
        <span v-if="formState.purpose === '1'">改善</span>
        <span v-if="formState.purpose === '2'">刚需</span>
        <span v-if="formState.purpose === '3'">结婚</span>
        <span v-if="formState.purpose === '4'">投资</span>
        <span v-if="formState.purpose === '5'">其他</span>
      </div>
      <div class="place-self-center">购房需求：</div>
      <div class="">{{ formState.demand }}</div>
      <div class="place-self-center">需求描述：</div>
      <div class="col-span-3">{{ formState.demandDescription }}</div>
      <div class="place-self-center">创建时间：</div>
      <div class="">{{ props.item.createTime.split('T')[0] }}</div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { PrivateModel } from '/@/api/customer/crmPrivate/model/PrivateModel';
  import { getMyById } from '/@/api/customer/crmPrivate/private';
  import { getProject } from '/@/api/host/project/project';

  export default defineComponent({
    name: 'FollowForm',
    components: {},
    props: {
      item: {
        type: Object,
        required: true,
      },
    },
    setup(props) {
      let projectName = ref('');
      const formState: UnwrapRef<PrivateModel> = reactive({});

      onMounted(async () => {
        if (props.item.projectId) {
          const { content } = await getProject(props.item.projectId);
          projectName.value = content.name || '';
        }
        const result = await await getMyById(props.item.customerId);
        const { content } = result;
        Object.assign(formState, content);
      });
      return {
        props,
        projectName,
        formState,
      };
    },
  });
</script>
