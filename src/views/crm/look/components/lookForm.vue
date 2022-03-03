<template>
  <div class="p-4">
    <div>客户： {{ formState?.customerName }}</div>
    <div>联系方式： {{ formState?.customerMobile }}</div>
    <div>带看时间: {{ formState?.realLookTime?.replace('T', ' ')?.replace('.000+08:00', '') }}</div>
    <div>项目信息： {{ formState?.projectById?.name }}</div>
    <div>销售信息： {{ formState?.userByCreate?.nickName }}</div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive } from 'vue';
  import {
    getCompanyLookById,
    getEveryGroupLookById,
    getGroupLookById,
    getMemberLookById,
    getProjectLookById,
    getResidentLookById,
  } from '/@/api/customer/crmLook/look';
  import { LookModel } from '/@/api/customer/crmLook/model/lookModel';

  export default defineComponent({
    name: 'LookForm',
    components: {},
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
      const formState: LookModel = reactive({});
      onMounted(async () => {
        if (props.fromType === 'my') {
          const { content } = await getResidentLookById(props.id);
          Object.assign(formState, content);
        } else if (props.fromType === 'member') {
          const { content } = await getMemberLookById(props.id);
          Object.assign(formState, content);
        } else if (props.fromType === 'group') {
          const { content } = await getGroupLookById(props.id);
          Object.assign(formState, content);
        } else if (props.fromType === 'everyGroup') {
          const { content } = await getEveryGroupLookById(props.id);
          Object.assign(formState, content);
        } else if (props.fromType === 'company') {
          const { content } = await getCompanyLookById(props.id);
          Object.assign(formState, content);
        } else if (props.fromType === 'project') {
          const { content } = await getProjectLookById(props.id);
          Object.assign(formState, content);
        }
      });

      return {
        formState,
      };
    },
  });
</script>
