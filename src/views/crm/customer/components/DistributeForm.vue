<template>
  <div class="w-full h-full lg:p-6">
    <Select
      v-model:value="updateByOne"
      style="width: 120px"
      :options="updateUsers"
      @change="updateChange"
      @search="updateBySearch"
      :filter-option="false"
      :showSearch="true"
      :allowClear="true"
      placeholder="销售名"
      autoComplete="off"
    />
    <Button @click="submit">确认</Button>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { Select, Button } from 'ant-design-vue';
  import { debounce } from 'lodash-es';
  import { defineComponent, onMounted, ref } from 'vue';
  import { distribute, distributeBatch } from '/@/api/customer/crmCity/city';
  import { transferSale } from '/@/api/customer/crmPrivate/private';
  import { getUsersBySale } from '/@/api/sys/user/user';
  import { Loading } from '/@/components/Loading';
  import { failed, success } from '/@/hooks/web/useList';
  import { useUserStore } from '/@/store/modules/user';

  interface Option {
    value: String;
    label: String;
  }
  export default defineComponent({
    name: 'DistributeForm',
    components: {
      Loading,
      Button,
      Select,
    },
    props: {
      id: {
        type: String,
        required: false,
        default: '',
      },
      ids: {
        type: Array,
        required: false,
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
      const updateUsers = ref<Option[]>([]);
      const updateBySearch = debounce(async (value) => {
        loading.value = true;
        if (value) {
          const { content } = await getUsersBySale(value);
          if (content && content.length > 0) {
            content.forEach((item) => {
              updateUsers.value?.push({ value: item.id || '', label: item.realName || '' });
            });
          }
        }
        loading.value = false;
      }, 800);

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
        if (props.id) {
          if (props.fromType === 'private') {
            try {
              const userStore = useUserStore();
              const userId = userStore.getUserInfo.id;
              await transferSale(props.id, userId, saleId.value);
              success('成功', '客户转移成功');
            } catch (error) {
              failed('失败', '客户转移失败');
            }
          } else {
            try {
              await distribute(props.fromType, props.id, saleId.value);
              success('成功', '客户分配成功');
            } catch (error) {}
          }
        } else if (props.ids) {
          if (props.fromType === 'private') {
            // try {
            //
            //   success('成功', '客户转移成功');
            // } catch (error) {
            //   failed('失败', '客户转移失败');
            // }
          } else {
            try {
              const result = await distributeBatch(
                props.fromType,
                props.ids as string[],
                saleId.value
              );
              if (result.failNum > 0) {
                failed('失败', result.failNum + '个客户分配失败');
                return;
              }
              success('成功', '客户分配成功');
            } catch (error) {
              failed('失败', '客户分配失败');
            }
          }
        }
      };

      return {
        updateChange,
        updateBySearch,
        updateByOne,
        tip,
        loading,
        submit,
        updateUsers,
      };
    },
  });
</script>
