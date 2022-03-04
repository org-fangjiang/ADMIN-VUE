import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface ResidentModel {
  userId?: string;
  projectId?: string;
  projectById?: any;
}

export const ResidentConst = {
  STATES: [
    { value: '0', label: t('model.user.invalid'), color: 'volcano' },
    { value: '1', label: t('model.user.effective'), color: 'geekblue' },
  ],
  _PERMS: {
    MANAGE: 'crm:resident:manage',
  },
};

export const ResidentColumns = [
  {
    title: t('model.user.userName'),
    key: 'username',
    dataIndex: 'username',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.user.mobile'),
    key: 'mobile',
    dataIndex: 'mobile',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.user.state'),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
  {
    title: t('model.user.action'),
    key: 'operation',
    slots: { customRender: 'operation' },
  },
];
