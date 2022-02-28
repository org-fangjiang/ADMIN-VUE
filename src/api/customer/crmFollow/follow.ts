import { Moment } from 'moment';
import { BaseListResult, BaseResult } from '../../model/baseModel';
import { FollowModel } from './model/followModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

export enum FollowApi {
  AddMy = '/crm-server/follow/addMy',
  AddOther = '/crm-server/follow/addOther',
  Update = '/crm-server/follow/update',
  Get = '/crm-server/follow/get',
  GetMyFollow = '/crm-server/follow/getMyFollow',
  GetNextFollow = '/crm-server/follow/getNextFollow',
  GetNextFollowInDay = '/crm-server/follow/getNextFollowInDay',
}

export function getNextFollow(mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  const data = reqParam.getInstance();
  return defHttp.post(
    {
      url: FollowApi.GetNextFollow,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getNextFollowInDay(day: Moment, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ day: day });
  const data = reqParam.getInstance();
  return defHttp.post<BaseListResult<FollowModel>>(
    {
      url: FollowApi.GetNextFollowInDay,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addMy(follow: FollowModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(follow);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<FollowModel>>(
    {
      url: FollowApi.AddMy,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function AddOther(follow: FollowModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(follow);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<FollowModel>>(
    {
      url: FollowApi.AddOther,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateFollow(follow: FollowModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(follow);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<FollowModel>>(
    {
      url: FollowApi.Update,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getAll(customerId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ customerId: customerId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseListResult<FollowModel>>(
    {
      url: FollowApi.Get,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getMyFollow(customerId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ customerId: customerId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseListResult<FollowModel>>(
    {
      url: FollowApi.GetMyFollow,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
