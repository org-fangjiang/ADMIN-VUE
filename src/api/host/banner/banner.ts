import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam } from '/@/api/model/baseModel';
import { BannerCondition, BannerModel } from './model/bannerModel';

enum ApiBanner {
  GetBanners = 'nhouse-server/manageBanner/getBanners',
  AddBanner = 'nhouse-server/manageBanner/addBanner',
  UpdateBanner = 'nhouse-server/manageBanner/updateBanner',
  DeleteBanner = 'nhouse-server/manageBanner/deleteBanner',
  ReEnableBanner = 'nhouse-server/manageBanner/reEnableBanner',
  GetBanner = 'nhouse-server/manageBanner/getBanner',
}

export function getBanner(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<BannerModel>>(
    {
      url: ApiBanner.GetBanner,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableBanner(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<BannerModel>>(
    {
      url: ApiBanner.ReEnableBanner,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteBanner(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<BannerModel>>(
    {
      url: ApiBanner.DeleteBanner,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateBanner(banner: BannerModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(banner);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<BannerModel>>(
    {
      url: ApiBanner.UpdateBanner,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addBanner(banner: BannerModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(banner);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<BannerModel>>(
    {
      url: ApiBanner.AddBanner,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getBanners(
  condition: BannerCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<BannerModel>>(
    {
      url: ApiBanner.GetBanners,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
