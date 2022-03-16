import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam, SortParam } from '/@/api/model/baseModel';
import {
  AddUserModel,
  GetAllUsersByRoleCondition,
  GetAllUsersCondition,
  GetUserModel,
  GetUsersByMobileCondition,
  GetUsersByRoleCondition,
  GetUsersCondition,
  SysUserBean,
  UpdateUserInfo,
} from './model/userModel';

enum Api {
  GetAllUsers = '/sys-server/user/getAllUsers', // SUPER_ADMIN
  GetAllUsersByRole = '/sys-server/user/getAllUsersByRole', // SUPER_ADMIN
  AddCompanyUser = '/sys-server/user/addCompanyUser', // SUPER_ADMIN
  DeleteCompanyUser = '/sys-server/user/deleteCompanyUser', // SUPER_ADMIN
  GetUsers = '/sys-server/user/getUsers', // user:select
  GetUsersByMobile = '/sys-server/user/getUsersByMobile', // user:select
  GetUsersByRole = '/sys-server/user/getUsersByRole', // user:select
  AddUser = '/sys-server/user/addUser', // user:add
  UpdateMyInfo = '/sys-server/user/updateMyInfo', // user:update
  UpdateUserInfo = '/sys-server/user/updateUserInfo', // user:update
  DeleteUser = '/sys-server/user/deleteUser', // user:delete
  SetUserRole = '/sys-server/user/setUserRole', // user:update
  SetUserDeptId = '/sys-server/user/setUserDeptId', // user:update
  SetUserMobile = '/sys-server/user/setUserMobile', // user:update
  SetUserEmail = '/sys-server/user/setUserEmail', // user:update
  ReEnableUser = '/sys-server/user/reEnableUser', // user:update
  GetUserInfo = '/api/auth/getUserInfo',
  GetUsersBySale = '/sys-server/user/getUsersBySale',
  GetUsersByResident = '/sys-server/user/getUsersByResident',
}

export function getUsersByResident(
  realName?: string,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData({ realName });
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<GetUserModel>>(
    {
      url: Api.GetUsersByResident,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getUsersBySale(
  realName?: string,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData({ realName });
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<GetUserModel>>(
    {
      url: Api.GetUsersBySale,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

//获取用户信息
export function getUserInfo(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({
    id,
  });
  const data = reqParam.getInstance();
  return defHttp.post<SysUserBean>(
    {
      url: Api.GetUserInfo,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
// 恢复用户信息
export function reEnableUser(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({
    id,
  });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<AddUserModel>>(
    {
      url: Api.ReEnableUser,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
// 设置用户部门
export function setUserEmail(id: string, email: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({
    id,
    email,
  });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<AddUserModel>>(
    {
      url: Api.SetUserEmail,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
// 设置用户手机号
export function setUserMobile(id: string, mobile: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({
    id,
    mobile,
  });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<AddUserModel>>(
    {
      url: Api.SetUserMobile,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
// 设置用户部门
export function setUserDeptId(id: string, deptId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({
    id,
    deptId,
  });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<AddUserModel>>(
    {
      url: Api.SetUserDeptId,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
// 设置用户角色
export function setUserRole(id: string, sysRoleBeans: any[], mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({
    id,
    sysRoleBeans,
  });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<AddUserModel>>(
    {
      url: Api.SetUserRole,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
// 删除用户信息
export function deleteUser(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({
    id,
  });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<AddUserModel>>(
    {
      url: Api.DeleteUser,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
// 更新用户信息
export function updateUserInfo(user: UpdateUserInfo, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(user);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<AddUserModel>>(
    {
      url: Api.UpdateUserInfo,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
// 更新个人信息
export function updateMyInfo(user: SysUserBean, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(user);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<AddUserModel>>(
    {
      url: Api.UpdateMyInfo,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

// 添加用户
export function addUser(user: AddUserModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(user);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<AddUserModel>>(
    {
      url: Api.AddUser,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

// 获取自己企业下所有的相似手机号用户
export function getUsersByRole(
  condition: GetUsersByRoleCondition,
  page?: PageParam,
  sort?: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<GetUserModel>>(
    {
      url: Api.GetUsersByRole,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

// 获取自己企业下所有的相似手机号用户
export function getUsersByMobile(
  condition: GetUsersByMobileCondition,
  page?: PageParam,
  sort?: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<GetUserModel>>(
    {
      url: Api.GetUsersByMobile,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

// 获取自己企业下的所有用户
export function getUsers(
  condition: GetUsersCondition,
  page?: PageParam,
  sort?: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<GetUserModel>>(
    {
      url: Api.GetUsers,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

// 获取指定企业下的所有用户
export function getAllUsers(
  condition: GetAllUsersCondition,
  page?: PageParam,
  sort?: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<GetUserModel>>(
    {
      url: Api.GetAllUsers,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

// 获取指定企业下指定的角色用户
export function getAllUsersByRole(
  condition: GetAllUsersByRoleCondition,
  page?: PageParam,
  sort?: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<GetUserModel>>(
    {
      url: Api.GetAllUsersByRole,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

// 超级管理员添加企业管理员
export function addCompanyUser(user: AddUserModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(user);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<AddUserModel>>(
    {
      url: Api.AddCompanyUser,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

// 超级管理员删除企业管理员
export function deleteCompanyUser(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({
    id,
  });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<AddUserModel>>(
    {
      url: Api.DeleteCompanyUser,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
