import { LayoutEntity } from './layoutEntity';

export interface BuildEntity {
  id?: string;
  number?: string;
  floors?: number;
  price?: number;
  priceDescription;
  description?: string;
  saleState?: string;
  projectId?: string;
  licenseId?: string;
  state?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  hBuildLayoutsById?: BuildLayoutEntity[];
  remark?: string;
  locationX?: number;
  locationY?: number;
}

export interface BuildLayoutEntity {
  buildId?: string;
  layoutId?: string;
  hLayoutByLayoutId?: LayoutEntity;
}
