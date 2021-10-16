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
