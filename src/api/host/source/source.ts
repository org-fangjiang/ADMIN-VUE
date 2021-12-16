import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BaseListResult, BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam } from '/@/api/model/baseModel';
import { SourceCondition, SourceModel } from './model/sourceModel';
import { ContentTypeEnum } from '/@/enums/httpEnum';

export enum ApiSource {
  GetResourcesList = '/nhouse-server/manageResource/getResourcesList', //必选参数：projectId
  GetResources = '/nhouse-server/manageResource/getResources', //必选参数：projectId  分页
  GetResource = '/nhouse-server/resource/getResource', //id
  AddResource = '/nhouse-server/manageResource/addResource', //必选参数：address, sort, projectId
  UpdateResource = '/nhouse-server/manageResource/updateResource',
  DeleteResource = '/nhouse-server/manageResource/deleteResource',
  ReEnableResource = '/nhouse-server/manageResource/reEnableResource',
  SetSandImg = '/nhouse-server/manageResource/setSandImg', //沙盘图，必选参数：resourceId, projectId
  SetFirstImg = '/nhouse-server/manageResource/setFirstImg', //项目首图，
  Upload = '/api/sys-server/file/upload',
  UploadNews = '/api/sys-server/file/uploadNews',
  UploadBanner = '/api/sys-server/file/uploadBanner',
  UpdateVideo = '/api/sys-server/file/updateVideo',
  UpdateVideoApi = '/sys-server/file/updateVideo',
}
export function uploadVideo(formData, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: ApiSource.UpdateVideoApi,
      params: formData,
      headers: { 'Content-Type': ContentTypeEnum.FORM_DATA },
      timeout: 300 * 1000,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getResourcesList(condition: SourceCondition, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  const data = reqParam.getInstance();
  return defHttp.post<BaseListResult<SourceModel>>(
    {
      url: ApiSource.GetResourcesList,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getResources(
  condition: SourceCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<SourceModel>>(
    {
      url: ApiSource.GetResources,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getResource(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<SourceModel>>(
    {
      url: ApiSource.GetResource,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addResource(source: SourceModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(source);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<SourceModel>>(
    {
      url: ApiSource.AddResource,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateResource(source: SourceModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(source);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<SourceModel>>(
    {
      url: ApiSource.UpdateResource,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteResource(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<SourceModel>>(
    {
      url: ApiSource.DeleteResource,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableResource(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<SourceModel>>(
    {
      url: ApiSource.ReEnableResource,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function setSandImg(id: string, projectId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ resourceId: id, projectId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<SourceModel>>(
    {
      url: ApiSource.SetSandImg,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function setFirstImg(id: string, projectId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ resourceId: id, projectId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<SourceModel>>(
    {
      url: ApiSource.SetFirstImg,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
