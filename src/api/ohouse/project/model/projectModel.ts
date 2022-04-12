import { SysDictDetailBean } from '/@/api/host/project/model/SysDictDetailBean';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface OProjectModel {
  id?: string;
  name?: string;
  aliasName?: string;
  labels?: string;
  type?: string;
  buildType?: string;
  property?: string;
  developerId?: string;
  brandId?: string;
  getLandTime?: string;
  longitude?: string;
  latitude?: string;
  provinceId?: string;
  cityId?: string;
  areaId?: string;
  locationScore?: string;
  educationScore?: string;
  medicalScore?: string;
  trafficScore?: string;
  matchingScore?: string;
  address?: string;
  openTime?: string;
  payTime?: string;
  landArea?: string;
  buildArea?: string;
  volumeRate?: string;
  greenRate?: string;
  parking?: string;
  buildingNumber?: number;
  houseTotal?: number;
  elevatorInfo?: string;
  hasElevator?: string;
  estateCompany?: string;
  estatePrice?: string;
  estateDescription?: string;
  waterMethod?: string;
  electricityMethod?: string;
  heatMethod?: string;
  trafficInfo?: string;
  medicalInfo?: string;
  matchingInfo?: string;
  educationInfo?: string;
  otherInfo?: string;
  description?: string;
  number?: string;
  lookTime?: string;
  state?: string;
  orderNum?: number;
  sandImg?: string;
  firstImg?: string;
  advantage?: string;
  defect?: string;
  parkingRatio?: string;
  cng?: string;
  divideCar?: string;
  unitNumber?: number;
  houseNumber?: number;
  ladderHouseRatio?: string;
  beansByLabels?: SysDictDetailBean[];
}

export interface OProjectCondition {
  id?: string;
  name?: string;
  labels?: string;
  type?: string;
  buildType?: string;
  property?: string;
  developerId?: string;
  brandId?: string;
  provinceId?: string;
  cityId?: string;
  areaId?: string;
  payTime?: string;
  waterMethod?: string;
  electricityMethod?: string;
  heatMethod?: string;
  state?: string;
  cng?: string;
  divideCar?: string;
}

