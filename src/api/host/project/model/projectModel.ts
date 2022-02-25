import { BrandEntity } from './brandEntity';
import { BuildEntity } from './buildEntity';
import { DeveloperEntity } from './developerEntity';
import { EstateCompanyEntity } from './estateCompanyEntity';
import { LayoutEntity } from './layoutEntity';
import { LicenseEntity } from './licenseEntity';
import { ProjectPriceLogEntity } from './projectPriceLogEntity';
import { AreaEntity, CityEntity, ProvinceEntity } from './provinceEntity';
import { ResourceEntity } from './resourceEntity';
import { SysDictDetailBean } from './SysDictDetailBean';
import { SysMetroStationEntity } from './sysMetroStationEntity';
import { SysTradingAreaEntity } from './sysTradingAreaEntity';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface HostModel {
  id?: string;
  name?: string;
  aliasName?: string;
  labels?: string;
  type?: string;
  buildType?: string;
  property?: number;
  brandIdS?: string;
  developerId?: string;
  decorationType?: string;
  decorationStandard?: number;
  getLandTime?: string;
  longitude?: string;
  latitude?: string;
  locationScore?: number;
  educationScore?: number;
  medicalScore?: number;
  trafficScore?: number;
  matchingScore?: number;
  address?: string;
  saleState?: string;
  openTime?: string;
  payTime?: string;
  saleAddress?: string;
  price?: number;
  lowTotalPrice?: number;
  highTotalPrice?: number;
  priceDescription?: string;
  priceDays?: string;
  updatePriceTime?: string;
  loanType?: string;
  landArea?: number;
  buildArea?: number;
  volumeRate?: number;
  greenRate?: number;
  parking?: string;
  buildingTotal?: number;
  houseTotal?: number;
  elevatorInfo?: string;
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
  lookTime?: number;
  state?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  orderNum?: number;
  commission?: number;
  commissionMode?: string;
  advantage?: string;
  defect?: string;
  hBuildsById?: BuildEntity[];
  hLayoutsById?: LayoutEntity[];
  hLicensesById?: LicenseEntity[];
  hDeveloperByDeveloperId?: DeveloperEntity;
  brandId?: BrandEntity;
  sysProvinceByProvinceId?: ProvinceEntity;
  sysCityByCityId?: CityEntity;
  sysAreaByAreaId?: AreaEntity;
  sandImg?: ResourceEntity;
  firstImg?: ResourceEntity;
  estateCompanyById?: EstateCompanyEntity;
  hResourcesById?: ResourceEntity[];
  sysTradingAreasById?: SysTradingAreaEntity[];
  sysMetroStationsById?: SysMetroStationEntity[];
  projectPriceLogEntities?: ProjectPriceLogEntity[];
  sysDictDetailBeans?: SysDictDetailBean[];
}

export interface HostCondition {
  id?: string;
  state?: string;
  name?: string;
  cityId?: string;
  provinceId: string;
}

