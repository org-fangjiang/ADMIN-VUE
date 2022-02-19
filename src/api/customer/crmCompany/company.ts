import { BasePageResult, BaseResult, CustomerResult, PageParam } from '../../model/baseModel';
import { CompanyCondition, CompanyModel } from './model/companyModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

export enum CompanyApi {
  GetByCompany = '/crm-server/customer/getByCompany',
  AddCompany = '/crm-server/customer/addCompany',
  GetCompanyById = '/crm-server/customer/getCompanyById',
}

export function getCompanyById(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<CustomerResult<CompanyModel>>(
    {
      url: CompanyApi.GetCompanyById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getByCompany(
  condition: CompanyCondition,
  page: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<CompanyModel>>(
    {
      url: CompanyApi.GetByCompany,
      data,
    },
    {
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
      url: CompanyApi.AddCompany,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
