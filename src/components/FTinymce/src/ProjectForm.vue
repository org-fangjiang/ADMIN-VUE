<template>
  <div>
    <Form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
      <div>
        <FormItem ref="name" :label="t('host.name')" name="name">
          <Select
            :showSearch="true"
            ref="select"
            :allowClear="true"
            v-model:value="formState.name"
            style="width: 120px"
            @search="nameChange"
            :options="options"
            :pagination="false"
            @select="nameSelect"
            label-in-value
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
          >
            <template v-if="fetching" #notFoundContent>
              <Spin size="small" />
            </template>
          </Select>
        </FormItem>
        <FormItem ref="areaId" :label="t('host.area')" name="areaId">
          <Input v-model:value="formState.area" autoComplete="off" />
        </FormItem>

        <FormItem ref="address" :label="t('host.address')" name="address">
          <Input v-model:value="formState.address" autoComplete="off" />
        </FormItem>
        <FormItem ref="hLayoutsById" :label="t('host.hLayoutsById')" name="hLayoutsById">
          <Input v-model:value="formState.hLayoutsById" autoComplete="off" />
        </FormItem>
        <FormItem ref="number" :label="t('host.number')" name="number">
          <Input v-model:value="formState.number" autoComplete="off" />
        </FormItem>
        <FormItem ref="firstImg" :label="t('host.firstImg')" name="firstImg">
          <Image :src="formState.firstImg" width="100px" />
        </FormItem>

        <FormItem :wrapper-col="{ span: 14, offset: 4 }">
          <Button type="primary" @click="onSubmit">{{ t('host.action.onSubmit') }}</Button>
          <!-- <Button style="margin-left: 10px" @click="resetForm">{{ t('host.action.reset') }}</Button> -->
        </FormItem>
      </div>
    </Form>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { Loading } from '/@/components/Loading';
  import { Form, FormItem, Button, Input, Select, Spin, Image } from 'ant-design-vue';
  import { _HostConst } from '/@/api/host/project/model/projectModel';
  import { useUserStore } from '/@/store/modules/user';
  import { getProject, search, searchWithCondition } from '/@/api/host/project/project';
  import { debounce } from 'lodash-es';

  interface Option {
    value: string;
    label: string;
  }

  export default defineComponent({
    name: 'ProjectForm',
    components: {
      Loading,
      Form,
      FormItem,
      Button,
      Input,
      Select,
      Spin,
      Image,
    },
    props: {
      id: {
        type: String,
        require: false,
      },
    },
    emits: ['projectInfo'],
    setup(props, { emit }) {
      const { t } = useI18n();

      const loading = ref<boolean>(false);
      const tip = ref<string>('加载中...');
      const formRef = ref();

      const userStore = useUserStore();
      const cityId = ref<string>(userStore.getUserInfo.companyCityId || '');
      let provinceId = ref<string>(userStore.getUserInfo.companyProvinceId || '');

      const formState = reactive({
        name: '',
        area: '',
        address: '',
        hLayoutsById: '',
        id: '',
        number: '',
        firstImg: '',
      });

      const options = ref<Option[]>([]);

      const condition = reactive({
        state: '',
        name: '',
        provinceId: provinceId,
        cityId: cityId,
      });

      let fetching = ref<boolean>(false);

      const nameChange = debounce(async (value) => {
        debugger;
        fetching.value = true;
        if (value && value !== '') {
          condition.name = value;
          const { content } = await search(condition);
          options.value.splice(0);
          if (content && content.length > 0) {
            content.forEach((item) => {
              options.value.push({ value: item.id || '', label: item.name || '' });
            });
          }
        } else {
          const { content } = await searchWithCondition(condition);
          if (content && content.length > 0) {
            content.forEach((item) => {
              options.value.push({ value: item.id || '', label: item.name || '' });
            });
          }
        }
        fetching.value = false;
      }, 200);

      let areaId = ref<string>('');
      const nameSelect = async (value) => {
        debugger;
        fetching.value = true;
        const { content } = await getProject(value.value);
        formState.id = content.id || '';
        console.log(content.sysAreaByAreaId?.id);
        if (!content.sysAreaByAreaId) {
          content.sysAreaByAreaId = {};
        }
        formState.area = content.sysAreaByAreaId.name || '';
        formState.address = content.address || '';
        formState.number = content.number || '';
        formState.firstImg = content.firstImg?.address || '';
        if (content.hLayoutsById && content.hLayoutsById.length > 0) {
          content.hLayoutsById.forEach((item) => {
            formState.hLayoutsById = item.room + '室(' + item.area + ')/㎡,';
          });
        } else {
          formState.hLayoutsById = '';
        }
        fetching.value = false;
      };

      const areaChange = async (_value, selectedOptions) => {
        debugger;
        formState.area = selectedOptions.label;
      };

      onMounted(async () => {
        debugger;
        // const { content } = await searchWithCondition(condition);
        // if (content && content.length > 0) {
        //   content.forEach((item) => {
        //     options.value.push({ value: item.id || '', label: item.name || '' });
        //   });
        // }
      });

      const onSubmit = () => {
        debugger;
        emit('projectInfo', formState);
      };

      return {
        t,
        formRef,
        formState,
        loading,
        tip,
        props,
        cityId,
        provinceId,
        nameChange,
        nameSelect,
        areaChange,
        onSubmit,
        options,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        fetching,
        areaId,
      };
    },
  });
</script>
