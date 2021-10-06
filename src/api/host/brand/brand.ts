import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam } from '/@/api/model/baseModel';
import { BrandCondition, BrandModel } from './model/brandModel';

enum ApiBrand {
  GetBrands = 'nhouse-server/brand/getBrands',
  GetBrand = 'nhouse-server/brand/getBrand',
  AddBrand = 'nhouse-server/brand/addBrand',
  UpdateBrand = 'nhouse-server/brand/updateBrand',
  DeleteBrand = 'nhouse-server/brand/deleteBrand',
  ReEnableBrand = 'nhouse-server/brand/reEnableBrand',
}

export function reEnableBrand(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<BrandModel>>(
    {
      url: ApiBrand.ReEnableBrand,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteBrand(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<BrandModel>>(
    {
      url: ApiBrand.DeleteBrand,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateBrand(brand: BrandModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(brand);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<BrandModel>>(
    {
      url: ApiBrand.UpdateBrand,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addBrand(brand: BrandModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(brand);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<BrandModel>>(
    {
      url: ApiBrand.AddBrand,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getBrand(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<BrandModel>>(
    {
      url: ApiBrand.GetBrand,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getBrands(
  condition: BrandCondition,
  page: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<BrandModel>>(
    {
      url: ApiBrand.GetBrands,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
