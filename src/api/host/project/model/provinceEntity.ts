export interface ProvinceEntity {
  id?: string;
  name?: string;
  state?: string;
  citiesByProvince?: CityEntity[];
}

export interface CityEntity {
  id?: string;
  name?: string;
  provinceId?: string;
  firstLetter?: string;
  state?: string;
}

export interface AreaEntity {
  id?: string;
  name?: string;
  cityId?: string;
  state?: string;
}
