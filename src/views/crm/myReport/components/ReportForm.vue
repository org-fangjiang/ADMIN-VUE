<template>
  <div class="px-4 pb-4 space-y-3">
    <div>客户： {{ formState.customerName }}</div>
    <div>联系方式： {{ formState.customerMobile }}</div>
    <div>预计带看: {{ formState?.lookTime?.replace('T', ' ')?.replace('.000+08:00', '') }}</div>
    <div>项目信息： {{ formState?.projectById?.name }}</div>
    <div>销售信息： {{ formState?.userByCreate?.nickName }}</div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive } from 'vue';
  import { ReportModel } from '/@/api/customer/crmReport/model/reportModel';
  import {
    getCompanyReportById,
    getGroupReportById,
    getMyReportById,
  } from '/@/api/customer/crmReport/report';

  export default defineComponent({
    name: 'ReportForm',
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
      const formState: ReportModel = reactive({});
      onMounted(async () => {
        if (props.fromType === 'my') {
          const { content } = await getMyReportById(props.id);
          Object.assign(formState, content);
        } else if (props.fromType === 'group') {
          const { content } = await getGroupReportById(props.id);
          Object.assign(formState, content);
        } else if (props.fromType === 'company') {
          const { content } = await getCompanyReportById(props.id);
          Object.assign(formState, content);
        }
      });

      return {
        formState,
      };
    },
  });
</script>
