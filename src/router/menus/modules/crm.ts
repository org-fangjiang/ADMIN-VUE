import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';
const crm: MenuModule = {
  orderNo: 10,
  menu: {
    name: t('routes.crm.customer'),
    path: '/crm',
    children: [
      {
        path: 'customer',
        name: t('routes.crm.customer'),
      },
      {
        path: 'deal',
        name: t('routes.crm.deal'),
      },
      {
        path: 'invalid',
        name: t('routes.crm.invalid'),
      },
      {
        path: 'myReport',
        name: t('routes.crm.myReport'),
      },
      {
        path: 'review',
        name: t('routes.crm.review'),
      },
      {
        path: 'look',
        name: t('routes.crm.look'),
      },
      {
        path: 'examineLook',
        name: t('routes.crm.examineLook'),
      },
    ],
  },
};
export default crm;
