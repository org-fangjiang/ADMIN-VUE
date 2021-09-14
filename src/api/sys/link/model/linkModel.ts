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
    { value: '0', label: t('model.link.invalid'), color: 'volcano' },
    { value: '1', label: t('model.role.effective'), color: 'geekblue' },
  ],
  _ADD_FIELDS: ['title', 'page', 'address', 'provinceId', 'cityId', 'areaId'],
  _UPDATE_FIELDS: ['title', 'page', 'address'],
  _RULES: {
    title: [{ required: true, message: t('model.link.title'), trigger: 'blur' }],
    page: [{ required: false, message: t('model.link.page'), trigger: 'blur' }],
    address: [{ required: true, message: t('model.link.address'), trigger: 'blur' }],
    provinceId: [{ required: true, message: t('model.link.provinceId'), trigger: 'blur' }],
    cityId: [{ required: true, message: t('model.link.cityId'), trigger: 'blur' }],
    areaId: [{ required: true, message: t('model.link.areaId'), trigger: 'blur' }],
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
    title: t('model.link.title'),
    key: 'title',
    width: '20%',
    dataIndex: 'title',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.link.page'),
    key: 'page',
    width: '10%',
    dataIndex: 'page',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.link.address'),
    key: 'address',
    width: '10%',
    dataIndex: 'address',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.link.state'),
    key: 'state',
    width: '10%',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
];

export const _Columns = [
  ..._Component_Columns,
  {
    title: t('model.link.action'),
    key: 'operation',
    width: '30%',
    slots: { customRender: 'operation' },
  },
];
