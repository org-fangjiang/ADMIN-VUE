import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface UnitModel {
  id?: string;
  buildId?: string;
  number?: string;
  floor?: number;
  everyRooms?: number;
  heightPrice?: string;
  lowPrice?: string;
  avePrice?: string;
}

export interface UnitCondition {
  id?: string;
  state?: string;
}

export const UnitConst = {
  EFFECTIVE: '1', // 有效
  INVALID: '0', // 无效
  STATES: [
    { value: '0', label: t('host.INVALID'), color: 'volcano' },
    { value: '1', label: t('host.EFFECTIVE'), color: 'geekblue' },
  ],
  _PERMS: {
    SELECT: 'unit:select',
    ADD: 'unit:add',
    UPDATE: 'unit:update',
    DELETE: 'unit:delete',
  },
  _UPDATE_FIELDS: ['floor', 'number', 'everyRooms'],
  _RULES: {
    buildId: [{ required: true, message: t('host.manageUnit.buildId'), trigger: 'blur' }],
    floor: [
      { required: true, type: 'number', message: t('host.manageUnit.floor'), trigger: 'blur' },
    ],
    number: [{ required: true, message: t('host.manageUnit.number'), trigger: 'blur' }],
    everyRooms: [
      { required: true, type: 'number', message: t('host.manageUnit.everyRooms'), trigger: 'blur' },
    ],
  },
};
