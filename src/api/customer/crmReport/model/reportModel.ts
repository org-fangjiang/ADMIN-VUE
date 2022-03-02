import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface ReportModel {
  id?: string;
  customerName?: string;
  customerMobile?: string;
  realCustomerMobile?: string;
  lookTime?: string;
  saleId?: string;
  customerId?: string;
  groupId?: string;
  companyId?: string;
  state?: string;
  projectId?: string;
  // createTime;
  // createBy;
  // updateTime;
  // updateBy;
  userByCreate?: any;
  userByUpdate?: any;
  projectById?: any;
}

export interface ReportCondition {
  companyId?: string;
  groupId?: string;
  saleId?: string;
  customerName?: string;
  mobile?: string;
  customerId?: string;
  projectId?: string;
  createTimeStart?: string;
  createTimeEnd?: string;
  state?: string;
}

export const ReportConst = {
  STATES: [
    { value: '0', label: t('marketing.follow.INVALID'), color: 'volcano' },
    { value: '1', label: t('marketing.follow.EFFECTIVE'), color: 'geekblue' },
    { value: '2', label: t('marketing.report.STATE_2'), color: 'volcano' },
    { value: '3', label: t('marketing.report.STATE_3'), color: 'geekblue' },
    { value: '4', label: t('marketing.report.STATE_4'), color: 'volcano' },
    { value: '5', label: t('marketing.report.STATE_5'), color: 'geekblue' },
    { value: '6', label: t('marketing.report.STATE_6'), color: 'volcano' },
  ],
  _RULES: {
    // saleId: [{ required: true, message: t('marketing.report.saleId'), trigger: 'blur' }],
    customerId: [{ required: true, message: t('marketing.report.customerId'), trigger: 'blur' }],
    // groupId: [{ required: true, message: t('marketing.report.groupId'), trigger: 'blur' }],
    // companyId: [{ required: true, message: t('marketing.report.companyId'), trigger: 'blur' }],
    projectId: [{ required: true, message: t('marketing.report.projectId'), trigger: 'blur' }],
    // state: [{ required: true, message: t('marketing.report.state'), trigger: 'blur' }],
    lookTime: [{ required: true, message: t('marketing.report.lookTime'), trigger: 'blur' }],
  },
  _UPDATE_FIELDS: [],
  _PERMS: {
    ADD: 'report:add',
    EXAMINE: 'report:examine',
    SELECT_MY: 'report:select:my',
    SELECT_MEMBER: 'report:select:member',
    SELECT_GROUP: 'report:select:group',
    SELECT_EVERYGROUP: 'report:select:everygroup',
    SELECT_COMPANY: 'report:select:company',
    SELECT_PROJECT: 'report:select:project',
    SELECT_RESIDENT: 'report:select:resident',
  },
};

export const Columns = [
  {
    title: t('marketing.report.customerId'),
    key: 'customerName',
    dataIndex: 'customerName',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('marketing.report.mobile'),
    key: 'customerMobile',
    dataIndex: 'customerMobile',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('marketing.report.projectId'),
    key: 'projectById',
    dataIndex: 'projectById',
    ellipsis: 'true',
    slots: { customRender: 'projectById' },
  },
  {
    title: t('marketing.report.lookTime'),
    key: 'lookTime',
    dataIndex: 'lookTime',
    ellipsis: 'true',
    slots: { customRender: 'lookTime' },
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

export const ReportColumns = [
  ...Columns,
  {
    title: t('host.operation'),
    key: 'operation',
    ellipsis: 'true',
    slots: { customRender: 'operation' },
  },
];
