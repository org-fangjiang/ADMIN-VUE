<template>
  <div :class="prefixCls">
    <div class="flex flex-row max-h-[500px]">
      <div class="w-full h-full">
        <Form
          :rules="clueConst._RULES"
          ref="formRef"
          :model="formState"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <FormItem ref="contact" :label="t('marketing.clue.contact')" name="contact">
            <Input :disabled="isUpdate" v-model:value="formState.contact" autoComplete="off" />
          </FormItem>
          <FormItem ref="username" :label="t('marketing.clue.username')" name="username">
            <Input :disabled="isUpdate" v-model:value="formState.username" autoComplete="off" />
          </FormItem>
          <FormItem ref="nickname" :label="t('marketing.clue.nickname')" name="nickname">
            <Input :disabled="isUpdate" v-model:value="formState.nickname" autoComplete="off" />
          </FormItem>
          <FormItem ref="gender" :label="t('marketing.clue.gender')" name="gender">
            <RadioGroup
              v-model:value="formState.gender"
              :disabled="isUpdate"
              :options="genderOption"
            />
          </FormItem>
          <FormItem ref="liveInProvince" :label="t('marketing.clue.liveIn')" name="liveInProvince">
            <FCascader
              v-if="isHidden"
              :provinceId="formState.liveInProvince"
              :cityId="formState.liveInCity"
              :areaId="formState.liveInArea"
              :disabled="isUpdate"
              @change="liveChange"
            />
          </FormItem>
          <FormItem
            ref="liveInAddress"
            :label="t('marketing.clue.liveInAddress')"
            name="liveInAddress"
          >
            <Input
              :disabled="isUpdate"
              v-model:value="formState.liveInAddress"
              autoComplete="off"
            />
          </FormItem>
          <FormItem ref="workInProvince" :label="t('marketing.clue.workIn')" name="workInProvince">
            <FCascader
              v-if="isHidden"
              :provinceId="formState.workInProvince"
              :cityId="formState.workInCity"
              :areaId="formState.workInArea"
              :disabled="isUpdate"
              @change="workChange"
            />
          </FormItem>
          <FormItem
            ref="workInAddress"
            :label="t('marketing.clue.workInAddress')"
            name="workInAddress"
          >
            <Input
              :disabled="isUpdate"
              v-model:value="formState.workInAddress"
              autoComplete="off"
            />
          </FormItem>
          <FormItem ref="intentionCity" :label="t('marketing.clue.intention')" name="intentionCity">
            <FCascader
              v-if="isHidden"
              :provinceId="formState.intentionProvince"
              :cityId="formState.intentionCity"
              :areaId="formState.intentionArea"
              :disabled="isUpdate"
              @change="intentionChange"
            />
          </FormItem>
          <FormItem
            ref="intentionProject"
            :label="t('marketing.clue.intentionProject')"
            name="intentionProject"
          >
            <Select
              :disabled="isUpdate"
              :showSearch="true"
              v-model:value="projects"
              :options="projectOption"
              :filter-option="false"
              mode="multiple"
              @change="projectChange"
              @search="projectSearch"
              :not-found-content="fetching ? undefined : null"
            >
              <template v-if="fetching" #notFoundContent>
                <Spin size="small" />
              </template>
            </Select>
          </FormItem>
          <FormItem ref="purpose" :label="t('marketing.clue.purpose')" name="purpose">
            <Select
              :disabled="isUpdate"
              ref="select"
              :allowClear="true"
              v-model:value="formState.purpose"
              style="width: 120px"
              :options="clueConst.PURPOSES"
              :pagination="false"
              @change="changePurpose"
            />
          </FormItem>
          <FormItem ref="demand" :label="t('marketing.clue.demand')" name="demand">
            <Select
              :disabled="isUpdate"
              v-model:value="purposes"
              mode="tags"
              style="width: 100%"
              :token-separators="[',']"
              :open="false"
            />
          </FormItem>
          <FormItem
            ref="demandDescription"
            :label="t('marketing.clue.demandDescription')"
            name="demandDescription"
          >
            <Textarea
              :disabled="isUpdate"
              v-model:value="formState.demandDescription"
              autoComplete="off"
            />
          </FormItem>
          <FormItem ref="source" :label="t('marketing.clue.source')" name="source">
            <Select
              :disabled="isUpdate"
              ref="select"
              :allowClear="true"
              v-model:value="formState.source"
              style="width: 120px"
              :options="clueConst.SOURCES"
              :pagination="false"
            />
          </FormItem>
          <FormItem :label="t('marketing.clue.updateBy')" name="updateBy">
            <Select
              v-model:value="formState.updateBy"
              autoComplete="off"
              :options="updateUsers"
              :allowClear="true"
              :showSearch="true"
              :filter-option="false"
              :disabled="true"
            />
          </FormItem>
          <FormItem :label="t('marketing.clue.activityId')" name="activityId">
            <Select
              :disabled="true"
              v-model:value="formState.activityId"
              autoComplete="off"
              :allowClear="true"
              :showSearch="true"
              :filter-option="false"
              :options="activityOptions"
            />
          </FormItem>
          <FormItem v-show="!isUpdate" :wrapper-col="{ span: 14, offset: 8 }">
            <Button type="primary" @click="onSubmit">{{ t('component.modal.okText') }}</Button>
            <Button style="margin-left: 10px" @click="resetForm">{{
              t('component.cropper.btn_reset')
            }}</Button>
          </FormItem>
        </Form>
      </div>
      <div class="pt-4 w-full h-[500px]" style="overflow-y: scroll; height: 500px">
        <Timeline>
          <TimelineItem
            :position="item.followResult === '1' ? 'right' : 'left'"
            v-for="item in formState.sysClueFollowEntities"
            :key="item.id"
          >
            <p>内容：{{ item.content || '' }}</p>
            <p>创建人：{{ item.userCreateBy?.realName || '' }}</p>
            <p>
              结果：
              <span v-if="item.followResult === '1'">无效</span>
              <span v-if="item.followResult === '2'">不买房</span>
              <span v-if="item.followResult === '3'">同行</span>
              <span v-if="item.followResult === '4'">号码错误</span>
              <span v-if="item.followResult === '5'">已转为客户</span></p
            >
            <p>
              时间：
              <span>{{ item.createTime.replace('T', ' ').replace('.000+08:00', '') }}</span>
            </p>
          </TimelineItem>
        </Timeline>
      </div>
    </div>
    <Modal
      :bodyStyle="{ overflow: 'auto', margin: '16px' }"
      :visible="drawerParam.visible"
      :title="drawerParam.title"
      @cancel="onClose"
      :footer="null"
      :destroyOnClose="true"
      centered
    >
      <AddFollow v-if="drawerParam.state === '0'" :id="formState.id" />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import {
    Form,
    FormItem,
    Input,
    Select,
    RadioGroup,
    Modal,
    Timeline,
    TimelineItem,
    Textarea,
    Button,
    Spin,
  } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { getById } from '/@/api/marketing/clue/clue';
  import { ClueConst, ClueModel } from '/@/api/marketing/clue/model/clueModel';
  import AddFollow from './AddFollow.vue';
  import FCascader from '/@/components/FCascader';
  import { failed, success } from '/@/hooks/web/useList';
  import { updateClue } from '/@/api/marketing/clue/clue';
  import { debounce } from 'lodash-es';
  import { search, searchWithCondition } from '/@/api/host/project/project';

  interface Option {
    value: string;
    label: string;
  }
  export default defineComponent({
    name: 'ClueForm',
    components: {
      Form,
      FormItem,
      Input,
      Loading,
      Select,
      AddFollow,
      Modal,
      Timeline,
      TimelineItem,
      RadioGroup,
      FCascader,
      Textarea,
      Button,
      Spin,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
      openType: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('clue');
      const clueConst = ref(ClueConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //判断更新还是新增
      let isUpdate = ref<boolean>(false);
      if (props.openType === '查看') {
        isUpdate.value = true;
      }

      let isHidden = ref(false);
      const genderOption = [
        { value: '0', label: '女' },
        { value: '1', label: '男' },
      ];

      // 购房用途
      const changePurpose = (value) => {
        formState.purpose = value;
      };

      // 居住地
      const liveChange = (e) => {
        formState.liveInProvince = e.value[0] || '';
        formState.liveInCity = e.value[1] || '';
        formState.liveInArea = e.value[2] || '';
      };
      // work
      const workChange = (e) => {
        formState.workInProvince = e.value[0] || '';
        formState.workInCity = e.value[1] || '';
        formState.workInArea = e.value[2] || '';
      };
      // intention
      const intentionChange = (e) => {
        formState.intentionProvince = e.value[0] || '';
        formState.intentionCity = e.value[1] || '';
        formState.intentionArea = e.value[2] || '';
      };

      //搜索项目
      let fetching = ref<boolean>(false);
      const projectSearch = debounce(async (value) => {
        fetching.value = true;
        let result;
        if (value) {
          result = await search({
            name: value,
            provinceId: formState.intentionProvince || '',
            cityId: formState.intentionCity,
            state: '1',
          });
        } else {
          result = await searchWithCondition({
            provinceId: formState.intentionProvince || '',
            cityId: formState.intentionCity,
            state: '1',
          });
        }
        if (result.content && result.content.length > 0) {
          projectOption.value.splice(0);
          result.content.forEach((item) => {
            projectOption.value.push({ value: item.id || '', label: item.name || '' });
          });
        }
        fetching.value = false;
      }, 800);

      //选中项目
      const projectChange = (value) => {
        projects.value = value;
      };

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<ClueModel> = reactive({});

      let projects = ref<String[]>([]);
      let projectOption = ref<Option[]>([]);
      let strProjects = ref<String[]>([]);
      let purposes = ref<String[]>([]);
      let updateUsers = ref<Option[]>([]);
      const activityOptions = ref<Option[]>([]);

      //初始加载
      onMounted(async () => {
        loading.value = true;
        projects.value.splice(0);
        if (props.id) {
          try {
            const { content } = await getById(props.id);
            Object.assign(formState, content);
            if (content.demand) {
              purposes.value = content.demand.split(',');
            }
            if (content.sysClueFollowEntities && content.sysClueFollowEntities.length > 0) {
              let t;
              for (let i = 0; i < content.sysClueFollowEntities.length - 1; i++) {
                for (let j = 0; j < content.sysClueFollowEntities.length - 1 - i; j++) {
                  if (
                    (content.sysClueFollowEntities[j].createTime || '') <
                    (content.sysClueFollowEntities[j + 1].createTime || '')
                  ) {
                    t = content.sysClueFollowEntities[j];
                    content.sysClueFollowEntities[j] = content.sysClueFollowEntities[j + 1];
                    content.sysClueFollowEntities[j + 1] = t;
                  }
                }
              }
            }
            if (content.projectRelationEntities && content.projectRelationEntities.length > 0) {
              content.projectRelationEntities.forEach((item) => {
                projects.value.push(item.id || '');
                projectOption.value.push({ value: item.id || '', label: item.name || '' });
              });
            }
            if (formState.userByUpdate) {
              updateUsers.value.push({
                value: formState.userByUpdate.id,
                label: formState.userByUpdate.realName || '',
              });
            }
            if (formState.activityByActivityId) {
              activityOptions.value.push({
                value: formState.activityByActivityId.id || '',
                label: formState.activityByActivityId.title || '',
              });
            }
          } catch (error) {
          } finally {
            isHidden.value = true;
            loading.value = false;
          }
        }
      });

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            try {
              const pro = projects.value.toString();
              formState.intentionProject = pro;
              formState.demand = purposes.value.toString();
              await updateClue(formState);
              success(t('marketing.action.update'), t('marketing.action.success'));
            } catch (error: any) {
              failed(error?.response?.data?.message, t('marketing.action.fail'));
            } finally {
              loading.value = false;
            }
          })
          .catch((error: any) => {
            console.log('error', error);
          });
      };

      //重置
      const resetForm = async () => {
        loading.value = true;
        try {
          const { content } = await getById(props.id);
          Object.assign(formState, content);
          if (content.purpose) {
            purposes.value = content.purpose.split(',');
          }
          if (content.sysClueFollowEntities && content.sysClueFollowEntities.length > 0) {
            let t;
            for (let i = 0; i < content.sysClueFollowEntities.length - 1; i++) {
              for (let j = 0; j < content.sysClueFollowEntities.length - 1 - i; j++) {
                if (
                  (content.sysClueFollowEntities[j].createTime || '') <
                  (content.sysClueFollowEntities[j + 1].createTime || '')
                ) {
                  t = content.sysClueFollowEntities[j];
                  content.sysClueFollowEntities[j] = content.sysClueFollowEntities[j + 1];
                  content.sysClueFollowEntities[j + 1] = t;
                }
              }
            }
          }
          if (content.projectRelationEntities && content.projectRelationEntities.length > 0) {
            content.projectRelationEntities.forEach((item) => {
              projects.value.push(item.name || '');
              projectOption.value.push({ value: item.id || '', label: item.name || '' });
            });
          }
          if (formState.userByUpdate) {
            updateUsers.value.push({
              value: formState.userByUpdate.id,
              label: formState.userByUpdate.realName || '',
            });
          }
          if (formState.activityByActivityId) {
            activityOptions.value.push({
              value: formState.activityByActivityId.id || '',
              label: formState.activityByActivityId.title || '',
            });
          }
        } catch (error) {
        } finally {
          isHidden.value = true;
          loading.value = false;
        }
        loading.value = false;
      };

      const addFollow = () => {
        drawerParam.state = '0';
        drawerParam.visible = true;
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
        try {
          projects.value.splice(0);
          const { content } = await getById(props.id);
          if (content.sysClueFollowEntities && content.sysClueFollowEntities.length > 0) {
            let t;
            for (let i = 0; i < content.sysClueFollowEntities.length - 1; i++) {
              for (let j = 0; j < content.sysClueFollowEntities.length - 1 - i; j++) {
                if (
                  (content.sysClueFollowEntities[j].createTime || '') <
                  (content.sysClueFollowEntities[j + 1].createTime || '')
                ) {
                  t = content.sysClueFollowEntities[j];
                  content.sysClueFollowEntities[j] = content.sysClueFollowEntities[j + 1];
                  content.sysClueFollowEntities[j + 1] = t;
                }
              }
            }
          }
          if (content.projectRelationEntities && content.projectRelationEntities.length > 0) {
            content.projectRelationEntities.forEach((item) => {
              projects.value.push(item.name || '');
            });
          }
          Object.assign(formState, content);
        } catch (error) {
        } finally {
          loading.value = false;
        }
      };

      return {
        t,
        prefixCls,
        clueConst,
        loading,
        tip,
        formRef,
        formState,
        onSubmit,
        resetForm,
        labelCol: { span: 8 },
        wrapperCol: { span: 12 },
        isUpdate,
        props,
        drawerParam,
        onClose,
        addFollow,
        projects,
        strProjects,
        genderOption,
        isHidden,
        purposes,
        projectOption,
        updateUsers,
        activityOptions,
        projectSearch,
        fetching,
        projectChange,
        liveChange,
        workChange,
        intentionChange,
        changePurpose,
      };
    },
  });
</script>
