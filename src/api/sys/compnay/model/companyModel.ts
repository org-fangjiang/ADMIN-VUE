import { useI18n } from '/@/hooks/web/useI18n';
import { AreaModel } from '../../area/model/areaModel';
import { CityModel } from '../../city/model/cityModel';
import { ProvinceModel } from '../../province/model/provinceModel';
const { t } = useI18n();

export interface CompanyModel {
  id?: string; //
  name?: string; //*
  managerId?: string; //-
  provinceId?: string; //*
  cityId?: string; //*
  areaId?: string; //*
  companyAddress?: string; //*
  companyPhone?: string; //*
  businessLicense?: string; //-
  companySize?: string; //*
  commission?: number; //-
  commissionMode?: string; //-
  onlineNumber?: string; //*
  state?: string; //-
  expirationData?: string; //*
  renewalData?: string; //
  createTime?: string; //-
  createBy?: string; //-
  updateTime?: string; //-
  updateBy?: string; //-
  provinceByProvinceId?: ProvinceModel; //-
  cityByCityId?: CityModel;
  areaByAreaId?: AreaModel;
}

export interface CompanyByCondition {
  state?: string;
  provinceId?: string;
  cityId?: string;
  areaId?: string;
}

export const CompanyConst = {
  INVALID: '0',
  LOCKED: '1',
  EFFECTIVE: '2',
  STATES: [
    { value: '0', label: t('model.company.invalid'), color: 'volcano' },
    { value: '1', label: t('model.company.locked'), color: 'geekblue' },
    { value: '2', label: t('model.company.effective'), color: 'green' },
  ],
  COMPANY_SIZES: [
    { value: '0', label: t('model.company.size0'), color: 'pink' },
    { value: '1', label: t('model.company.size1'), color: 'red' },
    { value: '2', label: t('model.company.size2'), color: 'orange' },
    { value: '3', label: t('model.company.size3'), color: 'green' },
    { value: '4', label: t('model.company.size4'), color: 'cyan' },
    { value: '5', label: t('model.company.size5'), color: 'blue' },
    { value: '6', label: t('model.company.size6'), color: 'purple' },
  ],
  COMPANY_ADD_FIELDS: [
    'name',
    'provinceId',
    'cityId',
    'areaId',
    'businessLicense',
    'companyAddress',
    'companyPhone',
    'companySize',
    'expirationData',
  ],
  COMPANY_UPDATE_FIELDS: [
    'provinceId',
    'cityId',
    'areaId',
    'managerId',
    'businessLicense',
    'companyAddress',
    'companyPhone',
    'companySize',
    'commission',
    'commissionMode',
    'onlineNumber',
  ],
  COMPANY_RULES: {
    name: [{ required: true, message: t('model.company.add_name'), trigger: 'blur' }],
    provinceId: [{ required: true, message: t('model.company.add_provinceId'), trigger: 'blur' }],
    cityId: [{ required: true, message: t('model.company.add_cityId'), trigger: 'blur' }],
    areaId: [{ required: true, message: t('model.company.add_areaId'), trigger: 'blur' }],
    businessLicense: [
      { required: true, message: t('model.company.add_businessLicense'), trigger: 'blur' },
    ],
    companyAddress: [
      { required: true, message: t('model.company.add_companyAddress'), trigger: 'blur' },
    ],
    companyPhone: [
      { required: true, message: t('model.company.add_companyPhone'), trigger: 'blur' },
    ],
    companySize: [{ required: true, message: t('model.company.add_companySize'), trigger: 'blur' }],
    expirationData: [
      { required: true, message: t('model.company.add_expirationData'), trigger: 'blur' },
    ],
  },
  COMPANY_RULES_CREATE_BY: {
    createBy: [{ required: true, message: t('model.company.add_createBy'), trigger: 'blur' }],
  },
  COMPANY_RULES_EXPIRATION_DATA: {
    expirationData: [
      { required: true, message: t('model.company.add_expirationData'), trigger: 'blur' },
    ],
  },
  COMPANY_PERMS: {
    SELECT: 'company:select',
    ADD: 'company:add',
    UPDATE: 'company:update',
    DELETE: 'company:delete',
  },
};

export const CompanyColumns = [
  {
    title: t('model.company.name'),
    key: 'name',
    dataIndex: 'name',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.company.province'),
    key: 'province',
    dataIndex: 'provinceByProvinceId.name',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.company.city'),
    key: 'city',
    dataIndex: 'cityByCityId.name',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.company.area'),
    key: 'area',
    dataIndex: 'areaByAreaId.name',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.company.companySize'),
    key: 'companySize',
    dataIndex: 'companySize',
    ellipsis: 'true',
    slots: { customRender: 'companySize' },
  },
  {
    title: t('model.company.state'),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
  {
    title: t('model.company.action'),
    key: 'action',
    ellipsis: 'true',
    slots: { customRender: 'action' },
  },
];

// SYS_COMPANY_MISS_ID(4001, "企业参数错误：编号"),
// SYS_COMPANY_MISS_NAME(4002, "企业参数错误：名称"),
// SYS_COMPANY_MISS_PROVINCE_ID(4003, "企业参数错误：省级编号"),
// SYS_COMPANY_MISS_CITY_ID(4004, "企业参数错误：市级编号"),
// SYS_COMPANY_MISS_AREA_ID(4005, "企业参数错误：区级编号"),
// SYS_COMPANY_MISS_COMPANY_ADDRESS(4006, "企业参数错误：详细地址"),
// SYS_COMPANY_MISS_COMPANY_SIZE(4007, "企业参数错误：规模"),
// SYS_COMPANY_MISS_STATE(4008, "企业参数错误：状态"),
// SYS_COMPANY_MISS_EXPIRATION_DATA(4009, "企业参数错误：到期时间"),
// SYS_COMPANY_MISS_COMMISSION_MODE(4010, "企业参数错误：抽成方式"),
// SYS_COMPANY_MISS_CREATE_BY(4011, "企业参数错误：负责人"),
// SYS_COMPANY_MISS_BUSINESS_LICENSE(4012, "企业参数错误：营业执照编号"),
