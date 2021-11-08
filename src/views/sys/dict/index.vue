// 字典信息管理页面

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <GroupTable
      :ref="groupRefFunc"
      @onAddDetail="addDetail"
      @onUpdateGroup="updateGroup"
      @onAddGroup="addGroup"
    >
      <template #group="{ group }">
        <DetailTable :ref="detailRefFunc" :groupId="group.id" @onUpdateDetail="updateDetail" />
      </template>
    </GroupTable>

    <Drawer
      :zIndex="1"
      :title="drawerParam.title"
      :width="'100%'"
      :destroyOnClose="true"
      :visible="drawerParam.visible"
      :get-container="false"
      :wrapClassName="`${prefixCls}-drawer`"
      :maskStyle="{ background: 'rgba(0, 0, 0, 0)' }"
      :wrap-style="{ position: 'fixed', top: '80px', righ: '0' }"
      @close="onClose"
    >
      <DetailForm
        v-if="drawerParam.state === '0'"
        :groupId="drawerParam.groupId"
        :id="drawerParam.id"
      />
      <GroupForm v-if="drawerParam.state === '1'" :id="drawerParam.id" />
    </Drawer>
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, ref, reactive } from 'vue';
  import { Drawer } from 'ant-design-vue';
  import DetailTable from './components/DetailTable.vue';
  import GroupTable from './components/GroupTable.vue';
  import DetailForm from './components/DetailForm.vue';
  import GroupForm from './components/GroupForm.vue';
  export default defineComponent({
    name: 'Location',
    components: {
      Drawer,
      DetailTable,
      DetailForm,
      GroupTable,
      GroupForm,
    },
    setup() {
      const { t } = useI18n();
      const { prefixCls } = useDesign('dict');
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      const groupRefObject = reactive<any>([]);
      const detailRefObject = reactive<any>([]);
      //抽屉
      const drawerParam = reactive({
        id: '', //当前数据项的编号
        groupId: '', //根据传入的分组id进行添加和修改字典详情
        state: '', // 0: detail 1: group
        title: '',
        visible: false,
      });
      //关闭抽屉
      const onClose = () => {
        try {
          switch (drawerParam.state) {
            //刷新组件
            case '1':
              groupRefObject[0].refresh();
              break;
            case '0':
              detailRefObject[0].refresh();
              break;
          }
          groupRefObject.splice(0); //清空
          detailRefObject.splice(0);
        } catch (e) {
          console.error(e);
        }

        drawerParam.id = '';
        drawerParam.groupId = '';
        drawerParam.state = '';
        drawerParam.title = '';
        drawerParam.visible = false;
      };

      //添加分组
      const addGroup = () => {
        drawerParam.visible = true;
        drawerParam.id = '';
        drawerParam.state = '1';
        drawerParam.title = t('model.dict.group.addGroup');
      };
      //更新分组
      const updateGroup = (e) => {
        drawerParam.visible = true;
        drawerParam.id = e.groupId;
        drawerParam.state = '1';
        drawerParam.title = t('model.dict.group.updateGroup');
      };
      //添加详情
      const addDetail = (e) => {
        drawerParam.visible = true;
        drawerParam.groupId = e.groupId;
        drawerParam.state = '0';
        drawerParam.title = t('model.dict.detail.addDetail');
      };
      //更新详情
      const updateDetail = (e) => {
        debugger;
        drawerParam.visible = true;
        drawerParam.id = e.detailId;
        drawerParam.state = '0';
        drawerParam.title = t('model.dict.detail.updateDetail');
      };

      const groupRefFunc = (el) => {
        groupRefObject.push(el);
      };
      const detailRefFunc = (el) => {
        detailRefObject.push(el);
      };

      return {
        t,
        prefixCls,
        tip,
        loading,
        groupRefFunc,
        detailRefFunc,
        drawerParam,
        onClose,
        addGroup,
        addDetail,
        updateGroup,
        updateDetail,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-dict';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;
    }
  }

  .@{prefix-cls} {
    &-drawer {
      max-width: 500px;
    }

    &-action-menu-item {
      text-align: center;
    }
  }
</style>
