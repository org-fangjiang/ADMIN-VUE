import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam } from '/@/api/model/baseModel';
import { AnswerCondition, AnswerModel } from './model/answerModel';

enum ApiAnswer {
  GetAnswers = 'nhouse-server/manageAnswer/getAnswers',
  AddAnswers = 'nhouse-server/manageAnswer/addAnswers',
  DeleteAnswer = 'nhouse-server/manageAnswer/deleteAnswer',
  ReEnableAnswer = 'nhouse-server/manageAnswer/reEnableAnswer',
  Examine = 'nhouse-server/manageAnswer/examine',
  Pass = 'nhouse-server/manageAnswer/pass',
  Failed = 'nhouse-server/manageAnswer/failed',
  PassIds = 'nhouse-server/manageAnswer/passIds',
  FailedIds = 'nhouse-server/manageAnswer/failedIds',
}
export function failedIds(id: string[], mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<AnswerModel>(
    {
      url: ApiAnswer.FailedIds,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function passIds(id: string[], mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<AnswerModel>(
    {
      url: ApiAnswer.PassIds,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function failedOne(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<AnswerModel>(
    {
      url: ApiAnswer.Failed,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function pass(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<AnswerModel>(
    {
      url: ApiAnswer.Pass,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function examine(page?: PageParam, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<AnswerModel>>(
    {
      url: ApiAnswer.Examine,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableAnswer(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<AnswerModel>>(
    {
      url: ApiAnswer.ReEnableAnswer,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteAnswer(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<AnswerModel>>(
    {
      url: ApiAnswer.DeleteAnswer,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addAnswers(answer: AnswerModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(answer);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<AnswerModel>>(
    {
      url: ApiAnswer.AddAnswers,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getAnswers(
  condition: AnswerCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<AnswerModel>>(
    {
      url: ApiAnswer.GetAnswers,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
