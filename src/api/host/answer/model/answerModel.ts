import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface AnswerModel {
  id?: string;
  content?: string;
  author?: string;
  avatar?: string;
  likeNum?: number;
  questionId?: string;
}

export interface AnswerCondition {
  id?: string;
  state?: string;
  questionId?: string;
}

export const _AnswerConst = {
  EFFECTIVE: '1', // 有效
  INVALID: '0', // 无效
  STATES: [
    { value: '0', label: t('host.INVALID'), color: 'volcano' },
    { value: '1', label: t('host.EFFECTIVE'), color: 'geekblue' },
  ],
  _PERMS: {
    SELECT: 'answers:select',
    ADD: 'answers:add',
    UPDATE: 'answers:update',
    DELETE: 'answers:delete',
  },
  _UPDATE_FIELDS: ['content'],
  _RULES: {
    content: [{ required: true, message: t('host.answer.content'), trigger: 'blur' }],
    questionId: [{ required: true, message: t('host.answer.questionId'), trigger: 'blur' }],
    author: [{ required: true, message: t('host.answer.author'), trigger: 'blur' }],
  },
};

export const _ColumnsAnswer = [
  {
    title: t('host.answer.content'),
    key: 'content',
    dataIndex: 'content',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.answer.author'),
    key: 'author',
    dataIndex: 'author',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.answer.likeNum'),
    key: 'likeNum',
    dataIndex: 'likeNum',
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
