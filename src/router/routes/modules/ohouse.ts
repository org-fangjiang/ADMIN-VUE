import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const ohouse: AppRouteModule = {
  path: '/ohouse',
  name: 'ohouse',
  component: LAYOUT,
  redirect: '/ohouse/oproject',
  meta: {
    orderNo: 10,
    title: t('routes.ohouse.project'),
    roles: ['/ohouse'],
  },
  children: [
    {
      path: 'oproject',
      name: 'OProject',
      component: () => import('/@/views/ohouse/project/index.vue'),
      meta: {
        title: t('routes.ohouse.adminProject'),
        roles: ['/ohouse/oproject'],
      },
    },
    {
      path: 'approval',
      name: 'Approval',
      component: () => import('/@/views/ohouse/approval/index.vue'),
      meta: {
        title: t('routes.ohouse.approval'),
        roles: ['/ohouse/approval'],
      },
    },
    {
      path: 'selfCreate',
      name: 'SelfCreate',
      component: () => import('/@/views/ohouse/selfCreate/index.vue'),
      meta: {
        title: t('routes.ohouse.selfCreate'),
        roles: ['/ohouse/selfCreate'],
      },
    },
    {
      path: 'invalidHouse',
      name: 'InvalidHouse',
      component: () => import('/@/views/ohouse/invalidHouse/index.vue'),
      meta: {
        title: t('routes.ohouse.invalidHouse'),
        roles: ['/ohouse/invalidHouse'],
      },
    },
    {
      path: 'maintain',
      name: 'Maintain',
      component: () => import('/@/views/ohouse/maintain/index.vue'),
      meta: {
        title: t('routes.ohouse.maintain'),
        roles: ['/ohouse/maintain'],
      },
    },
  ],
};

export default ohouse;
