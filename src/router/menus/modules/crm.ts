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
    ],
  },
};
export default crm;
