import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BaseListResult, BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam } from '/@/api/model/baseModel';
import { LicenseCondition, LicenseModel } from './model/licenseModel';
import { BuildEntity } from '../project/model/buildEntity';

enum ApiLicense {
  GetLicense = 'nhouse-server/manageLicense/getLicense', //id
  GetLicenses = 'nhouse-server/manageLicense/getLicenses', //projectId必选,分页
  GetLicensesAll = 'nhouse-server/manageLicense/getLicensesAll', //projectId  不分页
  AddLicense = 'nhouse-server/manageLicense/addLicense',
  UpdateLicense = 'nhouse-server/manageLicense/updateLicense',
  DeleteLicense = 'nhouse-server/manageLicense/deleteLicense', //
  ReEnableLicense = 'nhouse-server/manageLicense/reEnableLicense',
  UpdateLicenseAddBuild = 'nhouse-server/manageLicense/updateLicenseAddBuild', //关联楼栋
}

export function getLicense(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<LicenseModel>>(
    {
      url: ApiLicense.GetLicense,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableLicense(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<LicenseModel>>(
    {
      url: ApiLicense.ReEnableLicense,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteLicense(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<LicenseModel>>(
    {
      url: ApiLicense.DeleteLicense,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateLicenseAddBuild(
  id: string,
  hBuildsById: BuildEntity[],
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData({ id, hBuildsById });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<LicenseModel>>(
    {
      url: ApiLicense.UpdateLicenseAddBuild,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateLicense(license: LicenseModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(license);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<LicenseModel>>(
    {
      url: ApiLicense.UpdateLicense,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addLicense(license: LicenseModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(license);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<LicenseModel>>(
    {
      url: ApiLicense.AddLicense,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getLicensesAll(condition: LicenseCondition, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  const data = reqParam.getInstance();
  return defHttp.post<BaseListResult<LicenseModel>>(
    {
      url: ApiLicense.GetLicensesAll,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getLicenses(
  condition: LicenseCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<LicenseModel>>(
    {
      url: ApiLicense.GetLicenses,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
