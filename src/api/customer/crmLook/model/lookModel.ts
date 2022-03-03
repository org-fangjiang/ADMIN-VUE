import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export interface LookModel {
  id?: string;
  customerName?: string;
  customerMobile?: string;
  realCustomerMobile?: string;
  lookTime?: string;
  realLookTime?: string;
  saleId?: string;
  customerId?: string;
  projectId?: string;
  photoAddress?: string;
  commentContent?: string;
  commentScore?: string;
  groupId?: string;
  companyId?: string;
  state?: string;
  userByCreate?: any;
  userByUpdate?: any;
  projectById?: any;
}

export interface LookCondition {
  companyId?: string;
  groupId?: string;
  saleId?: string;
  customerName?: string;
  customerNam?: string;
  mobile?: string;
  customerId?: string;
  projectId?: string;
  createTimeStart?: string;
  createTimeEnd?: string;
  state?: string;
}

export const LookConst = {
  STATES: [
    { value: '0', label: t('marketing.follow.INVALID'), color: 'volcano' },
    { value: '1', label: t('marketing.follow.EFFECTIVE'), color: 'geekblue' },
    { value: '2', label: t('marketing.look.STATE_2'), color: 'volcano' },
    { value: '3', label: t('marketing.look.STATE_3'), color: 'geekblue' },
    { value: '4', label: t('marketing.look.STATE_4'), color: 'volcano' },
    { value: '5', label: t('marketing.look.STATE_5'), color: 'geekblue' },
  ],
  _RULES: {
    realLookTime: [{ required: true, message: t('marketing.look.realLook'), trigger: 'blur' }],
    photoAddress: [{ required: true, message: t('marketing.look.photoAddress'), trigger: 'blur' }],
  },
  _UPDATE_FIELDS: [],
  _PERMS: {
    ADD: 'look:add',
    EXAMINE: 'look:examine',
    MY_LOOK: 'look:select:my',
    SELECT_MEMBER: 'look:select:member',
    SELECT_GROUP: 'look:select:group',
    SELECT_EVERYGROUP: 'look:select:everygroup',
    SELECT_COMPANY: 'look:select:company',
    SELECT_PROJECT: 'look:select:project',
    SELECT_RESIDENT: 'look:select:resident',
  },
};

export const Columns = [
  {
    title: t('marketing.look.customerId'),
    key: 'customerName',
    dataIndex: 'customerName',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('marketing.look.mobile'),
    key: 'customerMobile',
    dataIndex: 'customerMobile',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('marketing.look.projectId'),
    key: 'projectById',
    dataIndex: 'projectById',
    ellipsis: 'true',
    slots: { customRender: 'projectById' },
  },
  {
    title: t('marketing.look.realLook'),
    key: 'realLookTime',
    dataIndex: 'realLookTime',
    ellipsis: 'true',
    slots: { customRender: 'realLookTime' },
  },
  // {
  //   title: t('marketing.report.saleId'),
  //   key: 'userByCreate',
  //   dataIndex: 'userByCreate',
  //   ellipsis: 'true',
  //   slots: '',
  // },
  {
    title: t('marketing.customer.state'),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
];

export const LookColumns = [
  ...Columns,
  {
    title: t('host.operation'),
    key: 'operation',
    ellipsis: 'true',
    slots: { customRender: 'operation' },
  },
];
