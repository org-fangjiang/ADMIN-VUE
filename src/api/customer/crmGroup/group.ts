import { BasePageResult, BaseResult, CustomerResult, PageParam } from '../../model/baseModel';
import { GroupCondition, GroupModel } from './model/groupModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

export enum GroupApi {
  GetByGroup = '/crm-server/customer/getByGroup',
  AddGroup = '/crm-server/customer/addGroup',
  GetGroupById = '/crm-server/customer/getGroupById',
}

export function getGroupById(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<CustomerResult<GroupModel>>(
    {
      url: GroupApi.GetGroupById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getByGroup(
  condition: GroupCondition,
  page: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<GroupModel>>(
    {
      url: GroupApi.GetByGroup,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addGroup(company: GroupModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(company);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<GroupModel>>(
    {
      url: GroupApi.AddGroup,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
