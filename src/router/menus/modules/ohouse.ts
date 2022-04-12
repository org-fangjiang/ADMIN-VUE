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
    ],
  },
};

export default ohouse;
