<template>
  <div>
    <Button v-if="!isHas" v-auth="saleProjectConst._PERMS.ADD" @click="addSale">{{
      t('crm.addSale')
    }}</Button>
    <Button v-if="isHas" v-auth="saleProjectConst._PERMS.DELETE" @click="deleteSale">{{
      t('crm.deleteSale')
    }}</Button>
    <Table
      :columns="saleProjectColumns"
      :data-source="list"
      rowKey="id"
      :pagination="false"
      :scroll="{ y: 'calc(70vh)' }"
    >
      <template #sysUserRelationEntity="{ text: sysUserRelationEntity }">
        <span>{{ sysUserRelationEntity.nickName }}</span>
      </template>
      <template #state="{ text: state }">
        <span>
          <Tag :color="saleProjectConst.STATES[state].color">
            {{ saleProjectConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
    </Table>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { getByProject } from '/@/api/customer/crmSale/crmSale';
  import { SaleProjectModel } from '/@/api/customer/crmSale/model/crmSaleModel';
  import { Table, Button, Tag } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import {
    SaleProjectConst,
    SaleProjectColumns as saleProjectColumns,
  } from '/@/api/customer/crmSale/model/crmSaleModel';
  import { getUserInfo } from '/@/api/sys/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { failed, success } from '/@/hooks/web/useList';
  import { add, deletePro } from '/@/api/customer/crmSale/crmSale';

  export default defineComponent({
    name: 'ProjectSale',
    components: {
      Table,
      Loading,
      Button,
      Tag,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const sales: SaleProjectModel[] = [];
      const list = reactive(sales);
      const saleProjectConst = ref(SaleProjectConst);
      let loading = ref<boolean>(false);
      let tip = ref<string>('加载中...');

      // 已驻守该楼盘
      let isHas = ref(false);
      onMounted(async () => {
        loading.value = true;
        const { content } = await getByProject(props.id);
        if (content && content.length > 0) {
          list.push(...content);
        }
        const userInfo = await getUserInfo();
        if (content && content.length > 0) {
          content.forEach((item) => {
            if (item.saleId === userInfo.id) {
              isHas.value = true;
            }
          });
        }
        loading.value = false;
      });

      // 驻守
      const addSale = async () => {
        loading.value = true;
        try {
          await add(props.id);
          success('成功', '驻守楼盘成功');
          isHas.value = true;
          const { content } = await getByProject(props.id);
          list.splice(0);
          if (content && content.length > 0) {
            list.push(...content);
          }
        } catch (error) {
          failed('失败', '驻守楼盘失败');
        } finally {
          loading.value = false;
        }
      };

      // 取消驻守
      const deleteSale = async () => {
        loading.value = true;
        try {
          await deletePro(props.id);
          success('成功', '取消驻守楼盘成功');
          isHas.value = false;
          const { content } = await getByProject(props.id);
          list.splice(0);
          if (content && content.length > 0) {
            list.push(...content);
          }
        } catch (error) {
          failed('失败', '取消驻守楼盘失败');
        } finally {
          loading.value = false;
        }
      };

      return {
        addSale,
        deleteSale,
        list,
        saleProjectColumns,
        saleProjectConst,
        isHas,
        t,
        loading,
        tip,
      };
    },
  });
</script>
