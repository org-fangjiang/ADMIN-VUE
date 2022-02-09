import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface NewsModel {
  id?: string;
  title?: string;
  description?: string;
  keywords?: string;
  content?: string;
  img?: string;
  sort?: string;
  source?: string;
  author?: string;
  inMobile?: string;
  projects?: any[];
  lookTimes?: number;
  orderNum?: number;
  provinceId?: string;
  cityId?: string;
  state?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
}

export interface NewsCondition {
  id?: string;
  projectId?: string;
  city?: string;
  inMobile?: string;
  state?: string;
  sort?: string;
}

export const _NewsConst = {
  EFFECTIVE: '1', // 有效
  INVALID: '0', // 无效
  STATES: [
    { value: '0', label: t('host.INVALID'), color: 'volcano' },
    { value: '1', label: t('host.EFFECTIVE'), color: 'geekblue' },
  ],
  IN_MOBILES: [
    { value: '0', label: t('host.IN_MOBILES.NOT_IN_MOBILE'), color: 'volcano' },
    { value: '1', label: t('host.IN_MOBILES.IN_MOBILE'), color: 'geekblue' },
  ],
  SORTS: [
    { value: '1', label: t('host.SORTS.GROUND_NEWS'), color: 'geekblue' },
    { value: '2', label: t('host.SORTS.OPENING_NEWS'), color: 'volcano' },
    { value: '3', label: t('host.SORTS.POLICY'), color: 'geekblue' },
    { value: '4', label: t('host.SORTS.INTEREST'), color: 'volcano' },
    { value: '5', label: t('host.SORTS.AREA_PLANNING'), color: 'geekblue' },
    { value: '6', label: t('host.SORTS.AREA_PRICE'), color: 'volcano' },
    { value: '7', label: t('host.SORTS.PROJECT'), color: 'geekblue' },
    { value: '8', label: t('host.SORTS.Encyclopedia'), color: 'geekblue' },
  ],
  SORTS_WITH_PROJECT: [
    { value: '2', label: t('host.SORTS.OPENING_NEWS'), color: 'volcano' },
    { value: '7', label: t('host.SORTS.PROJECT'), color: 'geekblue' },
  ],
  _PERMS: {
    SELECT: 'news:select',
    ADD: 'news:add',
    UPDATE: 'news:update',
    DELETE: 'news:delete',
  },
  _UPDATE_FIELDS: [
    'title',
    'description',
    'keywords',
    'content',
    'img',
    'sort',
    'source',
    'author',
    'inMobile',
    'orderNum',
    'projects',
  ],
  _RULES: {
    description: [
      {
        required: true,
        trigger: 'change',
        validator: function async(_rule, description: string) {
          if (description.length > 160 || description.length === 0) {
            return Promise.reject('描述必填并且不超过160字');
          } else {
            return Promise.resolve();
          }
        },
      },
    ],
    title: [{ required: true, message: t('host.news.title'), trigger: 'blur' }],
    keywords: [
      {
        required: true,
        trigger: 'change',
        validator: function async(_rule, keywords: string) {
          const list = keywords.split(',');
          if (!list || list.length < 5) {
            return Promise.reject('关键字至少5个');
          }
          return Promise.resolve();
        },
      },
    ],
    content: [{ required: true, message: t('host.news.content'), trigger: 'blur' }],
    img: [{ required: true, message: t('host.news.img'), trigger: 'blur' }],
    sort: [{ required: true, message: t('host.news.sort'), trigger: 'blur' }],
    source: [{ required: true, message: t('host.news.source'), trigger: 'blur' }],
    author: [{ required: true, message: t('host.news.author'), trigger: 'blur' }],
    inMobile: [{ required: true, message: t('host.news.inMobile'), trigger: 'blur' }],
    projects: [
      { required: false, message: t('host.news.projects'), type: 'array', trigger: 'blur' },
    ],
  },
};

export const _ColumnsNews = [
  {
    title: t('host.news.title'),
    key: 'title',
    dataIndex: 'title',
    ellipsis: 'true',
    width: '20%',
    slots: '',
  },
  {
    title: t('host.news.keywords'),
    key: 'keywords',
    dataIndex: 'keywords',
    ellipsis: 'true',
    width: '30%',
    slots: { customRender: 'keywords' },
  },
  // {
  //   title: t('host.news.img'),
  //   key: 'img',
  //   dataIndex: 'img',
  //   ellipsis: 'true',
  //   slots: { customRender: 'img' },
  // },
  // {
  //   title: t('host.news.projects'),
  //   key: 'projects',
  //   dataIndex: 'projects',
  //   ellipsis: 'true',
  //   slots: { customRender: 'projects' },
  // },
  {
    title: t('host.news.inMobile'),
    key: 'inMobile',
    dataIndex: 'inMobile',
    ellipsis: 'true',
    slots: { customRender: 'inMobile' },
  },
  {
    title: t('host.news.sort'),
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
    title: t('host.news.createBy'),
    key: 'createByUser',
    dataIndex: 'createByUser',
    ellipsis: 'true',
    slots: { customRender: 'createByUser' },
  },
  {
    title: t('host.news.createTime'),
    key: 'createTime',
    dataIndex: 'createTime',
    ellipsis: 'false',
    slots: { customRender: 'createTime' },
    // slots: '',
    // sorter: (a, b) => (a.createTime > b.createTime ? 1 : -1),
    // sortOrder: 'descend',
    // sortDirections: '[descend]',
    defaultSortOrder: 'descend',
    width: '180px',
    sorter: true,
  },
  {
    title: t('host.operation'),
    key: 'operation',
    ellipsis: 'true',
    width: '100px',
    slots: { customRender: 'operation' },
  },
];
