import { ResourceBean } from '../../layout/model/ResourceBean';

export interface BuildLayoutBean {
  buildId?: string;
  layoutId?: string;
  hLayoutByLayoutId?: LayoutBean;
}

export interface LayoutBean {
  id?: string;
  room?: number;
  hall?: number;
  toilet?: number;
  area?: number;
  saleState?: string;
  labels?: string;
  face?: string;
  description?: string;
  projectId?: string;
  resourceId?: string;
  hResourceByResourceId?: ResourceBean;
}
