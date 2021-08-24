import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';
const system: MenuModule = {
  orderNo: 10,
  menu: {
    name: t('routes.system.system'),
    path: '/system',
    children: [
      {
        path: 'location',
        name: t('routes.system.location'),
      },
      {
        path: 'metro',
        name: t('routes.system.metro'),
      },
      {
        path: 'trading',
        name: t('routes.system.trading'),
      },
      {
        path: 'dict',
        name: t('routes.system.dict'),
      },
      {
        path: 'company',
        name: t('routes.system.company'),
      },
      {
        path: 'dept',
        name: t('routes.system.dept'),
      },
      {
        path: 'menu',
        name: t('routes.system.menu'),
      },
      {
        path: 'role',
        name: t('routes.system.role'),
      },
      {
        path: 'user',
        name: t('routes.system.user'),
      },
    ],
  },
};
export default system;