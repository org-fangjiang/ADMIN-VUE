import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface VideoModel {
  id?: string;
  title?: string;
  keyword?: string;
  description?: string;
  cityId?: string;
  provinceId?: string;
  projectId?: string;
  videoAddress?: string;
  photoAddress?: string;
  sort?: string;
  isTop?: string;
  state?: string;
}

export interface VideoCondition {
  cityId?: string;
  state?: string;
  isTop?: string;
  project?: string;
}

export const _VideoConst = {
  EFFECTIVE: '1', // 有效
  INVALID: '0', // 无效
  STATES: [
    { value: '0', label: t('host.INVALID'), color: 'volcano' },
    { value: '1', label: t('host.EFFECTIVE'), color: 'geekblue' },
  ],
  isTop: [
    { value: '0', label: t('host.video.no'), color: 'volcano' },
    { value: '1', label: t('host.video.yes'), color: 'geekblue' },
  ],
  SORTS: [
    { value: '1', label: t('host.video.SORT_PROJECT'), color: 'volcano' },
    { value: '2', label: t('host.video.SORT_ROOM'), color: 'geekblue' },
    { value: '3', label: t('host.video.SORT_COMPARE'), color: 'volcano' },
    { value: '4', label: t('host.video.SORT_POLICY'), color: 'geekblue' },
  ],
  _PERMS: {
    SELECT: 'video:select',
    ADD: 'video:add',
    UPDATE: 'video:update',
    DELETE: 'video:delete',
  },
  _UPDATE_FIELDS: ['title', 'keyword', 'description'],
  _RULES: {
    title: [{ required: true, message: t('host.video.title'), trigger: 'blur' }],
    keyword: [{ required: true, message: t('host.video.keyword'), trigger: 'blur' }],
    description: [{ required: true, message: t('host.video.description'), trigger: 'blur' }],
    provinceId: [{ required: true, message: t('host.video.provinceId'), trigger: 'blur' }],
    cityId: [{ required: true, message: t('host.video.cityId'), trigger: 'blur' }],
    sort: [{ required: true, message: t('host.video.sort'), trigger: 'blur' }],
    // videoAddress: [{ required: true, message: t('host.video.videoAddress'), trigger: 'blur' }],
    photoAddress: [{ required: true, message: t('host.video.photoAddress'), trigger: 'blur' }],
  },
};

export const VideoColumns = [
  {
    title: t('host.video.title'),
    key: 'title',
    dataIndex: 'title',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.video.sort'),
    key: 'sort',
    dataIndex: 'sort',
    ellipsis: 'true',
    slots: { customRender: 'sort' },
  },
  {
    title: t('host.video.description'),
    key: 'description',
    dataIndex: 'description',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.video.keyword'),
    key: 'keyword',
    dataIndex: 'keyword',
    ellipsis: 'true',
    slots: { customRender: 'keyword' },
  },
  {
    title: t('host.video.isTop'),
    key: 'isTop',
    dataIndex: 'isTop',
    ellipsis: 'true',
    slots: { customRender: 'isTop' },
  },
  {
    title: t('host.operation'),
    key: 'operation',
    ellipsis: 'true',
    slots: { customRender: 'operation' },
  },
];
