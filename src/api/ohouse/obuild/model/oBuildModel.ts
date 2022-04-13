import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export interface oBuildModel {
  id?: string;
  number?: string;
  floors?: string;
  description?: string;
  projectId?: string;
  openTime?: string;
  payTime?: string;
  state?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  remark?: string;
  locationX?: string;
  locationY?: string;
  unitNumber?: number;
}

export interface oBuildCondition {
  id?: string;
  projectId?: string;
  number?: string;
  floors?: string;
  state?: string;
}

export const oBuildConst = {
  STATE: [
    { value: '0', label: t('ohouse.INVALID'), color: 'volcano' },
    { value: '1', label: t('ohouse.EFFECTIVE'), color: 'geekblue' },
    { value: '2', label: t('ohouse.PENDING_APPROVAL'), color: 'volcano' },
    { value: '3', label: t('ohouse.FAILED'), color: 'geekblue' },
  ],
  REMARK_STATES: [
    { value: '0', label: t('host.REMARK_STATES.REMARK_OFF'), color: 'volcano' },
    { value: '1', label: t('host.REMARK_STATES.REMARK_ON'), color: 'geekblue' },
  ],
  _UPDATE_FIELDS: [
    'number',
    'floors',
    'description',
    'projectId',
    'openTime',
    'payTIme',
    'remark',
    'locationX',
    'locationY',
    'unitNumber',
  ],
  _PERMS: {
    ADD: 'build:add',
    UPDATE: 'build:update',
    DELETE: 'build:delete',
    CHANGE: 'build:check:state',
  },
  _RULES: {
    number: [{ required: true, message: t('ohouse.build.number'), trigger: 'blur' }],
    floors: [
      { required: true, type: 'number', message: t('ohouse.build.floors'), trigger: 'blur' },
    ],
    projectId: [{ required: true, message: t('ohouse.build.projectId'), trigger: 'blur' }],
    openTime: [{ required: true, message: t('ohouse.build.openTime'), trigger: 'blur' }],
    payTime: [{ required: true, message: t('ohouse.build.payTime'), trigger: 'blur' }],
    unitNumber: [
      { required: true, type: 'number', message: t('ohouse.build.unitNumber'), trigger: 'blur' },
    ],
  },
};

export const BuildColumns = [
  {
    title: t('ohouse.build.number'),
    key: 'number',
    dataIndex: 'number',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('ohouse.build.unitNumber'),
    key: 'unitNumber',
    dataIndex: 'unitNumber',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('ohouse.build.floors'),
    key: 'floors',
    dataIndex: 'floors',
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
