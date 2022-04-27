<template>
  <div class="p-4 grid grid-cols-2 gap-y-4">
    <div>编号: {{ formState.identifier }}</div>
    <div>小区: {{ formState.entityByProjectId?.name }}</div>
    <div>楼号: {{ formState.entityByBuildId?.number }}</div>
    <div>单元: {{ formState.entityByUnitId?.number }}</div>
    <div>房屋面积: {{ formState.area }}㎡</div>
    <div>首付: {{ formState.downPayments }}万元</div>
    <div class="col-span-2">标题：{{ formState.title }}</div>
    <div>房号： {{ formState.number }}</div>
    <div>楼层: {{ formState.floor }}层</div>
    <div>
      楼层类型：
      <span v-if="formState.floorType === '1'">低层</span>
      <span v-if="formState.floorType === '2'">中层</span>
      <span v-if="formState.floorType === '3'">高层</span>
    </div>
    <div>挂牌价格：{{ formState.price }}万元</div>
    <div class="col-span-2"
      >标签：<span v-if="formState?.beansByLabels?.length > 0"
        ><span v-for="item in formState.beansByLabels" :key="item.id"
          >{{ item.value }}&nbsp;&nbsp;&nbsp;</span
        ></span
      ></div
    >
    <div>{{ formState.rooms }}室{{ formState.hall }}厅{{ formState.toilet }}卫</div>
    <div
      >朝向: <span v-if="formState.orientation === '1'">南</span
      ><span v-if="formState.orientation === '2'">北</span
      ><span v-if="formState.orientation === '3'">东</span
      ><span v-if="formState.orientation === '4'">西</span></div
    >
    <div>全款： {{ formState.totalPrice }}</div>
    <div
      >装修程度: <span v-if="formState.renovation === '1'">毛坯</span
      ><span v-if="formState.renovation === '2'">简装</span
      ><span v-if="formState.renovation === '3'">精装</span
      ><span v-if="formState.renovation === '4'">豪装</span></div
    >
    <div
      >类型: <span v-if="formState.type === '1'">住宅</span
      ><span v-if="formState.type === '2'">公寓</span><span v-if="formState.type === '3'">商铺</span
      ><span v-if="formState.type === '4'">写字楼</span
      ><span v-if="formState.type === '5'">仓库</span><span v-if="formState.type === '6'">别墅</span
      ><span v-if="formState.type === '7'">商业</span></div
    >
    <div>关键词：{{ formState.keyword }}</div>
    <div class="col-span-2">卖点： {{ formState.sellingPoint }}</div>
    <div class="col-span-2">业主心态: {{ formState.mentality }}</div>
    <div class="col-span-2">描述: {{ formState.description }}</div>
    <div
      >是否唯一: <span v-if="formState.isOnly === '1'">是</span
      ><span v-if="formState.isOnly === '2'">否</span></div
    >
    <div
      >年份: <span v-if="formState.fullYears === '1'">满两年</span
      ><span v-if="formState.fullYears === '2'">满五年</span
      ><span v-if="formState.fullYears === '3'">不满两年</span></div
    >
    <div>房东称呼： {{ formState.ownerName }}</div>
    <div>房东联系方式： {{ formState.ownerMobile }}</div>
    <div>其他联系方式： {{ formState.otherMobile }}</div>
    <div
      >房屋状态： <span v-if="formState.status === '1'">空闲</span
      ><span v-if="formState.status === '2'">自住</span
      ><span v-if="formState.status === '3'">出租</span></div
    >
    <div>
      <span v-if="formState.isShare === '0'">房屋非共有</span>
      <span v-if="formState.isShare === '1'">房屋共有</span>
    </div>
    <div>
      <span v-if="formState.isMortgage === '0'">房屋无抵押</span>
      <span v-if="formState.isMortgage === '1'">房屋有抵押</span>
    </div>
    <div>
      <span v-if="formState.hasXf === '1'">有小房</span>
      <span v-if="formState.hasXf === '0'">无小房</span>
    </div>
    <div>
      <span v-if="formState.hasCw === '1'">有车位</span>
      <span v-if="formState.hasCw === '0'">无车位</span>
    </div>
    <div>
      <span v-if="formState.hasDxs === '1'">有地下室</span>
      <span v-if="formState.hasDxs === '0'">无地下室</span>
    </div>
    <div>转接号： {{ formState.mobile }}</div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { getInfo, getOHouse } from '/@/api/ohouse/house/house';
  import { HouseModel } from '/@/api/ohouse/house/model/houseModel';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'SelfForm',
    components: {},
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<HouseModel> = reactive({});

      //获取当前用户信息
      const userStore = useUserStore();
      const userInfo = userStore.getUserInfo;

      onMounted(async () => {
        const { content } = await getOHouse(props.id);
        Object.assign(formState, content);
        if (content.userByCreate.id === userInfo.id) {
          const { content } = await getInfo(props.id);
          formState.number = content.number;
          formState.floor = content.floor;
          formState.ownerName = content.ownerName;
          formState.ownerMobile = content.ownerMobile;
          formState.otherMobile = content.otherMobile;
        }
      });
      return {
        formRef,
        formState,
      };
    },
  });
</script>
