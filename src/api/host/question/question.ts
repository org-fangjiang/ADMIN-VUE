import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam } from '/@/api/model/baseModel';
import { QuestionCondition, QuestionModel } from './model/questionModel';

enum ApiQuestion {
  GetQuestions = 'nhouse-server/manageQuestion/getQuestions',
  AddQuestion = 'nhouse-server/manageQuestion/addQuestion',
  UpdateQuestion = 'nhouse-server/manageQuestion/updateQuestion',
  DeleteQuestion = 'nhouse-server/manageQuestion/deleteQuestion',
  ReEnableQuestion = 'nhouse-server/manageQuestion/reEnableQuestion',
  GetQuestion = 'nhouse-server/manageQuestion/getQuestion',
  Examine = 'nhouse-server/manageQuestion/examine',
  Pass = 'nhouse-server/manageQuestion/pass',
  Failed = 'nhouse-server/manageQuestion/failed',
  PassIds = 'nhouse-server/manageQuestion/passIds',
  FailedIds = 'nhouse-server/manageQuestion/failedIds',
  FailedList = 'nhouse-server/manageQuestion/failedList',
  DelFailed = 'nhouse-server/manageQuestion/delFailed',
  DelFailedIds = 'nhouse-server/manageQuestion/delFailedIds',
}

export function delFailedIds(id: string[], mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<QuestionModel>(
    {
      url: ApiQuestion.DelFailedIds,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function delFailed(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<QuestionModel>(
    {
      url: ApiQuestion.DelFailed,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function failedList(page?: PageParam, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<QuestionModel>>(
    {
      url: ApiQuestion.FailedList,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function failedIds(id: string[], mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id });
  const data = reqParam.getInstance();
  return defHttp.post<QuestionModel>(
    {
      url: ApiQuestion.FailedIds,
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
  return defHttp.post<QuestionModel>(
    {
      url: ApiQuestion.PassIds,
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
  return defHttp.post<QuestionModel>(
    {
      url: ApiQuestion.Failed,
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
  return defHttp.post<QuestionModel>(
    {
      url: ApiQuestion.Pass,
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
  return defHttp.post<BasePageResult<QuestionModel>>(
    {
      url: ApiQuestion.Examine,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getQuestion(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<QuestionModel>>(
    {
      url: ApiQuestion.GetQuestion,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableQuestion(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<QuestionModel>>(
    {
      url: ApiQuestion.ReEnableQuestion,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteQuestion(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<QuestionModel>>(
    {
      url: ApiQuestion.DeleteQuestion,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateQuestion(question: QuestionModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(question);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<QuestionModel>>(
    {
      url: ApiQuestion.UpdateQuestion,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addQuestion(question: QuestionModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(question);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<QuestionModel>>(
    {
      url: ApiQuestion.AddQuestion,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getQuestions(
  condition: QuestionCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<QuestionModel>>(
    {
      url: ApiQuestion.GetQuestions,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
