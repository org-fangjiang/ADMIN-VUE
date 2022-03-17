import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface SaleProjectModel {
  saleId?: string;
  projectId?: string;
  reportTimes?: number;
  lookTimes?: number;
  dealTimes?: number;
  score?: number;
  state?: string;
}

export const SaleProjectConst = {
  STATES: [
    { value: '0', label: t('crm.saleProject.INVALID'), color: 'volcano' },
    { value: '1', label: t('crm.saleProject.EFFECTIVE'), color: 'geekblue' },
    { value: '2', label: t('crm.saleProject.STATE2'), color: 'red' },
  ],
  _PERMS: {
    ADD: 'crm:sale-project:add',
    DELETE: 'crm:sale-project:delete',
  },
};

export const SaleProjectColumns = [
  {
    title: t('crm.saleProject.saleId'),
    key: 'sysUserRelationEntity',
    dataIndex: 'sysUserRelationEntity',
    ellipsis: 'true',
    slots: { customRender: 'sysUserRelationEntity' },
  },
  {
    title: t('crm.saleProject.reportTimes'),
    key: 'reportTimes',
    dataIndex: 'reportTimes',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('crm.saleProject.lookTimes'),
    key: 'lookTimes',
    dataIndex: 'lookTimes',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('crm.saleProject.dealTimes'),
    key: 'dealTimes',
    dataIndex: 'dealTimes',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('crm.saleProject.score'),
    key: 'score',
    dataIndex: 'score',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('crm.state'),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
  // {
  //   title: t('crm.operation'),
  //   key: 'operation',
  //   ellipsis: 'true',
  //   slots: { customRender: 'operation' },
  // },
];
