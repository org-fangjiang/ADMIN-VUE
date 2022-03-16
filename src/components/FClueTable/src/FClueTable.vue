<template>
  <div>
    <Table :columns="clueColumns" :data-source="list" rowKey="id" :pagination="false">
      <template #projectRelationEntities="{ text: projectRelationEntities }">
        <span v-for="(item, index) in projectRelationEntities" :key="index">
          <Tag color="blue">{{ item.name }}</Tag>
        </span>
      </template>
      <template #createTime="{ text: createTime }">
        <span>{{ createTime.replace('T', ' ').replace('.000+08:00', '') }}</span>
      </template>
      <template #state="{ text: state }">
        <span>
          <Tag :color="clueConst.STATES[state].color">
            {{ clueConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
      <template #purpose="{ text: purpose }">
        <span v-if="purpose">
          <span>
            <Tag :color="clueConst.PURPOSES[purpose - 1].color">
              {{ clueConst.PURPOSES[purpose - 1].label }}
            </Tag>
          </span>
        </span>
      </template>
      <template #demand="{ text: demand }">
        <span v-if="demand">
          <span v-for="(item, index) in demand.split(',')" :key="index">
            <Tag color="blue">
              {{ item }}
            </Tag>
          </span>
        </span>
        <span v-else></span>
      </template>
      <template #operation="{ text: operation }">
        <Button
          @click="clickDelete(operation)"
          v-show="props.tabState === '1'"
          :class="prefixCls"
          v-auth="clueConst._PERMS.DELETE"
          type="link"
          size="small"
          >{{ t('marketing.action.delete') }}
        </Button>
        <Button
          v-show="props.tabState === '1'"
          v-auth="clueConst._PERMS.SELECT"
          type="link"
          size="small"
          :class="prefixCls"
          @click="clickSee(operation)"
        >
          {{ t('marketing.action.see') }}
        </Button>
        <Button
          v-show="props.tabState === '2'"
          @click="clickReceiveInvalid(operation)"
          v-auth="clueConst._PERMS.RECEIVE_INVALID"
          type="link"
          size="small"
          :class="prefixCls"
        >
          {{ t('marketing.action.receive') }}
        </Button>
        <Button
          v-show="props.tabState === '0'"
          @click="clickReceive(operation)"
          v-auth="clueConst._PERMS.RECEIVE"
          type="link"
          size="small"
          :class="prefixCls"
        >
          {{ t('marketing.action.receive') }}
        </Button>
        <Button
          v-show="props.tabState === '1'"
          @click="clickTransfer(operation)"
          v-auth="clueConst._PERMS.TRANSFER"
          type="link"
          size="small"
          :class="prefixCls"
        >
          {{ t('marketing.action.transfer') }}
        </Button>
        <Button
          v-show="props.tabState === '1'"
          @click="clickAddFollow(operation)"
          v-auth="clueConst._PERMS.ADD_FOLLOW"
          type="link"
          size="small"
          :class="prefixCls"
        >
          {{ t('marketing.action.addFollow') }}
        </Button>
      </template>
    </Table>
    <Modal
      :bodyStyle="{ overflow: 'auto', margin: '16px' }"
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      :footer="null"
      :destroyOnClose="true"
      centered
    >
      <AddFollow v-if="drawerParam.state === '0'" :id="drawerParam.id" />
    </Modal>
  </div>
</template>
<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Table, Button, Tag, Modal } from 'ant-design-vue';
  import { defineComponent, ref, onMounted, reactive } from 'vue';
  import { ColumnsClue, ClueConst } from '/@/api/marketing/clue/model/clueModel';
  import { useDesign } from '/@/hooks/web/useDesign';
  import AddFollow from '/@/views/marketing/clue/components/AddFollow.vue';

  export default defineComponent({
    name: 'FClueTable',
    components: {
      Table,
      Button,
      Tag,
      Modal,
      AddFollow,
    },
    props: {
      list: {
        type: Array,
        required: true,
      },
      tabState: {
        type: String,
        required: true,
      },
    },
    emits: ['tableAction'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('clue');
      const clueColumns = reactive(ColumnsClue);
      const clueConst = ref(ClueConst);

      onMounted(async () => {});

      let key = { code: 0, id: '' };
      const clickDelete = (record) => {
        Object.assign(key, { code: 0, id: record.id });
        emit('tableAction', key);
      };
      const clickReceive = (record) => {
        Object.assign(key, { code: 4, id: record.id });
        emit('tableAction', key);
      };
      const clickTransfer = (record) => {
        Object.assign(key, { code: 2, id: record.id });
        emit('tableAction', key);
      };
      const clickSee = (record) => {
        Object.assign(key, { code: 3, id: record.id });
        emit('tableAction', key);
      };

      const clickReceiveInvalid = (record) => {
        Object.assign(key, { code: 1, id: record.id });
        emit('tableAction', key);
      };

      const clickAddFollow = (record) => {
        drawerParam.state = '0';
        drawerParam.visible = true;
        drawerParam.id = record.id;
        drawerParam.title = '添加跟进信息';
      };

      // 抽屉参数
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
      });
      //关闭抽屉
      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.title = '';
      };

      return {
        clueColumns,
        clueConst,
        props,
        clickDelete,
        t,
        prefixCls,
        clickReceive,
        clickTransfer,
        clickSee,
        clickAddFollow,
        drawerParam,
        onClose,
        clickReceiveInvalid,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-clue';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;
    }
  }

  .@{prefix-cls} {
    &-action-menu-item {
      text-align: center;
    }

    &-add {
      margin-top: 20px;
      margin-right: 10px;
      margin-bottom: 20px;
    }
  }
</style>
