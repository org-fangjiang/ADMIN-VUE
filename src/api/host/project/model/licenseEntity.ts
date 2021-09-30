import { BuildEntity } from './buildEntity';

export interface LicenseEntity {
  id?: string;
  number?: string;
  projectId?: string;
  resourceId?: string;
  state?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  hBuildsById?: BuildEntity[];
}
