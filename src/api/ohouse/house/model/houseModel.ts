import { SysDictDetailBean } from '/@/api/host/project/model/SysDictDetailBean';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface HouseModel {
  id?: string;
  identifier?: string;
  title?: string;
  number?: number;
  floor?: number;
  floorType?: string;
  price?: number;
  labels?: string;
  totalPrice?: number;
  downPayments?: number;
  area?: number;
  buildArea?: number;
  rooms?: number;
  hall?: number;
  toilet?: number;
  orientation?: string;
  renovation?: string;
  type?: string;
  sellingPoint?: string;
  mentality?: string;
  description?: string;
  isOnly?: string;
  fullYears?: string;
  ownerName?: string;
  ownerMobile?: string;
  otherMobile?: string;
  projectId?: string;
  buildId?: string;
  unitId?: string;
  keyword?: string;
  state?: string;
  status?: string;
  isShare?: string;
  isMortgage?: string;
  hasXf?: string;
  hasDxs?: string;
  hasCw?: string;
  mobile?: string;
  provinceId?: string;
  cityId?: string;
  areaId?: string;
  beansByLabels?: SysDictDetailBean[];
  userByCreate?: userBean;
}

export interface userBean {
  id?: string;
  username?: string;
  realName?: string;
  nickName?: string;
  mobile?: string;
  state?: string;
  sex?: string;
  companyId?: string;
  avatar?: string;
}

export interface HouseCondition {
  identifier?: string;
  title?: string;
  number?: string;
  floor?: string;
  floorType?: string;
  lowPrice?: string;
  heightPrice?: string;
  lowTotalPrice?: string;
  heightTotalPrice?: string;
  lowArea?: string;
  heightArea?: string;
  lowBuildArea?: string;
  heightBuildArea?: string;
  rooms?: number;
  hall?: number;
  toilet?: number;
  orientation?: string;
  renovation?: string;
  type?: string;
  isOnly?: string;
  fullYears?: string;
  projectId?: string;
  buildId?: string;
  unitId?: string;
  provinceId?: string;
  cityId?: string;
  areaId?: string;
}

