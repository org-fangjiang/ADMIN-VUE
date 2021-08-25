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
    { value: '0', label: t(''), color: 'volcano' },
    { value: '1', label: t(''), color: 'geekblue' },
  ],
  _ADD_FIELDS: ['id', 'name', 'provinceId', 'firstLetter', 'state'],
  _UPDATE_FIELDS: ['id', 'name', 'provinceId', 'firstLetter', 'state'],
  _RULES: {
    id: [{ required: true, message: t(''), trigger: 'blur' }],
    name: [{ required: true, message: t(''), trigger: 'blur' }],
    provinceId: [{ required: true, message: t(''), trigger: 'blur' }],
    firstLetter: [{ required: true, message: t(''), trigger: 'blur' }],
    state: [{ required: true, message: t(''), trigger: 'blur' }],
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
    key: 'firstLetter',
    dataIndex: 'firstLetter',
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

// SYS_CITY_MISS_ID(4019, "市级参数错误：编号"),
// SYS_CITY_MISS_NAME(4020, "市级参数错误：名称"),
// SYS_CITY_MISS_PROVINCE_ID(4021, "市级参数错误：省级编号"),
// SYS_CITY_MISS_FIRST_LETTER(4022, "市级参数错误：首字母"),
// SYS_CITY_MISS_STATE(4023, "市级参数错误：状态"),
// SYS_CITY_IS_EXIST(4024, "市级已存在"),
// SYS_CITY_IS_NOT_EXIST(4025, "市级不存在"),
