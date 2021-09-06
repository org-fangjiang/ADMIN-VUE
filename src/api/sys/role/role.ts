import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam, SortParam } from '/@/api/model/baseModel';
import { RoleByCondition, RoleModel } from './model/roleModel';

enum Api {
  GetRoles = '/sys-server/role/getRoles',
  GetRole = '/sys-server/role/getRole',
  AddRoles = '/sys-server/role/addRoles',
  UpdateRole = '/sys-server/role/updateRole',
  DeleteRole = '/sys-server/role/deleteRole',
  ReEnableRole = '/sys-server/role/reEnableRole',
  SetRoleMenu = '/sys-server/role/setRoleMenu',
}

// 超级管理员： companyId, state
// 非超级管理员： state
export function getRoles(
  condition: RoleByCondition,
  page?: PageParam,
  sort?: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<RoleModel>>(
    {
      url: Api.GetRoles,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

// 角色详情id
export function getRole(
  condition: RoleByCondition,
  page?: PageParam,
  sort?: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<RoleModel>>(
    {
      url: Api.GetRole,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addRoles(role: RoleModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(role);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<RoleModel>>(
    {
      url: Api.AddRoles,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateRole(role: RoleModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(role);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<RoleModel>>(
    {
      url: Api.UpdateRole,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteRole(role: RoleModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(role);
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<RoleModel>>(
    {
      url: Api.DeleteRole,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableRole(role: RoleModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(role);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<RoleModel>>(
    {
      url: Api.ReEnableRole,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function setRoleMenu(role: RoleModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(role);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<RoleModel>>(
    {
      url: Api.SetRoleMenu,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
