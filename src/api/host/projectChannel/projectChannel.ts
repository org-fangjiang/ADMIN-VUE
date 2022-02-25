import { BaseResult } from '../../model/baseModel';
import { ChannelAndCase } from './model/projectChannelModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

enum ProjectChannel {
  GetProjectChannel = 'nhouse-server/manageProject/getProjectChannel', // project:search
  DelProjectChannelCase = 'nhouse-server/manageProject/delProjectChannelCase', //project:update
  DelProjectChannel = 'nhouse-server/manageProject/delProjectChannel',
  SetProjectChannelCase = 'nhouse-server/manageProject/setProjectChannelCase',
  SetProjectChannel = 'nhouse-server/manageProject/setProjectChannel',
}

export function getProjectChannel(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ChannelAndCase>>(
    {
      url: ProjectChannel.GetProjectChannel,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function delProjectChannelCase(
  id: string,
  channelCaseId: string,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id, channelCaseId: channelCaseId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ChannelAndCase>>(
    {
      url: ProjectChannel.DelProjectChannelCase,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function delProjectChannel(id: string, channelId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id, channelId: channelId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ChannelAndCase>>(
    {
      url: ProjectChannel.DelProjectChannel,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function setProjectChannelCase(
  id: string,
  channelCaseId: string,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id, channelCaseId: channelCaseId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ChannelAndCase>>(
    {
      url: ProjectChannel.SetProjectChannelCase,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function setProjectChannel(id: string, channelId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id, channelId: channelId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ChannelAndCase>>(
    {
      url: ProjectChannel.SetProjectChannel,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
