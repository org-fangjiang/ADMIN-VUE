export interface AreaModel {
  id: string;
  name: string;
  cityId: string;
  state: string;
}

export const AreaColumns = [
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
