export interface MenuModel {
  id: string;
  parentId: string;
  menuName: string;
  path: string;
  component: string;
  perms: string;
  icon: string;
  type: string;
  orderNum: string;
  createTime: string;
  updateTime: string;
  createBy: string;
  state: string;
}

export const MenuConst = {
  EFFECTIVE: '1',
  INVALID: '0',
  STATES: ['0', '1'],
};
