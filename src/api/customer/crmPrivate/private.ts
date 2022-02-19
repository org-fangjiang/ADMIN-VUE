import {
  BasePageResult,
  BaseResult,
  CustomerResult,
  PageParam,
  SortParam,
} from '../../model/baseModel';
import { PrivateCondition, PrivateModel } from './model/PrivateModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

export enum PrivateApi {
  GetMy = '/crm-server/customer/getMy',
  AddPrivate = '/crm-server/customer/addPrivate',
  GetMyById = '/crm-server/customer/getMyById',
}
export function getMyById(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<CustomerResult<PrivateModel>>(
    {
      url: PrivateApi.GetMyById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getByPrivate(
  condition: PrivateCondition,
  page: PageParam,
  sort?: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<PrivateModel>>(
    {
      url: PrivateApi.GetMy,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addPrivate(company: PrivateModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(company);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<PrivateModel>>(
    {
      url: PrivateApi.AddPrivate,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
