import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult, BaseListResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam } from '/@/api/model/baseModel';
import { ViolationCondition, ViolationModel } from './model/violationModel';

enum Api {
  GetByPage = '/sys-server/violation/getByPage',
  Add = '/sys-server/violation/add',
  AddAll = '/sys-server/violation/addAll',
  Update = '/sys-server/violation/update',
  Delete = '/sys-server/violation/delete',
  deleteAll = '/sys-server/violation/deleteAll',
  ReEnable = '/sys-server/violation/reEnable',
  ReEnableAll = '/sys-server/violation/reEnableAll',
  Get = '/sys-server/violation/get',
}

export function getOne(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ViolationModel>>(
    {
      url: Api.Get,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableAll(ids: string[], mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setDataArray(ids);
  const data = reqParam.getInstance();
  return defHttp.post<BaseListResult<ViolationModel>>(
    {
      url: Api.ReEnableAll,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnable(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ViolationModel>>(
    {
      url: Api.ReEnable,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteAll(ids: string[], mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setDataArray(ids);
  const data = reqParam.getInstance();
  return defHttp.delete<BaseListResult<ViolationModel>>(
    {
      url: Api.deleteAll,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteOne(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<ViolationModel>>(
    {
      url: Api.Delete,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function update(violation: ViolationModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(violation);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ViolationModel>>(
    {
      url: Api.Update,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addAll(violations: ViolationModel[], mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setDataArray(violations);
  const data = reqParam.getInstance();
  return defHttp.post<BaseListResult<ViolationModel>>(
    {
      url: Api.AddAll,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function add(violation: ViolationModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(violation);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ViolationModel>>(
    {
      url: Api.Add,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getByPage(
  condition: ViolationCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<ViolationModel>>(
    {
      url: Api.GetByPage,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
