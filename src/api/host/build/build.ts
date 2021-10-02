import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam } from '/@/api/model/baseModel';
import { BuildModel } from './model/buildModel';
import { BuildLayoutBean } from './model/BuildLayoutEntity';

enum ApiBuild {
  GetBuild = 'nhouse-server/manageBuild/getBuild',
  GetBuilds = 'nhouse-server/manageBuild/getBuilds',
  AddBuild = 'nhouse-server/manageBuild/addBuild',
  UpdateBuild = 'nhouse-server/manageBuild/updateBuild',
  DeleteBuild = 'nhouse-server/manageBuild/deleteBuild',
  ReEnableBuild = 'nhouse-server/manageBuild/reEnableBuild',
  RemoveBuild = 'nhouse-server/manageBuild/removeBuild',
  AddBuildLayout = 'nhouse-server/manageBuild/addBuildLayout',
  DeleteBuildLayout = 'nhouse-server/manageBuild/deleteBuildLayout',
}

export function deleteBuildLayout(
  id: string,
  hBuildLayoutsById: BuildLayoutBean[],
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData({ id, hBuildLayoutsById });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<BuildModel>>(
    {
      url: ApiBuild.DeleteBuildLayout,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
export function addBuildLayout(
  id: string,
  hBuildLayoutsById: BuildLayoutBean[],
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData({ id, hBuildLayoutsById });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<BuildModel>>(
    {
      url: ApiBuild.AddBuildLayout,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

// export function addBuildLayout(condition: BuildCondition, mode: ErrorMessageMode = 'modal') {
//   const reqParam = new RequestParam();
//   reqParam.setData(condition);
//   const data = reqParam.getInstance();
//   return defHttp.post<BaseResult<BuildModel>>(
//     {
//       url: ApiBuild.AddBuildLayout,
//       data,
//     },
//     {
//       errorMessageMode: mode,
//     }
//   );
// }

export function removeBuild(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<BuildModel>>(
    {
      url: ApiBuild.RemoveBuild,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableBuild(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<BuildModel>>(
    {
      url: ApiBuild.ReEnableBuild,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteBuild(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<BuildModel>>(
    {
      url: ApiBuild.DeleteBuild,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateBuild(build: BuildModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(build);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<BuildModel>>(
    {
      url: ApiBuild.UpdateBuild,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addBuild(build: BuildModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(build);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<BuildModel>>(
    {
      url: ApiBuild.AddBuild,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getBuild(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<BuildModel>>(
    {
      url: ApiBuild.GetBuild,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getBuilds(
  condition: BuildModel,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<BuildModel>>(
    {
      url: ApiBuild.GetBuilds,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
