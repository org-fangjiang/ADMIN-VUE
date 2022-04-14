// 添加更改楼栋信息
<template>
  <div :class="prefixCls">
    <Form
      ref="formRef"
      :model="formState"
      :rules="houseConst._RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="identifier" :label="t('ohouse.house.identifier')" name="identifier">
        <Input
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('identifier')"
          v-model:value="formState.identifier"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="title" :label="t('ohouse.house.title')" name="title">
        <Input
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('title')"
          v-model:value="formState.title"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="number" :label="t('ohouse.house.number')" name="number">
        <Input
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('number')"
          v-model:value="formState.number"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="floor" :label="t('ohouse.house.floor')" name="floor">
        <Input
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('floor')"
          v-model:value="formState.floor"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="floorType" :label="t('ohouse.house.floorType')" name="floorType">
        <Select
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('floorType')"
          ref="select"
          :allowClear="true"
          v-model:value="formState.floorType"
          style="width: 120px"
          @change="floorTypeChange"
          :options="houseConst.FLOORS"
          :pagination="false"
        />
      </FormItem>
      <FormItem ref="price" :label="t('ohouse.house.price')" name="price">
        <Input
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('price')"
          v-model:value="formState.price"
          autoComplete="off"
          suffix="万元"
        />
      </FormItem>
      <FormItem ref="labels" :label="t('ohouse.house.labels')" name="labels">
        <FGroup @change="changeLabels" :selectedLabel="selectLabel" />
      </FormItem>
      <FormItem ref="totalPrice" :label="t('ohouse.house.totalPrice')" name="totalPrice">
        <Input
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('totalPrice')"
          v-model:value="formState.totalPrice"
          autoComplete="off"
          suffix="万元"
        />
      </FormItem>
      <FormItem ref="downPayments" :label="t('ohouse.house.downPayments')" name="downPayments">
        <Input
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('downPayments')"
          v-model:value="formState.downPayments"
          autoComplete="off"
          suffix="万元"
        />
      </FormItem>
      <FormItem ref="area" :label="t('ohouse.house.area')" name="area">
        <Input
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('area')"
          v-model:value="formState.area"
          autoComplete="off"
          suffix="㎡"
        />
      </FormItem>
      <FormItem ref="buildArea" :label="t('ohouse.house.buildArea')" name="buildArea">
        <Input
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('buildArea')"
          v-model:value="formState.buildArea"
          autoComplete="off"
          suffix="㎡"
        />
      </FormItem>
      <FormItem ref="rooms" :label="t('ohouse.house.rooms')" name="rooms">
        <InputNumber
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('rooms')"
          v-model:value="formState.rooms"
          autoComplete="off"
          type="number"
        />
      </FormItem>
      <FormItem ref="hall" :label="t('ohouse.house.hall')" name="hall">
        <InputNumber
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('hall')"
          v-model:value="formState.hall"
          autoComplete="off"
          type="number"
        />
      </FormItem>
      <FormItem ref="toilet" :label="t('ohouse.house.toilet')" name="toilet">
        <InputNumber
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('toilet')"
          v-model:value="formState.toilet"
          autoComplete="off"
          type="number"
        />
      </FormItem>
      <FormItem ref="orientation" :label="t('ohouse.house.orientation')" name="orientation">
        <Select
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('orientation')"
          ref="select"
          :allowClear="true"
          v-model:value="formState.orientation"
          style="width: 120px"
          @change="orientationChange"
          :options="houseConst.ORIENTATION"
          :pagination="false"
        />
      </FormItem>
      <FormItem ref="renovation" :label="t('ohouse.house.renovation')" name="renovation">
        <Select
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('renovation')"
          ref="select"
          :allowClear="true"
          v-model:value="formState.renovation"
          style="width: 120px"
          @change="renovationChange"
          :options="houseConst.RENOVATION_"
          :pagination="false"
        />
      </FormItem>
      <FormItem ref="type" :label="t('ohouse.house.type')" name="type">
        <Select
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('type')"
          ref="select"
          :allowClear="true"
          v-model:value="formState.type"
          style="width: 120px"
          @change="typeChange"
          :options="houseConst.TYPES"
          :pagination="false"
        />
      </FormItem>
      <FormItem ref="sellingPoint" :label="t('ohouse.house.sellingPoint')" name="sellingPoint">
        <Textarea
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('sellingPoint')"
          v-model:value="formState.sellingPoint"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="mentality" :label="t('ohouse.house.mentality')" name="mentality">
        <Textarea
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('mentality')"
          v-model:value="formState.mentality"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="description" :label="t('ohouse.house.description')" name="description">
        <Textarea
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('description')"
          v-model:value="formState.description"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="isOnly" :label="t('ohouse.house.isOnly')" name="isOnly">
        <Select
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('isOnly')"
          ref="select"
          :allowClear="true"
          v-model:value="formState.isOnly"
          style="width: 120px"
          @change="isOnlyChange"
          :options="houseConst.ONLY"
          :pagination="false"
        />
      </FormItem>
      <FormItem ref="fullYears" :label="t('ohouse.house.fullYears')" name="fullYears">
        <Select
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('fullYears')"
          ref="select"
          :allowClear="true"
          v-model:value="formState.fullYears"
          style="width: 120px"
          @change="fullYearsChange"
          :options="houseConst.FULL_YEARS"
          :pagination="false"
        />
      </FormItem>
      <FormItem ref="ownerName" :label="t('ohouse.house.ownerName')" name="ownerName">
        <Input
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('ownerName')"
          v-model:value="formState.ownerName"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="ownerMobile" :label="t('ohouse.house.ownerMobile')" name="ownerMobile">
        <Input
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('ownerMobile')"
          v-model:value="formState.ownerMobile"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="otherMobile" :label="t('ohouse.house.otherMobile')" name="otherMobile">
        <Input
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('otherMobile')"
          v-model:value="formState.otherMobile"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="keyword" :label="t('ohouse.house.keyword')" name="keyword">
        <Select
          v-model:value="tags"
          mode="tags"
          style="width: 100%"
          :token-separators="[',']"
          :options="options"
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('keyword')"
          @change="tagsChange"
        />
      </FormItem>
      <FormItem ref="status" :label="t('ohouse.house.status')" name="status">
        <Select
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('status')"
          ref="select"
          :allowClear="true"
          v-model:value="formState.status"
          style="width: 120px"
          @change="statusChange"
          :options="houseConst.STATUS"
          :pagination="false"
        />
      </FormItem>
      <FormItem ref="isShare" :label="t('ohouse.house.isShare')" name="isShare">
        <RadioGroup
          v-model:value="formState.isShare"
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('isShare')"
        >
          <Radio value="1">共有</Radio>
          <Radio value="0">非公有</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem ref="isMortgage" :label="t('ohouse.house.isMortgage')" name="isMortgage">
        <RadioGroup
          v-model:value="formState.isMortgage"
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('isMortgage')"
        >
          <Radio value="1">有抵押</Radio>
          <Radio value="0">无抵押</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem ref="hasXf" :label="t('ohouse.house.hasXf')" name="hasXf">
        <RadioGroup
          v-model:value="formState.hasXf"
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('hasXf')"
        >
          <Radio value="1">有</Radio>
          <Radio value="0">无</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem ref="hasCw" :label="t('ohouse.house.hasCw')" name="hasCw">
        <RadioGroup
          v-model:value="formState.hasCw"
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('hasCw')"
        >
          <Radio value="1">有</Radio>
          <Radio value="0">无</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem ref="hasDxs" :label="t('ohouse.house.hasDxs')" name="hasDxs">
        <RadioGroup
          v-model:value="formState.hasDxs"
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('hasDxs')"
        >
          <Radio value="1">有</Radio>
          <Radio value="0">无</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem ref="mobile" :label="t('ohouse.house.mobile')" name="mobile">
        <Input
          :disabled="isUpdate && !houseConst._UPDATE_FIELDS.includes('mobile')"
          v-model:value="formState.mobile"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="provinceId" :label="t('ohouse.house.provinceId')" name="provinceId">
        <FProvince :provinceId="formState.provinceId" @change="changeProvince" />
      </FormItem>
      <FormItem ref="cityId" :label="t('ohouse.house.cityId')" name="cityId">
        <FCity :cityId="formState.cityId" :provinceId="formState.provinceId" @change="changeCity" />
      </FormItem>
      <FormItem ref="areaId" :label="t('ohouse.house.areaId')" name="areaId">
        <FArea :areaId="formState.areaId" :cityId="formState.cityId" @change="changeArea" />
      </FormItem>
      <FormItem :wrapper-col="{ span: 14, offset: 4 }">
        <Button type="primary" @click="onSubmit">{{ t('component.modal.okText') }}</Button>
        <Button style="margin-left: 10px" @click="resetForm">{{
          t('component.cropper.btn_reset')
        }}</Button>
      </FormItem>
    </Form>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import {
    Button,
    Form,
    FormItem,
    Input,
    Select,
    Textarea,
    InputNumber,
    Radio,
    RadioGroup,
  } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { success, failed } from '/@/hooks/web/useList';
  import { HouseConst, HouseModel } from '/@/api/ohouse/house/model/houseModel';
  import { isExist, addOHouse, updateOHouse, getOHouse } from '/@/api/ohouse/house/house';
  import { FGroup } from '/@/components/FGroup';
  import { FProvince, FCity, FArea } from '/@/components/FLocation';

  interface Option {
    value: string;
    label: string;
  }

  export default defineComponent({
    name: 'HouseForm',
    components: {
      InputNumber,
      Button,
      Form,
      FormItem,
      Input,
      Loading,
      Select,
      Textarea,
      FProvince,
      FCity,
      FArea,
      FGroup,
      Radio,
      RadioGroup,
    },
    props: {
      id: {
        type: String,
        required: false,
      },
      projectId: {
        type: String,
        required: true,
      },
      buildId: {
        type: String,
        required: true,
      },
      unitId: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('project');
      const houseConst = ref(HouseConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      //判断是更新还是添加
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }

      //是否打开设置资源的modal
      let isModal = ref<boolean>(false);
      const changeModal = () => {
        isModal.value = true;
      };
      const onClose = () => {
        isModal.value = false;
      };

      // fromRef 获取form
      const formRef = ref();
      const formState: UnwrapRef<HouseModel> = reactive({
        projectId: props.projectId,
        buildId: props.buildId,
        unitId: props.unitId,
      });

      //提交
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            if (props.id) {
              loading.value = true;
              try {
                await updateOHouse(formState);
                success(t('host.action.update'), t('host.action.success'));
              } catch (error: any) {
                failed(t('host.action.update'), t('host.action.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              loading.value = true;
              try {
                const result = await isExist(
                  formState.projectId || '',
                  formState.buildId || '',
                  formState.unitId || '',
                  formState.number || ''
                );
                if (result) {
                  failed('添加失败', '当前房号已存在');
                  loading.value = false;
                  return;
                }
              } catch (error) {
                loading.value = false;
              }
              try {
                await addOHouse(formState);
                success(t('host.action.add'), t('host.action.success'));
              } catch (error: any) {
                failed(t('host.action.add'), t('host.action.fail'));
              } finally {
                loading.value = false;
              }
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
          if (props.id) {
            const { content } = await getOHouse(props.id);
            Object.assign(formState, content);
          } else {
            formRef.value.resetFields();
          }
        } catch (error) {
        } finally {
          loading.value = false;
        }
      };

      //初始加载
      let selectLabel = ref<String[]>([]);
      onMounted(async () => {
        loading.value = true;
        if (props.id) {
          const { content } = await getOHouse(props.id);
          Object.assign(formState, content);
          //关键词赋值
          if (formState.keyword) {
            const detags = formState.keyword.split(',');
            detags.forEach((tag) => {
              options.value.push({ value: tag, label: tag });
              tags.value.push(tag);
            });
          }
          // 标签
          if (formState.labels) {
            if (formState.labels.length > 0) {
              selectLabel.value = formState.labels.split(',');
            }
          }
        }
        loading.value = false;
      });
      // 楼层类型
      const floorTypeChange = (value) => {
        formState.floorType = value;
      };
      //标签修改
      const changeLabels = async (e) => {
        if (e && e.length > 0) {
          formState.labels = '';
          e.forEach((item) => {
            formState.labels = item.key + ',' + formState.labels;
            if (!formState.beansByLabels) {
              formState.beansByLabels = [];
            }
            formState.beansByLabels.push({
              id: item.key,
              value: item.key,
              groupId: item.label,
            });
          });
          formState.labels = formState.labels.substring(0, formState.labels.length - 1);
        }
      };
      // 朝向
      const orientationChange = (value) => {
        formState.orientation = value;
      };
      // 装修
      const renovationChange = (value) => {
        formState.renovation = value;
      };
      //关键词
      const options = ref<Option[]>([]);
      let tags = ref<string[]>([]);
      const tagsChange = async (value) => {
        let selectTags = '';
        if (value && value.length > 0) {
          value.forEach((item: string) => {
            selectTags = selectTags + ',' + item;
          });
        }
        const x = selectTags.indexOf(',');
        selectTags = selectTags.substring(x + 1);
        formState.keyword = selectTags;
      };
      //省市区修改，更新了一个之后，下级数据清空重新获取
      const changeProvince = async (e) => {
        if (e.value !== formState.provinceId) {
          formState.cityId = '';
          formState.areaId = '';
        }
        formState.provinceId = e.value || '';
      };
      const changeCity = async (e) => {
        if (e.value !== formState.cityId) {
          formState.areaId = '';
        }
        formState.cityId = e.value || '';
      };
      const changeArea = async (e) => {
        formState.areaId = e.value || '';
      };
      // 类型
      const typeChange = (value) => {
        formState.type = value;
      };
      // 唯一
      const isOnlyChange = (value) => {
        formState.isOnly = value;
      };
      const fullYearsChange = (value) => {
        formState.fullYears = value;
      };
      const statusChange = (value) => {
        formState.status = value;
      };

      return {
        statusChange,
        fullYearsChange,
        isOnlyChange,
        typeChange,
        changeProvince,
        changeCity,
        changeArea,
        options,
        tags,
        tagsChange,
        renovationChange,
        orientationChange,
        changeLabels,
        floorTypeChange,
        t,
        prefixCls,
        houseConst,
        loading,
        tip,
        formRef,
        formState,
        onSubmit,
        resetForm,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        isUpdate,
        props,
        changeModal,
        isModal,
        onClose,
        selectLabel,
      };
    },
  });
</script>
