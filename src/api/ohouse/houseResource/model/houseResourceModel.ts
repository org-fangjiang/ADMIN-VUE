import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export interface ResourceModel {
  id?: string;
  houseId?: string;
  title?: string;
  keyword?: string;
  description?: string;
  address?: string;
  sort?: string;
  state?: string;
}

export interface ResourceCondition {
  id?: string;
  state?: string;
}

export const ResourceConst = {
  SORT: [
    { value: '1', label: t('ohouse.SORT.SORT_1'), color: 'volcano' },
    { value: '2', label: t('ohouse.SORT.SORT_2'), color: 'geekblue' },
    { value: '3', label: t('ohouse.SORT.SORT_3'), color: 'volcano' },
    { value: '4', label: t('ohouse.SORT.SORT_4'), color: 'geekblue' },
    { value: '5', label: t('ohouse.SORT.SORT_5'), color: 'volcano' },
    { value: '6', label: t('ohouse.SORT.SORT_6'), color: 'geekblue' },
  ],
  STATE: [
    { value: '0', label: t('ohouse.INVALID'), color: 'volcano' },
    { value: '1', label: t('ohouse.EFFECTIVE'), color: 'geekblue' },
    { value: '2', label: t('ohouse.PENDING_APPROVAL'), color: 'volcano' },
    { value: '3', label: t('ohouse.FAILED'), color: 'geekblue' },
  ],
  _UPDATE_FIELDS: ['title', 'keyword', 'description', 'address', 'sort'],
  _RULES: {
    title: [{ required: true, message: t('ohouse.resource.title'), trigger: 'blur' }],
    keyword: [{ required: true, message: t('ohouse.resource.keyword'), trigger: 'blur' }],
    description: [{ required: true, message: t('ohouse.resource.description'), trigger: 'blur' }],
    address: [{ required: true, message: t('ohouse.resource.address'), trigger: 'blur' }],
    sort: [{ required: true, message: t('ohouse.resource.sort'), trigger: 'blur' }],
  },
};

export const ResourceColumns = [
  {
    title: t('ohouse.resource.title'),
    key: 'title',
    dataIndex: 'title',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('ohouse.resource.keyword'),
    key: 'keyword',
    dataIndex: 'keyword',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('ohouse.resource.address'),
    key: 'address',
    dataIndex: 'address',
    ellipsis: 'true',
    slots: { customRender: 'address' },
  },
  {
    title: t('ohouse.resource.sort'),
    key: 'sort',
    dataIndex: 'sort',
    ellipsis: 'true',
    slots: { customRender: 'sort' },
  },
  {
    title: t('host.operation'),
    key: 'operation',
    width: '30%',
    ellipsis: 'true',
    slots: { customRender: 'operation' },
  },
];
