<template>
  <div class="w-full h-full lg:p-6">
    <Select
      v-model:value="updateByOne"
      style="width: 200px"
      :options="cityConst.LEVEL"
      @change="updateChange"
      :filter-option="false"
      :showSearch="true"
      :allowClear="true"
      placeholder="改变客户所在池"
      autoComplete="off"
    />
    <Button @click="submit">确认</Button>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { Select, Button } from 'ant-design-vue';
  import { defineComponent, onMounted, ref } from 'vue';
  import { transferLevel } from '/@/api/customer/crmCity/city';
  import { CityConst } from '/@/api/customer/crmCity/model/CityModel';
  import { Loading } from '/@/components/Loading';
  import { failed, success } from '/@/hooks/web/useList';

  export default defineComponent({
    name: 'SelectLevel',
    components: {
      Loading,
      Button,
      Select,
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
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const updateByOne = ref();
      const cityConst = ref(CityConst);

      let saleId = ref('');
      const updateChange = async (value) => {
        saleId.value = value;
      };

      onMounted(async () => {
        loading.value = true;
        loading.value = false;
      });

      // 确认
      const submit = async () => {
        if (saleId.value) {
          const result = await transferLevel(props.id, props.fromType, saleId.value);
          if (result.code === 200) {
            success('成功', '客户流转成功');
          } else {
            failed('失败', '客户流转失败');
          }
        }
      };

      return {
        updateChange,
        cityConst,
        updateByOne,
        tip,
        loading,
        submit,
      };
    },
  });
</script>
