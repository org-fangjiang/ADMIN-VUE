import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface MetroStationModel {
  id?: string;
  name?: string;
  longitude?: string;
  latitude?: string;
  state?: string;
  cityId?: string;
}

export interface MetroLineModel {
  id?: string;
  name?: string;
  cityId?: string;
  startStation?: MetroStationModel;
  endStation?: MetroStationModel;
  state?: string;
  stations?: string;
}

export interface MetroLineCondition {
  cityId?: string; // getLines
  state?: string; //  getLines
  id?: string; // getLine
}

export interface MetroStationCondition {
  lineId?: string; // getStationsByLine
  state?: string; // getStationsByLine getAllStations
  id?: string; // getStation
  cityId?: string; //getAllStations
  name?: string; //getAllStations
}

export const _Const = {
  PLANNING: '2', // 规划中
  EFFECTIVE: '1', // 已建成
  INVALID: '0', // 无效
  STATES: [
    { value: '0', label: t(''), color: 'volcano' },
    { value: '1', label: t(''), color: 'geekblue' },
    { value: '2', label: t(''), color: 'geekblue' },
  ],
  _PERMS: {
    SELECT: 'link:select',
    ADD: 'link:add',
    UPDATE: 'link:update',
    DELETE: 'link:delete',
  },
};

export const _MetroStationConst = {
  _UPDATE_FIELDS: ['name', 'longitude', 'latitude'],
  _RULES: {
    name: [{ required: true, message: t(''), trigger: 'blur' }],
    longitude: [{ required: true, message: t(''), trigger: 'blur' }],
    latitude: [{ required: true, message: t(''), trigger: 'blur' }],
    cityId: [{ required: true, message: t(''), trigger: 'blur' }],
  },
};

export const _MetroLineConst = {
  _UPDATE_FIELDS: ['name', 'startStation', 'endStation'],
  _RULES: {
    name: [{ required: true, message: t(''), trigger: 'blur' }],
    cityId: [{ required: true, message: t(''), trigger: 'blur' }],
    startStation: [{ required: false, message: t(''), trigger: 'blur' }],
    endStation: [{ required: false, message: t(''), trigger: 'blur' }],
  },
};

export const _ColumnsMetroLine = [
  {
    title: t(''),
    key: 'name',
    dataIndex: 'name',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t(''),
    key: 'startStation',
    dataIndex: 'startStation',
    ellipsis: 'true',
    slots: { customRender: 'startStation' },
  },
  {
    title: t(''),
    key: 'endStation',
    dataIndex: 'endStation',
    ellipsis: 'true',
    slots: { customRender: 'endStation' },
  },
  {
    title: t(''),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
  {
    title: t(''),
    key: 'operation',
    width: '30%',
    slots: { customRender: 'operation' },
  },
];

export const _ColumnsMetroStation = [
  {
    title: t(''),
    key: 'name',
    dataIndex: 'name',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.link.state'),
    key: 'state',
    width: '10%',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
  {
    title: t('model.link.action'),
    key: 'operation',
    width: '30%',
    slots: { customRender: 'operation' },
  },
];
