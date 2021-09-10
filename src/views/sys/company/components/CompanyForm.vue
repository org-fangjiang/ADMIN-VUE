// 企业信息表单
<template>
  <div>
    <Form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="name" :label="t('model.company.name')" name="name">
        <Input
          :disabled="isUpdate && !updateFields.includes('name')"
          v-model:value="formState.name"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="managerId" :label="t('model.company.managerId')" name="managerId">
        <Input
          :disabled="isUpdate && !updateFields.includes('managerId')"
          v-model:value="formState.managerId"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="provinceId" :label="t('model.company.province')" name="provinceId">
        <!-- <Input
          :disabled="companyId && !updateFields.includes('provinceId')"
          v-model:value="formState.provinceId"
          autoComplete="off"
        /> -->
        <FProvince
          :disabledProvince="isUpdate && !updateFields.includes('provinceId')"
          :provinceId="formState.provinceId"
          @change="changeProvince"
        />
      </FormItem>
      <FormItem ref="cityId" :label="t('model.company.city')" name="cityId">
        <!-- <Input
          :disabled="companyId && !updateFields.includes('cityId')"
          v-model:value="formState.cityId"
          autoComplete="off"
        /> -->
        <FCity
          :disabledProvince="isUpdate && !updateFields.includes('cityId')"
          :provinceId="formState.provinceId"
          :cityId="formState.cityId"
          @change="changeCity"
        />
      </FormItem>
      <FormItem ref="areaId" :label="t('model.company.area')" name="areaId">
        <!-- <Input
          :disabled="companyId && !updateFields.includes('areaId')"
          v-model:value="formState.areaId"
          autoComplete="off"
        /> -->
        <FArea
          :disabledProvince="isUpdate && !updateFields.includes('areaId')"
          :cityId="formState.cityId"
          :areaId="formState.areaId"
          @change="changeArea"
        />
      </FormItem>
      <FormItem
        ref="companyAddress"
        :label="t('model.company.companyAddress')"
        name="companyAddress"
      >
        <Input
          :disabled="isUpdate && !updateFields.includes('companyAddress')"
          v-model:value="formState.companyAddress"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="companyPhone" :label="t('model.company.companyPhone')" name="companyPhone">
        <Input
          :disabled="isUpdate && !updateFields.includes('companyPhone')"
          v-model:value="formState.companyPhone"
          autoComplete="off"
        />
      </FormItem>
      <FormItem
        ref="businessLicense"
        :label="t('model.company.businessLicense')"
        name="businessLicense"
      >
        <Input
          :disabled="isUpdate && !updateFields.includes('businessLicense')"
          v-model:value="formState.businessLicense"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="companySize" :label="t('model.company.companySize')" name="companySize">
        <!-- <Input
          :disabled="companyId && !updateFields.includes('companySize')"
          v-model:value="formState.companySize"
          autoComplete="off"
        /> -->
        <Select
          @change="stateHandleChange"
          v-model:value="formState.companySize"
          :options="companySizes"
        />
      </FormItem>
      <FormItem ref="commission" :label="t('model.company.commission')" name="commission">
        <Input
          :disabled="isUpdate && !updateFields.includes('commission')"
          v-if="formState.commissionMode === '1'"
          v-model:value="formState.commission"
          autoComplete="off"
        />
        <Slider
          :disabled="isUpdate && !updateFields.includes('commission')"
          v-else
          v-model:value="formState.commission"
        />
      </FormItem>
      <FormItem
        ref="commissionMode"
        :label="t('model.company.commissionMode')"
        name="commissionMode"
      >
        <!-- <Input
          :disabled="companyId && !updateFields.includes('commissionMode')"
          v-model:value="formState.commissionMode"
          autoComplete="off"
        /> -->
        <RadioGroup v-model:value="formState.commissionMode">
          <Radio value="0">百分比</Radio>
          <Radio value="1">固定金额</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem ref="onlineNumber" :label="t('model.company.onlineNumber')" name="onlineNumber">
        <Input v-model:value="formState.onlineNumber" autoComplete="off" />
      </FormItem>
      <FormItem
        ref="expirationData"
        :label="t('model.company.expirationData')"
        name="expirationData"
      >
        <!-- <Input
          v-show="false"
          :disabled="companyId && !updateFields.includes('expirationData')"
          v-model:value="formState.expirationData"
          autoComplete="off"
        /> -->
        <DatePicker
          showTime
          :disabled-date="disabledDate"
          :disabled="isUpdate && !updateFields.includes('expirationData')"
          format="YYYY-MM-DD HH:mm:ss"
          :value="formState.expirationData"
          @change="change"
        />
      </FormItem>
      <FormItem :wrapper-col="{ span: 14, offset: 4 }">
        <Button v-if="!isUpdate" type="primary" @click="onSubmit">{{
          t('model.company.add')
        }}</Button>
        <Button v-else type="primary" @click="onSubmit">{{ t('model.company.save') }}</Button>
        <Button style="margin-left: 10px" @click="resetForm">{{
          t('model.company.cancel')
        }}</Button>
      </FormItem>
    </Form>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getCompany, addCompany, updateCompany } from '/@/api/sys/compnay/company';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import moment from 'moment';
  import { CompanyModel, CompanyConst } from '/@/api/sys/compnay/model/companyModel';
  import { Loading } from '/@/components/Loading';
  import {
    Form,
    FormItem,
    Button,
    Input,
    Select,
    RadioGroup,
    Radio,
    DatePicker,
    Slider,
  } from 'ant-design-vue';
  import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';
  import { FProvince, FCity, FArea } from '/@/components/FLocation';

  export default defineComponent({
    name: 'CompanyForm',
    components: {
      Loading,
      Form,
      FormItem,
      Button,
      Input,
      Select,
      RadioGroup,
      Radio,
      DatePicker,
      Slider,
      FProvince,
      FCity,
      FArea,
    },
    props: {
      id: {
        type: String,
        require: false,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('login');
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }
      const loading = ref<boolean>(false);
      const tip = ref<string>('加载中...');
      const formRef = ref();
      const rules = reactive(CompanyConst.COMPANY_RULES);
      const companySizes = reactive(CompanyConst.COMPANY_SIZES);
      const stateHandleChange = async (value) => {
        formState.companySize = value;
      };

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

      const formState: UnwrapRef<CompanyModel> = reactive({
        id: '',
        name: '',
        managerId: '',
        provinceId: '',
        cityId: '',
        areaId: '',
        companyAddress: '',
        companyPhone: '',
        businessLicense: '',
        companySize: '',
        commission: 0,
        commissionMode: '',
        onlineNumber: '',
        expirationData: '',
        state: '',
        renewalData: '',
        createTime: '',
        createBy: '',
        updateTime: '',
        updateBy: '',
        provinceByProvinceId: undefined,
        cityByCityId: undefined,
        areaByAreaId: undefined,
      });

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            if (props.id) {
              loading.value = true;
              try {
                const { content } = await updateCompany(formState);
                success(t('model.company.updateInfo'), t('model.company.update_success'));
                Object.assign(formState, content);
                formState.commission = Number(formState.commission);
              } catch (error) {
                failed(error?.response?.data?.message, t('model.company.update_failed'));
              } finally {
                loading.value = false;
              }
            } else {
              loading.value = true;
              try {
                const { content } = await addCompany(formState);
                success(t('model.company.save'), t('model.company.save_success'));
                Object.assign(formState, content);
                formState.commission = Number(formState.commission);
              } catch (error) {
                failed(error?.response?.data?.message, t('model.company.save_failed'));
              } finally {
                loading.value = false;
              }
            }
          })
          .catch((error: ValidateErrorEntity<CompanyModel>) => {
            console.log('error', error);
          });
      };

      const change = (_date: any | string, dateString: string) => {
        formState.expirationData = dateString;
      };

      const success = (message: any, description: any) => {
        notification.success({
          message: message,
          description: description,
          duration: 3,
        });
      };

      const failed = (title: any, content: any) => {
        createErrorModal({
          title: title || t('sys.api.errorTip'),
          content: content || t('sys.api.networkExceptionMsg'),
          getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
      };

      const resetForm = async () => {
        if (props.id) {
          loading.value = true;
          try {
            const { content } = await getCompany(props.id);
            Object.assign(formState, content);
            formState.commission = Number(formState.commission);
          } catch (error) {
          } finally {
            loading.value = false;
          }
        } else {
          formRef.value.resetFields();
        }
      };

      const disabledDate = (current: any) => {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
      };

      onMounted(async () => {
        if (props.id) {
          loading.value = true;
          try {
            const { content } = await getCompany(props.id);
            Object.assign(formState, content);
            formState.commission = Number(formState.commission);
          } catch (error) {
          } finally {
            loading.value = false;
          }
        } else {
          // 如果是添加时，默认设置为百分比
          formState.commissionMode = '0';
        }
      });

      return {
        t,
        formRef,
        formState,
        loading,
        updateFields: CompanyConst.COMPANY_UPDATE_FIELDS,
        isUpdate,
        tip,
        rules,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        onSubmit,
        resetForm,
        stateHandleChange,
        companySizes,
        change,
        disabledDate,
        changeProvince,
        changeCity,
        changeArea,
        props,
      };
    },
  });
</script>
