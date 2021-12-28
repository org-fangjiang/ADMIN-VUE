import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';
const marketing: MenuModule = {
  orderNo: 10,
  menu: {
    name: t('routes.marketing.marketing'),
    path: '/marketing',
    children: [
      {
        path: 'clue',
        name: t('routes.marketing.clue'),
      },
      {
        path: 'addClue',
        name: t('routes.marketing.addClue'),
      },
      {
        path: 'activity',
        name: t('routes.marketing.activity'),
      },
    ],
  },
};
export default marketing;
