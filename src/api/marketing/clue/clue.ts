import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam } from '/@/api/model/baseModel';
import { ClueCondition, clueFollow, ClueModel } from './model/clueModel';

enum ApiClue {
  AddByUser = '/clue-server/manageClue/addByUser',
  GetById = '/clue-server/manageClue/getById',
  Receive = '/clue-server/manageClue/receive',
  ReceiveInvalid = '/clue-server/manageClue/receiveInvalid',
  Transfer = '/clue-server/manageClue/transfer',
  Invalid = '/clue-server/manageClue/invalid',
  GetByPageAll = '/clue-server/manageClue/getByPageAll',
  GetByPageWithCity = '/clue-server/manageClue/getByPageWithCity',
  GetByPageWithUser = '/clue-server/manageClue/getByPageWithUser',
  GetByIdWithCreate = '/clue-server/manageClue/getByIdWithCreate',
  GetByPageWithCreate = '/clue-server/manageClue/getByPageWithCreate',
}

enum ApiClueFollow {
  Add = '/clue-server/manageClueFollow/add',
  Update = '/clue-server/manageClueFollow/update',
}

export function update(follow: clueFollow, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(follow);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<clueFollow>>(
    {
      url: ApiClueFollow.Update,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function add(follow: clueFollow, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(follow);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<clueFollow>>(
    {
      url: ApiClueFollow.Add,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getByPageWithCreate(
  condition: ClueCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<ClueModel>>(
    {
      url: ApiClue.GetByPageWithCreate,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getByIdWithCreate(id: string, page?: PageParam, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ClueModel>>(
    {
      url: ApiClue.GetByIdWithCreate,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getByPageWithUser(
  condition: ClueCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<ClueModel>>(
    {
      url: ApiClue.GetByPageWithUser,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getByPageWithCity(
  condition: ClueCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<ClueModel>>(
    {
      url: ApiClue.GetByPageWithCity,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getByPageAll(
  condition: ClueCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<ClueModel>>(
    {
      url: ApiClue.GetByPageAll,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function invalid(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<ClueModel>>(
    {
      url: ApiClue.Invalid,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function transfer(id: string, userId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id, userId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ClueModel>>(
    {
      url: ApiClue.Transfer,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function receiveInvalid(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ClueModel>>(
    {
      url: ApiClue.ReceiveInvalid,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function receive(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ClueModel>>(
    {
      url: ApiClue.Receive,
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
  return defHttp.post<BaseResult<ClueModel>>(
    {
      url: ApiClue.GetById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addByUser(clue: ClueModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(clue);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ClueModel>>(
    {
      url: ApiClue.AddByUser,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
