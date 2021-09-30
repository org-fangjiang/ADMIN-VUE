import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';
const house: MenuModule = {
  orderNo: 10,
  menu: {
    name: t('routes.house.project'),
    path: '/house',
    children: [
      {
        path: 'project',
        name: t('routes.house.property'),
      },
    ],
  },
};
export default house;