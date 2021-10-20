import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface SourceModel {
  id?: string;
  title?: string;
  keyword?: string;
  description?: string;
  address?: string;
  sort?: string;
  state?: string;
  createBy?: string;
  createTime?: string;
  updateTime?: string;
  updateBy?: string;
  projectId?: string;
}

export interface SourceCondition {
  id?: string;
  state?: string;
  title?: string;
  projectId?: string;
  sort?: string;
}

export const _SourceConst = {
  EFFECTIVE: '1', // 有效
  INVALID: '0', // 无效
  STATES: [
    { value: '0', label: t('host.INVALID'), color: 'volcano' },
    { value: '1', label: t('host.EFFECTIVE'), color: 'geekblue' },
  ],
  SORTS: [
    { value: '1', label: t('host.source.sorts.HOUSE'), color: 'volcano' },
    { value: '2', label: t('host.source.sorts.SAND_TABLE'), color: 'geekblue' },
    { value: '3', label: t('host.source.sorts.LICENSE'), color: 'volcano' },
    { value: '4', label: t('host.source.sorts.EFFECT'), color: 'geekblue' },
    { value: '5', label: t('host.source.sorts.REAL_SCENE'), color: 'volcano' },
    { value: '6', label: t('host.source.sorts.VIDEO'), color: 'geekblue' },
    { value: '7', label: t('host.source.sorts.VR'), color: 'volcano' },
    { value: '8', label: t('host.source.sorts.Model_Room'), color: 'geekblue' },
    { value: '9', label: t('host.source.sorts.Sales_Department'), color: 'volcano' },
  ],
  _PERMS: {
    SELECT: 'resource:select',
    ADD: 'resource:add',
    UPDATE: 'resource:update',
    DELETE: 'resource:delete',
  },
  _UPDATE_fIELD: ['title', 'keyword', 'description', 'address'],
  _RULES: {
    address: [{ required: true, message: t('host.source.address'), trigger: 'blur' }],
    sort: [{ required: true, message: t('host.source.sort'), trigger: 'blur' }],
  },
};

export const _CSource = [
  {
    title: t('host.source.title'),
    key: 'title',
    dataIndex: 'title',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.source.description'),
    key: 'description',
    dataIndex: 'description',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.source.address'),
    key: 'address',
    dataIndex: 'address',
    ellipsis: 'true',
    slots: { customRender: 'address' },
  },
  {
    title: t('host.source.keyword'),
    key: 'keyword',
    dataIndex: 'keyword',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.source.sort'),
    key: 'sort',
    dataIndex: 'sort',
    ellipsis: 'true',
    slots: { customRender: 'sort' },
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
  ..._CSource,
  {
    title: t('host.operation'),
    width: '30%',
    key: 'operation',
    ellipsis: 'true',
    slots: { customRender: 'operation' },
  },
];
