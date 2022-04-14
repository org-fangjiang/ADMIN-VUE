import { BasePageResult, BaseResult, PageParam } from '../../model/baseModel';
import { oBuildCondition, oBuildModel } from './model/oBuildModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

enum oBuildApi {
  BuildList = 'ohouse-server/obuild/list',
  BuildId = 'ohouse-server/obuild',
  EnAbleBuild = 'ohouse-server/obuild/reEnable',
  Exist = 'ohouse-server/obuild/exist',
}

export function changeState(id: string, state: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id, state: state });
  const data = reqParam.getInstance();
  return defHttp.patch(
    {
      url: oBuildApi.BuildId,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function existBuild(projectId: string, number: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.get(
    {
      url: oBuildApi.Exist + '?projectId=' + projectId + '&number=' + number,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function buildById(id: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.get(
    {
      url: oBuildApi.BuildId + '?id=' + id,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getBuildList(
  condition: oBuildCondition,
  page: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<oBuildModel>>(
    {
      url: oBuildApi.BuildList,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addBuild(build: oBuildModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(build);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<oBuildModel>>(
    {
      url: oBuildApi.BuildId,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateBuild(build: oBuildModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(build);
  const data = reqParam.getInstance();
  return defHttp.put<BaseResult<oBuildModel>>(
    {
      url: oBuildApi.BuildId,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteBuild(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<oBuildModel>>(
    {
      url: oBuildApi.BuildId,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableBuild(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<oBuildModel>>(
    {
      url: oBuildApi.EnAbleBuild,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
