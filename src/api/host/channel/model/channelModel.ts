import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface ChannelModel {
  id?: string;
  name?: string;
  username?: string;
  contact?: string;
  description?: string;
}

export interface ChannelCondition {
  id?: string;
  name?: string;
  state?: string;
}

export const _ChannelConst = {
  EFFECTIVE: '1', // 有效
  INVALID: '0', // 无效
  STATES: [
    { value: '0', label: t('host.INVALID'), color: 'volcano' },
    { value: '1', label: t('host.EFFECTIVE'), color: 'geekblue' },
  ],
  _PERMS: {
    SELECT: 'channel:select',
    ADD: 'channel:add',
    UPDATE: 'channel:update',
    DELETE: 'channel:delete',
  },
  _UPDATE_FIELDS: ['name', 'username', 'contact', 'description'],
  _RULES: {
    name: [{ required: true, message: t('host.channel.name'), trigger: 'blur' }],
    username: [{ required: true, message: t('host.channel.username'), trigger: 'blur' }],
    contact: [{ required: true, message: t('host.channel.contact'), trigger: 'blur' }],
    // description: [{ required: true, message: t('host.channel.description'), trigger: 'blur' }],
  },
};

export const _ColumnsChannel = [
  {
    title: t('host.channel.name'),
    key: 'name',
    dataIndex: 'name',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.channel.username'),
    key: 'username',
    dataIndex: 'username',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.channel.contact'),
    key: 'contact',
    dataIndex: 'contact',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.state'),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
  {
    title: t('host.operation'),
    key: 'operation',
    ellipsis: 'true',
    slots: { customRender: 'operation' },
  },
];
