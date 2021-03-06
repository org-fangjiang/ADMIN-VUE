import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';
const about: MenuModule = {
  orderNo: 10,
  menu: {
    name: t('routes.dashboard.about'),
    path: '/about',
    children: [
      {
        path: 'index',
        name: t('routes.dashboard.about'),
      },
    ],
  },
};
export default about;