export const HouseConst = {
  SORT: [
    { value: '1', label: t('ohouse.SORT.SORT_1'), color: 'volcano' },
    { value: '2', label: t('ohouse.SORT.SORT_2'), color: 'geekblue' },
    { value: '3', label: t('ohouse.SORT.SORT_3'), color: 'volcano' },
    { value: '4', label: t('ohouse.SORT.SORT_4'), color: 'geekblue' },
    { value: '5', label: t('ohouse.SORT.SORT_5'), color: 'volcano' },
    { value: '6', label: t('ohouse.SORT.SORT_6'), color: 'geekblue' },
  ],
  YON: [
    { value: '1', label: t('ohouse.house.YES'), color: 'geekblue' },
    { value: '2', label: t('ohouse.house.NO'), color: 'volcano' },
  ],
  STATUS: [
    { value: '1', label: t('ohouse.house.STATUS_1'), color: 'geekblue' },
    { value: '2', label: t('ohouse.house.STATUS_2'), color: 'volcano' },
    { value: '3', label: t('ohouse.house.STATUS_3'), color: 'geekblue' },
  ],
  ONLY: [
    { value: '1', label: t('ohouse.house.IS_ONLY'), color: 'geekblue' },
    { value: '2', label: t('ohouse.house.IS_NOT_ONLY'), color: 'volcano' },
  ],
  FULL_YEARS: [
    { value: '1', label: t('ohouse.house.FULL_YEARS_1'), color: 'geekblue' },
    { value: '2', label: t('ohouse.house.FULL_YEARS_2'), color: 'volcano' },
    { value: '3', label: t('ohouse.house.FULL_YEARS_3'), color: 'geekblue' },
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
  RENOVATION_: [
    { value: '1', label: t('ohouse.house.RENOVATION_1'), color: 'geekblue' },
    { value: '2', label: t('ohouse.house.RENOVATION_2'), color: 'volcano' },
    { value: '3', label: t('ohouse.house.RENOVATION_3'), color: 'geekblue' },
    { value: '4', label: t('ohouse.house.RENOVATION_4'), color: 'geekblue' },
  ],
  ORIENTATION: [
    { value: '1', label: t('ohouse.house.ORIENTATION_1'), color: 'geekblue' },
    { value: '2', label: t('ohouse.house.ORIENTATION_2'), color: 'volcano' },
    { value: '3', label: t('ohouse.house.ORIENTATION_3'), color: 'geekblue' },
    { value: '4', label: t('ohouse.house.ORIENTATION_4'), color: 'geekblue' },
  ],
  FLOORS: [
    { value: '1', label: t('ohouse.house.floor1'), color: 'geekblue' },
    { value: '2', label: t('ohouse.house.floor2'), color: 'volcano' },
    { value: '3', label: t('ohouse.house.floor3'), color: 'geekblue' },
  ],
  STATE: [
    { value: '0', label: t('ohouse.INVALID'), color: 'volcano' },
    { value: '1', label: t('ohouse.EFFECTIVE'), color: 'geekblue' },
    { value: '2', label: t('ohouse.PENDING_APPROVAL'), color: 'volcano' },
    { value: '3', label: t('ohouse.FAILED'), color: 'geekblue' },
  ],
  _UPDATE_FIELDS: [
    'title',
    'identifier',
    'number',
    'floor',
    'floorType',
    'labels',
    'downPayments',
    'area',
    'buildArea',
    'rooms',
    'hall',
    'toilet',
    'orientation',
    'renovation',
    'type',
    'sellingPoint',
    'mentality',
    'description',
    'isOnly',
    'fullYears',
    'ownerName',
    'ownerMobile',
    'otherMobile',
    'projectId',
    'buildId',
    'unitId',
    'keyword',
    'state',
    'status',
    'isShare',
    'osMortgage',
    'hasXf',
    'hasDxs',
    'hasCw',
  ],
  _PERMS: {
    ADD: 'ohouse:add',
    UPDATE: 'ohouse:update',
    DELETE: 'ohouse:delete',
    CHANGE_STATE: 'ohouse:check:state',
  },
  _RULES: {
    identifier: [{ required: true, message: t('ohouse.house.identifier'), trigger: 'blur' }],
    title: [{ required: true, message: t('ohouse.house.title'), trigger: 'blur' }],
    number: [{ required: true, message: t('ohouse.house.number'), trigger: 'blur' }],
    floor: [{ required: true, type: 'number', message: t('ohouse.house.floor'), trigger: 'blur' }],
    floorType: [{ required: true, message: t('ohouse.house.floorType'), trigger: 'blur' }],
    price: [{ required: true, type: 'number', message: t('ohouse.house.price'), trigger: 'blur' }],
    labels: [{ required: true, message: t('ohouse.house.labels'), trigger: 'blur' }],
    totalPrice: [
      { required: true, type: 'number', message: t('ohouse.house.totalPrice'), trigger: 'blur' },
    ],
    downPayments: [
      { required: true, type: 'number', message: t('ohouse.house.downPayments'), trigger: 'blur' },
    ],
    area: [{ required: true, type: 'number', message: t('ohouse.house.area'), trigger: 'blur' }],
    buildArea: [
      { required: true, type: 'number', message: t('ohouse.house.buildArea'), trigger: 'blur' },
    ],
    rooms: [{ required: true, type: 'number', message: t('ohouse.house.rooms'), trigger: 'blur' }],
    hall: [{ required: true, type: 'number', message: t('ohouse.house.hall'), trigger: 'blur' }],
    toilet: [
      { required: true, type: 'number', message: t('ohouse.house.toilet'), trigger: 'blur' },
    ],
    orientation: [{ required: true, message: t('ohouse.house.orientation'), trigger: 'blur' }],
    renovation: [{ required: true, message: t('ohouse.house.renovation'), trigger: 'blur' }],
    type: [{ required: true, message: t('ohouse.house.type'), trigger: 'blur' }],
    sellingPoint: [{ required: true, message: t('ohouse.house.sellingPoint'), trigger: 'blur' }],
    mentality: [{ required: true, message: t('ohouse.house.mentality'), trigger: 'blur' }],
    isOnly: [{ required: true, message: t('ohouse.house.isOnly'), trigger: 'blur' }],
    fullYears: [{ required: true, message: t('ohouse.house.fullYears'), trigger: 'blur' }],
    ownerName: [{ required: true, message: t('ohouse.house.ownerName'), trigger: 'blur' }],
    ownerMobile: [
      {
        required: true,
        // message: t('ohouse.house.ownerMobile'),
        trigger: 'change',
        validator: function async(_rule, contact: string) {
          if (!/^1[3-9]{1}[0-9]{9}$/.test(contact)) {
            return Promise.reject('输入正确手机号');
          }
          return Promise.resolve();
        },
      },
    ],
    otherMobile: [
      {
        required: true,
        // message: t('ohouse.house.otherMobile'),
        trigger: 'change',
        validator: function async(_rule, contact: string) {
          if (!/^1[3-9]{1}[0-9]{9}$/.test(contact)) {
            return Promise.reject('输入正确手机号');
          }
          return Promise.resolve();
        },
      },
    ],
    projectId: [{ required: true, message: t('ohouse.house.projectId'), trigger: 'blur' }],
    buildId: [{ required: true, message: t('ohouse.house.buildId'), trigger: 'blur' }],
    unitId: [{ required: true, message: t('ohouse.house.unitId'), trigger: 'blur' }],
    state: [{ required: true, message: t('ohouse.house.state'), trigger: 'blur' }],
    status: [{ required: true, message: t('ohouse.house.status'), trigger: 'blur' }],
    isShare: [{ required: true, message: t('ohouse.house.isShare'), trigger: 'blur' }],
    isMortgage: [{ required: true, message: t('ohouse.house.isMortgage'), trigger: 'blur' }],
    hasXf: [{ required: true, message: t('ohouse.house.hasXf'), trigger: 'blur' }],
    hasDxs: [{ required: true, message: t('ohouse.house.hasDxs'), trigger: 'blur' }],
    hasCw: [{ required: true, message: t('ohouse.house.hasCw'), trigger: 'blur' }],
    provinceId: [{ required: true, message: t('ohouse.house.provinceId'), trigger: 'blur' }],
    cityId: [{ required: true, message: t('ohouse.house.cityId'), trigger: 'blur' }],
    areaId: [{ required: true, message: t('ohouse.house.areaId'), trigger: 'blur' }],
  },
};

export const HouseColumns = [
  {
    title: t('ohouse.house.title'),
    key: 'title',
    dataIndex: 'title',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('ohouse.house.number'),
    key: 'number',
    dataIndex: 'number',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('ohouse.house.floor'),
    key: 'floor',
    dataIndex: 'floor',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('ohouse.house.type'),
    key: 'type',
    dataIndex: 'type',
    ellipsis: 'true',
    slots: { customRender: 'type' },
  },
  {
    title: t('ohouse.house.price') + '(万元)',
    key: 'price',
    dataIndex: 'price',
    ellipsis: 'true',
    slots: { customRender: 'price' },
  },
  {
    title: t('ohouse.house.state'),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
  {
    title: t('ohouse.house.userByCreate'),
    key: 'userByCreate',
    dataIndex: 'userByCreate',
    ellipsis: 'true',
    slots: { customRender: 'userByCreate' },
  },
  {
    title: t('host.operation'),
    key: 'operation',
    width: '30%',
    ellipsis: 'true',
    slots: { customRender: 'operation' },
  },
];
