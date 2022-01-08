<template>
  <div class="p-4">
    <div class="mb-2">
      线索待领取：多长时间提醒单位:
      <Input type="number" style="width: 8%" v-model:value="list.clueUnclaimed" suffix="分钟" />
      线索待跟进：多长时间提醒单位:
      <Input type="number" style="width: 8%" v-model:value="list.clueUnFollow" suffix="分钟" />
      线索未跟进掉级：多长时间未跟进掉级:
      <Input type="number" style="width: 8%" v-model:value="list.clueDropLevel" suffix="分钟" />
      <Button class="ml-3" v-auth="timeRuleConst._PERMS.UPDATE" @click="updateRule(list)"
        >更新
      </Button>
    </div>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import {
    TimeRuleModel,
    TimeRuleConst as timeRuleConst,
  } from '/@/api/marketing/timeRule/model/timeRuleModel';
  import { success, failed } from '/@/hooks/web/useList';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '/@/store/modules/user';
  import { Loading } from '/@/components/Loading';
  import { BaseResult, PageSizeList } from '/@/api/model/baseModel';
  import { get, update } from '/@/api/marketing/timeRule/timeRule';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { Button, Input } from 'ant-design-vue';

  export default defineComponent({
    name: 'TimeRuleForm',
    components: {
      Loading,
      Button,
      Input,
    },
    setup() {
      const { t } = useI18n();
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const pageSizeList = ref<string[]>(PageSizeList);
      const { prefixCls } = useDesign('timeRule');
      // 获取用户store
      const userStore = useUserStore();
      const companyId = userStore.getUserInfo.companyId;

      const condition = reactive({
        companyId: companyId,
      });

      const timeRule: TimeRuleModel = {
        clueUnclaimed: 0,
        clueUnFollow: 0,
        clueDropLevel: 0,
      };
      // 列表结果
      let list = reactive(timeRule);

      //初始加载
      onMounted(async () => {
        const result = await getList();
        Object.assign(list, result?.content);
        console.log(',,,,,,', list);
      });

      const getList = async () => {
        loading.value = true;
        let result: BaseResult<TimeRuleModel> | undefined;
        try {
          result = await get(condition);
        } catch (error: any) {
        } finally {
          loading.value = false;
        }
        return result;
      };

      const updateRule = async (item) => {
        try {
          await update({
            companyId: companyId,
            clueUnclaimed: item.clueUnclaimed,
            clueUnFollow: item.clueUnFollow,
            clueDropLevel: item.clueDropLevel,
          });
          success('更新', '成功');
        } catch (e) {
          failed('更新', '失败');
        }
        const result = await getList();
        list = result?.content || {};
      };

      return {
        t,
        prefixCls,
        loading,
        tip,
        pageSizeList,
        condition,
        companyId,
        list,
        updateRule,
        timeRuleConst,
      };
    },
  });
</script>
