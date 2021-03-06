import { AreaModel } from '../../area/model/areaModel';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export interface CityModel {
  id?: string; //*
  name?: string; //*
  provinceId?: string; //*
  firstLetter?: string; //*
  state?: string; //-
}

export interface CityWithAreaModel {
  id?: string; //*
  name?: string; //*
  provinceId?: string; //*
  firstLetter?: string; //*
  state?: string; //-
  areasByCity?: AreaModel[];
}

export interface CityByCondition {
  id?: string; // provinceId
  state?: string;
}

export const CityConst = {
  INVALID: '0',
  EFFECTIVE: '1',
  STATES: [
    { value: '0', label: t('model.location.city.invalidState'), color: 'volcano' },
    { value: '1', label: t('model.location.city.validState'), color: 'geekblue' },
  ],
  _ADD_FIELDS: ['id', 'name', 'provinceId', 'firstLetter', 'state'],
  _UPDATE_FIELDS: ['name', 'firstLetter'],
  _RULES: {
    id: [{ required: true, message: t('model.location.city.id'), trigger: 'blur' }],
    name: [{ required: true, message: t('model.location.city.name'), trigger: 'blur' }],
    provinceId: [{ required: true, message: t('model.location.city.provinceId'), trigger: 'blur' }],
    firstLetter: [
      { required: true, message: t('model.location.city.firstLetter'), trigger: 'blur' },
    ],
    state: [{ required: true, message: t('model.location.city.state'), trigger: 'blur' }],
  },
  _PERMS: {
    SELECT: 'location:select',
    ADD: 'location:add',
    UPDATE: 'location:update',
    DELETE: 'location:delete',
  },
};

export const CityColumns = [
  {
    title: t('model.location.city.id'),
    key: 'id',
    dataIndex: 'id',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.location.city.name'),
    key: 'name',
    dataIndex: 'name',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.location.city.firstLetter'),
    key: 'firstLetter',
    dataIndex: 'firstLetter',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.location.city.state'),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
  {
    title: t('model.location.city.action'),
    key: 'action',
    ellipsis: 'true',
    slots: { customRender: 'action' },
  },
];

// SYS_CITY_MISS_ID(4019, "???????????????????????????"),
// SYS_CITY_MISS_NAME(4020, "???????????????????????????"),
// SYS_CITY_MISS_PROVINCE_ID(4021, "?????????????????????????????????"),
// SYS_CITY_MISS_FIRST_LETTER(4022, "??????????????????????????????"),
// SYS_CITY_MISS_STATE(4023, "???????????????????????????"),
// SYS_CITY_IS_EXIST(4024, "???????????????"),
// SYS_CITY_IS_NOT_EXIST(4025, "???????????????"),
