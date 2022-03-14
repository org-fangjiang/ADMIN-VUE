import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface ManageHouseModel {
  id?: string;
  number?: string;
  floor?: string;
  price?: string;
  channel?: string;
  description?: string;
  unitId?: string;
  state?: string;
  channelById?: any;
}

export interface ManageHouseCondition {
  id?: string;
  state?: string;
}

export const ManageHouseConst = {
  EFFECTIVE: '1', // 有效
  INVALID: '0', // 无效
  STATES: [
    { value: '0', label: t('host.INVALID'), color: 'volcano' },
    { value: '1', label: t('host.EFFECTIVE'), color: 'geekblue' },
  ],
  _PERMS: {
    SELECT: 'house:select',
    ADD: 'house:add',
    UPDATE: 'house:update',
    DELETE: 'house:delete',
  },
  _UPDATE_FIELDS: ['floor', 'number', 'price', 'channel', 'description'],
  _RULES: {
    unitId: [{ required: true, message: t('host.manageHouse.unitId'), trigger: 'blur' }],
    floor: [
      { required: true, type: 'number', message: t('host.manageHouse.floor'), trigger: 'blur' },
    ],
    number: [{ required: true, message: t('host.manageHouse.number'), trigger: 'blur' }],
    price: [{ required: true, message: t('host.manageHouse.price'), trigger: 'blur' }],
    channel: [{ required: true, message: t('host.manageHouse.channel'), trigger: 'blur' }],
  },
};

export const Columns = [
  {
    title: t('host.manageHouse.number'),
    key: 'number',
    dataIndex: 'number',
    ellipsis: 'true',
    slots: '',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.number - b.number,
  },
  {
    title: t('host.manageHouse.price'),
    key: 'price',
    dataIndex: 'price',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.manageHouse.channel'),
    key: 'channelById',
    dataIndex: 'channelById',
    ellipsis: 'true',
    slots: { customRender: 'channelById' },
  },
  {
    title: t('host.manageHouse.description'),
    key: 'description',
    dataIndex: 'description',
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
    title: t('host.operation'),
    key: 'operation',
    ellipsis: 'true',
    slots: { customRender: 'operation' },
  },
];
