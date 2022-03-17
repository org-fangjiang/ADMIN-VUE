import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface SaleModel {
  saleId?: string;
  maxGetCustomer?: number;
  score?: number;
  scoreTime?: number;
  baseScore?: number;
  companyId?: string;
  groupId?: string;
  extNumber?: string;
}

export const SaleConst = {
  STATES: [
    { value: '0', label: t('model.user.invalid'), color: 'volcano' },
    { value: '1', label: t('model.user.effective'), color: 'geekblue' },
  ],
  _UPDATE_FIELDS: ['maxGetCustomer', 'baseScore', 'extNumber'],
  _RULES: {},
  _PERMS: {
    SELECT: 'crm:sale:select',
    UPDATE: 'crm:sale:update',
    ADD: 'crm:sale:add',
  },
};

export const Columns = [
  {
    title: t('model.user.userName'),
    key: 'username',
    width: '20%',
    dataIndex: 'username',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.user.mobile'),
    key: 'mobile',
    width: '20%',
    dataIndex: 'mobile',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.user.extNumber'),
    key: 'extNumber',
    width: '20%',
    dataIndex: 'extNumber',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.user.state'),
    key: 'state',
    width: '10%',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
  {
    title: t('model.user.action'),
    key: 'operation',
    width: '20%',
    slots: { customRender: 'operation' },
  },
];
