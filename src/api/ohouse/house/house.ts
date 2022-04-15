import { PageParam } from '../../model/baseModel';
import { HouseCondition, HouseModel } from './model/houseModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

enum oHouseApi {
  GetHouseList = 'ohouse-server/ohouse/list',
  OHouseId = 'ohouse-server/ohouse',
  ReEnableHouse = 'ohouse-server/ohouse/reEnable',
  IsExist = 'ohouse-server/ohouse/exist',
  Transfer = 'ohouse-server/ohouse/transfer',
  TransferAll = 'ohouse-server/ohouse/transferAll',
  UpdatePrice = 'ohouse-server/ohousep',
}

export function updateHousePrice(houseId: string, price: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ houseId: houseId, price: price });
  const data = reqParam.getInstance();
  return defHttp.post(
    {
      url: oHouseApi.UpdatePrice,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function transferAll(saleId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ saleId: saleId });
  const data = reqParam.getInstance();
  return defHttp.patch(
    {
      url: oHouseApi.TransferAll,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function transfer(houseId: string, saleId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ houseId: houseId, saleId: saleId });
  const data = reqParam.getInstance();
  return defHttp.patch(
    {
      url: oHouseApi.Transfer,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function isExist(
  projectId: string,
  buildId: string,
  unitId: string,
  number: string,
  mode: ErrorMessageMode = 'modal'
) {
  return defHttp.get(
    {
      url:
        oHouseApi.IsExist +
        '?projectId=' +
        projectId +
        '&buildId=' +
        buildId +
        '&unitId=' +
        unitId +
        '&number=' +
        number,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function changeState(
  state: string,
  id: string,
  title: string,
  keyword: string,
  description: string,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData({
    state: state,
    id: id,
    title: title,
    keyword: keyword,
    description: description,
  });
  const data = reqParam.getInstance();
  return defHttp.patch(
    {
      url: oHouseApi.OHouseId,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableOHouse(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post(
    {
      url: oHouseApi.ReEnableHouse,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getOHouse(id: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.get(
    {
      url: oHouseApi.OHouseId + '?id=' + id,
    },
    { errorMessageMode: mode }
  );
}

export function addOHouse(house: HouseModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(house);
  const data = reqParam.getInstance();
  return defHttp.post(
    {
      url: oHouseApi.OHouseId,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateOHouse(house: HouseModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(house);
  const data = reqParam.getInstance();
  return defHttp.put(
    {
      url: oHouseApi.OHouseId,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getOHouseList(
  condition: HouseCondition,
  page: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post(
    {
      url: oHouseApi.GetHouseList,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteOHouse(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.delete(
    {
      url: oHouseApi.OHouseId,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
