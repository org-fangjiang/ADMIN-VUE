export interface BasicPageParams {
  page: number;
  pageSize: number;
}

export interface BasicFetchResult<T extends any> {
  items: T[];
  total: number;
}

export enum PageSizeEnum {
  A = 10,
  B = 20,
  C = 30,
  D = 50,
  E = 80,
  F = 100,
}

export const PageSizeList: string[] = ['10', '20', '30', '50', '80', '100'];
export interface BasePageResult<T extends any> {
  page: {
    size: number;
    number: number;
    numberOfElements: number;
    totalPages: number;
    totalElements: number;
  };
  content: T[];
}

export interface BaseListResult<T extends any> {
  content: T[];
}

export interface BaseResult<T extends any> {
  content: T;
}
export interface PageParam {
  pageNum: number;
  pageSize: number;
}
export interface SortParam {
  asc: string[];
  desc: string[];
}
