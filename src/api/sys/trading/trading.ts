import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam } from '/@/api/model/baseModel';
import { TradingCondition, TradingModel } from './model/tradingModel';

enum ApiTrading {
  GetTradings = '/sys-server/trading/getTradings', //指定省市下所有，分页
  GetTradingAreaById = '/sys-server/trading/getTradingAreaById', //id
  AddTradingArea = '/sys-server/trading/addTradingArea', //add
  UpdateTradingArea = '/sys-server/trading/updateTradingArea', //update
  DeleteTradingArea = '/sys-server/trading/deleteTradingArea', //delete
  ReEnableTradingArea = '/sys-server/trading/reEnableTradingArea', //ReEnable
  GetTradingsByName = '/sys-server/trading/getTradingsByName', //通过省市以及商圈名称筛选
  GetAllTradings = '/sys-server/trading/getAllTradings', //指定省市下所有，不分页
}

export function getAllTradings(condition: TradingCondition, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<TradingModel>>(
    {
      url: ApiTrading.GetAllTradings,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getTradingsByName(
  condition: TradingCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<TradingModel>>(
    {
      url: ApiTrading.GetTradingsByName,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableTradingArea(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<TradingModel>>(
    {
      url: ApiTrading.ReEnableTradingArea,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteTradingArea(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<TradingModel>>(
    {
      url: ApiTrading.DeleteTradingArea,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateTradingArea(tradingArea: TradingModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(tradingArea);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<TradingModel>>(
    {
      url: ApiTrading.UpdateTradingArea,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addTradingArea(tradingArea: TradingModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(tradingArea);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<TradingModel>>(
    {
      url: ApiTrading.AddTradingArea,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getTradingAreaById(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<TradingModel>>(
    {
      url: ApiTrading.GetTradingAreaById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getTradings(
  condition: TradingCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<TradingModel>>(
    {
      url: ApiTrading.GetTradings,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
