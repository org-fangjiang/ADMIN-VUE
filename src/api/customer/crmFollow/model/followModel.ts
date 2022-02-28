import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export interface FollowModel {
  id?: string;
  description?: string;
  resultType?: string;
  projectId?: string;
  videoAddress?: string;
  nextFollowTime?: string;
  customerId?: string;
  saleId?: string;
  groupId?: string;
  companyId?: string;
  state?: string;
  userBySaleId?: any;
}

export const FollowConst = {
  STATES: [
    { value: '0', label: t('marketing.follow.INVALID'), color: 'volcano' },
    { value: '1', label: t('marketing.follow.EFFECTIVE'), color: 'geekblue' },
  ],
  RESULT_TYPES: [
    { value: '1', label: t('marketing.follow.RESULT_TYPE_1'), color: 'volcano' },
    { value: '2', label: t('marketing.follow.RESULT_TYPE_2'), color: 'geekblue' },
    { value: '3', label: t('marketing.follow.RESULT_TYPE_3'), color: 'volcano' },
    { value: '4', label: t('marketing.follow.RESULT_TYPE_4'), color: 'geekblue' },
    { value: '5', label: t('marketing.follow.RESULT_TYPE_5'), color: 'geekblue' },
    { value: '6', label: t('marketing.follow.RESULT_TYPE_6'), color: 'volcano' },
    { value: '7', label: t('marketing.follow.RESULT_TYPE_7'), color: 'geekblue' },
  ],
  _RULES: {
    description: [{ required: true, message: t('marketing.follow.description'), trigger: 'blur' }],
    resultType: [{ required: true, message: t('marketing.follow.resultType'), trigger: 'blur' }],
    projectId: [{ required: true, message: t('marketing.follow.projectId'), trigger: 'blur' }],
    nextFollowTime: [
      { required: true, message: t('marketing.follow.nextFollowTime'), trigger: 'blur' },
    ],
    customerId: [{ required: true, message: t('marketing.follow.customerId'), trigger: 'blur' }],
    state: [{ required: true, message: t('marketing.follow.state'), trigger: 'blur' }],
  },
  _UPDATE_FIELDS: ['resultType', 'description', 'nextFollowTime', 'videoAddress'],
};
