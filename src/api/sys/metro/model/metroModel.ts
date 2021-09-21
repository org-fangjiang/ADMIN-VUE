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
  stations?: MetroStationModel[];
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
    { value: '0', label: t('model.metro.invalid'), color: 'volcano' },
    { value: '1', label: t('model.metro.effective'), color: 'geekblue' },
    { value: '2', label: t('model.metro.planning'), color: 'green' },
  ],
  _PERMS: {
    SELECT: 'metro:select',
    ADD: 'metro:add',
    UPDATE: 'metro:update',
    DELETE: 'metro:delete',
  },
};

export const _MetroStationConst = {
  ..._Const,
  _UPDATE_FIELDS: ['name', 'longitude', 'latitude'],
  _RULES: {
    name: [{ required: true, message: t('model.metroStation.form.name'), trigger: 'blur' }],
    longitude: [
      { required: true, message: t('model.metroStation.form.longitude'), trigger: 'blur' },
    ],
    latitude: [{ required: true, message: t('model.metroStation.form.latitude'), trigger: 'blur' }],
    cityId: [{ required: true, message: t('model.metroStation.form.cityId'), trigger: 'blur' }],
  },
};

export const _MetroLineConst = {
  ..._Const,
  _UPDATE_FIELDS: ['name', 'startStation', 'endStation'],
  _RULES: {
    name: [{ required: true, message: t('model.metroLine.form.name'), trigger: 'blur' }],
    cityId: [{ required: true, message: t('model.metroLine.form.cityId'), trigger: 'blur' }],
  },
};

export const _ColumnsMetroLine = [
  {
    title: t('model.metroLine.name'),
    key: 'name',
    dataIndex: 'name',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.metroLine.startStation'),
    key: 'startStation',
    dataIndex: 'startStation',
    ellipsis: 'true',
    slots: { customRender: 'startStation' },
  },
  {
    title: t('model.metroLine.endStation'),
    key: 'endStation',
    dataIndex: 'endStation',
    ellipsis: 'true',
    slots: { customRender: 'endStation' },
  },
  {
    title: t('model.metroLine.state'),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
  {
    title: t('model.metroLine.operation'),
    key: 'operation',
    width: '30%',
    slots: { customRender: 'operation' },
  },
];

export const _ColumnsMetroStation = [
  {
    title: t('model.metroStation.name'),
    key: 'name',
    dataIndex: 'name',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.metroStation.state'),
    key: 'state',
    width: '10%',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
  {
    title: t('model.metroStation.operation'),
    key: 'operation',
    width: '30%',
    slots: { customRender: 'operation' },
  },
];
