import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

import { clueActivityModel } from '../../clueActivity/model/clueActivityModel';
import { CityModel } from '/@/api/sys/city/model/cityModel';
import { SysUserBean } from '/@/api/sys/user/model/userModel';
import { HostModel } from '/@/api/host/project/model/projectModel';

export interface clueFollow {
  id?: string;
  clueId?: string;
  content?: string;
  followResult?: string;
  createTime?: string;
}

export interface ClueModel {
  id?: string;
  userId?: string;
  contact?: string;
  username?: string;
  nickname?: string;
  gender?: string;
  liveInProvince?: string;
  liveInCity?: string;
  liveInArea?: string;
  liveInAddress?: string;
  workInProvince?: string;
  workInCity?: string;
  workInArea?: string;
  workInAddress?: string;
  intentionProvince?: string;
  intentionCity?: string;
  intentionArea?: string;
  intentionProject?: string;
  purpose?: string;
  demand?: string;
  demandDescription?: string;
  activityId?: string;
  source?: string;
  state?: string;
  createTime?: string;
  createBy?: string;
  updateTime?: string;
  updateBy?: string;
  cityByIntentionCity?: CityModel;
  userByUpdate?: SysUserBean;
  activityByActivityId?: clueActivityModel;
  sysClueFollowEntities?: clueFollow[];
  projectRelationEntities?: HostModel[];
}

export interface ClueCondition {
  id?: string;
  userId?: string;
  liveInProvince?: string;
  liveInCity?: string;
  liveInArea?: string;
  state?: string;
  contact?: string;
  gender?: string;
  workInProvince?: string;
  workInCity?: string;
  workInArea?: string;
  intentionProvince?: string;
  intentionCity?: string;
  intentionArea?: string;
  intentionProject?: string;
  purpose?: string;
  createBy?: string;
  updateBy?: string;
  activityId?: string;
}

export const ClueFollowConst = {
  // STATES: [
  //   { value: '0', label: t('marketing.STATE_0'), color: 'volcano' },
  //   { value: '1', label: t('marketing.STATE_1'), color: 'geekblue' },
  // ],
  FOLLOW_RESULTS: [
    { value: '1', label: t('marketing.FOLLOW_RESULT_1'), color: 'geekblue' },
    { value: '2', label: t('marketing.FOLLOW_RESULT_2'), color: 'volcano' },
    { value: '3', label: t('marketing.FOLLOW_RESULT_3'), color: 'red' },
    { value: '4', label: t('marketing.FOLLOW_RESULT_4'), color: 'yellow' },
    { value: '5', label: t('marketing.FOLLOW_RESULT_5'), color: 'green' },
  ],
  _RULES: {
    content: [{ required: true, message: t('marketing.clueFollow.content'), trigger: 'blur' }],
    followResult: [
      { required: true, message: t('marketing.clueFollow.followResult'), trigger: 'blur' },
    ],
  },
};

export const ClueConst = {
  STATES: [
    { value: '0', label: t('marketing.STATE_0'), color: 'volcano' },
    { value: '1', label: t('marketing.STATE_1'), color: 'geekblue' },
    { value: '2', label: t('marketing.STATE_2'), color: 'yellow' },
  ],
  HOUSE_TYPES: [
    { value: '1', label: t('marketing.HOUSE_TYPE_1'), color: 'geekblue' },
    { value: '2', label: t('marketing.HOUSE_TYPE_2'), color: 'volcano' },
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
  _PERMS: {
    SELECT: 'clue:select',
    ADD: 'clue:add',
    RECEIVE: 'clue:receive',
    RECEIVE_INVALID: 'clue:receive:invalid',
    TRANSFER: 'clue:transfer',
    DELETE: 'clue:delete',
    SELECT_ALL: 'clue:select:all',
    SELECT_CITY: 'clue:select:city',
    SELECT_USER: 'clue:select:user',
    UPDATE_FOLLOW: 'clue-follow:update',
    ADD_FOLLOW: 'clue-follow:add',
    SELECT_CREATE: 'clue:select:create',
  },
  _UPDATE_FIELDS: [
    'contact',
    'username',
    'nickname',
    'gender',
    'liveInProvince',
    'liveInCity',
    'liveInArea',
    'liveInAddress',
    'workInProvince',
    'workInCity',
    'workInArea',
    'workInAddress',
    'intentionProvince',
    'intentionCity',
    'intentionArea',
    'intentionProject',
    'purpose',
    'demand',
    'demandDescription',
    'activityId',
    'source',
  ],
  _RULES: {
    intentionCity: [
      { required: true, message: t('marketing.clue.intentionCity'), trigger: 'blur' },
    ],
    contact: [
      {
        pattern: /^1\d{10}$/,
        required: true,
        message: t('marketing.clue.contact'),
        trigger: ['change', 'blur'],
      },
    ],
    source: [{ required: true, message: t('marketing.clue.source'), trigger: 'blur' }],
  },
};

export const Columns = [
  {
    title: t('marketing.clue.username'),
    key: 'username',
    dataIndex: 'username',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('marketing.clue.contact'),
    key: 'contact',
    dataIndex: 'contact',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('marketing.clue.purpose'),
    key: 'purpose',
    dataIndex: 'purpose',
    ellipsis: 'true',
    slots: { customRender: 'purpose' },
  },
  {
    title: t('marketing.clue.demand'),
    key: 'demand',
    dataIndex: 'demand',
    ellipsis: 'true',
    slots: { customRender: 'demand' },
  },
  {
    title: t('marketing.clue.intentionProject'),
    key: 'projectRelationEntities',
    dataIndex: 'projectRelationEntities',
    ellipsis: 'true',
    slots: { customRender: 'projectRelationEntities' },
  },
  {
    title: t('marketing.state'),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
];

export const ColumnsClue = [
  ...Columns,
  {
    title: t('marketing.operation'),
    key: 'operation',
    ellipsis: 'true',
    slots: { customRender: 'operation' },
  },
];
