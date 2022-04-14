import { UnitModel } from '../../host/manageUnit/model/manageUnitModel';
import { BaseResult, PageParam } from '../../model/baseModel';
import { UnitCondition } from './model/unitModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

enum oUnitApi {
  GetUnitList = 'ohouse-server/ounit/list',
  UnitById = 'ohouse-server/ounit',
  ReEnableUnit = 'ohouse-server/ounit/reEnable',
  UnitExist = 'ohouse-server/ounit/exist',
}

export function unitExist(buildId: string, number: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.get(
    {
      url: oUnitApi.UnitExist + '?buildId=' + buildId + '&number=' + number,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function changeState(id: string, state: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id, state: state });
  const data = reqParam.getInstance();
  return defHttp.patch<BaseResult<UnitModel>>(
    {
      url: oUnitApi.UnitById,
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
      url: oUnitApi.ReEnableUnit,
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
  return defHttp.delete<BaseResult<UnitModel>>(
    {
      url: oUnitApi.UnitById,
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
  return defHttp.put<BaseResult<UnitModel>>(
    {
      url: oUnitApi.UnitById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addUnit(unit: UnitModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(unit);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<UnitModel>>(
    {
      url: oUnitApi.UnitById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getUnitId(id: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.get(
    {
      url: oUnitApi.UnitById + '?id=' + id,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getUnitList(
  condition: UnitCondition,
  page: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post(
    {
      url: oUnitApi.GetUnitList,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
