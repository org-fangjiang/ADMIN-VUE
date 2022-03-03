import { BasePageResult, BaseResult, PageParam } from '../../model/baseModel';
import { LookCondition, LookModel } from './model/lookModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

enum LookApi {
  AddLook = '/crm-server/look/addLook',
  ExamineLook = '/crm-server/look/examineLook',
  GetMyLook = '/crm-server/look/getMyLook',
  GetMemberLook = '/crm-server/look/getMemberLook',
  GetGroupLook = '/crm-server/look/getGroupLook',
  GetEveryGroupLook = '/crm-server/look/getEveryGroupLook',
  GetCompanyLook = '/crm-server/look/getCompanyLook',
  GetProjectLook = '/crm-server/look/getProjectLook',
  GetResidentLook = '/crm-server/look/getResidentLook',
}

export function getResidentLook(
  condition: LookCondition,
  page: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<LookModel>>(
    {
      url: LookApi.GetResidentLook,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getProjectLook(
  condition: LookCondition,
  page: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<LookModel>>(
    {
      url: LookApi.GetProjectLook,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getCompanyLook(
  condition: LookCondition,
  page: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<LookModel>>(
    {
      url: LookApi.GetCompanyLook,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getEveryGroupLook(
  condition: LookCondition,
  page: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<LookModel>>(
    {
      url: LookApi.GetEveryGroupLook,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getGroupLook(
  condition: LookCondition,
  page: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<LookModel>>(
    {
      url: LookApi.GetGroupLook,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getMemberLook(
  condition: LookCondition,
  page: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<LookModel>>(
    {
      url: LookApi.GetMemberLook,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getMyLook(
  condition: LookCondition,
  page: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<LookModel>>(
    {
      url: LookApi.GetMyLook,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addLook(look: LookModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(look);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<LookModel>>(
    {
      url: LookApi.AddLook,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function examineLook(id: string, state: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id, state: state });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<LookModel>>(
    {
      url: LookApi.ExamineLook,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
