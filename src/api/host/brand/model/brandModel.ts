import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface BrandModel {
  id?: string;
  name?: string;
  description?: string;
  link?: string;
  photoAddress?: string;
}

export interface BrandCondition {
  id?: string;
  name?: string;
  state?: string;
}

export const _BrandConst = {
  EFFECTIVE: '1', // 有效
  INVALID: '0', // 无效
  STATES: [
    { value: '0', label: t('host.INVALID'), color: 'volcano' },
    { value: '1', label: t('host.EFFECTIVE'), color: 'geekblue' },
  ],
  _PERMS: {
    SEARCH: 'brand:select',
    ADD: 'brand:add',
    UPDATE: 'brand:update',
    DELETE: 'brand:delete',
  },
  _UPDATE_FIELDS: ['name', 'description', 'link', 'photoAddress'],
  _RULES: {
    name: [{ required: true, message: t('host.name'), trigger: 'blur' }],
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
    title: t('host.description'),
    key: 'description',
    dataIndex: 'description',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.link'),
    key: 'link',
    dataIndex: 'link',
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
];

export const _BrandColumns = [
  ..._Columns,
  {
    title: t('host.operation'),
    key: 'operation',
    ellipsis: 'true',
    slots: { customRender: 'operation' },
  },
];
