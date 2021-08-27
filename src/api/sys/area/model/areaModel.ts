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
    { value: '0', label: t('model.location.area.invalidState'), color: 'volcano' },
    { value: '1', label: t('model.location.area.validState'), color: 'geekblue' },
  ],
  _ADD_FIELDS: ['id', 'name', 'cityId', 'state'],
  _UPDATE_FIELDS: ['name'],
  _RULES: {
    id: [{ required: true, message: t('model.location.area.id'), trigger: 'blur' }],
    name: [{ required: true, message: t('model.location.area.name'), trigger: 'blur' }],
    cityId: [{ required: true, message: t('model.location.area.areaId'), trigger: 'blur' }],
    state: [{ required: true, message: t('model.location.area.state'), trigger: 'blur' }],
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
    title: t('model.location.area.id'),
    key: 'id',
    dataIndex: 'id',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.location.area.name'),
    key: 'name',
    dataIndex: 'name',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.location.area.state'),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
  {
    title: t('model.location.area.action'),
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
