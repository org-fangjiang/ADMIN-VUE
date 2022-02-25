export interface ReportRuleModel {
  projectId?: string;
  isFullNumber?: number;
  isHasFace?: number;
  isRepeatReport?: number;
  reportAfterLook?: number;
  reportProtectTime?: number;
  visitProtectTime?: number;
  revisitProtectTime?: number;
  receiveTimeStart?: string;
  receiveTimeEnd?: string;
  details?: string;
}

export const ReportRuleConst = {
  _PERMS: {
    SELECT: 'crm:rule:select',
    ADD: 'crm:rule:add',
    UPDATE: 'crm:rule:update',
  },
  _UPDATE_FIELDS: [
    'isFullNumber',
    'isHasFace',
    'isRepeatReport',
    'reportAfterLook',
    'reportProtectTime',
    'visitProtectTime',
    'revisitProtectTime',
    'receiveTimeStart',
    'receiveTimeEnd',
    'details',
  ],
  _RULES: {},
};
