<template>
  <div class="w-full h-full">
    <div class="pb-4 setwidth">
      <div class="flex-col mt-2 sm:flex">
        <span class="name">{{ formState.name }}</span>
        <span class="text-sm font-light lg:ml-4">别名：{{ formState.aliasName }}</span>
      </div>
      <div class="basic">
        <div class="basicInfo">基本信息</div>
        <div class="flex mt-4 sm:flex-col">
          <div class="sm:w-full lg:w-1/2">
            <div>
              项目类型：
              <span v-if="formState.type === '1'">住宅</span>
              <span v-if="formState.type === '2'">公寓</span>
              <span v-if="formState.type === '3'">商铺</span>
              <span v-if="formState.type === '4'">写字楼</span>
              <span v-if="formState.type === '5'">仓库</span>
              <span v-if="formState.type === '6'">别墅</span>
              <span v-if="formState.type === '7'">商业</span>
            </div>
            <div>
              产&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;权：
              <span>{{ formState.property }}年</span>
            </div>
            <div>
              装修类型：
              <span v-if="formState.decorationType === '1'">毛坯</span>
              <span v-if="formState.decorationType === '2'">简装</span>
              <span v-if="formState.decorationType === '3'">精装</span>
              <span v-if="formState.decorationType === '4'">毛坯与简装</span>
              <span v-if="formState.decorationType === '5'">毛坯与精装</span>
            </div>
            <!-- <div>
              开盘时间：
              <span>{{ formState.openTime?.replace('T', ' ').replace('.000+08:00', '') }}</span>
            </div> -->
          </div>
          <div class="sm:w-full lg:w-1/2">
            <div class=""
              >平均价格： <span class="">{{ formState.price }}元/m²</span></div
            >
            <div>
              售&nbsp;&nbsp;楼&nbsp;&nbsp;处：<span>{{ formState.saleAddress }}</span>
            </div>
            <div>
              项目位置：
              <span>{{ formState?.sysProvinceByProvinceId?.name }}</span>
              <span>{{ formState?.sysCityByCityId?.name }}</span>
              <span>{{ formState?.sysAreaByAreaId?.name }}</span>
              <span>{{ formState.address }}</span>
            </div>
            <!-- <div>
              交房时间：
              <span>{{ formState.payTime?.replace('T', ' ').replace('.000+08:00', '') }}</span>
            </div> -->
          </div>
        </div>
      </div>
      <div class="basic">
        <div class="basicInfo">户型信息：</div>
        <div class="setcol">
          <div v-for="item in formState.hBuildsById" :key="item.id">
            <div v-if="item.state === '1'">
              <span class="font-bold">{{ item.number }}号楼：</span>
              <span class="text-base">共{{ item.floors }}层</span><br />
              <span class="text-base">开盘时间:{{ item.payTime }}</span>
              <span class="text-base">&nbsp;&nbsp;交房时间:{{ item.openTime }}</span>
              <div class="lg:flex-row lg:flex-wrap sm:grid-cols-2 lg:flex sm:grid">
                <div v-for="e in item.hBuildLayoutsById" :key="e.buildId">
                  <div v-if="e.hLayoutByLayoutId.state === '1'">
                    <div class="mb-4 mr-4 lg:w-full">
                      <img
                        :src="e.hLayoutByLayoutId.hResourceByResourceId.address"
                        alt="户型图"
                        style="width: 150px; height: 200px"
                      />
                      <span
                        >{{ &nbsp; e.hLayoutByLayoutId.room }}室{{ e.hLayoutByLayoutId.hall }}厅{{
                          e.hLayoutByLayoutId.toilet
                        }}卫{{ e.hLayoutByLayoutId.area }}m²；</span
                      >
                      <span v-if="e.hLayoutByLayoutId.saleState === '1'">在售；</span>
                      <span v-if="e.hLayoutByLayoutId.saleState === '2'">待售；</span>
                      <span v-if="e.hLayoutByLayoutId.saleState === '3'">售罄；</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="basic">
        <div class="basicInfo">周边配套：</div>
        <div class="flex flex-col mt-4 space-y-2">
          <div class="">
            <span class="font-medium">医疗配套：</span> <span>{{ formState.medicalInfo }}</span>
          </div>
          <div class="">
            <span class="font-medium">商业配套：</span> <span>{{ formState.matchingInfo }}</span>
          </div>
          <div class="">
            <span class="font-medium">交通配套：</span> <span>{{ formState.trafficInfo }}</span>
          </div>
          <div class="">
            <span class="font-medium">教育配套：</span> <span>{{ formState.educationInfo }}</span>
          </div>
          <div class="">
            <span class="font-medium">公园配套：</span> <span>{{ formState.otherInfo }}</span>
          </div>
        </div>
      </div>
      <div class="basic">
        <div class="basicInfo">小区概况：</div>
        <div class="mt-4 space-y-2">
          <div class="flex space-y-2 sm:flex-col">
            <div class="sm:w-full lg:w-1/2"
              ><span class="font-medium">容&nbsp;&nbsp;积&nbsp;&nbsp;率：</span>
              <span class="">{{ formState.volumeRate }}%</span></div
            >
            <div class="sm:w-full lg:w-1/2"
              ><span class="font-medium">绿&nbsp;&nbsp;化&nbsp;&nbsp;率：</span>
              <span class="">{{ formState.greenRate }}%</span></div
            >
          </div>
          <div class="flex space-y-2 sm:flex-col">
            <div class="sm:w-full lg:w-1/2">
              <span class="font-medium">占地面积：</span>
              <span class="">{{ formState.landArea }}m²</span>
            </div>
            <div class="sm:w-full lg:w-1/2">
              <span class="font-medium">建筑面积：</span>
              <span class="">{{ formState.buildArea }}m²</span>
            </div>
          </div>
          <div class="flex space-y-2 sm:flex-col">
            <div class="sm:w-full lg:w-1/2">
              <span class="font-medium">总&nbsp;&nbsp;栋&nbsp;&nbsp;数：</span>
              <span class="">{{ formState.buildingTotal }}栋</span>
            </div>
            <div class="sm:w-full lg:w-1/2">
              <span class="font-medium">总&nbsp;&nbsp;户&nbsp;&nbsp;数：</span>
              <span class="">{{ formState.houseTotal }}户</span>
            </div>
          </div>
          <div class="flex space-y-2 sm:flex-col">
            <div class="sm:w-full lg:w-1/2">
              <span class="font-medium">供水方式：</span>
              <span v-if="formState.waterMethod == '0'">未知</span>
              <span v-if="formState.waterMethod == '1'">民用水</span>
              <span v-if="formState.waterMethod == '2'">商用水</span>
            </div>
            <div class="sm:w-full lg:w-1/2">
              <span class="font-medium">供暖方式：</span>
              <span v-if="formState.waterMethod == '0'">未知</span>
              <span v-if="formState.waterMethod == '1'">市政供暖</span>
              <span v-if="formState.waterMethod == '2'">集体供暖</span>
            </div>
          </div>
          <div class="flex space-y-2 sm:flex-col">
            <div class="sm:w-full lg:w-1/2">
              <span class="font-medium">供电方式：</span>
              <span v-if="formState.waterMethod == '0'">未知</span>
              <span v-if="formState.waterMethod == '1'">民用电</span>
              <span v-if="formState.waterMethod == '2'">商用电</span>
            </div>
            <div class="sm:w-full lg:w-1/2">
              <span class="font-medium">物&nbsp;&nbsp;业&nbsp;&nbsp;费：</span>
              <span class="">{{ formState.estatePrice }}元/m²</span>
            </div>
          </div>
          <div class="flex space-y-2 sm:flex-col">
            <div class="sm:w-full lg:w-1/2">
              <span class="font-medium">物业公司：</span>
              <span class="">{{ formState.estateCompanyById?.name }}</span>
            </div>
            <div class="sm:w-full lg:w-1/2">
              <span class="font-medium">物业描述：</span>
              <span class="">{{ formState.estateCompanyById?.description }}</span>
            </div>
          </div>
          <div class="flex space-y-2 sm:flex-col">
            <div class="sm:w-full lg:w-1/2">
              <span class="font-medium">开&nbsp;&nbsp;发&nbsp;&nbsp;商：</span>
              <span class="">{{ formState.hDeveloperByDeveloperId?.name }}</span>
            </div>
            <div class="sm:w-full lg:w-1/2">
              <span class="font-medium">开发商描述：</span>
              <span class="">{{ formState.hDeveloperByDeveloperId?.description }}</span>
            </div>
          </div>
          <div class="flex space-y-2 sm:flex-col">
            <div class="sm:w-full lg:w-1/2">
              <span class="font-medium">车位信息：</span>
              <span class="">{{ formState.parking }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { HostModel, _HostConst } from '/@/api/host/project/model/projectModel';
  import { useUserStore } from '/@/store/modules/user';
  import { getProject } from '/@/api/host/project/project';
  import { getProjectChannel } from '/@/api/host/projectChannel/projectChannel';
  import { ChannelAndCase } from '/@/api/host/projectChannel/model/projectChannelModel';
  import { getRule } from '/@/api/host/reportRule/reportRule';
  import { ReportRuleModel } from '/@/api/host/reportRule/model/reportRuleModel';

  export default defineComponent({
    name: 'ProjectForm',
    components: {},
    props: {
      id: {
        type: String,
        require: false,
      },
    },
    setup(props) {
      const { t } = useI18n();

      //加载动画
      const loading = ref<boolean>(false);
      const tip = ref<string>('加载中...');

      const userStore = useUserStore();
      const cityId = ref<string>(userStore.getUserInfo.companyCityId || '');
      let provinceId = ref<string>(userStore.getUserInfo.companyProvinceId || '');

      const formState: UnwrapRef<HostModel> = reactive({});
      const formStateChannel: UnwrapRef<ChannelAndCase> = reactive({});
      const formStateRule: UnwrapRef<ReportRuleModel> = reactive({});

      //初始加载
      onMounted(async () => {
        if (props.id) {
          loading.value = true;
          try {
            const { content } = await getProject(props.id);
            Object.assign(formState, content);
            const channelResult = await getProjectChannel(props.id);
            Object.assign(formStateChannel, channelResult.content);
            const ruleResult = await getRule(props.id);
            Object.assign(formStateRule, ruleResult.content);
          } catch (error) {
          } finally {
            loading.value = false;
          }
        }
        if (!formState.sysCityByCityId) {
          formState.sysCityByCityId = {};
        }
        if (!formState.sysAreaByAreaId) {
          formState.sysAreaByAreaId = {};
        }
        if (!formState.sysProvinceByProvinceId) {
          formState.sysProvinceByProvinceId = {};
        }
        formState.sysProvinceByProvinceId.id = provinceId.value;
        formState.sysCityByCityId.id = cityId.value;
      });

      return {
        t,
        formState,
        loading,
        tip,
        props,
        cityId,
        provinceId,
        formStateChannel,
        formStateRule,
      };
    },
  });
</script>

<style lang="less">
  .setwidth {
    @apply lg:mx-6 sm:mx-3;
  }

  .setflex {
    @apply flex mt-4 sm:flex-col lg:flex-row;
  }

  .name {
    @apply text-2xl font-bold text-blue-500;
  }

  .basic {
    @apply text-base mt-4 border-2 p-4 font-light shadow;
  }

  .basicInfo {
    @apply w-full border-b-2 border-b-blue-300 text-lg font-bold;
  }

  .layout {
    @apply w-full mt-5;
  }

  .setcol {
    @apply text-lg ml-4 mt-4;
  }
</style>
