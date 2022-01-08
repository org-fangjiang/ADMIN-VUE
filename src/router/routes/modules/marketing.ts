import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const marketing: AppRouteModule = {
  path: '/marketing',
  name: 'Marketing',
  component: LAYOUT,
  redirect: '/marketing/clue',
  meta: {
    orderNo: 10,
    title: t('routes.marketing.marketing'),
    roles: ['/marketing'],
  },
  children: [
    {
      path: 'clue',
      name: 'Clue',
      component: () => import('/@/views/marketing/clue/index.vue'),
      meta: {
        title: t('routes.marketing.clue'),
        roles: ['/marketing/clue'],
      },
    },
    {
      path: 'addClue',
      name: 'AddClue',
      component: () => import('/@/views/marketing/addClue/index.vue'),
      meta: {
        title: t('routes.marketing.addClue'),
        roles: ['/marketing/addClue'],
      },
    },
    {
      path: 'activity',
      name: 'Activity',
      component: () => import('/@/views/marketing/activity/index.vue'),
      meta: {
        title: t('routes.marketing.activity'),
        roles: ['/marketing/activity'],
      },
    },
    {
      path: 'timeRule',
      name: 'TimeRule',
      component: () => import('/@/views/marketing/timeRule/index.vue'),
      meta: {
        title: t('routes.marketing.timeRule'),
        roles: ['/marketing/timeRule'],
      },
    },
    {
      path: 'allTimeRule',
      name: 'AllTimeRule',
      component: () => import('/@/views/marketing/allTimeRule/index.vue'),
      meta: {
        title: t('routes.marketing.allTimeRule'),
        roles: ['/marketing/allTimeRule'],
      },
    },
  ],
};

export default marketing;
