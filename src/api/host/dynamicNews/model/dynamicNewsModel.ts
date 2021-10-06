import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface DynamicNewsModel {
  id?: string;
  title?: string;
  description?: string;
  content?: string;
  projectId?: string;
  sort?: string;
  author?: string;
  state?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
}

export interface DynamicNewsCondition {
  id?: string;
  state?: string;
  projectId?: string;
  sort?: string;
}

export const _DynamicNewsConst = {
  EFFECTIVE: '1', // 有效
  INVALID: '0', // 无效
  STATES: [
    { value: '0', label: t('host.INVALID'), color: 'volcano' },
    { value: '1', label: t('host.EFFECTIVE'), color: 'geekblue' },
  ],
  dynamicSort: [
    { value: '1', label: t('host.dynamicSort.OPEN'), color: 'volcano' },
    { value: '2', label: t('host.dynamicSort.PROCESS_RATE'), color: 'geekblue' },
    { value: '3', label: t('host.dynamicSort.OVER'), color: 'volcano' },
    { value: '4', label: t('host.dynamicSort.PAY'), color: 'geekblue' },
    { value: '5', label: t('host.dynamicSort.ACTIVITY'), color: 'volcano' },
    { value: '6', label: t('host.dynamicSort.ADD_BUILD'), color: 'geekblue' },
    { value: '7', label: t('host.dynamicSort.SALE_BUILD'), color: 'volcano' },
    { value: '8', label: t('host.dynamicSort.OVER_BUILD'), color: 'geekblue' },
    { value: '9', label: t('host.dynamicSort.PRICE_INFO'), color: 'geekblue' },
  ],
  _PERMS: {
    SELECT: 'dynamicNews:select',
    ADD: 'dynamicNews:add',
    UPDATE: 'dynamicNews:update',
    DELETE: 'dynamicNews:delete',
  },
  _UPDATE_FIELDS: ['title', 'description', 'content', 'sort', 'author'],
  _RULES: {
    title: [{ required: true, message: t('host.dynamicNews.title'), trigger: 'blur' }],
    description: [{ required: true, message: t('host.dynamicNews.description'), trigger: 'blur' }],
    projectId: [{ required: true, message: t('host.dynamicNews.projectId'), trigger: 'blur' }],
    content: [{ required: true, message: t('host.dynamicNews.content'), trigger: 'blur' }],
    sort: [{ required: true, message: t('host.dynamicNews.sort'), trigger: 'blur' }],
    author: [{ required: true, message: t('host.dynamicNews.author'), trigger: 'blur' }],
  },
};

export const _ColumnsDynamicNews = [
  {
    title: t('host.dynamicNews.title'),
    key: 'title',
    dataIndex: 'title',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.dynamicNews.description'),
    key: 'description',
    dataIndex: 'description',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.dynamicNews.author'),
    key: 'author',
    dataIndex: 'author',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.dynamicNews.sort'),
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
  {
    title: t('host.operation'),
    key: 'operation',
    ellipsis: 'true',
    slots: { customRender: 'operation' },
  },
];
