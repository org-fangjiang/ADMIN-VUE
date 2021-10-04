import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { BasePageResult, BaseResult } from '../../model/baseModel';
import { RequestParam } from '/@/utils/param/requestParam';
import { PageParam } from '/@/api/model/baseModel';
import { NewsCondition, NewsModel } from './model/newsModel';

enum ApiNews {
  GetNewsByProject = 'nhouse-server/manageNews/getNewsByProject',
  GetNewsByCity = 'nhouse-server/manageNews/getNewsByCity',
  AddNews = 'nhouse-server/manageNews/addNews',
  UpdateNews = 'nhouse-server/manageNews/updateNews',
  DeleteNews = 'nhouse-server/manageNews/deleteNews',
  ReEnableNews = 'nhouse-server/manageNews/reEnableNews',
  GetNews = 'nhouse-server/news/getNews',
}

export function getNews(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<NewsModel>>(
    {
      url: ApiNews.GetNews,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function reEnableNews(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<NewsModel>>(
    {
      url: ApiNews.ReEnableNews,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function deleteNews(id: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id });
  const data = reqParam.getInstance();
  return defHttp.delete<BaseResult<NewsModel>>(
    {
      url: ApiNews.DeleteNews,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function updateNews(news: NewsModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(news);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<NewsModel>>(
    {
      url: ApiNews.UpdateNews,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addNews(news: NewsModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(news);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<NewsModel>>(
    {
      url: ApiNews.AddNews,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getNewsByCity(
  condition: NewsCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<NewsModel>>(
    {
      url: ApiNews.GetNewsByCity,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getNewsByProject(
  condition: NewsCondition,
  page?: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<NewsModel>>(
    {
      url: ApiNews.GetNewsByProject,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
