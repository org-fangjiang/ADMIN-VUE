import { MenuModel } from '../../menu/model/menuModel';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export interface RoleModel {
  id?: string;
  roleName?: string;
  remake?: string;
  createTime?: string;
  updateTime?: string;
  createBy?: string;
  updateBy?: string;
  companyId?: string;
  state?: string;
  sysRoleMenusById?: MenuModel[];
  menus?: MenuModel[];
}

export interface RoleByCondition {
  id?: string; // role id
  companyId?: string; // 查询企业下角色使用
  state?: string; // role state
}

export const RoleConst = {
  EFFECTIVE: '1',
  INVALID: '0',
  STATES: [
    { value: '0', label: t('model.role.invalid'), color: 'volcano' },
    { value: '1', label: t('model.role.effective'), color: 'geekblue' },
  ],
  _ADD_FIELDS: ['roleName', 'remake', 'companyId', 'sysRoleMenusById'],
  _UPDATE_FIELDS: ['roleName', 'remake'],
  _RULES: {
    roleName: [{ required: true, message: t('model.role.roleName'), trigger: 'blur' }],
    remake: [{ required: false, message: t('model.role.remake'), trigger: 'blur' }],
  },
  _PERMS: {
    SELECT: 'department:select',
    ADD: 'department:add',
    UPDATE: 'department:update',
    DELETE: 'department:delete',
  },
};

export const RoleColumns = [
  {
    title: t('model.role.roleName'),
    key: 'name',
    dataIndex: 'roleName',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.role.state'),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
  {
    title: t('model.location.area.action'),
    key: 'action',
    ellipsis: 'true',
    slots: { customRender: 'action' },
  },
];
