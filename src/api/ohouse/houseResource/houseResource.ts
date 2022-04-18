import { PageParam } from '../../model/baseModel';
import { ResourceCondition, ResourceModel } from './model/houseResourceModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

enum oResourceApi {
  GetResourceBy = 'ohouse-server/ohouser',
  GetResourceList = 'ohouse-server/ohouser/list',
  ReEnableResource = 'ohouse-server/ohouser/reEnable',
  IsExist = 'ohouse-server/ohouser/exist',
}

export function isExis(id: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.get(
    {
      url: oResourceApi.IsExist + '?id=' + id,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function changeStatus(id: string, state: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id, state: state });
  const data = reqParam.getInstance();
  return defHttp.patch(
    {
      url: oResourceApi.GetResourceBy,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableOResource(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post(
    {
      url: oResourceApi.ReEnableResource,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteOResource(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.delete(
    {
      url: oResourceApi.GetResourceBy,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateOResource(resource: ResourceModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(resource);
  const data = reqParam.getInstance();
  return defHttp.put(
    {
      url: oResourceApi.GetResourceBy,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addOResource(resource: ResourceModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(resource);
  const data = reqParam.getInstance();
  return defHttp.post(
    {
      url: oResourceApi.GetResourceBy,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getResourceList(
  condition: ResourceCondition,
  page: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post(
    {
      url: oResourceApi.GetResourceList,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getResourceId(id: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.get(
    {
      url: oResourceApi.GetResourceBy + '?id=' + id,
    },
    {
      errorMessageMode: mode,
    }
  );
}
