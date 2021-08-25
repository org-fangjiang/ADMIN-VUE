import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export interface AreaModel {
  id?: string; //*
  name?: string; //*
  cityId?: string; //*
  state?: string;
}

export interface AreaByCondition {
  id?: string; // cityId
  state?: string;
}

export const AreaConst = {
  INVALID: '0',
  EFFECTIVE: '1',
  STATES: [
    { value: '0', label: t(''), color: 'volcano' },
    { value: '1', label: t(''), color: 'geekblue' },
  ],
  _ADD_FIELDS: ['id', 'name', 'cityId', 'state'],
  _UPDATE_FIELDS: ['id', 'name', 'cityId', 'state'],
  _RULES: {
    id: [{ required: true, message: t(''), trigger: 'blur' }],
    name: [{ required: true, message: t(''), trigger: 'blur' }],
    cityId: [{ required: true, message: t(''), trigger: 'blur' }],
    state: [{ required: true, message: t(''), trigger: 'blur' }],
  },
  _PERMS: {
    SELECT: 'location:select',
    ADD: 'location:add',
    UPDATE: 'location:update',
    DELETE: 'location:delete',
  },
};

export const AreaColumns = [
  {
    title: t(''),
    key: 'id',
    dataIndex: 'id',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t(''),
    key: 'name',
    dataIndex: 'name',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t(''),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t(''),
    key: 'action',
    ellipsis: 'true',
    slots: { customRender: 'action' },
  },
];

// SYS_AREA_MISS_ID(4013, "区级参数错误：编号"),
// SYS_AREA_MISS_NAME(4014, "区级参数错误：名称"),
// SYS_AREA_MISS_CITY_ID(4015, "区级参数错误：市级编号"),
// SYS_AREA_MISS_STATE(4016, "区级参数错误：状态"),
// SYS_AREA_IS_EXIST(4017, "区级已存在"),
// SYS_AREA_IS_NOT_EXIST(4018, "区级不存在"),
