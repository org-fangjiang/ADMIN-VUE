import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface ChannelCaseModel {
  id?: string;
  name?: string;
  contact?: string;
  avatar?: string;
  channelId?: string;
}

export interface ChannelCaseCondition {
  id?: string;
  channelId?: string;
  state?: string;
  projectId?: string;
  contact?: string;
}

export const _ChannelCaseConst = {
  EFFECTIVE: '1', // 有效
  INVALID: '0', // 无效
  STATES: [
    { value: '0', label: t('host.INVALID'), color: 'volcano' },
    { value: '1', label: t('host.EFFECTIVE'), color: 'geekblue' },
  ],
  _PERMS: {
    SELECT: 'channelCase:select',
    ADD: 'channelCase:add',
    UPDATE: 'channelCase:update',
    DELETE: 'channelCase:delete',
  },
  _UPDATE_FIELDS: ['name', 'avatar', 'contact'],
  _RULES: {
    name: [{ required: true, message: t('host.channelCase.name'), trigger: 'blur' }],
    contact: [{ required: true, message: t('host.channelCase.contact'), trigger: 'blur' }],
    channelId: [{ required: true, message: t('host.channelCase.channelId'), trigger: 'blur' }],
  },
};

export const Columns = [
  {
    title: t('host.channelCase.avatar'),
    key: 'avatar',
    dataIndex: 'avatar',
    ellipsis: 'true',
    slots: { customRender: 'avatar' },
  },
  {
    title: t('host.channelCase.name'),
    key: 'name',
    dataIndex: 'name',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.channelCase.contact'),
    key: 'contact',
    dataIndex: 'contact',
    ellipsis: 'true',
    slots: '',
  },
  // {
  //   title: t('host.channelCase.channelId'),
  //   key: 'channelId',
  //   dataIndex: 'channelId',
  //   ellipsis: 'true',
  //   slots: '',
  // },
  {
    title: t('host.state'),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
];

export const _ColumnsChannelCase = [
  ...Columns,
  {
    title: t('host.operation'),
    key: 'operation',
    ellipsis: 'true',
    slots: { customRender: 'operation' },
  },
];
