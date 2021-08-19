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
    ],
  },
};
export default system;
