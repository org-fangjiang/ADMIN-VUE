import { propTypes } from '/@/utils/propTypes';

export const basicProps = {
  provinceId: propTypes.string.def(undefined),
  cityId: propTypes.string.def(undefined),
  areaId: propTypes.string.def(undefined),
  size: propTypes.string.def('default'),
  placeholder: propTypes.string.def(''),
  disProCity: propTypes.bool.def(false),
};
