import { BasePageResult, BaseResult, PageParam } from '../../model/baseModel';
import { TimeRuleCondition, TimeRuleModel } from './model/timeRuleModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

enum TimeRuleApi {
  GetByPage = '/sys-server/sysTimeRule/getByPage',
  Get = '/sys-server/sysTimeRule/get',
  Add = '/sys-server/sysTimeRule/add',
  Update = '/sys-server/sysTimeRule/update',
}

export function getByPage(page?: PageParam, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<TimeRuleModel>>(
    {
      url: TimeRuleApi.GetByPage,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function get(condition: TimeRuleCondition, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<TimeRuleModel>>(
    {
      url: TimeRuleApi.Get,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function add(timeRule: TimeRuleModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(timeRule);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<TimeRuleModel>>(
    {
      url: TimeRuleApi.Add,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function update(timeRule: TimeRuleModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(timeRule);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<TimeRuleModel>>(
    {
      url: TimeRuleApi.Update,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
