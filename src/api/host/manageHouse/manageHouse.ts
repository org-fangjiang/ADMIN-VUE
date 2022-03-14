import { BaseListResult, BaseResult } from '../../model/baseModel';
import { ManageHouseModel } from './model/manageHouseModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

enum ManageHouseApi {
  Add = 'nhouse-server/manageHouse/add',
  Update = 'nhouse-server/manageHouse/update',
  Delete = 'nhouse-server/manageHouse/delete',
  reEnable = 'nhouse-server/manageHouse/reEnable',
  Get = 'nhouse-server/manageHouse/get',
  GetByBuildId = 'nhouse-server/manageHouse/getByBuildId',
}

export function addManage(manage: ManageHouseModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(manage);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ManageHouseModel>>(
    {
      url: ManageHouseApi.Add,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateManage(manage: ManageHouseModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(manage);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ManageHouseModel>>(
    {
      url: ManageHouseApi.Update,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteMange(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ManageHouseModel>>(
    {
      url: ManageHouseApi.Delete,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableManage(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ManageHouseModel>>(
    {
      url: ManageHouseApi.reEnable,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getManageHouse(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ManageHouseModel>>(
    {
      url: ManageHouseApi.Get,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getByUnitId(unitId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ unitId: unitId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseListResult<ManageHouseModel>>(
    {
      url: ManageHouseApi.GetByBuildId,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
