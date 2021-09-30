import { ResourceEntity } from './resourceEntity';

export interface LayoutEntity {
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
  state?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  hResourceByResourceId?: ResourceEntity;
}
