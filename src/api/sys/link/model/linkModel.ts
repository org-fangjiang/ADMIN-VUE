import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface LinkModel {
  id?: string;
  title?: string;
  page?: string;
  address?: string;
  provinceId?: string;
  cityId?: string;
  areaId?: string;
  state?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
}

export interface LinkCondition {
  title?: string;
  page?: string;
  provinceId?: string;
  cityId?: string;
  areaId?: string;
  state?: string;
}

export const _Const = {
  EFFECTIVE: '1',
  INVALID: '0',
  STATES: [
    { value: '0', label: t('model.role.invalid'), color: 'volcano' },
    { value: '1', label: t('model.role.effective'), color: 'geekblue' },
  ],
  _ADD_FIELDS: ['title', 'page', 'address', 'provinceId', 'cityId', 'areaId'],
  _UPDATE_FIELDS: ['title', 'page', 'address'],
  _RULES: {
    title: [{ required: true, message: t(''), trigger: 'blur' }],
    page: [{ required: false, message: t(''), trigger: 'blur' }],
    address: [{ required: true, message: t(''), trigger: 'blur' }],
    provinceId: [{ required: true, message: t(''), trigger: 'blur' }],
    cityId: [{ required: true, message: t(''), trigger: 'blur' }],
    areaId: [{ required: true, message: t(''), trigger: 'blur' }],
  },
  _PERMS: {
    SELECT: 'link:select',
    ADD: 'link:add',
    UPDATE: 'link:update',
    DELETE: 'link:delete',
  },
};

export const _Component_Columns = [
  {
    title: t(''),
    key: 'title',
    width: '20%',
    dataIndex: 'title',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t(''),
    key: 'page',
    width: '10%',
    dataIndex: 'page',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t(''),
    key: 'address',
    width: '10%',
    dataIndex: 'address',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t(''),
    key: 'state',
    width: '10%',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: '',
  },
];

export const _Columns = [
  ..._Component_Columns,
  {
    title: t('model.perms.action'),
    key: 'operation',
    width: '30%',
    slots: { customRender: 'operation' },
  },
];
