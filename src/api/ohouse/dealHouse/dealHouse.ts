import { DealHouseModel } from './model/dealModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

enum DealHouseApi {
  DealHouse = 'ohouse-server/ohouse/deal',
}

export function dealHouse(dealHouse: DealHouseModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(dealHouse);
  const data = reqParam.getInstance();
  return defHttp.post(
    {
      url: DealHouseApi.DealHouse,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
