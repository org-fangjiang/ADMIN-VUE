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
      {
        path: 'news',
        name: t('routes.house.news'),
      },
      {
        path: 'recommend',
        name: t('routes.house.recommend'),
      },
      {
        path: 'estateCompany',
        name: t('routes.house.estateCompany'),
      },
      {
        path: 'brand',
        name: t('routes.house.brand'),
      },
      {
        path: 'developer',
        name: t('routes.house.developer'),
      },
      {
        path: 'banner',
        name: t('routes.house.banner'),
      },
      {
        path: 'note',
        name: t('routes.house.note'),
      },
    ],
  },
};
export default house;
