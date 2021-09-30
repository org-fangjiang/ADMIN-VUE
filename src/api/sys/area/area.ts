// 区级接口
import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BaseListResult, BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam, SortParam } from '/@/api/model/baseModel';
import { AreaByCondition, AreaModel } from './model/areaModel';

enum Api {
  GetAreas = '/sys-server/area/getAreasByCityId',
  GetAllAreas = '/sys-server/area/getAllAreasByCityId',
  GetArea = '/sys-server/area/getAreaById',
  AddArea = '/sys-server/area/addArea',
  UpdateArea = '/sys-server/area/updateArea',
  DeleteArea = '/sys-server/area/deleteArea',
  ReEnableArea = '/sys-server/area/reEnableArea',
}

export function getAreas(
  condition: AreaByCondition,
  page?: PageParam,
  sort?: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<AreaModel>>(
    {
      url: Api.GetAreas,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getAllAreas(condition: AreaByCondition, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  const data = reqParam.getInstance();
  return defHttp.post<BaseListResult<AreaModel>>(
    {
      url: Api.GetAllAreas,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getArea(area: AreaModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(area);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<AreaModel>>(
    {
      url: Api.GetArea,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addArea(area: AreaModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(area);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<AreaModel>>(
    {
      url: Api.AddArea,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateArea(area: AreaModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(area);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<AreaModel>>(
    {
      url: Api.UpdateArea,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteArea(area: AreaModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(area);
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<AreaModel>>(
    {
      url: Api.DeleteArea,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableArea(area: AreaModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(area);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<AreaModel>>(
    {
      url: Api.ReEnableArea,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
