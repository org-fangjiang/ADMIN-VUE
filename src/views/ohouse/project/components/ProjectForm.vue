// 楼盘信息表单
<template>
  <div>
    <Form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <Divider orientation="left">基本信息</Divider>
      <br />
      <div style="display: grid; grid-template-columns: 33.33% 33.33% 33.33%">
        <FormItem ref="name" :label="t('host.name')" name="name">
          <Input
            :disabled="isUpdate && !updateFields.includes('name')"
            v-model:value="formState.name"
            autoComplete="off"
          />
        </FormItem>
        <FormItem ref="aliasName" :label="t('host.aliasName')" name="aliasName">
          <Input
            :disabled="isUpdate && !updateFields.includes('aliasName')"
            v-model:value="formState.aliasName"
            autoComplete="off"
          />
        </FormItem>
        <FormItem ref="type" :label="t('host.type')" name="type">
          <Select
            ref="select"
            :allowClear="true"
            v-model:value="formState.type"
            style="width: 120px"
            @change="typeChange"
            :options="hostConst.TYPES"
            :pagination="false"
          />
        </FormItem>
        <FormItem ref="buildType" :label="t('host.buildType')" name="buildType">
          <Select
            ref="select"
            :allowClear="true"
            v-model:value="formState.buildType"
            style="width: 120px"
            @change="buildTypeChange"
            :options="hostConst.BUILD_TYPES"
            :pagination="false"
          />
        </FormItem>
        <FormItem ref="property" :label="t('host.property')" name="property">
          <InputNumber
            :disabled="isUpdate && !updateFields.includes('property')"
            v-model:value="formState.property"
            :type="'number'"
            autoComplete="off"
          />&nbsp;&nbsp;年
        </FormItem>
        <FormItem ref="getLandTime" :label="t('host.getLandTime')" name="getLandTime">
          <DatePicker
            showTime
            :disabled="isUpdate && !updateFields.includes('getLandTime')"
            format="YYYY-MM-DD HH:mm:ss"
            :value="formState.getLandTime"
            @change="getLandTimechange"
          />
        </FormItem>
        <FormItem ref="locationScore" :label="t('host.locationScore')" name="locationScore">
          <InputNumber
            :min="1.0"
            :max="5.0"
            :disabled="isUpdate && !updateFields.includes('locationScore')"
            v-model:value="formState.locationScore"
            autoComplete="off"
            placeholder="1.0～5.0"
          />
        </FormItem>
        <FormItem ref="educationScore" :label="t('host.educationScore')" name="educationScore">
          <InputNumber
            :min="1.0"
            :max="5.0"
            :disabled="isUpdate && !updateFields.includes('educationScore')"
            v-model:value="formState.educationScore"
            autoComplete="off"
            placeholder="1.0～5.0"
          />
        </FormItem>
        <FormItem ref="medicalScore" :label="t('host.medicalScore')" name="medicalScore">
          <InputNumber
            :min="1.0"
            :max="5.0"
            :disabled="isUpdate && !updateFields.includes('medicalScore')"
            v-model:value="formState.medicalScore"
            autoComplete="off"
            placeholder="1.0～5.0"
          />
        </FormItem>
        <FormItem ref="trafficScore" :label="t('host.trafficScore')" name="trafficScore">
          <InputNumber
            :min="1.0"
            :max="5.0"
            :disabled="isUpdate && !updateFields.includes('trafficScore')"
            v-model:value="formState.trafficScore"
            autoComplete="off"
            placeholder="1.0～5.0"
          />
        </FormItem>
        <FormItem ref="matchingScore" :label="t('host.matchingScore')" name="matchingScore">
          <InputNumber
            :min="1.0"
            :max="5.0"
            :disabled="isUpdate && !updateFields.includes('matchingScore')"
            v-model:value="formState.matchingScore"
            autoComplete="off"
            placeholder="1.0～5.0"
          />
        </FormItem>
        <FormItem ref="unitNumber" :label="t('host.unitNumber')" name="unitNumber">
          <InputNumber
            :disabled="isUpdate && !updateFields.includes('unitNumber')"
            v-model:value="formState.unitNumber"
            autoComplete="off"
          />
        </FormItem>
        <FormItem ref="houseNumber" :label="t('host.houseNumber')" name="houseNumber">
          <InputNumber
            :disabled="isUpdate && !updateFields.includes('houseNumber')"
            v-model:value="formState.houseNumber"
            autoComplete="off"
          />
        </FormItem>
        <FormItem :label="t('host.province')" name="provinceId">
          <FProvince :disabledProvince="true" :provinceId="provinceId" />
        </FormItem>
        <FormItem :label="t('host.city')" name="cityId">
          <FCity :disabledCity="true" :provinceId="provinceId" :cityId="cityId" />
        </FormItem>
        <FormItem ref="areaId" :label="t('host.area')" name="areaId">
          <FArea
            :disabledArea="isUpdate && !updateFields.includes('areaId')"
            :cityId="cityId"
            :areaId="formState.areaId"
            @change="areaChange"
          />
        </FormItem>
        <FormItem ref="address" :label="t('host.address')" name="address">
          <div class="flex flex-row w-full h-full">
            <Input
              :disabled="isUpdate && !updateFields.includes('address')"
              v-model:value="formState.address"
              autoComplete="off"
            />
            <div style="padding-top: 6px; padding-left: 8px" @click="searchPOI">
              <Icon icon="fa-solid:location-arrow" />
            </div>
          </div>
        </FormItem>
        <FormItem ref="developerId" :label="t('host.hDeveloperByDeveloperId')" name="developerId">
          <Button @click="setDevelop">设置开发商</Button>
          <br />
          <span>{{ developerName }}</span>
        </FormItem>
        <FormItem ref="brandId" :label="t('host.brandId')" name="brandId">
          <Button @click="setBrand">设置品牌商</Button>
          <br />
          <span>{{ brandName }}</span>
        </FormItem>
        <FormItem ref="sandImg" :label="t('host.sandImg')" name="brandId">
          <Button @click="setSandImg">设置沙盘图</Button>
          <br />
          <img :src="sandAddress" alt="" width="120px" />
        </FormItem>
        <FormItem ref="firstImg" :label="t('host.firstImg')" name="firstImg">
          <Button @click="setFirstImg">设置首图</Button>
          <br />
          <img :src="firstAddress" alt="" width="120px" />
        </FormItem>
      </div>
      <br />
      <Divider orientation="left">销售信息</Divider>
      <br />
      <div style="display: grid; grid-template-columns: 33.33% 33.33% 33.33%">
        <FormItem ref="openTime" :label="t('host.openTime')" name="openTime">
          <DatePicker
            showTime
            :disabled="isUpdate && !updateFields.includes('openTime')"
            format="YYYY-MM-DD HH:mm:ss"
            :value="formState.openTime"
            @change="openTimechange"
          />
        </FormItem>
        <FormItem ref="payTime" :label="t('host.payTime')" name="payTime">
          <DatePicker
            showTime
            :disabled="isUpdate && !updateFields.includes('payTime')"
            format="YYYY-MM-DD HH:mm:ss"
            :value="formState.payTime"
            @change="payTimechange"
          />
        </FormItem>
        <FormItem ref="labels" :label="t('host.labels')" name="labels">
          <FGroup @change="changeLabels" :ids="formState.beansByLabels" />
        </FormItem>
      </div>
      <br />
      <Divider orientation="left">规划信息</Divider>
      <br />
      <div style="display: grid; grid-template-columns: 33.33% 33.33% 33.33%">
        <FormItem
          ref="ladderHouseRatio"
          :label="t('host.ladderHouseRatio')"
          name="ladderHouseRatio"
        >
          <Input
            :disabled="isUpdate && !updateFields.includes('ladderHouseRatio')"
            v-model:value="formState.ladderHouseRatio"
            autoComplete="off"
          />
        </FormItem>
        <FormItem ref="landArea" :label="t('host.landArea')" name="landArea">
          <Input
            :disabled="isUpdate && !updateFields.includes('landArea')"
            v-model:value="formState.landArea"
            autoComplete="off"
            suffix="m²"
            :type="'number'"
          />
        </FormItem>
        <FormItem ref="buildArea" :label="t('host.buildArea')" name="buildArea">
          <Input
            :disabled="isUpdate && !updateFields.includes('buildArea')"
            v-model:value="formState.buildArea"
            autoComplete="off"
            suffix="m²"
            :type="'number'"
          />
        </FormItem>
        <FormItem ref="volumeRate" :label="t('host.volumeRate')" name="volumeRate">
          <InputNumber
            :disabled="isUpdate && !updateFields.includes('volumeRate')"
            v-model:value="formState.volumeRate"
            autoComplete="off"
            :formatter="(value) => `${value}%`"
            :parser="(value) => value.replace('%', '')"
          />
        </FormItem>
        <FormItem ref="greenRate" :label="t('host.greenRate')" name="greenRate">
          <Input
            :disabled="isUpdate && !updateFields.includes('greenRate')"
            v-model:value="formState.greenRate"
            autoComplete="off"
            suffix="%"
            :type="'number'"
          />
        </FormItem>
        <FormItem ref="parkingRatio" :label="t('host.park')" name="parkingRatio">
          <Input
            :disabled="isUpdate && !updateFields.includes('formState.parkingRatio')"
            v-model:value="formState.parkingRatio"
            autoComplete="off"
          />
        </FormItem>
        <FormItem ref="parking" :label="t('host.parking')" name="parking">
          <Input
            :disabled="isUpdate && !updateFields.includes('parking')"
            v-model:value="formState.parking"
            autoComplete="off"
          />
        </FormItem>
        <FormItem ref="buildingNumber" :label="t('host.buildingTotal')" name="buildingNumber">
          <InputNumber
            :disabled="isUpdate && !updateFields.includes('buildingNumber')"
            v-model:value="formState.buildingNumber"
            autoComplete="off"
          />&nbsp;&nbsp;栋
        </FormItem>
        <FormItem ref="houseTotal" :label="t('host.houseTotal')" name="houseTotal">
          <Input
            :disabled="isUpdate && !updateFields.includes('houseTotal')"
            v-model:value="formState.houseTotal"
            autoComplete="off"
            suffix="户"
            :type="'number'"
          />
        </FormItem>
        <FormItem ref="elevatorInfo" :label="t('host.elevatorInfo')" name="elevatorInfo">
          <Input
            :disabled="isUpdate && !updateFields.includes('elevatorInfo')"
            v-model:value="formState.elevatorInfo"
            autoComplete="off"
          />
        </FormItem>
        <FormItem ref="estateCompany" :label="t('host.estateCompany')" name="estateCompany">
          <Button @click="setEstate">设置物业公司</Button>
          <br />
          <span>{{ estateName }}</span>
        </FormItem>
        <FormItem ref="estatePrice" :label="t('host.estatePrice')" name="estatePrice">
          <Input
            :disabled="isUpdate && !updateFields.includes('estatePrice')"
            v-model:value="formState.estatePrice"
            autoComplete="off"
            suffix="元/m²"
            :type="'number'"
          />
        </FormItem>
        <FormItem
          ref="estateDescription"
          :label="t('host.estateDescription')"
          name="estateDescription"
        >
          <Input
            :disabled="isUpdate && !updateFields.includes('estateDescription')"
            v-model:value="formState.estateDescription"
            autoComplete="off"
          />
        </FormItem>
      </div>
      <br />
      <Divider orientation="left">其他信息</Divider>
      <br />
      <div style="display: grid; grid-template-columns: 33.33% 33.33% 33.33%">
        <FormItem ref="divideCar" :label="t('host.people')" name="divideCar">
          <Select
            ref="select"
            :allowClear="true"
            v-model:value="formState.divideCar"
            style="width: 120px"
            @change="divideChange"
            :options="hostConst.DIVIDE"
            :pagination="false"
          />
        </FormItem>
        <FormItem ref="cng" :label="t('host.cng')" name="cng">
          <Select
            ref="select"
            :allowClear="true"
            v-model:value="formState.cng"
            style="width: 120px"
            @change="cngChange"
            :options="hostConst.CNG"
            :pagination="false"
          />
        </FormItem>
        <FormItem ref="waterMethod" :label="t('host.waterMethod')" name="waterMethod">
          <Select
            ref="select"
            :allowClear="true"
            v-model:value="formState.waterMethod"
            style="width: 120px"
            @change="waterMethodChange"
            :options="hostConst.WATER_METHOD"
            :pagination="false"
          />
        </FormItem>
        <FormItem
          ref="electricityMethod"
          :label="t('host.electricityMethod')"
          name="electricityMethod"
        >
          <Select
            ref="select"
            :allowClear="true"
            v-model:value="formState.electricityMethod"
            style="width: 120px"
            @change="electricityMethodChange"
            :options="hostConst.ELECTRICITY_METHOD"
            :pagination="false"
          />
        </FormItem>
        <FormItem ref="heatMethod" :label="t('host.heatMethod')" name="heatMethod">
          <Select
            ref="select"
            :allowClear="true"
            v-model:value="formState.heatMethod"
            style="width: 120px"
            @change="heatMethodChange"
            :options="hostConst.HEAT_METHOD"
            :pagination="false"
          />
        </FormItem>
        <FormItem ref="trafficInfo" :label="t('host.trafficInfo')" name="trafficInfo">
          <Textarea
            :disabled="isUpdate && !updateFields.includes('trafficInfo')"
            v-model:value="formState.trafficInfo"
            autoComplete="off"
          />
        </FormItem>
        <FormItem ref="medicalInfo" :label="t('host.medicalInfo')" name="medicalInfo">
          <Textarea
            :disabled="isUpdate && !updateFields.includes('medicalInfo')"
            v-model:value="formState.medicalInfo"
            autoComplete="off"
          />
        </FormItem>
        <FormItem ref="matchingInfo" :label="t('host.matchingInfo')" name="matchingInfo">
          <Textarea
            :disabled="isUpdate && !updateFields.includes('matchingInfo')"
            v-model:value="formState.matchingInfo"
            autoComplete="off"
          />
        </FormItem>
        <FormItem ref="educationInfo" :label="t('host.educationInfo')" name="educationInfo">
          <Textarea
            :disabled="isUpdate && !updateFields.includes('educationInfo')"
            v-model:value="formState.educationInfo"
            autoComplete="off"
          />
        </FormItem>
        <FormItem ref="otherInfo" :label="t('host.otherInfo')" name="otherInfo">
          <Textarea
            :disabled="isUpdate && !updateFields.includes('otherInfo')"
            v-model:value="formState.otherInfo"
            autoComplete="off"
          />
        </FormItem>
        <FormItem ref="description" :label="t('host.description')" name="description">
          <Textarea
            :disabled="isUpdate && !updateFields.includes('description')"
            v-model:value="formState.description"
            autoComplete="off"
          />
        </FormItem>
        <FormItem ref="advantage" :label="t('host.advantage')" name="advantage">
          <Textarea
            :disabled="isUpdate && !updateFields.includes('advantage')"
            v-model:value="formState.advantage"
            autoComplete="off"
          />
        </FormItem>
        <FormItem ref="defect" :label="t('host.defect')" name="defect">
          <Textarea
            :disabled="isUpdate && !updateFields.includes('defect')"
            v-model:value="formState.defect"
            autoComplete="off"
          />
        </FormItem>
        <FormItem ref="orderNum" :label="t('host.orderNum')" name="orderNum">
          <Input v-model:value="formState.orderNum" autoComplete="off" :type="'number'" />
        </FormItem>
      </div>
      <br />
      <Divider />
      <br />
      <div style="display: grid; grid-template-columns: 33.33% 33.33% 33.33%">
        <FormItem ref="number" :label="t('host.number')" name="number">
          <Input
            :disabled="isUpdate && !updateFields.includes('number')"
            v-model:value="formState.number"
            autoComplete="off"
            :type="'number'"
          />
        </FormItem>
        <FormItem ref="lookTime" :label="t('host.lookTime')" name="lookTime">
          <InputNumber
            :disabled="isUpdate && !updateFields.includes('lookTime')"
            v-model:value="formState.lookTime"
            autoComplete="off"
          />
        </FormItem>
        <FormItem :wrapper-col="{ span: 14, offset: 4 }">
          <Button type="primary" @click="onSubmit">{{ t('host.action.onSubmit') }}</Button>
          <Button style="margin-left: 10px" @click="resetForm">{{ t('host.action.reset') }}</Button>
        </FormItem>
      </div>
    </Form>
    <Modal
      v-model:visible="visible"
      title=""
      @ok="handleOk"
      width="100%"
      wrapClassName="full-modal"
    >
      <MapSearchPOI
        :searchText="searchText"
        :type="'150500'"
        :cityId="cityId"
        :citylimit="cityId !== ''"
        @change="poiChange"
      />
    </Modal>
    <Modal
      v-model:visible="isSet"
      title=""
      width="800px"
      :footer="null"
      :bodyStyle="{ overflow: 'auto', 'margin-top': '16px' }"
      :destroyOnClose="true"
    >
      <DeveloperTable v-if="state === 1" @setDeveloper="setDeveloper" :checkedKeys="selectedRow" />
      <BrandTable v-if="state === 2" @setBrandName="setBrandName" :checkedKeys="selectedRow" />
      <EstateTable v-if="state === 3" @setEstateName="setEstateName" :checkedKeys="selectedRow" />
    </Modal>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Loading } from '/@/components/Loading';
  import { Icon } from '/@/components/Icon';
  import { MapSearchPOI } from '/@/components/FMap';
  import {
    Form,
    FormItem,
    Button,
    Input,
    InputNumber,
    Select,
    DatePicker,
    Modal,
    Textarea,
    Divider,
  } from 'ant-design-vue';
  import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';
  import { useUserStore } from '/@/store/modules/user';
  import { FProvince, FCity, FArea } from '/@/components/FLocation';
  import { Persistent } from '/@/utils/cache/persistent';
  import { HOUSE_PROJECT } from '/@/enums/cacheEnum';
  import { FGroup } from '/@/components/FGroup';
  import DeveloperTable from '/@/components/FDeveloper/src/DeveloperTable.vue';
  import BrandTable from '/@/components/FBrand/src/BrandTable.vue';
  import EstateTable from '/@/components/FEstateCompany/src/EstateTable.vue';
  import { getDeveloper } from '/@/api/host/developer/developer';
  import { getBrand } from '/@/api/host/brand/brand';
  import { getEstateCompany } from '/@/api/host/estateCompany/estateCompany';
  import { failed, success } from '/@/hooks/web/useList';
  import { OProjectConst, OProjectModel } from '/@/api/ohouse/project/model/projectModel';
  import { getOHouse, addOHouse, updateOHouse, exist } from '/@/api/ohouse/project/project';

  export default defineComponent({
    name: 'ProjectForm',
    components: {
      Loading,
      Form,
      FormItem,
      Button,
      Input,
      InputNumber,
      Select,
      DatePicker,
      Icon,
      Modal,
      MapSearchPOI,
      Textarea,
      FProvince,
      FCity,
      FArea,
      FGroup,
      DeveloperTable,
      BrandTable,
      EstateTable,
      Divider,
    },
    props: {
      id: {
        type: String,
        require: false,
      },
    },
    setup(props) {
      const { t } = useI18n();

      //判断是否为更新
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }
      //加载动画
      const loading = ref<boolean>(false);
      const tip = ref<string>('加载中...');

      //验证规则
      const rules = reactive(OProjectConst._RULES);
      const hostConst = ref(OProjectConst);

      const userStore = useUserStore();
      const cityId = ref<string>(userStore.getUserInfo.companyCityId || '');
      let provinceId = ref<string>(userStore.getUserInfo.companyProvinceId || '');

      const formRef = ref();
      const formState: UnwrapRef<OProjectModel> = reactive({});

      // 人车分流
      const divideChange = (value) => {
        formState.divideCar = value;
      };

      //标签
      const changeLabels = async (e) => {
        if (e && e.length > 0) {
          formState.labels = '';
          e.forEach((item) => {
            formState.labels = item.key + ',' + formState.labels;
          });
        }
      };
      //设置开发商
      let isSet = ref(false);
      let state = ref(0);
      let selectedRow = ref('');
      let developerName = ref('');
      const setDevelop = async () => {
        isSet.value = true;
        state.value = 1;
        if (formState.developerId) {
          selectedRow.value = formState.developerId;
        }
      };
      const setDeveloper = async (value) => {
        formState.developerId = value.id;
        const { content } = await getDeveloper(value.id);
        developerName.value = content.name || '';
        isSet.value = false;
        state.value = 0;
        selectedRow.value = '';
      };
      //设置品牌商
      let brandName = ref('');
      const setBrand = async () => {
        isSet.value = true;
        state.value = 2;
        if (formState.brandId) {
          selectedRow.value = formState.brandId;
        }
      };
      const setBrandName = async (value) => {
        formState.brandId = value.id;
        const { content } = await getBrand(value.id);
        formState.brandId = content.id;
        brandName.value = content.name || '';
        isSet.value = false;
        state.value = 0;
        selectedRow.value = '';
      };
      //设置物业公司
      let estateName = ref('');
      const setEstate = async () => {
        isSet.value = true;
        state.value = 3;
        if (formState.estateCompany) {
          selectedRow.value = formState.estateCompany;
        }
      };
      const setEstateName = async (value) => {
        formState.estateCompany = value.id;
        const { content } = await getEstateCompany(value.id);
        formState.estateCompany = content.id;
        estateName.value = content.name || '';
        isSet.value = false;
        state.value = 0;
        selectedRow.value = '';
      };
      //类型
      const typeChange = async (e) => {
        formState.type = e || '';
      };
      //建筑类型
      const buildTypeChange = async (e) => {
        formState.buildType = e;
      };
      //拿地时间
      const getLandTimechange = async (e) => {
        formState.getLandTime = e;
      };
      //开盘时间
      const openTimechange = (_date: any | string, dateString: string) => {
        formState.openTime = dateString;
      };
      //交房时间
      const payTimechange = (_date: any | string, dateString: string) => {
        formState.payTime = dateString;
      };
      //供水方式
      const waterMethodChange = async (e) => {
        formState.waterMethod = e;
      };
      //供电方式
      const electricityMethodChange = async (e) => {
        formState.electricityMethod = e;
      };
      //供暖方式
      const heatMethodChange = async (e) => {
        formState.heatMethod = e;
      };
      //区
      const areaChange = async (e) => {
        formState.areaId = e || '';
      };
      // 燃气
      const cngChange = (value) => {
        formState.cng = value;
      };
      // 沙盘图
      let sandAddress = ref();
      const setSandImg = () => {};
      // 首图
      let firstAddress = ref();
      const setFirstImg = () => {};

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
                // failed(error?.response?.data?.message, t('host.action.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              loading.value = true;
              try {
                const result = await exist(cityId.value, formState.name || '');
                if (result.code === 200) {
                  console.log('existResult:', result);
                }
              } catch (error) {
                loading.value = false;
                failed('添加失败', '项目已存在');
                return;
              }
              try {
                await addOHouse(formState);
                success(t('host.action.add'), t('host.action.success'));
              } catch (error: any) {
                // failed(error?.response?.data?.message, t('host.action.fail'));
              } finally {
                loading.value = false;
              }
            }
          })
          .catch((error: ValidateErrorEntity<OProjectModel>) => {
            console.log('error', error);
          });
      };
      //重置
      const resetForm = async () => {
        if (props.id) {
          loading.value = true;
          try {
            const { content } = await getOHouse(props.id);
            Object.assign(formState, content);
          } catch (error) {
          } finally {
            loading.value = false;
          }
        } else {
          formRef.value.resetFields();
          Persistent.removeLocal(HOUSE_PROJECT, true);
        }
      };

      let area = ref('');
      let selected = ref<String[]>([]);
      let selectedLabel = ref<String[]>([]);
      //初始加载
      onMounted(async () => {
        if (props.id) {
          loading.value = true;
          try {
            const { content } = await getOHouse(props.id);
            Object.assign(formState, content);
            if (formState.beansByLabels) {
              formState.beansByLabels.forEach((item) => {
                selectedLabel.value.push(item.id || '');
              });
              formState.labels = selectedLabel.value.toString();
            }
            //获取物业开发商和品牌商的名称并展示
            if (formState.developerId) {
              const { content } = await getDeveloper(formState.developerId);
              developerName.value = content.name || '';
            }
            if (formState.brandId) {
              const { content } = await getBrand(formState.brandId);
              brandName.value = content.name || '';
            }
            if (formState.estateCompany) {
              const { content } = await getEstateCompany(formState.estateCompany);
              estateName.value = content.name || '';
            }
          } catch (error) {
          } finally {
            loading.value = false;
          }
        }
        formState.provinceId = provinceId.value;
        formState.cityId = cityId.value;
      });

      // 是否打开，model
      const startOrEnd = ref('');
      const visible = ref<boolean>(false);
      const handleOk = (e: MouseEvent) => {
        console.log(e);
        visible.value = false;
      };
      // Poi 搜索内容
      const searchText = ref<string>('');
      const searchPOI = () => {
        searchText.value = formState.name || '';
        visible.value = true;
      };
      // poi change
      const poiChange = async (result) => {
        if (result === '') {
          formState.name = '';
          formState.longitude = '';
          formState.latitude = '';
          formState.areaId = '';
          return;
        }
        formState.name = result.value.name;
        formState.longitude = result.value.location.lng;
        formState.latitude = result.value.location.lat;
        formState.areaId = result.value.adcode;
        formState.address = result.value.address;
        area.value = result.value.adcode;
      };

      return {
        t,
        formRef,
        formState,
        loading,
        updateFields: OProjectConst._UPDATE_FIELDS,
        isUpdate,
        tip,
        rules,
        labelCol: { span: 5 },
        wrapperCol: { span: 7 },
        onSubmit,
        resetForm,
        areaChange,
        props,
        cityId,
        provinceId,
        handleOk,
        searchPOI,
        poiChange,
        startOrEnd,
        typeChange,
        buildTypeChange,
        getLandTimechange,
        openTimechange,
        payTimechange,
        waterMethodChange,
        electricityMethodChange,
        heatMethodChange,
        visible,
        hostConst,
        searchText,
        area,
        changeLabels,
        selected,
        setDevelop,
        isSet,
        state,
        setDeveloper,
        developerName,
        brandName,
        setBrand,
        setBrandName,
        setEstateName,
        setEstate,
        estateName,
        selectedRow,
        selectedLabel,
        divideChange,
        cngChange,
        setSandImg,
        setFirstImg,
        sandAddress,
        firstAddress,
      };
    },
  });
</script>