export const OProjectConst = {
  STATE: [
    { value: '0', label: t('ohouse.INVALID'), color: 'volcano' },
    { value: '1', label: t('ohouse.EFFECTIVE'), color: 'geekblue' },
    { value: '2', label: t('ohouse.PENDING_APPROVAL'), color: 'volcano' },
    { value: '3', label: t('ohouse.FAILED'), color: 'geekblue' },
  ],
  SALE_STATES: [
    { value: '1', label: t('ohouse.SALE_ON'), color: 'volcano' },
    { value: '2', label: t('ohouse.SALE_OFF'), color: 'geekblue' },
    { value: '2', label: t('ohouse.SALE_OVER'), color: 'red' },
  ],
  TYPES: [
    { value: '1', label: t('ohouse.TYPE.HOUSE'), color: 'volcano' }, //住宅 TYPE_HOUSE
    { value: '2', label: t('ohouse.TYPE.FLATS'), color: 'geekblue' }, //公寓 TYPE_FLATS
    { value: '3', label: t('ohouse.TYPE.SHOP'), color: 'volcano' }, //商铺 TYPE_SHOP
    { value: '4', label: t('ohouse.TYPE.OFFICE'), color: 'geekblue' }, //写字楼 TYPE_OFFICE
    { value: '5', label: t('ohouse.TYPE.STORE'), color: 'volcano' }, //仓库 TYPE_STORE
    { value: '6', label: t('ohouse.TYPE.VILLA'), color: 'geekblue' }, //仓库 TYPE_STORE
    { value: '7', label: t('ohouse.TYPE.BUSINESS'), color: 'geekblue' }, //仓库 TYPE_STORE
  ],
  BUILD_TYPES: [
    { value: '1', label: t('ohouse.BUILD_TYPE.PASSIVE'), color: 'volcano' }, //BUILD_TYPE_PASSIVE 被动式
    { value: '2', label: t('ohouse.BUILD_TYPE.PREFABRICATED'), color: 'geekblue' }, //BUILD_TYPE_PREFABRICATED 装配式
    { value: '3', label: t('ohouse.BUILD_TYPE.POURING'), color: 'volcano' }, //BUILD_TYPE_POURING 浇筑式
    { value: '4', label: t('ohouse.BUILD_TYPE.PART_PREFABRICATED'), color: 'geekblue' }, //BUILD_TYPE_PART_PREFABRICATED 部分装配式
    { value: '5', label: t('ohouse.BUILD_TYPE.PART_POURING'), color: 'volcano' }, //BUILD_TYPE_PART_POURING 部分浇筑
  ],
  WATER_METHOD: [
    { value: '0', label: t('ohouse.WATER.UNKNOWN'), color: 'volcano' }, //WATER_UNKNOWN 未知
    { value: '1', label: t('ohouse.WATER.CIVIL'), color: 'geekblue' }, //WATER_CIVIL 民用水
    { value: '2', label: t('ohouse.WATER.COMMERCIAL'), color: 'volcano' }, //WATER_COMMERCIAL商用水
  ],
  ELECTRICITY_METHOD: [
    { value: '0', label: t('ohouse.WATER.UNKNOWN'), color: 'volcano' }, //ELECTRICITY_UNKNOWN 未知
    { value: '1', label: t('ohouse.WATER.CIVIL'), color: 'geekblue' }, //ELECTRICITY_CIVIL 民用水
    { value: '2', label: t('ohouse.WATER.COMMERCIAL'), color: 'volcano' }, //ELECTRICITY_COMMERCIAL
  ],
  HEAT_METHOD: [
    { value: '0', label: t('ohouse.HEAT.UNKNOWN'), color: 'volcano' }, // 未知
    { value: '1', label: t('ohouse.HEAT.MUNICIPAL'), color: 'geekblue' }, //HEAT_MUNICIPAL 市政供暖
    { value: '2', label: t('ohouse.HEAT.CONCENTRATED'), color: 'volcano' }, //HEAT_CONCENTRATED 集体供暖
    { value: '3', label: t('ohouse.HEAT.HEAT_SELF'), color: 'volcano' }, //HEAT_CONCENTRATED 集体供暖
  ],
  DIVIDE: [
    { value: '0', label: t('host.NO'), color: 'volcano' },
    { value: '1', label: t('host.YES'), color: 'geekblue' },
    { value: '2', label: t('host.YES2'), color: 'geekblue' },
  ],
  CNG: [
    { value: '0', label: t('host.NO'), color: 'volcano' },
    { value: '1', label: t('host.YES'), color: 'geekblue' },
    { value: '2', label: t('host.YES3'), color: 'geekblue' },
  ],
  _PERMS: {
    ADD: 'oproject:add',
    DELETE: 'oproject:delete',
    UPDATE: 'oproject:update',
    CHANGE: 'oproject:check:state',
  },
  _UPDATE_FIELDS: [
    'name',
    'aliasName',
    'labels',
    'type',
    'buildType',
    'property',
    'developerId',
    'brandId',
    'getLandTime',
    'longitude',
    'latitude',
    'provinceId',
    'cityId',
    'areaId',
    'locationScore',
    'educationScore',
    'medicalScore',
    'trafficScore',
    'matchingScore',
    'address',
    'openTime',
    'payTime',
    'landArea',
    'buildArea',
    'volumeRate',
    'greenRate',
    'parking',
    'buildingNumber',
    'houseTotal',
    'elevatorInfo',
    'hasElevator',
    'estateCompany',
    'estatePrice',
    'estateDescription',
    'waterMethod',
    'electricityMethod',
    'heatMethod',
    'trafficInfo',
    'medicalInfo',
    'matchingInfo',
    'educationInfo',
    'otherInfo',
    'description',
    'number',
    'lookTime',
    'state',
    'orderNum',
    'sandImg',
    'firstImg',
    'advantage',
    'defect',
    'parkingRatio',
  ],
  _RULES: {
    name: [{ required: true, message: t('ohouse.project.name'), trigger: 'blur' }],
    type: [{ required: true, message: t('ohouse.project.type'), trigger: 'blur' }],
    buildType: [{ required: true, message: t('ohouse.project.buildType'), trigger: 'blur' }],
    property: [
      { required: true, type: 'number', message: t('ohouse.project.property'), trigger: 'blur' },
    ],
    longitude: [{ required: true, message: t('ohouse.project.longitude'), trigger: 'blur' }],
    latitude: [{ required: true, message: t('ohouse.project.latitude'), trigger: 'blur' }],
    number: [{ required: true, message: t('ohouse.project.number'), trigger: 'blur' }],
    provinceId: [{ required: true, message: t('ohouse.project.provinceId'), trigger: 'blur' }],
    cityId: [{ required: true, message: t('ohouse.project.cityId'), trigger: 'blur' }],
    areaId: [{ required: true, message: t('ohouse.project.areaId'), trigger: 'blur' }],
    address: [{ required: true, message: t('ohouse.project.address'), trigger: 'blur' }],
    buildingNumber: [
      {
        required: true,
        type: 'number',
        message: t('ohouse.project.buildingNumber'),
        trigger: 'blur',
      },
    ],
  },
};

export const oHouseColumns = [
  {
    title: t('host.name'),
    key: 'name',
    dataIndex: 'name',
    ellipsis: 'true',
    fixed: 'left',
    slots: '',
  },
  {
    title: t('host.type'),
    key: 'type',
    dataIndex: 'type',
    ellipsis: 'true',
    slots: { customRender: 'type' },
  },
  {
    title: t('host.address'),
    key: 'address',
    dataIndex: 'address',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.state'),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
  {
    title: t('host.orderNum'),
    key: 'orderNum',
    dataIndex: 'orderNum',
    ellipsis: 'false',
    slots: { customRender: 'orderNum' },
    sorter: true,
    width: '5%',
  },
  {
    title: t('host.operation'),
    key: 'operation',
    ellipsis: 'true',
    slots: { customRender: 'operation' },
  },
];
