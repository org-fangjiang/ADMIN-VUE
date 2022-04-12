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
  ],
};

export default ohouse;
