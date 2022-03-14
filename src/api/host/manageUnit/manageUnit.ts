import { BaseListResult, BaseResult } from '../../model/baseModel';
import { UnitModel } from './model/manageUnitModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

enum ManageUnitApi {
  Add = 'nhouse-server/manageUnit/add',
  Update = 'nhouse-server/manageUnit/update',
  Delete = 'nhouse-server/manageUnit/delete',
  reEnable = 'nhouse-server/manageUnit/reEnable',
  Get = 'nhouse-server/manageUnit/get',
  GetByBuildId = 'nhouse-server/manageUnit/getByBuildId',
}

export function addUnit(unit: UnitModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(unit);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<UnitModel>>(
    {
      url: ManageUnitApi.Add,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateUnit(unit: UnitModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(unit);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<UnitModel>>(
    {
      url: ManageUnitApi.Update,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteUnit(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<UnitModel>>(
    {
      url: ManageUnitApi.Delete,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableUnit(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<UnitModel>>(
    {
      url: ManageUnitApi.reEnable,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getUnit(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<UnitModel>>(
    {
      url: ManageUnitApi.Get,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getByBuildId(buildId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ buildId: buildId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseListResult<UnitModel>>(
    {
      url: ManageUnitApi.GetByBuildId,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
