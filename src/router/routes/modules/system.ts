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
    icon: 'ant-design:setting-filled',
    title: t('routes.system.system'),
    roles: ['/system'],
  },
  children: [
    {
      path: 'location',
      name: 'Location',
      component: () => import('/@/views/sys/location/index.vue'),
      meta: {
        title: t('routes.system.location'),
        roles: ['/system/location'],
        icon: 'mdi:compass',
      },
    },
    {
      path: 'metro',
      name: 'Metro',
      component: () => import('/@/views/sys/metro/index.vue'),
      meta: {
        title: t('routes.system.metro'),
        roles: ['/system/metro'],
        icon: 'maki:rail-metro',
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
    {
      path: 'company',
      name: 'Company',
      component: () => import('/@/views/sys/company/index.vue'),
      meta: {
        title: t('routes.system.company'),
        roles: ['/system/company'],
        icon: 'clarity:organization-solid',
      },
    },
    {
      path: 'dept',
      name: 'Dept',
      component: () => import('/@/views/sys/department/index.vue'),
      meta: {
        title: t('routes.system.dept'),
        roles: ['/system/dept'],
      },
    },
    {
      path: 'menu',
      name: 'Menu',
      component: () => import('/@/views/sys/menu/index.vue'),
      meta: {
        title: t('routes.system.menu'),
        roles: ['/system/menu'],
        icon: 'bx:bx-menu',
      },
    },
    {
      path: 'role',
      name: 'Role',
      component: () => import('/@/views/sys/role/index.vue'),
      meta: {
        title: t('routes.system.role'),
        roles: ['/system/role'],
        icon: 'ri:function-fill',
      },
    },
    {
      path: 'user',
      name: 'User',
      component: () => import('/@/views/sys/user/index.vue'),
      meta: {
        title: t('routes.system.user'),
        roles: ['/system/user'],
        icon: 'mdi:account',
      },
    },
  ],
};

export default system;