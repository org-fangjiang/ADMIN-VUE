import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface AddUserModel {
  username?: string;
  password?: string;
  realName?: string;
  nickName?: string;
  sex?: string;
  email?: string;
  mobile?: string;
  theme?: string;
  avatar?: string;
  description?: string;
  deptId?: string;
  deptName?: string;
  roleId?: string;
  roleName?: string;
  sysRoleBeans?: string[]; // roleId 集合
  type?: string;
  companyName?: string;
  companyId?: string;
}

export interface GetUserModel {
  id?: string;
  username?: string;
  password?: string;
  realName?: string;
  nickName?: string;
  companyId?: string;
  deptId?: string;
  email?: string;
  mobile?: string;
  state?: string;
  lastLoginTime?: string;
  sex?: string;
  theme?: string;
  avatar?: string;
  description?: string;
  createTime?: string;
  createBy?: string;
  updateTime?: string;
  sysUserRolesById?: string;
}

// getAllUsers 接口使用 SUPER_ADMIN
export interface GetAllUsersCondition {
  companyId: string;
  state?: string;
}

// getAllUsersByRole 接口使用 SUPER_ADMIN
export interface GetAllUsersByRoleCondition {
  companyId: string;
  roleId: string;
  state?: string;
}

// getUsers 接口使用 user:select
export interface GetUsersCondition {
  deptId?: string;
  state?: string;
}

// getUsersByMobile 接口使用 user:select
export interface GetUsersByMobileCondition {
  mobile: string;
  state?: string;
}

// getUsersByRole 接口使用 user:select
export interface GetUsersByRoleCondition {
  roleId: string;
  state?: string;
}

// updateMyInfo 接口使用
export interface UpdateMyInfo {
  id: string;
  realName?: string;
  nickName?: string;
  sex?: string;
  avatar?: string;
  description?: string;
}

// updateUserInfo 接口使用
export interface UpdateUserInfo {
  id: string;
  realName?: string;
  nickName?: string;
  sex?: string;
  avatar?: string;
  description?: string;
  password?: string;
}

export const _Const = {
  EFFECTIVE: '1',
  INVALID: '0',
  STATES: [
    { value: '0', label: t('model.role.invalid'), color: 'volcano' },
    { value: '1', label: t('model.role.effective'), color: 'geekblue' },
  ],
  MAN: '0',
  WOMAN: '1',
  NO: '2',
  _ADD_FIELDS: [
    'username',
    'password',
    'realName',
    'nickName',
    'sex',
    'email',
    'mobile',
    'state',
    'theme',
    'avatar',
    'description',
    'deptId',
    'deptName',
    'roleId',
    'roleName',
    'sysRoleBeans',
  ],
  _UPDATE_FIELDS: ['realName', 'nickName', 'sex', 'avatar', 'description', 'password'],
  _RULES: {
    password: [{ required: true, message: t(''), trigger: 'blur' }],
    realName: [{ required: true, message: t(''), trigger: 'blur' }],
    nickName: [{ required: false, message: t(''), trigger: 'blur' }],
    sex: [{ required: false, message: t(''), trigger: 'blur' }],
    email: [{ required: false, message: t(''), trigger: 'blur' }],
    mobile: [{ required: true, message: t(''), trigger: 'blur' }],
    theme: [{ required: false, message: t(''), trigger: 'blur' }],
    avatar: [{ required: false, message: t(''), trigger: 'blur' }],
    description: [{ required: false, message: t(''), trigger: 'blur' }],
    deptId: [{ required: false, message: t(''), trigger: 'blur' }],
    deptName: [{ required: false, message: t(''), trigger: 'blur' }],
    roleId: [{ required: false, message: t(''), trigger: 'blur' }],
    roleName: [{ required: false, message: t(''), trigger: 'blur' }],
    sysRoleBeans: [{ required: false, message: t(''), trigger: 'blur' }],
  },
  _PERMS: {
    SELECT: 'user:select',
    ADD: 'user:add',
    UPDATE: 'user:update',
    DELETE: 'user:delete',
  },
};

export const _Component_Columns = [
  {
    title: t(''),
    key: 'username',
    width: '20%',
    dataIndex: 'username',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t(''),
    key: 'mobile',
    width: '10%',
    dataIndex: 'mobile',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t(''),
    key: 'sysUserRolesById',
    width: '10%',
    dataIndex: 'sysUserRolesById',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t(''),
    key: 'state',
    width: '10%',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: '',
  },
];

export const _Columns = [
  ..._Component_Columns,
  {
    title: t('model.perms.action'),
    key: 'operation',
    width: '30%',
    slots: { customRender: 'operation' },
  },
];
