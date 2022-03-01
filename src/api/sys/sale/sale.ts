import { BaseResult } from '../../model/baseModel';
import { SaleModel } from './model/saleModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

enum SaleApi {
  GetSale = 'crm-server/saleInfo/get',
  UpdateSale = 'crm-server/saleInfo/update',
  SaveSale = 'crm-server/saleInfo/save',
}

export function getSale(saleId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ saleId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<SaleModel>>(
    {
      url: SaleApi.GetSale,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateSale(sale: SaleModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(sale);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<SaleModel>>(
    {
      url: SaleApi.UpdateSale,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function saveSale(sale: SaleModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(sale);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<SaleModel>>(
    {
      url: SaleApi.SaveSale,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
