import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface RecommendModel {
  id?: string;
  cityId?: string;
  projectId?: string;
  projectName?: string;
  state?: string;
  createTime?: string;
  createBy?: string;
  updateTime?: string;
  updateBy?: string;
}

export interface RecommendCondition {
  id?: string;
  cityId?: string;
  projectId?: string;
  projectName?: string;
  state?: string;
}

export const _RecommendConst = {
  EFFECTIVE: '1', // 有效
  INVALID: '0', // 无效
  STATES: [
    { value: '0', label: t('host.INVALID'), color: 'volcano' },
    { value: '1', label: t('host.EFFECTIVE'), color: 'geekblue' },
  ],
  _PERMS: {
    SELECT: 'recommend:select',
    ADD: 'recommend:add',
    UPDATE: 'recommend:update',
    DELETE: 'recommend:delete',
  },
  _UPDATE_FIELDS: [],
  _RULES: {
    projectName: [{ required: true, message: t('host.recommend.projectName'), trigger: 'blur' }],
    projectId: [{ required: true, message: t('host.recommend.projectId'), trigger: 'blur' }],
    cityId: [{ required: true, message: t('host.recommend.cityId'), trigger: 'blur' }],
  },
};

export const _ColumnsRecommend = [
  {
    title: t('host.recommend.cityId'),
    key: 'cityId',
    dataIndex: 'cityId',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.recommend.projectName'),
    key: 'projectName',
    dataIndex: 'projectName',
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
