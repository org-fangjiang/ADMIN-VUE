<template>
  <div class="min-h-[500px] overflow-y-scroll">
    <div class="p-4">
      <Select
        :options="options"
        @change="changeType"
        :allowClear="true"
        v-model:value="houseType"
        style="width: 120px"
      />
      <div>
        <div
          v-show="allHidden"
          v-for="(item, index) in allHouse"
          :key="index"
          :class="'grid grid-cols-' + props.everyRooms"
          class="gap-3 mb-3"
        >
          <div
            v-for="e in item"
            :key="e"
            class="border p-3 text-center min-h-[100px] grid items-stretch"
          >
            <div v-if="index < 9" class="self-center">
              <div v-if="e?.id">
                <Popover
                  :title="props.buildName + '栋-' + props.unitName + '单元-' + e.number + '室'"
                  trigger="hover"
                >
                  <template #content>
                    <div>成交价：{{ e.price }}</div>
                    <div>渠道名：{{ e.channelById.name }}</div>
                    <div>楼层：{{ e?.floor }}</div>
                    <div>描述：{{ e.description }}</div>
                    <div
                      >状态： <span v-if="e.state === '0'">无效</span
                      ><span v-if="e.state === '1'">有效</span></div
                    >
                    <Button
                      v-if="e.state === '1'"
                      v-auth="manageHouseConst._PERMS.DELETE"
                      @click="deleteOne(e)"
                      type="link"
                      size="small"
                    >
                      {{ t('host.action.delete') }}
                    </Button>
                    <Button
                      v-if="e.state === '0'"
                      v-auth="manageHouseConst._PERMS.UPDATE"
                      @click="reEnableOne(e)"
                      type="link"
                      size="small"
                    >
                      {{ t('host.action.reEnable') }}
                    </Button>
                    <Button
                      v-auth="manageHouseConst._PERMS.UPDATE"
                      @click="updateOne(e)"
                      type="link"
                      size="small"
                    >
                      {{ t('host.action.update') }}
                    </Button>
                  </template>
                  <div>
                    <div>房源号：{{ e.number }}</div>
                    <div>成交价：{{ e.price }}</div>
                    <div>渠道名：{{ e.channelById.name }}</div>
                  </div>
                </Popover>
              </div>
              <div v-else @click="addHouse('0' + (index + 1) + e.number)">
                <Popover
                  :title="
                    props.buildName +
                    '栋-' +
                    props.unitName +
                    '单元-' +
                    '0' +
                    (index + 1) +
                    e.number +
                    '室'
                  "
                  trigger="hover"
                >
                  <template #content>
                    <div> 房源号： {{ '0' + (index + 1) }}{{ e.number }} </div>
                  </template>
                  <div> {{ '0' + (index + 1) }}{{ e.number }} </div>
                </Popover>
              </div>
            </div>
            <div v-else class="self-center">
              <div v-if="e?.id">
                <Popover :title="e.number" trigger="hover">
                  <template #content>
                    <div>成交价：{{ e.price }}</div>
                    <div>渠道名：{{ e.channelById.name }}</div>
                    <div>楼层：{{ e?.floor }}</div>
                    <div>描述：{{ e.description }}</div>
                    <div
                      >状态： <span v-if="e.state === '0'">无效</span
                      ><span v-if="e.state === '1'">有效</span></div
                    >
                    <Button
                      v-if="e.state === '1'"
                      v-auth="manageHouseConst._PERMS.DELETE"
                      @click="deleteOne(e)"
                      type="link"
                      size="small"
                    >
                      {{ t('host.action.delete') }}
                    </Button>
                    <Button
                      v-if="e.state === '0'"
                      v-auth="manageHouseConst._PERMS.UPDATE"
                      @click="reEnableOne(e)"
                      type="link"
                      size="small"
                    >
                      {{ t('host.action.reEnable') }}
                    </Button>
                    <Button
                      v-auth="manageHouseConst._PERMS.UPDATE"
                      @click="updateOne(e)"
                      type="link"
                      size="small"
                    >
                      {{ t('host.action.update') }}
                    </Button>
                  </template>
                  <div>
                    <div>房源号：{{ e.number }}</div>
                    <div>成交价：{{ e.price }}</div>
                    <div>渠道名：{{ e.channelById.name }}</div>
                  </div>
                </Popover>
              </div>
              <div v-else @click="addHouse(index + 1 + e.number)">
                <Popover
                  :title="
                    props.buildName +
                    '栋-' +
                    props.unitName +
                    '单元-' +
                    (index + 1) +
                    e.number +
                    '室'
                  "
                  trigger="hover"
                >
                  <template #content>
                    <div> 房源号： {{ index + 1 }}{{ e.number }} </div>
                  </template>
                  <div> {{ index + 1 }}{{ e.number }} </div>
                </Popover>
              </div>
            </div>
          </div>
        </div>
        <div
          v-show="dealHidden"
          v-for="(item, index) in allHouse"
          :key="index"
          :class="'grid grid-cols-' + props.everyRooms"
          class="gap-3 mb-3"
        >
          <div
            v-for="e in item"
            :key="e"
            class="border p-3 text-center min-h-[100px] grid items-stretch"
          >
            <div v-if="index < 9" class="self-center">
              <div v-if="e?.id">
                <Popover
                  :title="props.buildName + '栋-' + props.unitName + '单元-' + e.number + '室'"
                  trigger="hover"
                >
                  <template #content>
                    <div>成交价：{{ e.price }}</div>
                    <div>渠道名：{{ e.channelById.name }}</div>
                    <div>楼层：{{ e?.floor }}</div>
                    <div>描述：{{ e.description }}</div>
                    <div
                      >状态： <span v-if="e.state === '0'">无效</span
                      ><span v-if="e.state === '1'">有效</span></div
                    >
                    <Button
                      v-if="e.state === '1'"
                      v-auth="manageHouseConst._PERMS.DELETE"
                      @click="deleteOne(e)"
                      type="link"
                      size="small"
                    >
                      {{ t('host.action.delete') }}
                    </Button>
                    <Button
                      v-if="e.state === '0'"
                      v-auth="manageHouseConst._PERMS.UPDATE"
                      @click="reEnableOne(e)"
                      type="link"
                      size="small"
                    >
                      {{ t('host.action.reEnable') }}
                    </Button>
                    <Button
                      v-auth="manageHouseConst._PERMS.UPDATE"
                      @click="updateOne(e)"
                      type="link"
                      size="small"
                    >
                      {{ t('host.action.update') }}
                    </Button>
                  </template>
                  <div>
                    <div>房源号：{{ e.number }}</div>
                    <div>成交价：{{ e.price }}</div>
                    <div>渠道名：{{ e.channelById.name }}</div>
                  </div>
                </Popover>
              </div>
            </div>
            <div v-else class="self-center">
              <div v-if="e?.id">
                <Popover :title="e.number" trigger="hover">
                  <template #content>
                    <div>成交价：{{ e.price }}</div>
                    <div>渠道名：{{ e.channelById.name }}</div>
                    <div>楼层：{{ e?.floor }}</div>
                    <div>描述：{{ e.description }}</div>
                    <div
                      >状态： <span v-if="e.state === '0'">无效</span
                      ><span v-if="e.state === '1'">有效</span></div
                    >
                    <Button
                      v-if="e.state === '1'"
                      v-auth="manageHouseConst._PERMS.DELETE"
                      @click="deleteOne(e)"
                      type="link"
                      size="small"
                    >
                      {{ t('host.action.delete') }}
                    </Button>
                    <Button
                      v-if="e.state === '0'"
                      v-auth="manageHouseConst._PERMS.UPDATE"
                      @click="reEnableOne(e)"
                      type="link"
                      size="small"
                    >
                      {{ t('host.action.reEnable') }}
                    </Button>
                    <Button
                      v-auth="manageHouseConst._PERMS.UPDATE"
                      @click="updateOne(e)"
                      type="link"
                      size="small"
                    >
                      {{ t('host.action.update') }}
                    </Button>
                  </template>
                  <div>
                    <div>房源号：{{ e.number }}</div>
                    <div>成交价：{{ e.price }}</div>
                    <div>渠道名：{{ e.channelById.name }}</div>
                  </div>
                </Popover>
              </div>
            </div>
          </div>
        </div>
        <div
          v-show="reviewHidden"
          v-for="(item, index) in allHouse"
          :key="index"
          :class="'grid grid-cols-' + props.everyRooms"
          class="gap-3 mb-3"
        >
          <div
            v-for="e in item"
            :key="e"
            class="border p-3 text-center min-h-[100px] grid items-stretch"
          >
            <div v-if="index < 9" class="self-center">
              <div v-if="!e?.id" @click="addHouse('0' + (index + 1) + e.number)">
                <Popover
                  :title="
                    props.buildName +
                    '栋-' +
                    props.unitName +
                    '单元-' +
                    '0' +
                    (index + 1) +
                    e.number +
                    '室'
                  "
                  trigger="hover"
                >
                  <template #content>
                    <div> 房源号： {{ '0' + (index + 1) }}{{ e.number }} </div>
                  </template>
                  <div> {{ '0' + (index + 1) }}{{ e.number }} </div>
                </Popover>
              </div>
            </div>
            <div v-else class="self-center">
              <div v-if="!e?.id" @click="addHouse(index + 1 + e.number)">
                <Popover
                  :title="
                    props.buildName +
                    '栋-' +
                    props.unitName +
                    '单元-' +
                    (index + 1) +
                    e.number +
                    '室'
                  "
                  trigger="hover"
                >
                  <template #content>
                    <div> 房源号： {{ index + 1 }}{{ e.number }} </div>
                  </template>
                  <div> {{ index + 1 }}{{ e.number }} </div>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal
      :bodyStyle="{ overflow: 'auto', margin: '16px' }"
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      width="60%"
      :footer="null"
      :destroyOnClose="true"
      centered
    >
      <AddHouseForm
        v-if="drawerParam.state === '0'"
        :unitId="props.id"
        :id="drawerParam.id"
        :projectId="props.projectId"
        :houseId="drawerParam.houseId"
      />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
  import { deleteMange, getByUnitId, reEnableManage } from '/@/api/host/manageHouse/manageHouse';
  import {
    Columns as columns,
    ManageHouseConst,
    ManageHouseModel,
  } from '/@/api/host/manageHouse/model/manageHouseModel';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Button, Modal, Popover, Select } from 'ant-design-vue';
  import AddHouseForm from './AddHouseForm.vue';
  import { Loading } from '/@/components/Loading';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { failed, success } from '/@/hooks/web/useList';

  export default defineComponent({
    name: 'HouseTable',
    components: {
      Button,
      AddHouseForm,
      Modal,
      Loading,
      Popover,
      Select,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
      projectId: {
        type: String,
        required: true,
      },
      allFloor: {
        type: Number,
        required: true,
      },
      everyRooms: {
        type: Number,
        required: true,
      },
      unitName: {
        type: String,
        required: false,
      },
      buildName: {
        type: String,
        required: false,
      },
    },
    setup(props) {
      const { prefixCls } = useDesign('project');
      let tip = ref<string>('加载中...');

      let loading = ref<boolean>(true);
      const { t } = useI18n();
      const manageHouseConst = ref(ManageHouseConst);
      const house: ManageHouseModel[] = [];
      const list = reactive(house);
      let floors = ref<string[]>([]);
      let count = 0;

      // 所有房源
      let allHidden = ref(true);
      // 成交房源
      let dealHidden = ref(false);
      // 未成交
      let reviewHidden = ref(false);
      const options = [
        { value: '1', label: '成交房源' },
        { value: '2', label: '未成交房源' },
      ];
      let houseType = ref('');
      watch(
        () => houseType.value,
        () => {
          if (houseType.value === '1') {
            dealHidden.value = true;
            allHidden.value = false;
            reviewHidden.value = false;
          } else if (houseType.value === '2') {
            dealHidden.value = false;
            allHidden.value = false;
            reviewHidden.value = true;
          } else {
            dealHidden.value = false;
            allHidden.value = true;
            reviewHidden.value = false;
          }
        }
      );
      // 修改查询状态
      const changeType = (value) => {
        houseType.value = value;
      };

      let allHouse = ref<any[]>([]);

      onMounted(async () => {
        for (let i = 0; i < props.allFloor; i++) {
          allHouse.value.push({});
          for (let j = 0; j < props.everyRooms; j++) {
            allHouse.value[i][j] = { number: '' };
            if (i < 10) {
              allHouse.value[i][j].number = '0' + (i + 1);
            } else {
              allHouse.value[i][j].number = '' + (i + 1);
            }
            if (j < 10) {
              allHouse.value[i][j].number = '0' + (j + 1);
            } else {
              allHouse.value[i][j].number = '' + (j + 1);
            }
          }
        }
        const { content } = await getByUnitId(props.id);
        if (content && content.length > 0) {
          list.push(...content);
          list.forEach((item) => {
            if (item.floor && !floors.value.includes(item.floor)) {
              floors.value.push(item.floor);
            }
          });
          onJi();
        }
        list.forEach((item) => {
          const float = Number(item.number?.substring(0, 2)) - 1;
          const house = Number(item.number?.substring(2)) - 1;
          allHouse.value[float][house] = item;
        });
        loading.value = false;
      });
      // 倒序
      const onJi = () => {
        if (floors.value && floors.value.length > 0) {
          let t;
          for (let i = 0; i < floors.value.length - 1; i++) {
            for (let j = 0; j < floors.value.length - 1 - i; j++) {
              if (floors.value[j] < floors.value[j + 1]) {
                t = floors.value[j];
                floors.value[j] = floors.value[j + 1];
                floors.value[j + 1] = t;
              }
            }
          }
        }
      };

      // 删除
      const deleteOne = async (line) => {
        loading.value = true;
        try {
          await deleteMange(line.id);
          success('成功', '删除成功');
          const { content } = await getByUnitId(props.id);
          if (content && content.length > 0) {
            list.splice(0);
            list.push(...content);
            list.forEach((item) => {
              const float = Number(item.number?.substring(0, 2)) - 1;
              const house = Number(item.number?.substring(2)) - 1;
              allHouse.value[float][house] = item;
            });
          }
        } catch (error) {
          failed('失败', '删除失败');
        } finally {
          loading.value = false;
        }
      };
      // 恢复
      const reEnableOne = async (line) => {
        loading.value = true;
        try {
          await reEnableManage(line.id);
          success('成功', '恢复成功');
          const { content } = await getByUnitId(props.id);
          if (content && content.length > 0) {
            list.splice(0);
            list.push(...content);
            list.forEach((item) => {
              const float = Number(item.number?.substring(0, 2)) - 1;
              const house = Number(item.number?.substring(2)) - 1;
              allHouse.value[float][house] = item;
            });
          }
        } catch (error) {
          failed('失败', '恢复失败');
        } finally {
          loading.value = false;
        }
      };

      // 抽屉参数
      const drawerParam = reactive({
        id: '',
        state: '',
        title: '',
        visible: false,
        houseId: '',
      });

      //关闭抽屉
      const onClose = async () => {
        drawerParam.visible = false;
        drawerParam.state = '';
        drawerParam.id = '';
        drawerParam.title = '';
        drawerParam.houseId = '';
        list.splice(0);
        const { content } = await getByUnitId(props.id);
        if (content && content.length > 0) {
          list.push(...content);
        }
        list.forEach((item) => {
          const float = Number(item.number?.substring(0, 2)) - 1;
          const house = Number(item.number?.substring(2)) - 1;
          allHouse.value[float][house] = item;
        });
      };

      const addHouse = (id) => {
        drawerParam.houseId = id;
        drawerParam.id = '';
        drawerParam.state = '0';
        drawerParam.title = '添加房源信息';
        drawerParam.visible = true;
      };

      // 更新
      const updateOne = (item) => {
        drawerParam.id = item.id;
        drawerParam.state = '0';
        drawerParam.title = '更新房源信息';
        drawerParam.visible = true;
      };

      return {
        count,
        t,
        house,
        list,
        manageHouseConst,
        addHouse,
        drawerParam,
        onClose,
        props,
        columns,
        prefixCls,
        loading,
        tip,
        deleteOne,
        reEnableOne,
        floors,
        updateOne,
        allHouse,
        options,
        allHidden,
        dealHidden,
        reviewHidden,
        changeType,
        houseType,
      };
    },
  });
</script>
