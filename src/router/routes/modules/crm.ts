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
    {
      path: 'deal',
      name: 'Deal',
      component: () => import('/@/views/crm/deal/index.vue'),
      meta: {
        title: t('routes.crm.deal'),
        roles: ['/crm/deal'],
      },
    },
    {
      path: 'invalid',
      name: 'Invalid',
      component: () => import('/@/views/crm/invalid/index.vue'),
      meta: {
        title: t('routes.crm.invalid'),
        roles: ['/crm/invalid'],
      },
    },
  ],
};

export default crm;
