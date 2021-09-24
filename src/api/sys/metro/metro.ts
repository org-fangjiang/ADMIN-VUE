import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam } from '/@/api/model/baseModel';
import {
  MetroLineCondition,
  MetroLineModel,
  MetroStationCondition,
  MetroStationModel,
} from './model/metroModel';

enum ApiLine {
  GetLines = '/sys-server/metroLine/getLines',
  GetLine = '/sys-server/metroLine/getLine',
  AddLine = '/sys-server/metroLine/addLine',
  UpdateLine = '/sys-server/metroLine/updateLine',
  DeleteLine = '/sys-server/metroLine/deleteLine',
  ReEnableLine = '/sys-server/metroLine/reEnableLine',
}

enum ApiStation {
  GetAllStations = '/sys-server/metroStation/getAllStations',
  GetStationsByLine = '/sys-server/metroStation/getStationsByLine',
  GetStation = '/sys-server/metroStation/getStation',
  AddStation = '/sys-server/metroStation/addStation',
  UpdateStation = '/sys-server/metroStation/updateStation',
  DeleteStation = '/sys-server/metroStation/deleteStation',
  ReEnableStation = '/sys-server/metroStation/reEnableStation',
}

export function reEnableStation(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<MetroStationModel>>(
    {
      url: ApiStation.ReEnableStation,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteStation(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<MetroStationModel>>(
    {
      url: ApiStation.DeleteStation,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateStation(station: MetroStationModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(station);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<MetroStationModel>>(
    {
      url: ApiStation.UpdateStation,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addStation(station: MetroStationModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(station);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<MetroStationModel>>(
    {
      url: ApiStation.AddStation,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getStation(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<MetroStationModel>>(
    {
      url: ApiStation.GetStation,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getStationsByLine(
  condition: MetroStationCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<MetroStationModel>>(
    {
      url: ApiStation.GetStationsByLine,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getAllStations(
  condition: MetroStationCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<MetroStationModel>>(
    {
      url: ApiStation.GetAllStations,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableLine(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({
    id,
  });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<MetroLineModel>>(
    {
      url: ApiLine.ReEnableLine,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteLine(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({
    id,
  });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<MetroLineModel>>(
    {
      url: ApiLine.DeleteLine,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateLine(line: MetroLineModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(line);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<MetroLineModel>>(
    {
      url: ApiLine.UpdateLine,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addLine(line: MetroLineModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(line);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<MetroLineModel>>(
    {
      url: ApiLine.AddLine,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getLine(id: String, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<MetroLineModel>>(
    {
      url: ApiLine.GetLine,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getLines(
  condition: MetroLineCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<MetroLineModel>>(
    {
      url: ApiLine.GetLines,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