export const _HostConst = {
  EFFECTIVE: '1', // 有效
  INVALID: '0', // 无效
  STATES: [
    { value: '0', label: t('host.INVALID'), color: 'volcano' },
    { value: '1', label: t('host.EFFECTIVE'), color: 'geekblue' },
  ],
  TYPES: [
    { value: '1', label: t('host.TYPE.HOUSE'), color: 'volcano' }, //住宅 TYPE_HOUSE
    { value: '2', label: t('host.TYPE.FLATS'), color: 'geekblue' }, //公寓 TYPE_FLATS
    { value: '3', label: t('host.TYPE.SHOP'), color: 'volcano' }, //商铺 TYPE_SHOP
    { value: '4', label: t('host.TYPE.OFFICE'), color: 'geekblue' }, //写字楼 TYPE_OFFICE
    { value: '5', label: t('host.TYPE.STORE'), color: 'volcano' }, //仓库 TYPE_STORE
    { value: '6', label: t('host.TYPE.VILLA'), color: 'geekblue' }, //仓库 TYPE_STORE
    { value: '7', label: t('host.TYPE.BUSINESS'), color: 'geekblue' }, //仓库 TYPE_STORE
  ],
  DECORATIONS: [
    { value: '1', label: t('host.DECORATION.ROUGHCAST'), color: 'volcano' }, //毛坯 DECORATION_ROUGHCAST
    { value: '2', label: t('host.DECORATION.PAPERBACK'), color: 'geekblue' }, //DECORATION_PAPERBACK 简装
    { value: '3', label: t('host.DECORATION.HARDBACK'), color: 'volcano' }, //DECORATION_HARDBACK 精装
    { value: '4', label: t('host.DECORATION.ROUGHCAST_PAPERBACK'), color: 'geekblue' }, //DECORATION_ROUGHCAST_PAPERBACK 毛坯与简装
    { value: '5', label: t('host.DECORATION.ROUGHCAST_HARDBACK'), color: 'volcano' }, //DECORATION_ROUGHCAST_HARDBACK 毛坯与精装
  ],
  BUILD_TYPES: [
    { value: '1', label: t('host.BUILD_TYPE.PASSIVE'), color: 'volcano' }, //BUILD_TYPE_PASSIVE 被动式
    { value: '2', label: t('host.BUILD_TYPE.PREFABRICATED'), color: 'geekblue' }, //BUILD_TYPE_PREFABRICATED 装配式
    { value: '3', label: t('host.BUILD_TYPE.POURING'), color: 'volcano' }, //BUILD_TYPE_POURING 浇筑式
    { value: '4', label: t('host.BUILD_TYPE.PART_PREFABRICATED'), color: 'geekblue' }, //BUILD_TYPE_PART_PREFABRICATED 部分装配式
    { value: '5', label: t('host.BUILD_TYPE.PART_POURING'), color: 'volcano' }, //BUILD_TYPE_PART_POURING 部分浇筑
  ],
  WATER_METHOD: [
    { value: '0', label: t('host.WATER.UNKNOWN'), color: 'volcano' }, //WATER_UNKNOWN 未知
    { value: '1', label: t('host.WATER.CIVIL'), color: 'geekblue' }, //WATER_CIVIL 民用水
    { value: '2', label: t('host.WATER.COMMERCIAL'), color: 'volcano' }, //WATER_COMMERCIAL商用水
  ],
  ELECTRICITY_METHOD: [
    { value: '0', label: t('host.WATER.UNKNOWN'), color: 'volcano' }, //ELECTRICITY_UNKNOWN 未知
    { value: '1', label: t('host.WATER.CIVIL'), color: 'geekblue' }, //ELECTRICITY_CIVIL 民用水
    { value: '2', label: t('host.WATER.COMMERCIAL'), color: 'volcano' }, //ELECTRICITY_COMMERCIAL
  ],
  HEAT_METHOD: [
    { value: '0', label: t('host.HEAT.UNKNOWN'), color: 'volcano' }, // 未知
    { value: '1', label: t('host.HEAT.MUNICIPAL'), color: 'geekblue' }, //HEAT_MUNICIPAL 市政供暖
    { value: '2', label: t('host.HEAT.CONCENTRATED'), color: 'volcano' }, //HEAT_CONCENTRATED 集体供暖
  ],
  COMMISSION_MODE: [
    { value: '1', label: t('host.COMMISSION.FIXED'), color: 'volcano' }, //固定 COMMISSION_FIXED
    { value: '2', label: t('host.COMMISSION.PERCENTAGE'), color: 'geekblue' }, //百分比 COMMISSION_PERCENTAGE
  ],
  SALE_STATES: [
    { value: '1', label: t('host.SALE.ON'), color: 'volcano' }, //SALE_ON在售
    { value: '2', label: t('host.SALE.OFF'), color: 'geekblue' }, //待售
    { value: '3', label: t('host.SALE.SALE_OVER'), color: 'volcano' }, //SALE_OVER售罄
  ],
  LOAN_METHODS: [
    { value: '1', label: t('host.LOAN.ALL'), color: 'volcano' }, //
    { value: '2', label: t('host.LOAN.COMMERCE'), color: 'geekblue' }, //
    { value: '3', label: t('host.LOAN.PROVIDENT_FUND'), color: 'volcano' },
    { value: '4', label: t('host.LOAN.COMPOSE'), color: 'geekblue' }, //
    { value: '5', label: t('host.LOAN.CITY'), color: 'volcano' }, //
    { value: '6', label: t('host.LOAN.PROVINCE'), color: 'geekblue' },
    { value: '7', label: t('host.LOAN.RAILWAY'), color: 'volcano' }, //
    { value: '8', label: t('host.LOAN.ARMY'), color: 'geekblue' }, //
    { value: '9', label: t('host.LOAN.TEACHER'), color: 'volcano' },
  ],
  _PERMS: {
    SEARCH: 'project:search',
    ADD: 'project:add',
    UPDATE: 'project:update',
    DELETE: 'project:delete',
    EstateCompanySet: 'project:estateCompany:set',
    DeveloperSet: 'project:developer:set',
    BrandSet: 'project:brand:set',
  },
  _UPDATE_fIELDS: [
    'name',
    'aliasName',
    'labels',
    'type',
    'buildType',
    'property',
    'decorationType',
    'decorationStandard',
    'getLandTime',
    'longitude',
    'latitude',
    'locationScore',
    'educationScore',
    'medicalScore',
    'trafficScore',
    'matchingScore',
    'address',
    'saleState',
    'openTime',
    'payTime',
    'saleAddress',
    'price',
    'lowTotalPrice',
    'highTotalPrice',
    'priceDescription',
    'priceDays',
    'updatePriceTime',
    'loanType',
    'landArea',
    'buildArea',
    'volumeRate',
    'greenRate',
    'parking',
    'buildingTotal',
    'houseTotal',
    'elevatorInfo',
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
    'commissionMode',
    'commission',
    'defect',
    'advantage',
  ],
  _RULES: {
    name: [{ required: true, message: t('host.name'), trigger: 'blur' }],
    type: [{ required: true, message: t('host.type'), trigger: 'blur' }],
    buildType: [{ required: true, message: t('host.buildType'), trigger: 'blur' }],
    property: [{ required: true, type: 'number', message: t('host.property'), trigger: 'blur' }],
    longitude: [{ required: true, message: t('host.longitude'), trigger: 'blur' }],
    latitude: [{ required: true, message: t('host.latitude'), trigger: 'blur' }],
    sysProvinceByProvinceId: [{ required: true, message: t('host.province'), trigger: 'blur' }],
    sysCityByCityId: [{ required: true, message: t('host.city'), trigger: 'blur' }],
    sysAreaByAreaId: [{ required: true, message: t('host.area'), trigger: 'blur' }],
    address: [{ required: true, message: t('host.address'), trigger: 'blur' }],
    saleState: [{ required: true, message: t('host.saleState'), trigger: 'blur' }],
    saleAddress: [{ required: true, message: t('host.saleAddress'), trigger: 'blur' }],
    buildingTotal: [
      { required: true, type: 'number', message: t('host.buildingTotal'), trigger: 'blur' },
    ],
    number: [{ required: true, message: t('host.number'), trigger: 'blur' }],
    decorationType: [{ required: true, message: t('host.decorationType'), trigger: 'blur' }],
    waterMethod: [{ required: true, message: t('host.waterMethod'), trigger: 'blur' }],
    electricityMethod: [{ required: true, message: t('host.electricityMethod'), trigger: 'blur' }],
    heatMethod: [{ required: true, message: t('host.heatMethod'), trigger: 'blur' }],
    commissionMode: [{ required: true, message: t('host.commissionMode'), trigger: 'blur' }],
    commission: [
      { required: true, type: 'number', message: t('host.commission'), trigger: 'blur' },
    ],
  },
};

export const _Columns = [
  {
    title: t('host.name'),
    key: 'name',
    dataIndex: 'name',
    ellipsis: 'true',
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
    title: t('host.price'),
    key: 'price',
    dataIndex: 'price',
    ellipsis: 'true',
    slots: { customRender: 'price' },
  },
  {
    title: t('host.state'),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
];

export const _ColumnsHost = [
  ..._Columns,
  {
    title: t('host.news.createTime'),
    key: 'createTime',
    dataIndex: 'createTime',
    ellipsis: 'false',
    slots: { customRender: 'createTime' },
    defaultSortOrder: 'descend',
    sorter: true,
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
