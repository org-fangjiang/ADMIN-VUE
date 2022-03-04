import { BaseListResult } from '../../model/baseModel';
import { ResidentModel } from './mdoel/residentModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

enum ResidentApi {
  GetProject = 'crm-server/residentInfo/getProject',
  AddProject = 'crm-server/residentInfo/addProject',
  AddProjectBatch = 'crm-server/residentInfo/addProjectBatch',
  DeleteProject = 'crm-server/residentInfo/deleteProject',
  DeleteProjectBatch = 'crm-server/residentInfo/deleteProjectBatch',
}

export function deleteProjectBatch(
  userId: string,
  projectId: string[],
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData({ userId, projectId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseListResult<ResidentModel>>(
    {
      url: ResidentApi.DeleteProjectBatch,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteProject(userId: string, projectId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ userId, projectId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseListResult<ResidentModel>>(
    {
      url: ResidentApi.DeleteProject,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addProjectBatch(
  userId: string,
  projectId: string[],
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData({ userId, projectId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseListResult<ResidentModel>>(
    {
      url: ResidentApi.AddProjectBatch,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addProject(userId: string, projectId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ userId, projectId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseListResult<ResidentModel>>(
    {
      url: ResidentApi.AddProject,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getProject(userId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ userId: userId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseListResult<ResidentModel>>(
    {
      url: ResidentApi.GetProject,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
