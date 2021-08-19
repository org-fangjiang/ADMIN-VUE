import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';
const workbench: MenuModule = {
  orderNo: 0,
  menu: {
    name: t('routes.dashboard.workbench'),
    path: '/workbench',
    children: [
      {
        path: 'index',
        name: t('routes.dashboard.workbench'),
      },
    ],
  },
};
export default workbench;
