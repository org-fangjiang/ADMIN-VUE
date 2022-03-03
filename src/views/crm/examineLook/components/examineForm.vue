<template>
  <div class="p-4">
    <div>客户： {{ formState.customerName }}</div>
    <div>联系方式： {{ formState.customerMobile }}</div>
    <div>带看时间: {{ formState.realLookTime.replace('T', ' ').replace('.000+08:00', '') }}</div>
    <div>项目信息： {{ formState.projectById.name }}</div>
    <div>销售信息： {{ formState.userByCrate.nickName }}</div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive } from 'vue';
  import { LookModel } from '/@/api/customer/crmLook/model/lookModel';
  import { getResidentLookById } from '/@/api/customer/crmLook/look';

  export default defineComponent({
    name: 'ExamineForm',
    components: {},
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const formState: LookModel = reactive({});
      onMounted(async () => {
        const { content } = await getResidentLookById(props.id);
        Object.assign(formState, content);
      });

      return {
        formState,
      };
    },
  });
</script>
