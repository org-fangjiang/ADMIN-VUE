import { BasePageResult, BaseResult, PageParam } from '../../model/baseModel';
import { ReportCondition, ReportModel } from './model/reportModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestParam } from '/@/utils/param/requestParam';

enum ReportApi {
  AddReport = '/crm-server/report/addReport',
  ExamineReport = '/crm-server/report/examineReport',
  GetMyReport = '/crm-server/report/getMyReport',
  GetMemberReport = '/crm-server/report/getMemberReport',
  GetGroupReport = '/crm-server/report/getGroupReport',
  GetEveryGroupReport = '/crm-server/report/getEveryGroupReport',
  GetCompanyReport = '/crm-server/report/getCompanyReport',
  GetProjectReport = '/crm-server/report/getProjectReport',
  GetResidentReport = '/crm-server/report/getResidentReport',
  GetResidentReportById = '/crm-server/report/getResidentReportById',
  GetMyReportById = '/crm-server/report/getMyReportById',
  GetMemberReportById = '/crm-server/report/getMemberReportById',
  GetGroupReportById = '/crm-server/report/getGroupReportById',
  GetEveryGroupReportById = '/crm-server/report/getEveryGroupReportById',
  GetCompanyReportById = '/crm-server/report/getCompanyReportById',
  GetProjectReportById = '/crm-server/report/getProjectReportById',
}

export function getProjectReportById(reportId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ reportId: reportId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ReportModel>>(
    {
      url: ReportApi.GetProjectReportById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getCompanyReportById(reportId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ reportId: reportId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ReportModel>>(
    {
      url: ReportApi.GetCompanyReportById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getEveryGroupReportById(reportId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ reportId: reportId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ReportModel>>(
    {
      url: ReportApi.GetEveryGroupReportById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getGroupReportById(reportId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ reportId: reportId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ReportModel>>(
    {
      url: ReportApi.GetGroupReportById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getMemberReportById(reportId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ reportId: reportId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ReportModel>>(
    {
      url: ReportApi.GetMemberReportById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getMyReportById(reportId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ reportId: reportId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ReportModel>>(
    {
      url: ReportApi.GetMyReportById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getResidentReportById(reportId: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ reportId: reportId });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ReportModel>>(
    {
      url: ReportApi.GetResidentReportById,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getResidentReport(
  condition: ReportCondition,
  page: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<ReportModel>>(
    {
      url: ReportApi.GetResidentReport,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getProjectReport(
  condition: ReportCondition,
  page: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<ReportModel>>(
    {
      url: ReportApi.GetProjectReport,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getCompanyReport(
  condition: ReportCondition,
  page: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<ReportModel>>(
    {
      url: ReportApi.GetCompanyReport,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getEveryGroupReport(
  condition: ReportCondition,
  page: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<ReportModel>>(
    {
      url: ReportApi.GetEveryGroupReport,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getGroupReport(
  condition: ReportCondition,
  page: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<ReportModel>>(
    {
      url: ReportApi.GetGroupReport,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getMemberReport(
  condition: ReportCondition,
  page: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<ReportModel>>(
    {
      url: ReportApi.GetMemberReport,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getMyReport(
  condition: ReportCondition,
  page: PageParam,
  mode: ErrorMessageMode = 'modal'
) {
  const reqParam = new RequestParam();
  reqParam.setData(condition);
  reqParam.setPage(page);
  const data = reqParam.getInstance();
  return defHttp.post<BasePageResult<ReportModel>>(
    {
      url: ReportApi.GetMyReport,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addReport(report: ReportModel, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData(report);
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ReportModel>>(
    {
      url: ReportApi.AddReport,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function examineReport(id: string, state: string, mode: ErrorMessageMode = 'modal') {
  const reqParam = new RequestParam();
  reqParam.setData({ id: id, state: state });
  const data = reqParam.getInstance();
  return defHttp.post<BaseResult<ReportModel>>(
    {
      url: ReportApi.ExamineReport,
      data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
