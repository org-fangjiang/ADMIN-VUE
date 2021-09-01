import { propTypes } from '/@/utils/propTypes';

export const basicProps = {
  ids: propTypes.arrayOf(propTypes.string).def([]),
  size: propTypes.string.def('default'),
  placeholder: propTypes.string.def(''),
};
