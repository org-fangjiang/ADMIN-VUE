import { PageParam, SortParam } from '/@/api/model/baseModel';

export interface ParamInstance {
  data?: any;
  page?: PageParam;
  sort?: SortParam;
}

export class RequestParam {
  private paramInstance: ParamInstance;

  constructor(data?: any | undefined, sort?: SortParam | undefined, page?: PageParam | undefined) {
    this.paramInstance = {};
    if (data) {
      this.paramInstance.data = data;
    }
    if (sort) {
      this.paramInstance.sort = sort;
    }
    if (page) {
      this.paramInstance.page = page;
    }
  }

  setData(data: any): void {
    if (data) {
      if (this.paramInstance.data) {
        Object.assign(this.paramInstance.data, data);
      } else {
        this.paramInstance.data = Object.assign({}, data);
      }
    }
  }

  clearData(): void {
    this.paramInstance.data = {};
  }

  setSort(sort: SortParam | undefined): void {
    if (sort) {
      if (this.paramInstance.sort) {
        Object.assign(this.paramInstance.sort, sort);
      } else {
        this.paramInstance.sort = Object.assign({}, sort);
      }
    }
  }

  clearSort(): void {
    this.paramInstance.sort = { asc: [], desc: [] };
  }

  setPage(page: PageParam | undefined): void {
    if (page) {
      if (this.paramInstance.page) {
        Object.assign(this.paramInstance.page, page);
      } else {
        this.paramInstance.page = Object.assign({}, page);
      }
      this.paramInstance.page.pageNum = this.paramInstance.page.pageNum - 1;
    }
  }

  clearPage(): void {
    this.paramInstance.page = { pageNum: 0, pageSize: 10 };
  }

  getInstance(): ParamInstance {
    return this.paramInstance;
  }
}
