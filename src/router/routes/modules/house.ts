import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const house: AppRouteModule = {
  path: '/house',
  name: 'House',
  component: LAYOUT,
  redirect: '/house/project',
  meta: {
    orderNo: 10,
    title: t('routes.house.project'),
    roles: ['/house'],
  },
  children: [
    {
      path: 'project',
      name: 'Project',
      component: () => import('/@/views/house/project/index.vue'),
      meta: {
        title: t('routes.house.property'),
        roles: ['/house/project'],
      },
    },
    {
      path: 'news',
      name: 'news',
      component: () => import('/@/views/house/news/index.vue'),
      meta: {
        title: t('routes.house.news'),
        roles: ['/house/news'],
      },
    },
    {
      path: 'recommend',
      name: 'recommend',
      component: () => import('/@/views/house/recommend/index.vue'),
      meta: {
        title: t('routes.house.recommend'),
        roles: ['/house/recommend'],
      },
    },
    {
      path: 'estateCompany',
      name: 'estateCompany',
      component: () => import('/@/views/house/estateCompany/index.vue'),
      meta: {
        title: t('routes.house.estateCompany'),
        roles: ['/house/estateCompany'],
      },
    },
    {
      path: 'brand',
      name: 'brand',
      component: () => import('/@/views/house/brand/index.vue'),
      meta: {
        title: t('routes.house.brand'),
        roles: ['/house/brand'],
      },
    },
    {
      path: 'developer',
      name: 'developer',
      component: () => import('/@/views/house/developer/index.vue'),
      meta: {
        title: t('routes.house.developer'),
        roles: ['/house/developer'],
      },
    },
    {
      path: 'banner',
      name: 'banner',
      component: () => import('/@/views/house/banner/index.vue'),
      meta: {
        title: t('routes.house.banner'),
        roles: ['/house/banner'],
      },
    },
    {
      path: 'note',
      name: 'note',
      component: () => import('/@/views/house/note/index.vue'),
      meta: {
        title: t('routes.house.note'),
        roles: ['/house/note'],
      },
    },
  ],
};

export default house;
