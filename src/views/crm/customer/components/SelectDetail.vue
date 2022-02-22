<template>
  <div class="lg:h-[700px] flex flex-row w-full h-full overflow-y-scroll lg:py-2 lg:mb-4">
    <div class="w-1/2">
      <div class="space-x-4 space-y-4 lg:grid lg:grid-cols-2 justify-items-center">
        <div class="place-self-end">用户名：</div>
        <div class="place-self-start">{{ formState.username }}</div>
        <div class="place-self-end">联系方式：</div>
        <div class="place-self-start">{{ formState.contact }}</div>
        <div class="place-self-end">性别：</div>
        <div class="place-self-start">{{ formState.username }}</div>
        <div class="place-self-end">用户名：</div>
        <div class="place-self-start"
          ><span v-if="formState.gender === '0'">女</span
          ><span v-if="formState.gender === '1'">男</span></div
        >
        <div class="place-self-end">意向楼盘：</div>
        <div class="place-self-start">{{ projects.toString() }}</div>
        <div class="place-self-end">居住地：</div>
        <div class="place-self-start">{{ livePro + liveCity + liveArea }}</div>
        <div class="place-self-end">工作地：</div>
        <div class="place-self-start">{{ workPro + workCity + workArea }}</div>
        <div class="place-self-end">意向地：</div>
        <div class="place-self-start">{{ inPro + inCity + inArea }}</div>
        <div class="place-self-end">购房目的：</div>
        <div class="place-self-start">
          <span v-if="formState.purpose === '1'">改善</span>
          <span v-if="formState.purpose === '2'">刚需</span>
          <span v-if="formState.purpose === '3'">结婚</span>
          <span v-if="formState.purpose === '4'">投资</span>
          <span v-if="formState.purpose === '5'">其他</span>
        </div>
        <div class="place-self-end">购房需求：</div>
        <div class="place-self-start">{{ formState.demand.toString() }}</div>
        <div class="place-self-end">需求描述：</div>
        <div class="place-self-start">{{ formState.demandDescription }}</div>
        <div class="place-self-end">客户来源：</div>
        <div class="place-self-start">
          <span v-if="formState.source === '1'">关注楼盘</span>
          <span v-if="formState.source === '2'">变价提醒</span>
          <span v-if="formState.source === '3'">帮您找房</span>
          <span v-if="formState.source === '4'">专车找房</span>
          <span v-if="formState.source === '5'">组团砍价</span>
          <span v-if="formState.source === '6'">订阅楼盘</span>
          <span v-if="formState.source === '7'">动态通知</span>
          <span v-if="formState.source === '8'">成交价查询</span>
          <span v-if="formState.source === '9'">开盘通知</span>
          <span v-if="formState.source === '10'">了解周边</span>
          <span v-if="formState.source === '11'">了解楼盘优缺点</span>
          <span v-if="formState.source === '12'">快手</span>
          <span v-if="formState.source === '13'">抖音</span>
          <span v-if="formState.source === '14'">视频推广</span>
          <span v-if="formState.source === '15'">活动推广</span>
          <span v-if="formState.source === '16'">余房查询</span>
        </div>
        <div class="place-self-end">意向强度：</div>
        <div class="place-self-start">{{ formState.buyIntentionRange }}</div>
        <div class="place-self-end">系统判定意向强度：</div>
        <div class="place-self-start">{{ formState.autoBugIntentionRange }}</div>
        <div class="place-self-end">失信次数：</div>
        <div class="place-self-start">{{ formState.breakPromiseTimes }}</div>
        <div class="place-self-end">带看次数：</div>
        <div class="place-self-start">{{ formState.lookTime }}</div>
        <div class="place-self-end">报备次数：</div>
        <div class="place-self-start">{{ formState.reportTime }}</div>
        <div class="place-self-end">被浏览次数：</div>
        <div class="place-self-start">{{ formState.viewTime }}</div>
        <div class="place-self-end">流转次数：</div>
        <div class="place-self-start">{{ formState.transferTime }}</div>
        <div class="place-self-end">跟进人：</div>
        <div class="place-self-start">
          <span v-if="formState.userByUpdate">{{ formState.userByUpdate.realName }}</span>
          <span v-else>{{ formState.userByCreate.realName }}</span>
        </div>
      </div>
    </div>
    <div class="w-1/2 mt-4">
      <div>带看记录</div>
      <div
        v-show="
          formState.crmSaleCustomerRelationsById &&
          formState.crmSaleCustomerRelationsById.length > 0
        "
      >
        <div v-for="item in formState.crmSaleCustomerRelationsById" :key="item.customerId">
          <div>
            销售名：{{ item.saleName }}
            <span v-if="item.isOwner === '1'">（主负责人）</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { getCityById } from '/@/api/customer/crmCity/city';
  import { getCompanyById } from '/@/api/customer/crmCompany/company';
  import { getDealById } from '/@/api/customer/crmDeal/deal';
  import { getGroupById } from '/@/api/customer/crmGroup/group';
  import { getInvalidById } from '/@/api/customer/crmInvalid/invalid';
  import { getMyById } from '/@/api/customer/crmPrivate/private';
  import { getArea } from '/@/api/sys/area/area';
  import { getCity } from '/@/api/sys/city/city';
  import { getProvince } from '/@/api/sys/province/province';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'SelectDetail',
    props: {
      cityId: {
        type: String,
        required: false,
      },
      companyId: {
        type: String,
        required: false,
      },
      groupId: {
        type: String,
        required: false,
      },
      privateId: {
        type: String,
        required: false,
      },
      dealId: {
        type: String,
        required: false,
      },
      invalidId: {
        type: String,
        required: false,
      },
    },
    setup(props) {
      const { prefixCls } = useDesign('customer');
      const formRef = ref();
      const formState = reactive({
        id: '',
        userId: '',
        contact: '',
        username: '',
        gender: '',
        liveIn: '',
        workIn: '',
        intentionProvince: '',
        intentionCity: '',
        intentionArea: '',
        intentionProject: '',
        purpose: '',
        demand: '',
        demandDescription: '',
        activityId: '',
        source: '',
        autoBugIntentionRange: null,
        buyIntentionRange: null,
        breakPromiseTimes: null,
        lookTime: null,
        reportTime: null,
        viewTime: null,
        transferTime: null,
        companyId: '',
        state: '',
        groupId: '',
        userByCreate: {},
        userByUpdate: {},
        crmSaleCustomerRelationsById: [],
        projectsByIntention: [{ id: '', name: '' }],
      });

      let demands = ref<string[]>([]);
      let projects = ref<any[]>([]);
      const follow = ref<string>('');
      const look = ref<string>('');
      const report = ref<string>('');
      const livePro = ref<string>('');
      const liveCity = ref<string>('');
      const liveArea = ref<string>('');
      const workPro = ref<string>('');
      const workCity = ref<string>('');
      const workArea = ref<string>('');
      const inPro = ref<string>('');
      const inCity = ref<string>('');
      const inArea = ref<string>('');

      onMounted(async () => {
        if (props.cityId) {
          const result = await getCityById(props.cityId);
          Object.assign(formState, result.content);
          follow.value = result.follow;
          look.value = result.look;
          report.value = result.report;
        } else if (props.companyId) {
          const result = await getCompanyById(props.companyId);
          Object.assign(formState, result.content);
          follow.value = result.follow;
          look.value = result.look;
          report.value = result.report;
        } else if (props.groupId) {
          const result = await getGroupById(props.groupId);
          Object.assign(formState, result.content);
          follow.value = result.follow;
          look.value = result.look;
          report.value = result.report;
        } else if (props.privateId) {
          const result = await getMyById(props.privateId);
          Object.assign(formState, result.content);
          follow.value = result.follow;
          look.value = result.look;
          report.value = result.report;
        } else if (props.dealId) {
          const result = await getDealById(props.dealId);
          Object.assign(formState, result.content);
          // follow.value = result.follow;
          // look.value = result.look;
          // report.value = result.report;
        } else if (props.invalidId) {
          const result = await getInvalidById(props.invalidId);
          Object.assign(formState, result.content);
          // follow.value = result.follow;
          // look.value = result.look;
          // report.value = result.report;
        }
        if (formState.liveIn) {
          const liveIne: string[] = [];
          liveIne.push(...formState.liveIn.split(','));
          if (liveIne[0]) {
            const { content } = await getProvince({ id: liveIne[0] });
            livePro.value = content.name || '';
          }
          if (liveIne[1]) {
            const { content } = await getCity({ id: liveIne[1] });
            liveCity.value = content.name || '';
          }
          if (liveIne[2]) {
            const result: any = await getArea({ id: liveIne[2] });
            liveArea.value = result.name || '';
          }
        }
        if (formState.workIn) {
          const workIne: string[] = [];
          workIne.push(...formState.workIn.split(','));
          if (workIne[0]) {
            const { content } = await getProvince({ id: workIne[0] });
            workPro.value = content.name || '';
          }
          if (workIne[1]) {
            const { content } = await getCity({ id: workIne[1] });
            workCity.value = content.name || '';
          }
          if (workIne[2]) {
            const result: any = await getArea({ id: workIne[2] });
            workArea.value = result.name || '';
          }
        }
        if (formState.projectsByIntention && formState.projectsByIntention.length > 0) {
          formState.projectsByIntention.forEach((p) => {
            projects.value.push(p.name);
          });
        }
        if (formState.intentionProvince) {
          const { content } = await getProvince({ id: formState.intentionProvince });
          inPro.value = content.name || '';
        }
        if (formState.intentionCity) {
          const { content } = await getCity({ id: formState.intentionCity });
          inCity.value = content.name || '';
        }
        if (formState.intentionArea) {
          const result: any = await getArea({ id: formState.intentionArea });
          inArea.value = result.name || '';
        }
      });

      return {
        inCity,
        inPro,
        follow,
        projects,
        demands,
        formRef,
        formState,
        look,
        report,
        prefixCls,
        livePro,
        liveCity,
        liveArea,
        workPro,
        workCity,
        workArea,
        inArea,
      };
    },
  });
</script>
