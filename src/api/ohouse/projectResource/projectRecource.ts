import { BasePageResult, BaseResult, PageParam } from '../../model/baseModel';
import { ProjectResourceCondition, ProjectResourceModel } from './model/projectResourceModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

enum ProjectResourceApi {
  GetResources = 'ohouse-server/oprojectr/list',
  GetResourceId = 'ohouse-server/oprojectr',
  ReEnableResource = 'ohouse-server/oprojectr/reEnable',
  ReEnable = 'ohouse-server/oprojectr/reEnable',
}
export function deleteOResource(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<ProjectResourceModel>>(
    {
      url: ProjectResourceApi.GetResourceId,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableOResource(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ProjectResourceModel>>(
    {
      url: ProjectResourceApi.ReEnable,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateOResource(resource: ProjectResourceModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(resource);
  const data = reqParam.getInstance();
  return defHttp.put<BaseResult<ProjectResourceModel>>(
    {
      url: ProjectResourceApi.GetResourceId,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addOResource(resource: ProjectResourceModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(resource);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ProjectResourceModel>>(
    {
      url: ProjectResourceApi.GetResourceId,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getResources(
  condition: ProjectResourceCondition,
  page: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<ProjectResourceModel>>(
    {
      url: ProjectResourceApi.GetResources,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function GetResourceId(id: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.get<BaseResult<ProjectResourceModel>>(
    {
      url: ProjectResourceApi.GetResourceId + '?id=' + id,
    },
    {
      errorMessageMode: mode,
    }
  );
}
