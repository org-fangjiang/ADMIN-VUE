// 字典接口
import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam, SortParam } from '/@/api/model/baseModel';
import {
  DetailByCondition,
  DictDetailModel,
  DictGroupModel,
  GroupByCondition,
} from './model/dictModel';

enum Api {
  GetSysDictGroups = '/sys-service/dictGroup/getSysDictGroups',
  GetSysDictGroup = '/sys-service/dictGroup/getSysDictGroup',
  AddSysDictGroup = '/sys-service/dictGroup/addSysDictGroup',
  UpdateSysDictGroup = '/sys-service/dictGroup/updateSysDictGroup',
  DeleteSysDictGroup = '/sys-service/dictGroup/deleteSysDictGroup',
  ReEnableSysDictGroup = '/sys-service/dictGroup/reEnableSysDictGroup',
  GetSysDictDetailsByArray = '/sys-service/dictDetail/getSysDictDetailsByArray',
  GetSysDictDetails = '/sys-service/dictDetail/getSysDictDetails',
  GetSysDictDetail = '/sys-service/dictDetail/getSysDictDetail',
  AddSysDictDetail = '/sys-service/dictDetail/addSysDictDetail',
  UpdateSysDictDetail = '/sys-service/dictDetail/updateSysDictDetail',
  DeleteSysDictDetail = '/sys-service/dictDetail/deleteSysDictDetail',
  ReEnableSysDictDetail = '/sys-service/dictDetail/reEnableSysDictDetail',
}

export function getSysDictGroups(
  condition: GroupByCondition,
  page?: PageParam,
  sort?: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<DictGroupModel>>(
    {
      url: Api.GetSysDictGroups,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function GetSysDictGroup(condition: GroupByCondition, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<DictGroupModel>>(
    {
      url: Api.GetSysDictGroup,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addSysDictGroup(dictGroupModel: DictGroupModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(dictGroupModel);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<DictGroupModel>>(
    {
      url: Api.AddSysDictGroup,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function UpdateSysDictGroup(
  dictGroupModel: DictGroupModel,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(dictGroupModel);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<DictGroupModel>>(
    {
      url: Api.UpdateSysDictGroup,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteSysDictGroup(
  dictGroupModel: DictGroupModel,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(dictGroupModel);
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<DictGroupModel>>(
    {
      url: Api.DeleteSysDictGroup,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableSysDictGroup(
  dictGroupModel: DictGroupModel,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(dictGroupModel);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<DictGroupModel>>(
    {
      url: Api.ReEnableSysDictGroup,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
//////////////////
// 分组下字典详情
//////////////////
export function GetSysDictDetailsByArray(ids: string[], mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ ids });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<DictDetailModel>>(
    {
      url: Api.GetSysDictDetailsByArray,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getSysDictDetails(
  condition: GroupByCondition,
  page?: PageParam,
  sort?: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<DictDetailModel>>(
    {
      url: Api.GetSysDictDetails,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getSysDictDetail(condition: DetailByCondition, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<DictDetailModel>>(
    {
      url: Api.GetSysDictDetail,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addSysDictDetail(
  dictDetailModel: DictDetailModel,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(dictDetailModel);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<DictDetailModel>>(
    {
      url: Api.AddSysDictDetail,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function UpdateSysDictDetail(
  dictDetailModel: DictDetailModel,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(dictDetailModel);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<DictDetailModel>>(
    {
      url: Api.UpdateSysDictDetail,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteSysDictDetail(
  dictDetailModel: DictDetailModel,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(dictDetailModel);
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<DictDetailModel>>(
    {
      url: Api.DeleteSysDictDetail,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableSysDictDetail(
  dictDetailModel: DictDetailModel,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(dictDetailModel);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<DictDetailModel>>(
    {
      url: Api.ReEnableSysDictDetail,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
