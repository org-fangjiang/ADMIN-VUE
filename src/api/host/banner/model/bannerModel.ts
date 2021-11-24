import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface BannerModel {
  id?: string;
  title?: string;
  keyword?: string;
  description?: string;
  address?: string;
  cityId?: string;
  hProjectId?: string;
}

export interface BannerCondition {
  id?: string;
  state?: string;
  cityId?: string;
}

export const _BannerConst = {
  EFFECTIVE: '1', // 有效
  INVALID: '0', // 无效
  STATES: [
    { value: '0', label: t('host.INVALID'), color: 'volcano' },
    { value: '1', label: t('host.EFFECTIVE'), color: 'geekblue' },
  ],
  _PERMS: {
    SEARCH: 'banner:select',
    ADD: 'banner:add',
    UPDATE: 'banner:update',
    DELETE: 'banner:delete',
  },
  _UPDATE_FIELDS: ['title', 'keyword', 'description', 'address', 'cityId', 'hProjectId'],
  _RULES: {
    title: [{ required: true, message: t('host.banner.title'), trigger: 'blur' }],
    keyword: [{ required: true, message: t('host.banner.keyword'), trigger: 'blur' }],
    description: [{ required: true, message: t('host.banner.description'), trigger: 'blur' }],
    address: [{ required: true, message: t('host.banner.address'), trigger: 'blur' }],
    cityId: [{ required: true, message: t('host.banner.cityId'), trigger: 'blur' }],
    hProjectId: [{ required: true, message: t('host.banner.hProjectId'), trigger: 'blur' }],
  },
};

export const _BannerColumns = [
  {
    title: t('host.banner.title'),
    key: 'title',
    dataIndex: 'title',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.banner.keyword'),
    key: 'keyword',
    dataIndex: 'keyword',
    ellipsis: 'true',
    slots: { customRender: 'keyword' },
  },
  {
    title: t('host.banner.address'),
    key: 'address',
    dataIndex: 'address',
    ellipsis: 'true',
    slots: { customRender: 'address' },
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
