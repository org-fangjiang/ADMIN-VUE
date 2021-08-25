// 省级接口
import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam, SortParam } from '/@/api/model/baseModel';
import {
  ProvinceByCondition,
  ProvinceModel,
  ProvinceModelWithCityModel,
} from './model/provinceModel';

enum Api {
  GetProvinces = '/sys-server/province/getProvinces',
  GetProvince = '/sys-server/province/getProvinceById',
  GetProvinceWithAllCities = '/sys-server/province/getProvinceWithAllCities',
  AddProvince = '/sys-server/province/addProvince',
  UpdateProvince = '/sys-server/province/updateProvince',
  DeleteProvince = '/sys-server/province/deleteProvince',
  ReEnableProvince = '/sys-server/province/reEnableProvince',
}

export function getProvinces(
  condition: ProvinceByCondition,
  page?: PageParam,
  sort?: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<ProvinceModel>>(
    {
      url: Api.GetProvinces,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getProvince(province: ProvinceModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(province);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ProvinceModel>>(
    {
      url: Api.GetProvince,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function GetProvinceWithAllCities(
  province: ProvinceModel,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(province);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ProvinceModelWithCityModel>>(
    {
      url: Api.GetProvinceWithAllCities,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addProvince(province: ProvinceModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(province);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ProvinceModel>>(
    {
      url: Api.AddProvince,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateProvince(province: ProvinceModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(province);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ProvinceModel>>(
    {
      url: Api.UpdateProvince,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteProvince(province: ProvinceModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(province);
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<ProvinceModel>>(
    {
      url: Api.DeleteProvince,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableProvince(province: ProvinceModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(province);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ProvinceModel>>(
    {
      url: Api.ReEnableProvince,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
