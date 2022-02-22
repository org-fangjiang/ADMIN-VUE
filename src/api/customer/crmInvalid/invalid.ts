import { BasePageResult, BaseResult, PageParam, SortParam } from '../../model/baseModel';
import { InvalidCondition, InvalidModel } from './model/InvalidModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

export enum InvalidApi {
  GetInvalidById = '/crm-server/customer/getInvalidById',
  GetByInvalid = '/crm-server/customer/getByInvalid',
}

export function getInvalidById(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<InvalidModel>>(
    {
      url: InvalidApi.GetByInvalid,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getByInvalid(
  condition: InvalidCondition,
  page: PageParam,
  sort: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<InvalidModel>>(
    {
      url: InvalidApi.GetByInvalid,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
