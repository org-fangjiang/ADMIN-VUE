import { CityEntity } from './provinceEntity';

export interface SysTradingAreaEntity {
  id?: string;
  name?: string;
  description?: string;
  longitude?: string;
  latitude?: string;
  radius?: number;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  state?: string;
  cityId?: string;
  cityById?: CityEntity;
}
