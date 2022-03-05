<template>
  <div>
    <Button @click="submit">确定</Button>
    <Select
      :options="reportConst.STATES"
      v-model:value="state"
      style="width: 120px; margin-bottom: 20px"
    />
    <div v-if="formState.id">
      <div>客户名称：{{ formState.customerName }}</div>
      <div>项目名称：{{ formState.projectById.name }}</div>
      <div>预计带看时间：{{ formState.lookTime.replace('T', ' ').replace('.000+08:00', '') }}</div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { Select, Button } from 'ant-design-vue';
  import { ReportConst, ReportModel } from '/@/api/customer/crmReport/model/reportModel';
  import { examineReport, getResidentReportById } from '/@/api/customer/crmReport/report';
  import { success } from '/@/hooks/web/useList';
  export default defineComponent({
    name: 'ReviewForm',
    components: {
      Select,
      Button,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const reportConst = ref(ReportConst);
      const state = ref();

      const submit = async () => {
        if (state.value) {
          try {
            await examineReport(props.id, state.value);
            success('成功', '审核成功');
          } catch (error) {}
        }
      };
      const formState: ReportModel = reactive({});
      onMounted(async () => {
        const { content } = await getResidentReportById(props.id);
        Object.assign(formState, content);
      });
      return {
        state,
        reportConst,
        submit,
        formState,
      };
    },
  });
</script>
