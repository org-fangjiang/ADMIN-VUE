// 市级接口
import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam, SortParam } from '/@/api/model/baseModel';
import { CityByCondition, CityModel, CityWithAreaModel } from './model/cityModel';

enum Api {
  GetCities = '/sys-server/city/getCitiesByProvinceId',
  GetCity = '/sys-server/city/getCityById',
  GetCityWithAllArea = '/sys-server/city/getCityWithAllAreas',
  AddCity = '/sys-server/city/addCity',
  UpdateCity = '/sys-server/city/updateCity',
  DeleteCity = '/sys-server/city/deleteCity',
  ReEnableCity = '/sys-server/city/reEnableCity',
}

export function getCities(
  condition: CityByCondition,
  page?: PageParam,
  sort?: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<CityModel>>(
    {
      url: Api.GetCities,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getCity(city: CityModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(city);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<CityModel>>(
    {
      url: Api.GetCities,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getCityWithAllArea(city: CityModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(city);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<CityWithAreaModel>>(
    {
      url: Api.GetCityWithAllArea,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addCity(city: CityModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(city);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<CityModel>>(
    {
      url: Api.AddCity,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateCity(city: CityModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(city);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<CityModel>>(
    {
      url: Api.UpdateCity,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteCity(city: CityModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(city);
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<CityModel>>(
    {
      url: Api.DeleteCity,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableCity(city: CityModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(city);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<CityModel>>(
    {
      url: Api.ReEnableCity,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
