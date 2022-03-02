<template>
  <div>
    <Button @click="submit">确定</Button>
    <Select
      :options="reportConst.STATES"
      v-model:value="state"
      style="width: 120px; margin-bottom: 20px"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Select, Button } from 'ant-design-vue';
  import { ReportConst } from '/@/api/customer/crmReport/model/reportModel';
  import { examineReport } from '/@/api/customer/crmReport/report';
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
      return {
        state,
        reportConst,
        submit,
      };
    },
  });
</script>
