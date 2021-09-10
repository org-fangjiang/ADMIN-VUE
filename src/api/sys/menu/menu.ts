import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BaseListResult, BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam, SortParam } from '/@/api/model/baseModel';
import { MenuByCondition, MenuModel } from './model/permsModel';

enum Api {
  GetParentMenu = '/sys-server/menu/getParentMenu',
  GetChildMenu = '/sys-server/menu/getChildMenu',
  GetMenu = '/sys-server/menu/getMenu',
  AddMenu = '/sys-server/menu/addMenu',
  UpdateMenu = '/sys-server/menu/updateMenu',
  DeleteMenu = '/sys-server/menu/deleteMenu',
  ReEnableMenu = '/sys-server/menu/reEnableMenu',
}

export function getParentMenu(
  condition: MenuByCondition,
  page?: PageParam,
  sort?: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<MenuModel>>(
    {
      url: Api.GetParentMenu,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getChildMenu(
  condition: MenuByCondition,
  page?: PageParam,
  sort?: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BaseListResult<MenuModel>>(
    {
      url: Api.GetChildMenu,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getMenu(condition: MenuByCondition, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<MenuModel>>(
    {
      url: Api.GetMenu,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addMenu(menu: MenuModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(menu);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<MenuModel>>(
    {
      url: Api.AddMenu,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateMenu(menu: MenuModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(menu);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<MenuModel>>(
    {
      url: Api.UpdateMenu,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteMenu(menu: MenuModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(menu);
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<MenuModel>>(
    {
      url: Api.DeleteMenu,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableMenu(menu: MenuModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(menu);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<MenuModel>>(
    {
      url: Api.ReEnableMenu,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
