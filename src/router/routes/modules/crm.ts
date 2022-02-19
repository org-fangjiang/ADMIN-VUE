import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const crm: AppRouteModule = {
  path: '/crm',
  name: 'Customer',
  component: LAYOUT,
  redirect: '/crm/customer',
  meta: {
    orderNo: 10,
    title: t('routes.crm.customer'),
    roles: ['/crm'],
  },
  children: [
    {
      path: 'customer',
      name: 'Customer',
      component: () => import('/@/views/crm/customer/index.vue'),
      meta: {
        title: t('routes.crm.customer'),
        roles: ['/crm/customer'],
      },
    },
  ],
};

export default crm;
