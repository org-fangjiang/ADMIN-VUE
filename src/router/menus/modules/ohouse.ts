import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';
const ohouse: MenuModule = {
  orderNo: 10,
  menu: {
    name: t('routes.ohouse.project'),
    path: '/ohouse',
    children: [
      {
        path: 'oproject',
        name: t('routes.ohouse.adminProject'),
      },
      {
        path: 'approval',
        name: t('routes.ohouse.approval'),
      },
      {
        path: 'selfCreate',
        name: t('routes.ohouse.selfCreate'),
      },
    ],
  },
};

export default ohouse;
