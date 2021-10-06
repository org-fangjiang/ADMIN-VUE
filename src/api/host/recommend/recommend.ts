import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult, PageParam } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { RecommendCondition, RecommendModel } from './model/recommendModel';

enum ApiRecommend {
  Add = 'nhouse-server/manageRecommendProject/add',
  Delete = 'nhouse-server/manageRecommendProject/delete',
  ReEnable = 'nhouse-server/manageRecommendProject/reEnable',
  GetByPage = 'nhouse-server/manageRecommendProject/getByPage',
}

export function getByPage(
  condition: RecommendCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<RecommendModel>>(
    {
      url: ApiRecommend.GetByPage,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableRecommend(projectId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ projectId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<RecommendModel>>(
    {
      url: ApiRecommend.ReEnable,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteRecommend(projectId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ projectId });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<RecommendModel>>(
    {
      url: ApiRecommend.Delete,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addRecommend(projectId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ projectId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<RecommendModel>>(
    {
      url: ApiRecommend.Add,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
