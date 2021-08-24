export interface CityModel {
  id: string;
  name: string;
  provinceId: string;
  firstLetter: string;
  state: string;
}

export const CityColumns = [
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'name',
    slots: '',
  },
  {
    title: 'state',
    key: 'state',
    dataIndex: 'state',
    slots: '',
  },
];
