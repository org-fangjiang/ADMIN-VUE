import { BasePageResult, BaseResult, CustomerResult, PageParam } from '../../model/baseModel';
import { CityCondition, CityModel } from './model/CityModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

export enum CityApi {
  GetByCity = '/crm-server/customer/getByCity',
  AddCity = '/crm-server/customer/addCity',
  InSystem = '/crm-server/customer/inSystem',
  GetCityById = '/crm-server/customer/getCityById',
  AllSale = '/crm-server/customer/allSale',
  AddSale = '/crm-server/customer/addSale', // id: string, shareId: string
  Distribute = '/crm-server/customer/distribute', //from cusId saleId
  DistributeBatch = '/crm-server/customer/distributeBatch',
}

export function distributeBatch(
  fromType: string,
  customerId: string[],
  saleId: string,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData({ from: fromType, customerId: customerId, saleId: saleId });
  const data = reqParam.getInstance();
  return defHttp.post(
    {
      url: CityApi.DistributeBatch,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function distribute(
  fromType: string,
  customerId: string,
  saleId: string,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData({ from: fromType, customerId: customerId, saleId: saleId });
  const data = reqParam.getInstance();
  return defHttp.post(
    {
      url: CityApi.Distribute,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addSale(id: string, shareId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id, shareId: shareId });
  const data = reqParam.getInstance();
  return defHttp.post(
    {
      url: CityApi.AddSale,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function allSale(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post(
    {
      url: CityApi.AllSale,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getCityById(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<CustomerResult<CityModel>>(
    {
      url: CityApi.GetCityById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function inSystem(mobile: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ mobile: mobile });
  const data = reqParam.getInstance();
  return defHttp.post(
    {
      url: CityApi.InSystem,
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
      url: CityApi.AddCity,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getByCity(
  condition: CityCondition,
  page: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<CityModel>>(
    {
      url: CityApi.GetByCity,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
