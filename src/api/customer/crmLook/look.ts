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
  GetResidentLookById = '/crm-server/look/getResidentLookById',
  GetMyLookById = '/crm-server/look/getMyLookById',
  GetMemberLookById = '/crm-server/look/getMemberLookById',
  GetGroupLookById = '/crm-server/look/getGroupLookById',
  GetEveryGroupLookById = '/crm-server/look/getEveryGroupLookById',
  GetCompanyLookById = '/crm-server/look/getCompanyLookById',
  GetProjectLookById = '/crm-server/look/getProjectLookById',
}

export function getProjectLookById(lookId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ lookId: lookId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<LookModel>>(
    {
      url: LookApi.GetProjectLookById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getCompanyLookById(lookId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ lookId: lookId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<LookModel>>(
    {
      url: LookApi.GetCompanyLookById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getEveryGroupLookById(lookId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ lookId: lookId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<LookModel>>(
    {
      url: LookApi.GetEveryGroupLookById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getGroupLookById(lookId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ lookId: lookId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<LookModel>>(
    {
      url: LookApi.GetGroupLookById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getMemberLookById(lookId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ lookId: lookId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<LookModel>>(
    {
      url: LookApi.GetMemberLookById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getMyLookById(lookId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ lookId: lookId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<LookModel>>(
    {
      url: LookApi.GetMyLookById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getResidentLookById(lookId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ lookId: lookId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<LookModel>>(
    {
      url: LookApi.GetResidentLookById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
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
