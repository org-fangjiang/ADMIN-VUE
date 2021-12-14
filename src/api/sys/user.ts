import { defHttp } from '/@/utils/http/axios';
import {
  LoginParams,
  LoginResultModel,
  CodeResultModel,
  UserInfoModel,
  RefreshParams,
} from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  GetCode = '/api/auth/code',
  Login = '/api/oauth/token',
  Logout = '/api/auth/signOut',
  GetUserInfo = '/api/auth/getUserInfo',
  RefreshToken = '/api/oauth/token',
  GetPermCode = '/getPermCode',
}
export function refreshTokenApi(params: RefreshParams) {
  defHttp.setHeader({ Authorization: 'Basic ZmFuZ2ppYW5nOjEyMzQ1Ng==' });
  return defHttp.post<LoginResultModel>(
    {
      url: Api.RefreshToken,
      data: params,
    },
    {
      withToken: false,
    }
  );
}

export function getCodeApi() {
  return defHttp.post<CodeResultModel>({
    url: Api.GetCode,
  });
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  defHttp.setHeader({ Authorization: 'Basic ZmFuZ2ppYW5nOjEyMzQ1Ng==' });
  return defHttp.get<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
      joinParamsToUrl: true,
    }
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<UserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'modal' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.delete({ url: Api.Logout });
}
