import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const system: AppRouteModule = {
  path: '/system',
  name: 'System',
  component: LAYOUT,
  redirect: '/system/location',
  meta: {
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: t('routes.system.system'),
  },
  children: [
    {
      path: 'location',
      name: 'Location',
      component: () => import('/@/views/sys/location/index.vue'),
      meta: {
        title: t('routes.system.location'),
        roles: ['/system/location'],
      },
    },
    {
      path: 'metro',
      name: 'Metro',
      component: () => import('/@/views/sys/metro/index.vue'),
      meta: {
        title: t('routes.system.metro'),
        roles: ['/system/metro'],
      },
    },
    {
      path: 'trading',
      name: 'Trading',
      component: () => import('/@/views/sys/trading/index.vue'),
      meta: {
        title: t('routes.system.trading'),
        roles: ['/system/trading'],
      },
    },
    {
      path: 'dict',
      name: 'Dict',
      component: () => import('/@/views/sys/dict/index.vue'),
      meta: {
        title: t('routes.system.dict'),
        roles: ['/system/dict'],
      },
    },
    // {
    //   path: 'workbench',
    //   name: 'Workbench',
    //   component: () => import('/@/views/dashboard/workbench/index.vue'),
    //   meta: {
    //     title: t('routes.dashboard.workbench'),
    //   },
    // },
  ],
};

export default system;
