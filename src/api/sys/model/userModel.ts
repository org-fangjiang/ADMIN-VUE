export interface CodeResultModel {
  key: string;
  codeUrl: string;
}
/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
  key: string;
  code: string;
  grant_type: string;
}

export interface RefreshParams {
  grant_type: string;
  refresh_token: string;
  client_id: string;
  client_secret: string;
  scope: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  access_token: string | undefined;
  expires_in: number;
  refresh_token: string | undefined;
  scope: string[];
  token_type: string;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
}

export interface MenuInfo {
  id: string;
  parentId: string;
  menuName: string;
  path: string;
  component: string;
  perms: string;
  icon: string;
  type: string;
  orderNum: string;
  createTime: string;
  updateTime: string;
  createBy: string;
  state: string;
}

export interface RoleInfo {
  id: string;
  roleName: string;
  remake: string;
  createTime: string;
  updateTime: string;
  createBy: string;
  companyId: string;
  state: string;
  menus: MenuInfo[];
}
export interface UserInfoModel {
  id: string;
  username: string;
  password: string;
  realName: string;
  nickName: string;
  sex: string;
  email: string;
  mobile: string;
  state: string;
  theme: string;
  avatar: string;
  description: string;
  lastLoginTime: string;
  createTime: string;
  createBy: string;
  updateTime: string;
  deptId: string;
  deptName: string;
  roleId: string;
  roleName: string;
  sysRoleBeans: RoleInfo[];
  type: string;
  companyName: string;
  companyId: string;
}
