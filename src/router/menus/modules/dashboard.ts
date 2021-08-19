import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';
const dashboard: MenuModule = {
  orderNo: 10,
  menu: {
    name: t('routes.dashboard.dashboard'),
    path: '/system',
    children: [
      {
        path: 'function',
        name: t('routes.dashboard.analysis'),
      },
      // {
      //   path: 'workbench',
      //   name: t('routes.dashboard.workbench'),
      // },
    ],
  },
};
export default dashboard;
