import { BaseListResult } from '../../model/baseModel';
import { SaleProjectModel } from './model/crmSaleModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

enum ApiResident {
  Add = 'crm-server/saleProject/add',
  Delete = 'crm-server/saleProject/delete',
  GetByProject = 'crm-server/saleProject/getByProject',
}
// 销售驻守楼盘
export function add(projectId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ projectId });
  const data = reqParam.getInstance();
  return defHttp.post(
    {
      url: ApiResident.Add,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deletePro(projectId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ projectId });
  const data = reqParam.getInstance();
  return defHttp.post(
    {
      url: ApiResident.Delete,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getByProject(projectId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ projectId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseListResult<SaleProjectModel>>(
    {
      url: ApiResident.GetByProject,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
