import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export interface TimeRuleModel {
  companyId?: string;
  clueUnclaimed?: number;
  clueUnFollow?: number;
  clueDropLevel?: number;
  companyById?: any;
}

export interface TimeRuleCondition {
  companyId?: string;
}

export const TimeRuleConst = {
  _PERMS: {
    SELECT: 'time-rule:select',
    ADD: 'time-rule:add',
    UPDATE: 'time-rule:update',
  },
  _UPDATE_FIELDS: ['clueDropLevel', 'clueUnFollow', 'clueUnclaimed'],
  _RULES: {
    clueDropLevel: [
      {
        required: true,
        type: 'number',
        message: t('marketing.timeRule.clueDropLevel'),
        trigger: 'blur',
      },
    ],
    clueUnFollow: [
      {
        required: true,
        type: 'number',
        message: t('marketing.timeRule.clueUnFollow'),
        trigger: 'blur',
      },
    ],
    clueUnclaimed: [
      {
        required: true,
        type: 'number',
        message: t('marketing.timeRule.clueUnclaimed'),
        trigger: 'blur',
      },
    ],
  },
};

export const TimeRuleColumns = [
  {
    title: t('marketing.timeRule.clueDropLevel'),
    key: 'clueDropLevel',
    ellipsis: 'true',
    slots: { customRender: 'clueDropLevel' },
  },
  {
    title: t('marketing.timeRule.clueUnFollow'),
    key: 'clueUnFollow',
    ellipsis: 'true',
    slots: { customRender: 'clueUnFollow' },
  },
  {
    title: t('marketing.timeRule.clueUnclaimed'),
    key: 'clueUnclaimed',
    ellipsis: 'true',
    slots: { customRender: 'clueUnclaimed' },
  },
  {
    title: t('marketing.timeRule.companyId'),
    key: 'companyId',
    ellipsis: 'true',
    slots: { customRender: 'companyId' },
  },
  {
    title: t('marketing.operation'),
    key: 'operation',
    ellipsis: 'true',
    slots: { customRender: 'operation' },
  },
];
