import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface TradingModel {
  id?: string;
  name?: string;
  description?: string;
  longitude?: string;
  latitude?: string;
  radius?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  state?: string;
  provinceId?: string;
  provinceById?: string;
  cityId?: string;
  cityById?: string;
  areaId?: string;
  areaById?: string;
}

export interface TradingCondition {
  name?: string; //getAllTradingByName
  cityId?: string; //getAllTrading
  provinceId?: string; //getAllTrading
  state?: string; //
  id?: string; //getTradingAreaById
}

export const _TradingConst = {
  EFFECTIVE: '1', // 有效
  INVALID: '0', // 无效
  STATES: [
    { value: '0', label: t('model.trading.invalid'), color: 'volcano' },
    { value: '1', label: t('model.trading.effective'), color: 'geekblue' },
  ],
  _PERMS: {
    SELECT: 'tradingarea:select',
    ADD: 'tradingarea:add',
    UPDATE: 'tradingarea:update',
    DELETE: 'tradingarea:delete',
  },
  _UPDATE_FIELDS: ['name', 'description', 'longitude', 'latitude', 'radius'],
  _RULES: {
    name: [{ required: true, message: t('model.trading.name'), trigger: 'blur' }],
    longitude: [{ required: true, message: t('model.trading.longitude'), trigger: 'blur' }],
    latitude: [{ required: true, message: t('model.trading.latitude'), trigger: 'blur' }],
    radius: [{ required: true, message: t('model.trading.radius'), trigger: 'blur' }],
    provinceId: [{ required: true, message: t('model.trading.provinceId'), trigger: 'blur' }],
    cityId: [{ required: true, message: t('model.trading.cityId'), trigger: 'blur' }],
    areaId: [{ required: false, message: t('model.trading.areaId'), trigger: 'blur' }],
  },
};

export const _ColumnsTrading = [
  {
    title: t('model.trading.name'),
    key: 'name',
    dataIndex: 'name',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.trading.description'),
    key: 'description',
    dataIndex: 'description',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.trading.state'),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
  {
    title: t('model.metroStation.operation'),
    key: 'operation',
    width: '20%',
    slots: { customRender: 'operation' },
  },
];
