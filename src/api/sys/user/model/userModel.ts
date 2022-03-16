import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface SysUserBean {
  id: string;
  username?: string;
  password?: string;
  realName?: string;
  nickName?: string;
  sex?: string;
  email?: string;
  mobile?: string;
  state?: string;
  theme?: string;
  avatar?: string;
  description?: string;
  lastLoginTime?: string;
  createTime?: string;
  createBy?: string;
  updateTime?: string;
  deptId?: string;
  deptName?: string;
  roleId?: string;
  roleName?: string;
  sysRoleBeans?: any[]; // roleId 集合
  type?: string;
  companyName?: string;
  companyId?: string;
  companyCityId?: string;
  companyProvinceId?: string;
}

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
  sysRoleBeans?: any[]; // roleId 集合
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
  sysUserRolesById?: any[];
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
    { value: '0', label: t('model.user.invalid'), color: 'volcano' },
    { value: '1', label: t('model.user.effective'), color: 'geekblue' },
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
    password: [{ required: true, message: t('model.user.password'), trigger: 'blur' }],
    realName: [{ required: true, message: t('model.user.realName'), trigger: 'blur' }],
    nickName: [{ required: true, message: t('model.user.nickName'), trigger: 'blur' }],
    sex: [{ required: false, message: t('model.user.sex'), trigger: 'blur' }],
    email: [{ required: false, message: t('model.user.email'), trigger: 'blur' }],
    mobile: [
      { pattern: '^1[0-9]{10}', required: true, message: t('model.user.mobile'), trigger: 'blur' },
    ],
    theme: [{ required: false, message: t('model.user.theme'), trigger: 'blur' }],
    avatar: [{ required: false, message: t('model.user.avatar'), trigger: 'blur' }],
    description: [{ required: false, message: t('model.user.description'), trigger: 'blur' }],
    deptId: [{ required: true, message: t('model.user.deptId'), trigger: 'blur' }],
    deptName: [{ required: false, message: t('model.user.deptName'), trigger: 'blur' }],
    roleId: [{ required: false, message: t('model.user.roleId'), trigger: 'blur' }],
    roleName: [{ required: false, message: t('model.user.roleName'), trigger: 'blur' }],
    sysRoleBeans: [{ required: false, message: t('model.user.sysRoleBeans'), trigger: 'blur' }],
  },
  _PERMS: {
    SELECT: 'user:select',
    ADD: 'user:add',
    UPDATE: 'user:update',
    DELETE: 'user:delete',
    SET_ROLE: 'user:set:role',
  },
};

export const _Component_Columns = [
  {
    title: t('model.user.userName'),
    key: 'username',
    width: '20%',
    dataIndex: 'username',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.user.mobile'),
    key: 'mobile',
    width: '20%',
    dataIndex: 'mobile',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.user.sysRoleBeans'),
    key: 'sysUserRolesById',
    width: '30%',
    dataIndex: 'sysUserRolesById',
    ellipsis: 'true',
    slots: { customRender: 'sysUserRolesById' },
  },
  {
    title: t('model.user.state'),
    key: 'state',
    width: '10%',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
];

export const _Columns = [
  ..._Component_Columns,
  {
    title: t('model.user.action'),
    key: 'operation',
    width: '20%',
    slots: { customRender: 'operation' },
  },
];
