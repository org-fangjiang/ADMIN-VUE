import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface ProjectResourceModel {
  id?: string;
  projectId?: string;
  title?: string;
  keyword?: string;
  description?: string;
  address?: string;
  sort?: string;
  state?: string;
}

export interface ProjectResourceCondition {
  id?: string;
  state?: string;
}

export const ProjectResourceConst = {
  STATE: [
    { value: '0', label: t('ohouse.INVALID'), color: 'volcano' },
    { value: '1', label: t('ohouse.EFFECTIVE'), color: 'geekblue' },
  ],
  SORT: [
    { value: '1', label: t('ohouse.SORT.SORT_1'), color: 'volcano' },
    { value: '2', label: t('ohouse.SORT.SORT_2'), color: 'geekblue' },
    { value: '3', label: t('ohouse.SORT.SORT_3'), color: 'volcano' },
    { value: '4', label: t('ohouse.SORT.SORT_4'), color: 'geekblue' },
    { value: '5', label: t('ohouse.SORT.SORT_5'), color: 'volcano' },
    { value: '6', label: t('ohouse.SORT.SORT_6'), color: 'geekblue' },
  ],
  _RULES: {
    projectId: [
      { required: true, message: t('ohouse.projectResource.projectId'), trigger: 'blur' },
    ],
    title: [{ required: true, message: t('ohouse.projectResource.title'), trigger: 'blur' }],
    keyword: [{ required: true, message: t('ohouse.projectResource.keyword'), trigger: 'blur' }],
    description: [
      { required: true, message: t('ohouse.projectResource.description'), trigger: 'blur' },
    ],
    address: [{ required: true, message: t('ohouse.projectResource.address'), trigger: 'blur' }],
    sort: [{ required: true, message: t('ohouse.projectResource.sort'), trigger: 'blur' }],
    state: [{ required: true, message: t('ohouse.projectResource.state'), trigger: 'blur' }],
  },
  _PERMS: {
    ADD: 'oproject:add',
    DELETE: 'oproject:update',
    UPDATE: 'oproject:update',
  },
  _UPDATE_FIELDS: ['title', 'keyword', 'address', 'description'],
};

export const ResourceColumns = [
  {
    title: t('ohouse.projectResource.title'),
    key: 'title',
    dataIndex: 'title',
    ellipsis: 'true',
    slots: '',
  },
  // {
  //   title: t('ohouse.projectResource.projectId'),
  //   key: 'projectId',
  //   dataIndex: 'projectId',
  //   ellipsis: 'true',
  //   slots: { customRender: 'projectId' },
  // },
  {
    title: t('ohouse.projectResource.address'),
    key: 'address',
    dataIndex: 'address',
    ellipsis: 'true',
    slots: { customRender: 'address' },
  },
  {
    title: t('ohouse.projectResource.state'),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
  {
    title: t('ohouse.projectResource.sort'),
    key: 'sort',
    dataIndex: 'sort',
    ellipsis: 'true',
    slots: { customRender: 'sort' },
  },
];

export const ProjectResourceColumns = [
  ...ResourceColumns,
  {
    title: t('host.operation'),
    key: 'operation',
    ellipsis: 'true',
    slots: { customRender: 'operation' },
    width: '30%',
  },
];
