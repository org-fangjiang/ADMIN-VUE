import { propTypes } from '/@/utils/propTypes';

export const basicProps = {
  provinceId: propTypes.string.def(''),
  cityId: propTypes.string.def(''),
  areaId: propTypes.string.def(''),
  size: propTypes.string.def('default'),
  placeholder: propTypes.string.def(''),
  disabledProvince: propTypes.bool.def(false),
  disabledCity: propTypes.bool.def(false),
  disabledArea: propTypes.bool.def(false),
};
