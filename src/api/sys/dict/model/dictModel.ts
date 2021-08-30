import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export interface DictDetailModel {
  id?: string;
  value?: string;
  groupId?: string;
  state?: string;
}

export interface DictGroupModel {
  id?: string;
  name?: string;
  state?: string;
  sysDictDetails?: DictDetailModel[];
}

export interface DictByCondition {
  id?: string; // dictId
  groupId?: string;
  state?: string;
}

export interface GroupByCondition {
  id?: string; // groupId
  state?: string;
}

export const DictConst = {
  INVALID: '0',
  EFFECTIVE: '1',
  STATES: [
    { value: '0', label: t(''), color: 'volcano' },
    { value: '1', label: t(''), color: 'geekblue' },
  ],
  _ADD_GROUP_FIELDS: ['name'],
  _ADD_DETAIL_FIELDS: ['value', 'groupId'],
  _UPDATE_GROUP_FIELDS: ['name'],
  _UPDATE_DETAIL_FIELDS: ['value', 'groupId'],
  _DETAIL_RULES: {
    value: [{ required: true, message: t(''), trigger: 'blur' }],
    groupId: [{ required: true, message: t(''), trigger: 'blur' }],
    state: [{ required: true, message: t(''), trigger: 'blur' }],
  },
  _GROUP_RULES: {
    name: [{ required: true, message: t(''), trigger: 'blur' }],
    state: [{ required: true, message: t(''), trigger: 'blur' }],
  },
  _PERMS: {
    SELECT: 'dict:select',
    ADD: 'dict:add',
    UPDATE: 'dict:update',
    DELETE: 'dict:delete',
  },
};

export const DetailColumns = [
  {
    title: t(''),
    key: 'value',
    dataIndex: 'value',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t(''),
    key: 'groupId',
    dataIndex: 'groupId',
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

export const GroupColumns = [
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
  {
    title: t(''),
    key: 'action',
    ellipsis: 'true',
    slots: { customRender: 'action' },
  },
];

// SYS_DICT_MISS_ID(4031, "字典详情参数错误：编号"),
// SYS_DICT_MISS_VALUE(4032, "字典详情参数错误：值"),
// SYS_DICT_MISS_GROUP_ID(4033, "字典详情参数错误：所属字典分组"),
// SYS_DICT_IS_EXIST(4034, "字典值已存在"),
// SYS_DICT_IS_NOT_EXIST(4035, "字典值不存在"),

// SYS_DICT_GROUP_MISS_ID(4036, "字典分组详情参数错误：编号"),
// SYS_DICT_GROUP_MISS_NAME(4037, "字典分组详情参数错误：分组名称"),
// SYS_DICT_GROUP_IS_EXIST(4038, "字典组已存在"),
// SYS_DICT_GROUP_IS_NOT_EXIST(4039, "字典组不存在"),
