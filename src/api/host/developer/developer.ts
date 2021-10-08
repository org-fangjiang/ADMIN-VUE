import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam } from '/@/api/model/baseModel';
import { DeveloperCondition, DeveloperModel } from './model/developerModel';

enum ApiDeveloper {
  GetDevelopers = 'nhouse-server/developer/getDevelopers',
  GetDeveloper = 'nhouse-server/developer/getDeveloper',
  AddDeveloper = 'nhouse-server/developer/addDeveloper',
  UpdateDeveloper = 'nhouse-server/developer/updateDeveloper',
  DeleteDeveloper = 'nhouse-server/developer/deleteDeveloper',
  ReEnableDeveloper = 'nhouse-server/developer/reEnableDeveloper',
}

export function reEnableDeveloper(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<DeveloperModel>>(
    {
      url: ApiDeveloper.ReEnableDeveloper,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteDeveloper(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<DeveloperModel>>(
    {
      url: ApiDeveloper.DeleteDeveloper,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateDeveloper(brand: DeveloperModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(brand);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<DeveloperModel>>(
    {
      url: ApiDeveloper.UpdateDeveloper,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addDeveloper(brand: DeveloperModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(brand);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<DeveloperModel>>(
    {
      url: ApiDeveloper.AddDeveloper,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getDeveloper(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<DeveloperModel>>(
    {
      url: ApiDeveloper.GetDeveloper,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getDevelopers(
  condition: DeveloperCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<DeveloperModel>>(
    {
      url: ApiDeveloper.GetDevelopers,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
