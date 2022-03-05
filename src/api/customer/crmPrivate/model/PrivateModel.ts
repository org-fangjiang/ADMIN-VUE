import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export interface PrivateModel {
  id?: string;
  userId?: string;
  contact?: string;
  username?: string;
  gender?: string;
  liveIn?: string;
  workIn?: string;
  intentionProvince?: string;
  intentionCity?: string;
  intentionArea?: string;
  intentionProject?: string;
  purpose?: string;
  demand?: string;
  demandDescription?: string;
  activityId?: string;
  source?: string;
  autoBugIntentionRange?: number;
  buyIntentionRange?: number;
  breakPromiseTimes?: number;
  lookTime?: number;
  reportTime?: number;
  viewTime?: number;
  transferTime?: number;
  companyId?: string;
  state?: string;
  groupId?: string;
  userByCreate?: any;
  userByUpdate?: any;
  crmSaleCustomerRelationsById?: CrmSaleCustomerRelationEntity[];
  projectsByIntention?: any[];
}

export interface CrmSaleCustomerRelationEntity {
  saleId?: string;
  customerId?: string;
  isOwner?: string;
  saleName?: string;
}

export interface PrivateCondition {
  mobile?: string;
  liveIn?: string;
  workIn?: string;
  intentionProvince?: string;
  intentionCity?: string;
  intentionArea?: string;
  intentionProject?: string;
  purpose?: string;
  demand?: string;
  source?: string;
  buyIntentionRange?: number;
  companyId?: string;
  groupId?: string;
}

export const PrivateConst = {
  STATES: [
    { value: '0', label: t('marketing.customer.INVALID'), color: 'volcano' },
    { value: '1', label: t('marketing.customer.EFFECTIVE'), color: 'geekblue' },
    { value: '2', label: t('marketing.customer.STATE_2'), color: 'geekblue' },
    { value: '3', label: t('marketing.customer.STATE_3'), color: 'geekblue' },
    { value: '4', label: t('marketing.customer.STATE_4'), color: 'geekblue' },
    { value: '5', label: t('marketing.customer.STATE_5'), color: 'geekblue' },
    { value: '6', label: t('marketing.customer.STATE_6'), color: 'geekblue' },
    { value: '7', label: t('marketing.customer.STATE_7'), color: 'geekblue' },
    { value: '8', label: t('marketing.customer.STATE_8'), color: 'geekblue' },
    { value: '9', label: t('marketing.customer.STATE_9'), color: 'geekblue' },
  ],
  PURPOSES: [
    { value: '1', label: t('marketing.PURPOSE_1'), color: 'geekblue' },
    { value: '2', label: t('marketing.PURPOSE_2'), color: 'volcano' },
    { value: '3', label: t('marketing.PURPOSE_3'), color: 'red' },
    { value: '4', label: t('marketing.PURPOSE_4'), color: 'yellow' },
    { value: '5', label: t('marketing.PURPOSE_5'), color: 'green' },
  ],
  SOURCES: [
    { value: '1', label: t('marketing.SOURCE_1'), color: 'geekblue' },
    { value: '2', label: t('marketing.SOURCE_2'), color: 'volcano' },
    { value: '3', label: t('marketing.SOURCE_3'), color: 'red' },
    { value: '4', label: t('marketing.SOURCE_4'), color: 'yellow' },
    { value: '5', label: t('marketing.SOURCE_5'), color: 'green' },
    { value: '6', label: t('marketing.SOURCE_6'), color: 'geekblue' },
    { value: '7', label: t('marketing.SOURCE_7'), color: 'volcano' },
    { value: '8', label: t('marketing.SOURCE_8'), color: 'red' },
    { value: '9', label: t('marketing.SOURCE_9'), color: 'yellow' },
    { value: '10', label: t('marketing.SOURCE_10'), color: 'green' },
    { value: '11', label: t('marketing.SOURCE_11'), color: 'geekblue' },
    { value: '12', label: t('marketing.SOURCE_12'), color: 'volcano' },
    { value: '13', label: t('marketing.SOURCE_13'), color: 'red' },
    { value: '14', label: t('marketing.SOURCE_14'), color: 'yellow' },
    { value: '15', label: t('marketing.SOURCE_15'), color: 'green' },
    { value: '16', label: t('marketing.SOURCE_16'), color: 'green' },
  ],
  GENDER: [
    { value: '0', label: t('marketing.customer.female'), color: 'red' },
    { value: '1', label: t('marketing.customer.male'), color: 'blue' },
  ],
  _RULES: {
    contact: [
      {
        required: true,
        // message: t('marketing.customer.contact'),
        trigger: 'change',
        validator: function async(_rule, contact: string) {
          if (!/^1[3-9]{1}[0-9]{9}$/.test(contact)) {
            return Promise.reject('输入正确手机号');
          }
          return Promise.resolve();
        },
      },
    ],
    username: [{ required: true, message: t('marketing.customer.username'), trigger: 'blur' }],
    gender: [{ required: true, message: t('marketing.customer.gender'), trigger: 'blur' }],
    intentionCity: [
      { required: true, message: t('marketing.customer.intentionCity'), trigger: 'blur' },
    ],
    source: [{ required: true, message: t('marketing.customer.source'), trigger: 'blur' }],
    // state: [{ required: true, message: t('marketing.customer.state'), trigger: 'blur' }],
    buyIntentionRange: [
      {
        required: false,
        message: '意向强度为1-100的数字',
        trigger: 'change',
        validator: function async(_rule, buyIntentionRange: number) {
          if (buyIntentionRange > 100 || buyIntentionRange < 0) {
            return Promise.reject('意向强度为1-100的数字');
          }
          return Promise.resolve();
        },
      },
    ],
  },
  _UPDATE_FIELDS: [
    'contact',
    'username',
    'gender',
    'liveIn',
    'workIn',
    'intentionProvince',
    'intentionCity',
    'intentionArea',
    'intentionProject',
    'purpose',
    'demand',
    'demandDescription',
  ],
  _PERMS: {
    SELECT: 'customer:select',
    ADD: 'customer:add',
    TRANSFER: 'customer:transfer:sale',
    UPDATE: 'customer:update',
    TRANSFER_LEVEL: 'customer:transfer:level',
    INVALID: 'customer:invalid',
    DEAL: 'customer:deal',
    REPORT: 'report:add',
    LOOK: 'look:add',
  },
};

export const _ColumnsPrivate = [
  {
    title: t('marketing.customer.contact'),
    key: 'contact',
    dataIndex: 'contact',
    ellipsis: 'true',
    slots: '',
    width: '10%',
  },
  {
    title: t('marketing.customer.username'),
    key: 'username',
    dataIndex: 'username',
    ellipsis: 'true',
    slots: '',
    width: '10%',
  },
  {
    title: t('marketing.customer.gender'),
    key: 'gender',
    dataIndex: 'gender',
    ellipsis: 'true',
    slots: { customRender: 'gender' },
    width: '5%',
  },
  {
    title: t('marketing.customer.intention_project'),
    key: 'projectsByIntention',
    dataIndex: 'projectsByIntention',
    ellipsis: 'true',
    slots: { customRender: 'projectsByIntention' },
    width: '30%',
  },
  {
    title: t('marketing.customer.purpose'),
    key: 'purpose',
    dataIndex: 'purpose',
    ellipsis: 'true',
    slots: { customRender: 'purpose' },
    width: '10%',
  },
  {
    title: t('marketing.customer.state'),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
    width: '10%',
  },
  {
    title: t('host.operation'),
    key: 'operation',
    ellipsis: 'true',
    slots: { customRender: 'operation' },
  },
];
