import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { CompanyModel, CompanyByCondition } from './model/companyModel';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam, SortParam } from '/@/api/model/baseModel';

enum Api {
  GetCompanies = '/sys-server/company/getCompanies',
  GetCompany = '/sys-server/company/getCompany',
  AddCompany = '/sys-server/company/changeCreateBy',
  UpdateCompany = '/sys-server/company/updateCompany',
  DeleteCompany = '/sys-server/company/deleteCompany',
  ReEnableCompany = '/sys-server/company/reEnableCompany',
  ChangeCreateBy = '/sys-server/company/changeCreateBy',
  RenewalData = '/sys-server/company/renewalData',
}

export function getCompanies(
  condition: CompanyByCondition,
  page?: PageParam,
  sort?: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<CompanyModel>>(
    {
      url: Api.GetCompanies,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getCompany(id: String, mode: ErrorMessageMode = 'message') {
  const reqParam = new RequestParam();
  id = id;
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<CompanyModel>>(
    {
      url: Api.GetCompany,
      data,
    },
    {
      joinTime: false,
      errorMessageMode: mode,
    }
  );
}

export function addCompany(company: CompanyModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(company);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<CompanyModel>>(
    {
      url: Api.AddCompany,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateCompany(company: CompanyModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(company);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<CompanyModel>>(
    {
      url: Api.UpdateCompany,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteCompany(company: CompanyModel, mode: ErrorMessageMode = 'message') {
  const reqParam = new RequestParam();
  reqParam.setData(company);
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<CompanyModel>>(
    {
      url: Api.DeleteCompany,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableCompany(company: CompanyModel, mode: ErrorMessageMode = 'message') {
  const reqParam = new RequestParam();
  reqParam.setData(company);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<CompanyModel>>(
    {
      url: Api.ReEnableCompany,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function changeCreateBy(company: CompanyModel, mode: ErrorMessageMode = 'message') {
  const reqParam = new RequestParam();
  reqParam.setData(company);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<CompanyModel>>(
    {
      url: Api.ChangeCreateBy,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function renewalData(company: CompanyModel, mode: ErrorMessageMode = 'message') {
  const reqParam = new RequestParam();
  reqParam.setData(company);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<CompanyModel>>(
    {
      url: Api.RenewalData,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
