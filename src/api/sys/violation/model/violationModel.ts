import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface ViolationModel {
  id?: string;
  value?: string;
  state?: string;
}

export interface ViolationCondition {
  state?: string;
  value?: string;
}

export const _Const = {
  EFFECTIVE: '1',
  INVALID: '0',
  STATES: [
    { value: '0', label: t('model.link.invalid'), color: 'volcano' },
    { value: '1', label: t('model.role.effective'), color: 'geekblue' },
  ],
  _ADD_FIELDS: ['value'],
  _UPDATE_FIELDS: ['value', 'state'],
  _RULES: {
    value: [{ required: true, message: t('model.violation.value'), trigger: 'blur' }],
  },
  _PERMS: {
    SELECT: 'violation:select',
    ADD: 'violation:add',
    UPDATE: 'violation:update',
    DELETE: 'violation:delete',
  },
};

export const _ViolationColumns = [
  {
    title: t('model.violation.value'),
    key: 'value',
    width: '',
    dataIndex: 'value',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.link.state'),
    key: 'state',
    width: '',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
  {
    title: t('model.link.action'),
    key: 'operation',
    width: '',
    slots: { customRender: 'operation' },
  },
];
