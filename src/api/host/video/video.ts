import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam } from '/@/api/model/baseModel';
import { VideoCondition, VideoModel } from './model/videoModel';

enum ApiVideo {
  AddVideo = '/nhouse-server/manageVideo/add',
  UpdateVideo = '/nhouse-server/manageVideo/update',
  DeleteVideo = '/nhouse-server/manageVideo/delete',
  ReEnableVideo = '/nhouse-server/manageVideo/reEnable',
  SetTop = '/nhouse-server/manageVideo/setTop',
  Cancel = '/nhouse-server/manageVideo/cancel',
  GetById = '/nhouse-server/manageVideo/getById',
  GetByPage = '/nhouse-server/manageVideo/getByPage',
}

export function GetByPage(
  condition: VideoCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<VideoModel>>(
    {
      url: ApiVideo.GetByPage,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getById(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<VideoModel>>(
    {
      url: ApiVideo.GetById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function cancel(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<VideoModel>>(
    {
      url: ApiVideo.Cancel,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function setTop(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<VideoModel>>(
    {
      url: ApiVideo.SetTop,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableVideo(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<VideoModel>>(
    {
      url: ApiVideo.ReEnableVideo,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteVideo(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<VideoModel>>(
    {
      url: ApiVideo.DeleteVideo,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addVideo(video: VideoModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(video);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<VideoModel>>(
    {
      url: ApiVideo.AddVideo,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateVideo(video: VideoModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(video);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<VideoModel>>(
    {
      url: ApiVideo.UpdateVideo,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
