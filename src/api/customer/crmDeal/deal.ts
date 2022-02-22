import { BasePageResult, BaseResult, PageParam, SortParam } from '../../model/baseModel';
import { DealCondition, DealModel } from './model/DealModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

export enum DealApi {
  GetByDeal = '/crm-server/customer/getByDeal',
  GetDealById = '/crm-server/customer/getDealById',
}

export function getDealById(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<DealModel>>(
    {
      url: DealApi.GetDealById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getByDeal(
  condition: DealCondition,
  page: PageParam,
  sort: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<DealModel>>(
    {
      url: DealApi.GetByDeal,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
