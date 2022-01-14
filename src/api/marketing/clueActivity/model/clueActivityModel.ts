import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
import { HostModel } from '/@/api/host/project/model/projectModel';
import { CityModel } from '/@/api/sys/city/model/cityModel';
import { SysUserBean } from '/@/api/sys/user/model/userModel';

export interface clueActivityModel {
  id?: string;
  title?: string;
  description?: string;
  sort?: string;
  type?: string;
  expireTime?: string;
  headImg?: string;
  userNumber?: number;
  cityId?: string;
  state?: string;
  createTime?: string;
  createBy?: string;
  updateTime?: string;
  updateBy?: string;
  cityByCityId?: CityModel;
  createByUser?: SysUserBean;
  updateByUser?: SysUserBean;
  projectEntities?: HostModel[];
}

export interface ClueActivityCondition {
  id?: string;
  companyId?: string;
  state?: string;
  roleId?: string;
  deptId?: string;
  mobile?: string;
  email?: string;
  title?: string;
  cityId?: string;
  createBy?: string;
}

export const ClueActivityCOnst = {
  STATES: [
    { value: '0', label: t('marketing.clueActivity.STATE_0'), color: 'volcano' },
    { value: '1', label: t('marketing.clueActivity.STATE_1'), color: 'geekblue' },
    { value: '2', label: t('marketing.clueActivity.STATE_2'), color: 'yellow' },
  ],
  SORTS: [
    { value: '1', label: t('marketing.clueActivity.SORT_1'), color: 'geekblue' },
    { value: '2', label: t('marketing.clueActivity.SORT_2'), color: 'yellow' },
    { value: '3', label: t('marketing.clueActivity.SORT_3'), color: 'volcano' },
    { value: '4', label: t('marketing.clueActivity.SORT_4'), color: 'geekblue' },
    { value: '5', label: t('marketing.clueActivity.SORT_5'), color: 'yellow' },
    { value: '6', label: t('marketing.clueActivity.SORT_6'), color: 'volcano' },
  ],
  TYPES: [
    { value: '2', label: t('marketing.clueActivity.TYPE_2'), color: 'volcano' },
    { value: '1', label: t('marketing.clueActivity.TYPE_1'), color: 'geekblue' },
  ],
  _PERMS: {
    SELECT: 'activity:select',
    SELECT_CITY: 'activity:select:city',
    SELECT_CREATE: 'activity:select:create',
    SELECT_ALL: 'activity:select:all',
    ADD_PC: 'activity:add:pc',
    ADD_USER: 'activity:add:user',
    UPDATE_ALL: 'activity:udpate:all',
    UPDATE_USER: 'activity:udpate:user',
    DELETE_ALL: 'activity:delete:all',
    DELETE_USER: 'activity:delete:user',
    PUBLISH: 'activity:publish',
  },
  _UPDATE_FIELDS: ['title', 'description', 'expireTime', 'headImg'],
  _RULES: {
    title: [
      {
        required: true,
        message: '活动标题不超过8个字',
        trigger: 'change',
        validator: function async(_rule, title: string) {
          if (title.length > 8) {
            return Promise.reject('活动标题不超过8个字');
          }
          return Promise.resolve();
        },
      },
    ],
    description: [
      { required: true, message: t('marketing.clueActivity.description'), trigger: 'blur' },
    ],
    sort: [{ required: true, message: t('marketing.clueActivity.sort'), trigger: 'blur' }],
    expireTime: [
      { required: true, message: t('marketing.clueActivity.expireTime'), trigger: 'blur' },
    ],
    headImg: [{ required: true, message: t('marketing.clueActivity.headImg'), trigger: 'blur' }],
  },
};

export const ActivityColumns = [
  {
    title: t('marketing.clueActivity.title'),
    key: 'title',
    dataIndex: 'title',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('marketing.clueActivity.type'),
    key: 'type',
    dataIndex: 'type',
    ellipsis: 'true',
    slots: { customRender: 'type' },
  },
  {
    title: t('marketing.clueActivity.sort'),
    key: 'sort',
    dataIndex: 'sort',
    ellipsis: 'true',
    slots: { customRender: 'sort' },
  },
  {
    title: t('marketing.clueActivity.expireTime'),
    key: 'expireTime',
    dataIndex: 'expireTime',
    ellipsis: 'true',
    slots: { customRender: 'expireTime' },
  },
  {
    title: t('marketing.state'),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
  {
    title: t('marketing.clueActivity.projectEntities'),
    key: 'projectEntities',
    dataIndex: 'projectEntities',
    ellipsis: 'true',
    slots: { customRender: 'projectEntities' },
  },
  {
    title: t('marketing.operation'),
    key: 'operation',
    ellipsis: 'true',
    slots: { customRender: 'operation' },
  },
];
