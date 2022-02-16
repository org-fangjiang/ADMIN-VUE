import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface QuestionModel {
  id?: string;
  content?: string;
  projectId?: string;
  lookTimes?: number;
}

export interface QuestionCondition {
  id?: string;
  projectId?: string;
  state?: string;
}

export const _QuestionConst = {
  EFFECTIVE: '1', // 有效
  INVALID: '0', // 无效
  STATES: [
    { value: '0', label: t('host.INVALID'), color: 'volcano' },
    { value: '1', label: t('host.EFFECTIVE'), color: 'geekblue' },
  ],
  EXAMINESTATES: [
    { value: '0', label: t('host.INVALID'), color: 'volcano' },
    { value: '1', label: t('host.EFFECTIVE'), color: 'geekblue' },
    { value: '2', label: t('model.question.willPass'), color: 'geekblue' },
    { value: '3', label: t('model.question.failed'), color: 'geekblue' },
  ],
  _PERMS: {
    SELECT: 'question:select',
    ADD: 'question:add',
    UPDATE: 'question:update',
    DELETE: 'question:delete',
    EXAMINE: 'question:examine',
  },
  _UPDATE_FIELDS: ['content'],
  _RULES: {
    content: [{ required: true, message: t('host.question.content'), trigger: 'blur' }],
    projectId: [{ required: true, message: t('host.question.projectId'), trigger: 'blur' }],
  },
};

export const _ColumnsQuestion = [
  {
    title: t('host.question.content'),
    key: 'content',
    dataIndex: 'content',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.question.lookTimes'),
    key: 'lookTimes',
    dataIndex: 'lookTimes',
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

export const _Columns = [
  {
    title: t('host.question.content'),
    key: 'content',
    dataIndex: 'content',
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
