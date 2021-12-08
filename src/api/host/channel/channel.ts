import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam } from '/@/api/model/baseModel';
import { ChannelCondition, ChannelModel } from './model/channelModel';

enum ApiChannel {
  GetChannels = '/nhouse-server/channel/getChannels',
  GetChannel = '/nhouse-server/channel/getChannel',
  AddChannel = '/nhouse-server/channel/addChannel',
  UpdateChannel = '/nhouse-server/channel/updateChannel',
  DeleteChannel = '/nhouse-server/channel/deleteChannel',
  ReEnableChannel = '/nhouse-server/channel/reEnableChannel',
}

export function reEnableChannel(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ChannelModel>>(
    {
      url: ApiChannel.ReEnableChannel,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteChannel(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<ChannelModel>>(
    {
      url: ApiChannel.DeleteChannel,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateChannel(channel: ChannelModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(channel);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ChannelModel>>(
    {
      url: ApiChannel.UpdateChannel,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addChannel(channel: ChannelModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(channel);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ChannelModel>>(
    {
      url: ApiChannel.AddChannel,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getChannel(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ChannelModel>>(
    {
      url: ApiChannel.GetChannel,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getChannels(
  condition: ChannelCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<ChannelModel>>(
    {
      url: ApiChannel.GetChannels,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
