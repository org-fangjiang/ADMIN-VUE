<template>
  <div class="lg:h-[600px] flex flex-row w-full h-full overflow-hidden lg:mb-4">
    <div class="w-1/2 lg:grid lg:grid-cols-4">
      <div class="">用户名：</div>
      <div class="place-self-start">{{ formState.username }}</div>
      <div class="">性别：</div>
      <div class="">{{ formState.username }}</div>
      <div class="">意向楼盘：</div>
      <div class="">{{ projects.toString() }}</div>
      <div class="">工作地：</div>
      <div class="">{{ workPro + workCity + workArea }}</div>
      <div class="">购房目的：</div>
      <div class="">
        <span v-if="formState.purpose === '1'">改善</span>
        <span v-if="formState.purpose === '2'">刚需</span>
        <span v-if="formState.purpose === '3'">结婚</span>
        <span v-if="formState.purpose === '4'">投资</span>
        <span v-if="formState.purpose === '5'">其他</span>
      </div>
      <div class="">需求描述：</div>
      <div class="">{{ formState.demandDescription }}</div>
      <div class="">意向强度：</div>
      <div class="">{{ formState.buyIntentionRange }}</div>
      <div class="">判定意向强度：</div>
      <div class="">{{ formState.autoBugIntentionRange }}</div>
      <div class="">失信次数：</div>
      <div class="">{{ formState.breakPromiseTimes }}</div>
      <div class="">联系方式：</div>
      <div class="">{{ formState.contact }}</div>
      <div class="">用户名：</div>
      <div class=""
        ><span v-if="formState.gender === '0'">女</span
        ><span v-if="formState.gender === '1'">男</span></div
      >
      <div class="">居住地：</div>
      <div class="">{{ livePro + liveCity + liveArea }}</div>
      <div class="">意向地：</div>
      <div class="">{{ inPro + inCity + inArea }}</div>
      <div class="">购房需求：</div>
      <div class="">{{ formState.demand.toString() }}</div>
      <div class="">客户来源：</div>
      <div class="">
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
      <div class="">带看次数：</div>
      <div class="">{{ formState.lookTime }}</div>
      <div class="">报备次数：</div>
      <div class="">{{ formState.reportTime }}</div>
      <div class="">被浏览次数：</div>
      <div class="">{{ formState.viewTime }}</div>
      <div class="">流转次数：</div>
      <div class="">{{ formState.transferTime }}</div>
      <div class="">负责销售：</div>
      <div class="">
        <div v-for="item in formState.crmSaleCustomerRelationsById" :key="item.saleId">
          <span v-if="item.isOwner === '1'">主负责人：{{ item.saleName }}</span>
          <span v-if="item.isOwner === '0'">协助销售：{{ item.saleName }}</span>
        </div>
      </div>
    </div>
    <div v-if="allNote && allNote.length > 0" class="w-1/2 ml-4">
      <div class="mb-4 grid grid-cols-2 pr-4">
        <div>跟进信息:</div>
        <div class="space-x-4 text-blue-700 place-self-end"
          ><button @click="onSh" type="link">正序</button
          ><button @click="onJi" type="link">倒序</button></div
        >
      </div>
      <div v-if="allNote && allNote.length > 0" class="h-[570px] overflow-y-scroll mb-4">
        <Timeline>
          <TimelineItem v-for="item in allNote" :key="item.id" color="green">
            <div>{{ item.userByCreate.nickName }}</div>
            <div>{{ item.description }}</div>
            <div>意向楼盘：{{ item.projectById.name }}</div>
            <div class="space-x-4">
              <span v-if="item.resultType">上次跟进结果：</span>
              <span v-if="item.resultType === '1'">未接听</span>
              <span v-if="item.resultType === '2'">接听后挂断</span>
              <span v-if="item.resultType === '3'">通话中</span>
              <span v-if="item.resultType === '4'">拉黑</span>
              <span v-if="item.resultType === '5'">空号</span>
              <span v-if="item.resultType === '6'">不买房</span>
              <span v-if="item.resultType === '7'">同行</span>
              <span>{{ item.createTime.replace('T', ' ').split('.')[0] }}</span>
            </div>
          </TimelineItem>
        </Timeline>
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
  import { Timeline, TimelineItem } from 'ant-design-vue';

  export default defineComponent({
    name: 'SelectDetail',
    components: {
      Timeline,
      TimelineItem,
    },
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
      const follow = ref<any>();
      const look = ref<any>();
      const report = ref<any>();
      const livePro = ref<string>('');
      const liveCity = ref<string>('');
      const liveArea = ref<string>('');
      const workPro = ref<string>('');
      const workCity = ref<string>('');
      const workArea = ref<string>('');
      const inPro = ref<string>('');
      const inCity = ref<string>('');
      const inArea = ref<string>('');

      // 所有跟进/报备/带看记录
      const allNote = ref<any[]>([]);

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
          follow.value = result.follow;
          look.value = result.look;
          report.value = result.report;
        } else if (props.invalidId) {
          const result = await getInvalidById(props.invalidId);
          Object.assign(formState, result.content);
          follow.value = result.follow;
          look.value = result.look;
          report.value = result.report;
        }
        if (follow.value && follow.value?.content?.length > 0) {
          allNote.value.push(...follow.value.content);
        }
        if (report.value && report.value?.content?.length > 0) {
          allNote.value.push(...report.value.content);
        }
        if (look.value && look.value?.content?.length > 0) {
          allNote.value.push(...look.value.content);
        }
        console.log(allNote.value);
        // 将所有跟进信息倒序排列
        onJi();
        // onSh();

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

      // 升序
      const onSh = () => {
        if (allNote.value && allNote.value.length > 0) {
          let t;
          for (let i = 0; i < allNote.value.length - 1; i++) {
            for (let j = 0; j < allNote.value.length - 1 - i; j++) {
              if (allNote.value[j].createTime > allNote.value[j + 1].createTime) {
                t = allNote.value[j];
                allNote.value[j] = allNote.value[j + 1];
                allNote.value[j + 1] = t;
              }
            }
          }
        }
      };
      // 降序
      const onJi = () => {
        if (allNote.value && allNote.value.length > 0) {
          let t;
          for (let i = 0; i < allNote.value.length - 1; i++) {
            for (let j = 0; j < allNote.value.length - 1 - i; j++) {
              if (allNote.value[j].createTime < allNote.value[j + 1].createTime) {
                t = allNote.value[j];
                allNote.value[j] = allNote.value[j + 1];
                allNote.value[j + 1] = t;
              }
            }
          }
        }
      };

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
        allNote,
        onSh,
        onJi,
      };
    },
  });
</script>
