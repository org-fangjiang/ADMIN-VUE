<template>
  <div>
    <Select
      v-model:value="saleId"
      style="width: 120px"
      :options="options"
      @change="updateChange"
      @search="updateBySearch"
      :filter-option="false"
      :showSearch="true"
      :allowClear="true"
      placeholder="销售名"
      autoComplete="off"
    />
    <Button @click="addOneSave">{{ t('marketing.action.onSubmit') }}</Button>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Select, Button } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { debounce } from 'lodash-es';
  import { getUsersBySale } from '/@/api/sys/user/user';
  import { addSale } from '/@/api/customer/crmCity/city';
  import { failed, success } from '/@/hooks/web/useList';
  interface Option {
    value: String;
    label: String;
  }
  export default defineComponent({
    name: 'AddSaleForm',
    components: {
      Select,
      Button,
      Loading,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      const options = ref<Option[]>([]);
      let saleId = ref('');

      const updateBySearch = debounce(async (value) => {
        loading.value = true;
        if (value) {
          const { content } = await getUsersBySale(value);
          if (content && content.length > 0) {
            content.forEach((item) => {
              options.value?.push({ value: item.id || '', label: item.realName || '' });
            });
          }
        }
        loading.value = false;
      }, 800);

      const updateChange = async (value) => {
        saleId.value = value;
      };

      // 添加销售
      const addOneSave = async () => {
        if (saleId.value) {
          loading.value = true;
          try {
            await addSale(props.id, saleId.value);
            success('成功', '添加销售成功');
          } catch (error) {
            failed('失败', error);
          } finally {
            loading.value = false;
          }
        }
      };

      onMounted(async () => {
        loading.value = true;
        loading.value = false;
      });

      return {
        updateChange,
        updateBySearch,
        t,
        saleId,
        options,
        loading,
        tip,
        addOneSave,
      };
    },
  });
</script>
