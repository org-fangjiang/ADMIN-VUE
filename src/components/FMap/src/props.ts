import { propTypes } from '/@/utils/propTypes';
// POI TYPE 150000 交通 150500 地铁 120000 商务住宅 090000 医疗保健服务
export const basicProps = {
  type: propTypes.string.def(''), // POI type | 分隔
  longitude: propTypes.string.def(''),
  latitude: propTypes.string.def(''),
  searchText: propTypes.string.def(''),
  cityId: propTypes.string.def(''),
  citylimit: propTypes.bool.def(false), // 是否强制限制在指定城市下搜索
};
