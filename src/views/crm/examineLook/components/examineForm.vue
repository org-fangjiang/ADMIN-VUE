<template>
  <div class="p-4">
    <Button @click="submit">确定</Button>
    <Select
      :options="lookConst.STATES"
      v-model:value="state"
      style="width: 120px; margin-bottom: 20px"
    />
    <div>客户： {{ formState?.customerName }}</div>
    <div>联系方式： {{ formState?.customerMobile }}</div>
    <div>带看时间: {{ formState?.realLookTime?.replace('T', ' ')?.replace('.000+08:00', '') }}</div>
    <div>项目信息： {{ formState?.projectById?.name }}</div>
    <div>销售信息： {{ formState?.userByUpdate?.nickName }}</div>
    <div><Image :src="formState.photoAddress" alt="" width="200px" /></div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { LookConst, LookModel } from '/@/api/customer/crmLook/model/lookModel';
  import { examineLook, getResidentLookById } from '/@/api/customer/crmLook/look';
  import { success } from '/@/hooks/web/useList';
  import { Image, Button, Select } from 'ant-design-vue';

  export default defineComponent({
    name: 'ExamineForm',
    components: { Image, Button, Select },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const lookConst = ref(LookConst);
      const state = ref();

      const submit = async () => {
        if (state.value) {
          try {
            await examineLook(props.id, state.value);
            success('成功', '审核成功');
          } catch (error) {}
        }
      };

      const formState: LookModel = reactive({});
      onMounted(async () => {
        const { content } = await getResidentLookById(props.id);
        Object.assign(formState, content);
      });

      return {
        formState,
        lookConst,
        submit,
        state,
      };
    },
  });
</script>
