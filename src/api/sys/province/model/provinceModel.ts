import { CityModel } from '../../city/model/cityModel';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export interface ProvinceModel {
  id?: string;
  name?: string;
  state?: string;
}

export interface ProvinceModelWithCityModel {
  id?: string;
  name?: string;
  state?: string;
  citiesByProvince?: CityModel[];
}

export interface ProvinceByCondition {
  state?: string;
}

export const ProvinceConst = {
  INVALID: '0',
  EFFECTIVE: '1',
  STATES: [
    { value: '0', label: t(''), color: 'volcano' },
    { value: '1', label: t(''), color: 'geekblue' },
  ],
  _ADD_FIELDS: ['id', 'name', 'state'],
  _UPDATE_FIELDS: ['id', 'name', 'state'],
  _RULES: {
    id: [{ required: true, message: t(''), trigger: 'blur' }],
    name: [{ required: true, message: t(''), trigger: 'blur' }],
    state: [{ required: true, message: t(''), trigger: 'blur' }],
  },
  _PERMS: {
    SELECT: 'location:select',
    ADD: 'location:add',
    UPDATE: 'location:update',
    DELETE: 'location:delete',
  },
};

export const ProvinceColumns = [
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
];

// SYS_PROVINCE_MISS_ID(4026, "省级参数错误：编号"),
// SYS_PROVINCE_MISS_NAME(4027, "省级参数错误：名称"),
// SYS_PROVINCE_MISS_STATE(4028, "省级参数错误：状态"),
// SYS_PROVINCE_IS_EXIST(4029, "省级已存在"),
// SYS_PROVINCE_IS_NOT_EXIST(4030, "省级不存在"),
