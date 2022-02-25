import { BaseResult } from '../../model/baseModel';
import { ReportRuleModel } from './model/reportRuleModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

enum ReportApi {
  GetRule = 'crm-server/reportRule/get',
  AddRule = 'crm-server/reportRule/add',
  UpdateRule = 'crm-server/reportRule/update',
}

export function getRule(id: string, mode: ErrorMessageMode = 'none') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ReportRuleModel>>(
    {
      url: ReportApi.GetRule,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addRule(rule: ReportRuleModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(rule);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ReportRuleModel>>(
    {
      url: ReportApi.AddRule,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateRule(rule: ReportRuleModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(rule);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ReportRuleModel>>(
    {
      url: ReportApi.UpdateRule,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
