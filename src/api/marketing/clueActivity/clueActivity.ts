import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam } from '/@/api/model/baseModel';
import { clueActivityModel, ClueActivityCondition } from './model/clueActivityModel';

enum ApiActivity {
  GetById = '/clue-server/manageClueActivity/getById',
  GetByPage = '/clue-server/manageClueActivity/getByPage', //activity:select:city
  GetByPageWithCreateBy = '/clue-server/manageClueActivity/getByPageWithCreateBy', //activity:select:create
  GetAllWithCity = '/clue-server/manageClueActivity/getAllWithCity', //activity:select:all
  AddPC = '/clue-server/manageClueActivity/addPC',
  AddUser = '/clue-server/manageClueActivity/addUser',
  UpdateAll = '/clue-server/manageClueActivity/updateAll',
  UpdateUser = '/clue-server/manageClueActivity/updateUser',
  UpdateStateUser = '/clue-server/manageClueActivity/updateStateUser',
  UpdateStateAll = '/clue-server/manageClueActivity/updateStateAll',
  DeleteAll = '/clue-server/manageClueActivity/deleteAll',
  DeleteUser = '/clue-server/manageClueActivity/deleteUser',
  ReEnableAll = '/clue-server/manageClueActivity/reEnableAll',
  ReEnableUser = '/clue-server/manageClueActivity/reEnableUser',
  Publish = '/clue-server/manageClueActivity/publish',
}

export function publish(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<clueActivityModel>>(
    {
      url: ApiActivity.Publish,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableUser(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<clueActivityModel>>(
    {
      url: ApiActivity.ReEnableUser,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableAll(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<clueActivityModel>>(
    {
      url: ApiActivity.ReEnableAll,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteUser(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<clueActivityModel>>(
    {
      url: ApiActivity.DeleteUser,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteAll(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<clueActivityModel>>(
    {
      url: ApiActivity.DeleteAll,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateStateAll(condition: ClueActivityCondition, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<clueActivityModel>>(
    {
      url: ApiActivity.UpdateStateAll,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateStateUser(
  condition: ClueActivityCondition,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<clueActivityModel>>(
    {
      url: ApiActivity.UpdateStateUser,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateUser(clueActivity: clueActivityModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(clueActivity);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<clueActivityModel>>(
    {
      url: ApiActivity.UpdateUser,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateAll(clueActivity: clueActivityModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(clueActivity);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<clueActivityModel>>(
    {
      url: ApiActivity.UpdateAll,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addUser(clueActivity: clueActivityModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(clueActivity);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<clueActivityModel>>(
    {
      url: ApiActivity.AddUser,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addPC(clueActivity: clueActivityModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(clueActivity);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<clueActivityModel>>(
    {
      url: ApiActivity.AddPC,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getAllWithCity(
  condition: ClueActivityCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<clueActivityModel>>(
    {
      url: ApiActivity.GetAllWithCity,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getByPageWithCreateBy(
  condition: ClueActivityCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<clueActivityModel>>(
    {
      url: ApiActivity.GetByPageWithCreateBy,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getByPage(
  condition: ClueActivityCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<clueActivityModel>>(
    {
      url: ApiActivity.GetByPage,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getById(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<clueActivityModel>>(
    {
      url: ApiActivity.GetById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
