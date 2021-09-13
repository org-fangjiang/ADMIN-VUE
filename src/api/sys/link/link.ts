import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam, SortParam } from '/@/api/model/baseModel';
import { LinkCondition, LinkModel } from './model/linkModel';

enum Api {
  GetLinks = '/sys-server/manageLinks/getLinks',
  AddLinks = '/sys-server/manageLinks/addLinks',
  UpdateLinks = '/sys-server/manageLinks/updateLinks',
  DeleteLinks = '/sys-server/manageLinks/deleteLinks',
  ReEnableLinks = '/sys-server/manageLinks/reEnableLinks',
}

export function reEnableLinks(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({
    id,
  });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<LinkModel>>(
    {
      url: Api.ReEnableLinks,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteLinks(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({
    id,
  });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<LinkModel>>(
    {
      url: Api.DeleteLinks,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateLinks(link: LinkModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(link);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<LinkModel>>(
    {
      url: Api.UpdateLinks,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addLinks(link: LinkModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(link);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<LinkModel>>(
    {
      url: Api.AddLinks,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getLinks(
  condition: LinkCondition,
  page?: PageParam,
  sort?: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<LinkModel>>(
    {
      url: Api.GetLinks,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
