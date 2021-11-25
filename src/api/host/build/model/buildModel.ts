import { BuildLayoutBean } from './BuildLayoutEntity';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface BuildModel {
  id?: string;
  number?: string;
  floors?: number;
  price?: number;
  priceDescription?: string;
  description?: string;
  saleState?: string;
  projectId?: string;
  licenseId?: string;
  state?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  hBuildLayoutsById?: BuildLayoutBean[];
  remark?: string;
  locationX?: number;
  locationY?: number;
  openTime?: string;
  payTime?: string;
}

export interface BuildCondition {
  id?: string;
  state?: string;
  projectId?: string;
  hBuildLayoutsById?: BuildLayoutBean[];
}

export const _BuildConst = {
  EFFECTIVE: '1', // 有效
  INVALID: '0', // 无效
  licenseId: '3', // 预售证
  STATES: [
    { value: '0', label: t('host.INVALID'), color: 'volcano' },
    { value: '1', label: t('host.EFFECTIVE'), color: 'geekblue' },
  ],
  REMARK_STATES: [
    { value: '0', label: t('host.REMARK_STATES.REMARK_OFF'), color: 'volcano' },
    { value: '1', label: t('host.REMARK_STATES.REMARK_ON'), color: 'geekblue' },
  ],
  SALE_STATES: [
    { value: '1', label: t('host.SALE.ON'), color: 'volcano' }, //SALE_ON在售
    { value: '2', label: t('host.SALE.OFF'), color: 'geekblue' }, //待售
    { value: '3', label: t('host.SALE.SALE_OVER'), color: 'green' }, //SALE_OVER售罄
  ],
  _PERMS: {
    SELECT: 'build:select',
    ADD: 'build:add',
    UPDATE: 'build:update',
    DELETE: 'build:delete',
  },
  _UPDATE_FIELDS: [
    'number',
    'floors',
    'price',
    'priceDescription',
    'description',
    'saleState',
    'licenseId',
    'remark',
    'locationX',
    'locationY',
    'openTime',
    'payTime',
  ],
  _RULES: {
    number: [{ required: true, message: t('host.build.number'), trigger: 'blur' }],
    saleState: [{ required: true, message: t('host.build.saleState'), trigger: 'blur' }],
    projectId: [{ required: true, message: t('host.build.projectId'), trigger: 'blur' }],
  },
};

export const _Columns = [
  {
    title: t('host.build.number'),
    key: 'number',
    dataIndex: 'number',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.build.floors'),
    key: 'floors',
    dataIndex: 'floors',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.build.price'),
    key: 'price',
    dataIndex: 'price',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.build.licenseId'),
    key: 'licenseId',
    dataIndex: 'licenseId',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.build.saleState'),
    key: 'saleState',
    dataIndex: 'saleState',
    ellipsis: 'true',
    slots: { customRender: 'saleState' },
  },
  {
    title: t('host.state'),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
];

export const _ColumnsBuild = [
  ..._Columns,
  {
    title: t('host.operation'),
    key: 'operation',
    width: '30%',
    ellipsis: 'true',
    slots: { customRender: 'operation' },
  },
];
