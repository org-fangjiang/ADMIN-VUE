<template>
  <div class="min-h-[500px]">
    <Button v-auth="unitConst._PERMS.ADD" @click="addUnit" :class="`${prefixCls}-sel`">{{
      t('host.action.add')
    }}</Button>
    <div v-if="list && list.length > 0" class="grid grid-cols-2 gap-8">
      <fieldset
        v-for="item in list"
        :key="item.id"
        @click="clickHouse(item.id, item.floor, item.everyRooms, item.number)"
        style="border: 1px solid"
      >
        <legend style="width: auto; margin-left: 10%; padding-left: 20px; padding-right: 20px"
          >{{ item.number }}单元</legend
        >
        <div class="grid grid-cols-3 p-8">
          <div>每层几户：</div>
          <div class="col-span-2">{{ item.everyRooms }}</div>
          <div>平均价格：</div>
          <div class="col-span-2">{{ item.avePrice }}</div>
          <div>层数：</div>
          <div class="col-span-2">{{ item.floor }}</div>
          <div>最高成交价：</div>
          <div class="col-span-2">{{ item.heightPrice }}</div>
          <div>最低成交价：</div>
          <div class="col-span-2">{{ item.lowPrice }}</div>
          <div>状态：</div>
          <div v-if="item.state === '1'" class="col-span-2">有效</div>
          <div v-if="item.state === '0'" class="col-span-2">无效</div>
          <div class="col-span-3 mt-3" @click.stop="stop">
            <Button
              v-if="item.state === '1'"
              v-auth="unitConst._PERMS.DELETE"
              @click="deleteOne(item)"
              type="link"
              size="small"
            >
              {{ t('host.action.delete') }}
            </Button>
            <Button
              v-if="item.state === '0'"
              v-auth="unitConst._PERMS.UPDATE"
              @click="reEnableOne(item)"
              type="link"
              size="small"
            >
              {{ t('host.action.reEnable') }}
            </Button>
            <Button
              v-auth="unitConst._PERMS.UPDATE"
              @click="updateOne(item)"
              type="link"
              size="small"
            >
              {{ t('host.action.update') }}
            </Button>
          </div>
        </div>
      </fieldset>
    </div>
    <Modal
      :bodyStyle="{ overflow: 'auto', margin: '16px' }"
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width="40%"
      :footer="null"
      :destroyOnClose="true"
      centered
    >
      <AddUnitForm
        v-if="drawerParam.state === '0'"
        :buildId="props.buildId"
        :id="drawerParam.id"
        :projectId="props.projectId"
      />
      <HouseTable
        v-if="drawerParam.state === '1'"
        :id="drawerParam.id"
        :projectId="props.projectId"
        :allFloor="drawerParam.allFloor"
        :everyRooms="drawerParam.everyRooms"
        :buildName="props.buildName"
        :unitName="drawerParam.unitName"
      />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { useI18n } from 'vue-i18n';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { deleteUnit, getByBuildId, reEnableUnit } from '/@/api/host/manageUnit/manageUnit';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { UnitConst, UnitModel } from '/@/api/host/manageUnit/model/manageUnitModel';
  import { BaseListResult } from '/@/api/model/baseModel';
  import AddUnitForm from './AddUnitForm.vue';
  import { Button, Modal } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import HouseTable from './HouseTable.vue';
  import { failed, success } from '/@/hooks/web/useList';

  export default defineComponent({
    name: 'UnitForm',
    components: {
      AddUnitForm,
      Button,
      Modal,
      Loading,
      HouseTable,
    },
    props: {
      buildId: {
        type: String,
        required: false,
      },
      projectId: {
        type: String,
        required: true,
      },
      buildName: {
        type: String,
        required: false,
      },
    },
    emits: ['hiddenModal', 'haveModal'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('project');

      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //参数权限
      const unitConst = ref(UnitConst);

      const units: UnitModel[] = [];
      const list = reactive(units);
      onMounted(async () => {
        const result = await getList();
        if (result?.content && result?.content.length > 0) {
          result.content.forEach((item) => {
            list.push(item);
          });
        }
      });

      const getList = async () => {
        loading.value = true;
        let result: BaseListResult<UnitModel> | undefined;
        try {
          if (props.buildId) {
            result = await getByBuildId(props.buildId);
          }
        } catch (error: any) {
          createErrorModal({
            title: t('sys.api.errorTip'),
            content: error?.response?.data?.message || t('sys.api.networkExceptionMsg'),
          });
        } finally {
          loading.value = false;
        }
        return result;
      };

      // 抽屉参数
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
        selected: [''],
        allFloor: '',
        everyRooms: '',
        unitName: '',
      });

      //关闭抽屉
      const onClose = async () => {
        emit('haveModal');
        drawerParam.unitName = '';
        drawerParam.allFloor = '';
        drawerParam.everyRooms = '';
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        drawerParam.selected = [''];
        const result = await getList();
        if (result?.content && result?.content.length > 0) {
          list.splice(0);
          result.content.forEach((item) => {
            list.push(item);
          });
        }
      };

      const addUnit = () => {
        drawerParam.state = '0';
        drawerParam.title = '添加单元信息';
        drawerParam.id = '';
        drawerParam.visible = true;
      };
      // 更新单元信息
      const updateOne = (line) => {
        drawerParam.state = '0';
        drawerParam.title = '更新单元信息';
        drawerParam.id = line.id;
        drawerParam.visible = true;
      };

      // 房源信息
      const clickHouse = (unitId, floor, everyRooms, unitName) => {
        drawerParam.state = '1';
        drawerParam.title = '查看房源信息';
        drawerParam.id = unitId;
        drawerParam.visible = true;
        drawerParam.allFloor = floor;
        drawerParam.everyRooms = everyRooms;
        drawerParam.unitName = unitName;
        emit('hiddenModal');
      };

      const stop = () => {
        // 阻止冒泡
        const evt = window.event;
        if (evt && evt.preventDefault) {
          evt.preventDefault();
          evt.stopPropagation ? evt.stopPropagation() : (evt.cancelBubble = true);
        }
      };
      // 删除
      const deleteOne = async (line) => {
        try {
          await deleteUnit(line.id);
          success('成功', '删除成功');
        } catch (error) {
          failed('失败', '删除失败');
        }
      };

      // 恢复
      const reEnableOne = async (line) => {
        try {
          await reEnableUnit(line.id);
          success('成功', '恢复成功');
        } catch (error) {
          failed('失败', '恢复失败');
        }
      };

      return {
        updateOne,
        reEnableOne,
        deleteOne,
        onClose,
        drawerParam,
        addUnit,
        t,
        prefixCls,
        tip,
        loading,
        unitConst,
        props,
        list,
        clickHouse,
        stop,
      };
    },
  });
</script>
