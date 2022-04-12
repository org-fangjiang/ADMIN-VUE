import { BasePageResult, BaseResult, PageParam, SortParam } from '../../model/baseModel';
import { OProjectCondition, OProjectModel } from './model/projectModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

const _sortParam = ['orderNum', 'createTime', 'lookTime', 'price', 'openTime', 'payTime'];

enum oHouseApi {
  List = 'ohouse-server/oproject/list',
  ById = 'ohouse-server/oproject',
  Add = 'ohouse-server/oproject',
  Exist = 'ohouse-server/oproject/exist',
}

export function exist(cityId: string, name: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.get(
    {
      url: oHouseApi.Exist + '?cityId=' + cityId + '&name=' + name,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function projectList(
  condition: OProjectCondition,
  page: PageParam,
  sort: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<OProjectModel>>(
    {
      url: oHouseApi.List,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getOHouse(id: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.get(
    {
      url: oHouseApi.ById + '?id=' + id,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addOHouse(oHouse: OProjectModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(oHouse);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<OProjectModel>>(
    {
      url: oHouseApi.Add,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateOHouse(oHouse: OProjectModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(oHouse);
  const data = reqParam.getInstance();
  return defHttp.put<BaseResult<OProjectModel>>(
    {
      url: oHouseApi.Add,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteOHouse(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<OProjectModel>>(
    {
      url: oHouseApi.Add,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableOHouse(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<OProjectModel>>(
    {
      url: oHouseApi.Add,
      data,
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
  return defHttp.patch<BaseResult<OProjectModel>>(
    {
      url: oHouseApi.Add,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
