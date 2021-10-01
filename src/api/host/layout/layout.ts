import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam } from '/@/api/model/baseModel';
import { LayoutModel } from './model/layoutModel';

enum ApiLayout {
  GetLayoutList = 'nhouse-server/manageLayout/getLayoutList', //必选参数：projectId
  GetLayout = 'nhouse-server/manageLayout/getLayout', //
  AddLayout = 'nhouse-server/manageLayout/addLayout',
  UpdateLayout = 'nhouse-server/manageLayout/updateLayout',
  DeleteLayout = 'nhouse-server/manageLayout/deleteLayout',
  ReEnableLayout = 'nhouse-server/manageLayout/reEnableLayout',
}

export function getLayoutList(
  condition: LayoutModel,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<LayoutModel>>(
    {
      url: ApiLayout.GetLayoutList,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getLayout(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<LayoutModel>>(
    {
      url: ApiLayout.GetLayout,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addLayout(layout: LayoutModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(layout);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<LayoutModel>>(
    {
      url: ApiLayout.AddLayout,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateLayout(layout: LayoutModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(layout);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<LayoutModel>>(
    {
      url: ApiLayout.UpdateLayout,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteLayout(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<LayoutModel>>(
    {
      url: ApiLayout.DeleteLayout,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableLayout(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<LayoutModel>>(
    {
      url: ApiLayout.ReEnableLayout,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
