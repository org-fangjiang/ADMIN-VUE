import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export interface UnitModel {
  id?: string;
  buildId?: string;
  projectId?: string;
  number?: string;
  floor?: number;
  everyRooms?: number;
  state?: string;
}

export interface UnitCondition {
  id?: string;
  oBuildId?: string;
  number?: string;
  everyRooms?: number;
  state?: string;
}

export const UnitConst = {
  STATE: [
    { value: '0', label: t('ohouse.INVALID'), color: 'volcano' },
    { value: '1', label: t('ohouse.EFFECTIVE'), color: 'geekblue' },
    { value: '2', label: t('ohouse.PENDING_APPROVAL'), color: 'volcano' },
    { value: '3', label: t('ohouse.FAILED'), color: 'geekblue' },
  ],
  _UPDATE_FIELDS: ['number', 'floor', 'everyRooms', 'state'],
  _PERMS: {
    ADD: 'unit:add',
    UPDATE: 'unit:update',
    DELETE: 'unit:delete',
    CHANGE: 'unit:check:state',
  },
  _RULES: {
    buildId: [{ required: true, message: t('ohouse.unit.buildId'), trigger: 'blur' }],
    projectId: [{ required: true, message: t('ohouse.unit.projectId'), trigger: 'blur' }],
    number: [{ required: true, message: t('ohouse.unit.number'), trigger: 'blur' }],
    floor: [{ required: true, type: 'number', message: t('ohouse.unit.floor'), trigger: 'blur' }],
    everyRooms: [
      { required: true, type: 'number', message: t('ohouse.unit.everyRooms'), trigger: 'blur' },
    ],
  },
};

export const UnitColumns = [
  {
    title: t('ohouse.unit.number'),
    key: 'number',
    dataIndex: 'number',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('ohouse.unit.floor'),
    key: 'floor',
    dataIndex: 'floor',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('ohouse.unit.everyRooms'),
    key: 'everyRooms',
    dataIndex: 'everyRooms',
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
    width: '30%',
    ellipsis: 'true',
    slots: { customRender: 'operation' },
  },
];
