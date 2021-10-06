import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam } from '/@/api/model/baseModel';
import { DynamicNewsCondition, DynamicNewsModel } from './model/dynamicNewsModel';

enum ApiDynamicNews {
  GetDynamicNews = 'nhouse-server/manageDynamicNews/getDynamicNews', //projectId必填
  GetDynamicNew = 'nhouse-server/manageDynamicNews/getDynamicNew',
  AddDynamicNew = 'nhouse-server/manageDynamicNews/addDynamicNew',
  UpdateDynamicNew = 'nhouse-server/manageDynamicNews/updateDynamicNew',
  DeleteDynamicNew = 'nhouse-server/manageDynamicNews/deleteDynamicNew',
  ReEnableDynamicNew = 'nhouse-server/manageDynamicNews/reEnableDynamicNew',
}

export function getDynamicNew(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<DynamicNewsModel>>(
    {
      url: ApiDynamicNews.GetDynamicNew,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableDynamicNew(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<DynamicNewsModel>>(
    {
      url: ApiDynamicNews.ReEnableDynamicNew,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteDynamicNew(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<DynamicNewsModel>>(
    {
      url: ApiDynamicNews.DeleteDynamicNew,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateDynamicNew(dynamicNews: DynamicNewsModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(dynamicNews);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<DynamicNewsModel>>(
    {
      url: ApiDynamicNews.UpdateDynamicNew,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addDynamicNew(dynamicNews: DynamicNewsModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(dynamicNews);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<DynamicNewsModel>>(
    {
      url: ApiDynamicNews.AddDynamicNew,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getDynamicNews(
  condition: DynamicNewsCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<DynamicNewsModel>>(
    {
      url: ApiDynamicNews.GetDynamicNews,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
