import { ErrorTypeEnum } from '/@/enums/exceptionEnum';
import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';
import { RoleInfo } from '/@/api/sys/model/userModel';

// Lock screen information
export interface LockInfo {
  // Password required
  pwd?: string | undefined;
  // Is it locked?
  isLock?: boolean;
}

// Error-log information
export interface ErrorLogInfo {
  // Type of error
  type: ErrorTypeEnum;
  // Error file
  file: string;
  // Error name
  name?: string;
  // Error message
  message: string;
  // Error stack
  stack?: string;
  // Error detail
  detail: string;
  // Error url
  url: string;
  // Error time
  time?: string;
}

export interface UserInfo {
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
  companyCityId?: string;
}

export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
  menuMode?: MenuModeEnum;
  menuType?: MenuTypeEnum;
}
