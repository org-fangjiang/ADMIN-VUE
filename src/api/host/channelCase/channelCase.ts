import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult, BaseListResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam } from '/@/api/model/baseModel';
import { ChannelCaseCondition, ChannelCaseModel } from './model/channelCaseModel';

enum ApiChannelCase {
  GetChannelCases = '/nhouse-server/channelCase/getChannelCases', //必选参数：channelId 可选参数：contact, state
  GetChannelCase = '/nhouse-server/channelCase/getChannelCase',
  GetChannelCaseByProjectId = '/nhouse-server/channelCase/getChannelCaseByProjectId', //必选参数：projectId 可选参数：state(ChannelConstants.EFFECTIVE)
  GetChannelCaseByChannelId = '/nhouse-server/channelCase/getChannelCaseByChannelId', //必选参数：projectId, channelId 可选参数：state
  AddChannelCase = '/nhouse-server/channelCase/addChannelCase',
  UpdateChannelCase = '/nhouse-server/channelCase/updateChannelCase',
  DeleteChannelCase = '/nhouse-server/channelCase/deleteChannelCase',
  ReEnableChannelCase = '/nhouse-server/channelCase/reEnableChannelCase',
}

export function reEnableChannelCase(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ChannelCaseModel>>(
    {
      url: ApiChannelCase.ReEnableChannelCase,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteChannelCase(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<ChannelCaseModel>>(
    {
      url: ApiChannelCase.DeleteChannelCase,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateChannelCase(channelCase: ChannelCaseModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(channelCase);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ChannelCaseModel>>(
    {
      url: ApiChannelCase.UpdateChannelCase,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addChannelCase(channelCase: ChannelCaseModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(channelCase);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ChannelCaseModel>>(
    {
      url: ApiChannelCase.AddChannelCase,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getChannelCaseByChannelId(
  condition: ChannelCaseCondition,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  const data = reqParam.getInstance();
  return defHttp.post<BaseListResult<ChannelCaseModel>>(
    {
      url: ApiChannelCase.GetChannelCaseByChannelId,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getChannelCaseByProjectId(
  condition: ChannelCaseCondition,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  const data = reqParam.getInstance();
  return defHttp.post<BaseListResult<ChannelCaseModel>>(
    {
      url: ApiChannelCase.GetChannelCaseByProjectId,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getChannelCase(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ChannelCaseModel>>(
    {
      url: ApiChannelCase.GetChannelCase,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getChannelCases(
  condition: ChannelCaseCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<ChannelCaseModel>>(
    {
      url: ApiChannelCase.GetChannelCases,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
