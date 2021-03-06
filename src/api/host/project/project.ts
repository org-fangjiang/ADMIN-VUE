import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult, SortParam } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam } from '/@/api/model/baseModel';
import { HostCondition, HostModel } from './model/projectModel';

enum ApiHost {
  Search = 'nhouse-server/manageProject/search', //必选参数：name, cityId 可选参数：state, pageParam(0,10)
  SearchWithCondition = 'nhouse-server/manageProject/searchWithCondition', //必选参数：provinceId, cityId 分页
  AddProject = 'nhouse-server/manageProject/addProject',
  UpdateProject = 'nhouse-server/manageProject/updateProject',
  DeleteProject = 'nhouse-server/manageProject/deleteProject',
  ReEnableProject = 'nhouse-server/manageProject/reEnableProject',
  SetProjectEstateCompany = 'nhouse-server/manageProject/setProjectEstateCompany', //为项目设置物业企业,必选参数：projectId, estateCompany
  SetProjectDeveloper = 'nhouse-server/manageProject/setProjectDeveloper',
  SetProjectBrand = 'nhouse-server/manageProject/setProjectBrand', // 设置品牌商
  GetProject = 'nhouse-server/manageProject/getProject',
  SetProjectOrder = 'nhouse-server/manageProject/setProjectOrder',
  ClearProjectOrder = 'nhouse-server/manageProject/clearProjectOrder',
  Around = 'nhouse-server/place/around',
}

export function around(location: string, type: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.get(
    {
      url: ApiHost.Around,
      params: {
        location: location,
        type: type,
        offset: 10,
      },
    },
    {
      errorMessageMode: mode,
    }
  );
}

// https://restapi.amap.com/v3/place/around?key=<用户的key>&location=116.473168,39.993015&radius=10000&types=011100
const key = '0e91d4576951619f26c117b96bf4415f';
export function getLocation(location: string, type: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.get(
    {
      url:
        'https://restapi.amap.com/v3/place/around?key=' +
        key +
        '&location=' +
        location +
        '&radius=10000&types=' +
        type +
        '&offset=10',
      // headers: { 'Access-Control-Allow-Origin': '*' },
    },
    {
      errorMessageMode: mode,
      withToken: false,
      isTransformResponse: false,
    }
  );
}

export function clearProjectOrder(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<HostModel>>(
    {
      url: ApiHost.SetProjectOrder,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function setProjectOrder(id: string, order: number, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id, order });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<HostModel>>(
    {
      url: ApiHost.SetProjectOrder,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getProject(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<HostModel>>(
    {
      url: ApiHost.GetProject,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableProject(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<HostModel>>(
    {
      url: ApiHost.ReEnableProject,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteProject(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<HostModel>>(
    {
      url: ApiHost.DeleteProject,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
export interface PriceModel {
  id: string;
  price: string;
  lowTotalPrice: string;
  highTotalPrice: string;
  priceDescription: string;
}
export function updatePrice(project: PriceModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(project);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<HostModel>>(
    {
      url: ApiHost.UpdateProject,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateProject(project: HostModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(project);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<HostModel>>(
    {
      url: ApiHost.UpdateProject,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addProject(project: HostModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(project);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<HostModel>>(
    {
      url: ApiHost.AddProject,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function searchWithCondition(
  condition: HostCondition,
  page?: PageParam,
  sort?: SortParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  reqParam.setSort(sort);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<HostModel>>(
    {
      url: ApiHost.SearchWithCondition,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function search(
  condition: HostCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<HostModel>>(
    {
      url: ApiHost.Search,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function setProjectEstateCompany(
  id: string,
  estateCompany: string,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData({ id, estateCompany });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<HostModel>>(
    {
      url: ApiHost.SetProjectEstateCompany,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function setProjectDeveloper(
  id: string,
  developerId: string,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData({ id, developerId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<HostModel>>(
    {
      url: ApiHost.SetProjectDeveloper,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function setProjectBrand(id: string, brandId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id, brandId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<HostModel>>(
    {
      url: ApiHost.SetProjectBrand,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
