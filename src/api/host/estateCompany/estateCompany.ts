import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam } from '/@/api/model/baseModel';
import { EstateCompanyCondition, EstateCompanyModel } from './model/estateCompanyModel';

enum ApiEstateCompany {
  GetEstateCompanies = 'nhouse-server/manageEstateCompany/getEstateCompanies',
  GetEstateCompany = 'nhouse-server/manageEstateCompany/getEstateCompany',
  AddEstateCompany = 'nhouse-server/manageEstateCompany/addEstateCompany',
  UpdateEstateCompany = 'nhouse-server/manageEstateCompany/updateEstateCompany',
  DeleteEstateCompany = 'nhouse-server/manageEstateCompany/deleteEstateCompany',
  ReEnableEstateCompany = 'nhouse-server/manageEstateCompany/reEnableEstateCompany',
}

export function reEnableEstateCompany(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<EstateCompanyModel>>(
    {
      url: ApiEstateCompany.ReEnableEstateCompany,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteEstateCompany(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<EstateCompanyModel>>(
    {
      url: ApiEstateCompany.DeleteEstateCompany,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateEstateCompany(
  estateCompany: EstateCompanyModel,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(estateCompany);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<EstateCompanyModel>>(
    {
      url: ApiEstateCompany.UpdateEstateCompany,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addEstateCompany(
  estateCompany: EstateCompanyModel,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(estateCompany);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<EstateCompanyModel>>(
    {
      url: ApiEstateCompany.AddEstateCompany,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getEstateCompany(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<EstateCompanyModel>>(
    {
      url: ApiEstateCompany.GetEstateCompany,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getEstateCompanies(
  condition: EstateCompanyCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<EstateCompanyModel>>(
    {
      url: ApiEstateCompany.GetEstateCompanies,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
