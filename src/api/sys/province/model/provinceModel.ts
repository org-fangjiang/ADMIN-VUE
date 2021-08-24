export interface ProvinceModel {
  id: string;
  name: string;
  state: string;
}

export const ProvinceColumns = [
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'name',
    slots: '',
  },
  {
    title: 'State',
    key: 'state',
    dataIndex: 'state',
    slots: '',
  },
];
