import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam, SortParam } from '/@/api/model/baseModel';
import { DepartmentByCondition, DepartmentModel } from './model/departmentModel';

enum Api {
  GetAllDepartments = '/sys-server/dept/getAllDepartments',
  GetDepartments = '/sys-server/dept/getDepartments',
  GetDepartment = '/sys-server/dept/getDepartment',
  AddDepartment = '/sys-server/dept/addDepartment',
  UpdateDepartment = '/sys-server/dept/updateDepartment',
  DeleteDepartment = '/sys-server/dept/deleteDepartment',
}

export function getAllDepartments(
  condition: DepartmentByCondition,
  page?: PageParam,
  sort?: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<DepartmentModel>>(
    {
      url: Api.GetAllDepartments,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getDepartments(
  condition: DepartmentByCondition,
  page?: PageParam,
  sort?: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<DepartmentModel>>(
    {
      url: Api.GetDepartments,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getDepartment(
  condition: DepartmentByCondition,
  page?: PageParam,
  sort?: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<DepartmentModel>>(
    {
      url: Api.GetDepartment,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addDepartment(department: DepartmentModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(department);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<DepartmentModel>>(
    {
      url: Api.AddDepartment,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateDepartment(
  condition: DepartmentByCondition,
  page?: PageParam,
  sort?: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<DepartmentModel>>(
    {
      url: Api.UpdateDepartment,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteDepartment(
  condition: DepartmentByCondition,
  page?: PageParam,
  sort?: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.delete<BasePageResult<DepartmentModel>>(
    {
      url: Api.DeleteDepartment,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
