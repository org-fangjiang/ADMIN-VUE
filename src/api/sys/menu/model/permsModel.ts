import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export interface MenuModel {
  id?: string;
  parentId?: string;
  menuName?: string;
  path?: string;
  component?: string;
  perms?: string;
  icon?: string;
  type?: string;
  orderNum?: string;
  createTime?: string;
  updateTime?: string;
  createBy?: string;
  state?: string;
}

export interface MenuByCondition {
  id?: string; // 菜单id
  parentId?: string; // 父级菜单id
  state?: string; // 菜单状态 查询菜单详情时此项不需要
}

export const MenuConst = {
  EFFECTIVE: '1',
  INVALID: '0',
  MENU: '0',
  BUTTON: '1',
  STATES: [
    { value: '0', label: t('model.perms.invalid'), color: 'volcano' },
    { value: '1', label: t('model.perms.effective'), color: 'geekblue' },
  ],
  _TYPE: [
    { value: '0', label: t('model.perms.menu'), color: 'volcano' }, // 菜单
    { value: '1', label: t('model.perms.button'), color: 'geekblue' }, // 按钮
  ],
  _ADD_MENU_FIELDS: ['parentId', 'menuName', 'path', 'component', 'icon', 'type', 'orderNum'],
  _ADD_BUTTON_FIELDS: [
    'parentId',
    'menuName',
    'path',
    'component',
    'perms',
    'icon',
    'type',
    'orderNum',
  ],
  _UPDATE_MENU_FIELDS: [
    'parentId',
    'menuName',
    'path',
    'component',
    'icon',
    'type',
    'orderNum',
    'state',
  ],
  _UPDATE_BUTTON_FIELDS: [
    'parentId',
    'menuName',
    'path',
    'component',
    'perms',
    'icon',
    'type',
    'orderNum',
    'state',
  ],
  _MENU_RULES: {
    parentId: [{ required: false, message: t('model.perms.parentId'), trigger: 'blur' }],
    menuName: [{ required: true, message: t('model.perms.menuName'), trigger: 'blur' }],
    path: [{ required: true, message: t('model.perms.path'), trigger: 'blur' }],
    component: [{ required: false, message: t('model.perms.component'), trigger: 'blur' }],
    perms: [{ required: false, message: t('model.perms.perms'), trigger: 'blur' }],
    icon: [{ required: false, message: t('model.perms.icon'), trigger: 'blur' }],
    type: [{ required: true, message: t('model.perms.menu'), trigger: 'blur' }],
    orderNum: [{ required: false, message: t('model.perms.orderNum'), trigger: 'blur' }],
    createTime: [{ required: false, message: t('model.perms.createTime'), trigger: 'blur' }],
    updateTime: [{ required: false, message: t('model.perms.updateTime'), trigger: 'blur' }],
    createBy: [{ required: false, message: t('model.perms.createBy'), trigger: 'blur' }],
    state: [{ required: true, message: t('model.perms.state'), trigger: 'blur' }],
  },
  _BUTTON_RULES: {
    parentId: [{ required: true, message: t('model.perms.parentId'), trigger: 'blur' }],
    menuName: [{ required: true, message: t('model.perms.menuName'), trigger: 'blur' }],
    path: [{ required: true, message: t('model.perms.path'), trigger: 'blur' }],
    component: [{ required: false, message: t('model.perms.component'), trigger: 'blur' }],
    perms: [{ required: false, message: t('model.perms.perms'), trigger: 'blur' }],
    icon: [{ required: false, message: t('model.perms.icon'), trigger: 'blur' }],
    type: [{ required: true, message: t('model.perms.button'), trigger: 'blur' }],
    orderNum: [{ required: false, message: t('model.perms.orderNum'), trigger: 'blur' }],
    createTime: [{ required: false, message: t('model.perms.createTime'), trigger: 'blur' }],
    updateTime: [{ required: false, message: t('model.perms.updateTime'), trigger: 'blur' }],
    createBy: [{ required: false, message: t('model.perms.createBy'), trigger: 'blur' }],
    state: [{ required: true, message: t('model.perms.state'), trigger: 'blur' }],
  },
  _PERMS: {
    SELECT: 'menu:select',
    ADD: 'menu:add',
    UPDATE: 'menu:update',
    DELETE: 'menu:delete',
  },
};

export const _Component_Columns = [
  {
    title: t('model.perms.name'),
    key: 'name',
    width: '20%',
    dataIndex: 'menuName',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.perms.path'),
    key: 'path',
    width: '10%',
    dataIndex: 'path',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.perms.perms'),
    key: 'perms',
    width: '10%',
    dataIndex: 'perms',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.perms.icon'),
    key: 'icon',
    width: '10%',
    dataIndex: 'icon',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.perms.type'),
    key: 'type',
    width: '10%',
    dataIndex: 'type',
    ellipsis: 'true',
    slots: { customRender: 'type' },
  },
  {
    title: t('model.perms.state'),
    key: 'state',
    width: '10%',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
];

export const _Columns = [
  ..._Component_Columns,
  {
    title: t('model.perms.action'),
    key: 'operation',
    width: '30%',
    slots: { customRender: 'operation' },
  },
];
// SYS_MENU_MISS_ID(4049, "菜单权限参数错误：编号"),
// SYS_MENU_MISS_MENU_NAME(4049, "菜单权限参数错误：名称"),
// SYS_MENU_MISS_PATH(4049, "菜单权限参数错误：路径"),
// SYS_MENU_MISS_TYPE(4049, "菜单权限参数错误：类型"),
// SYS_MENU_MISS_PERMS(4049, "菜单权限参数错误：权限标识符"),
// SYS_MENU_MISS_PARENT_ID(4049, "菜单权限参数错误：上级编号"),
// SYS_MENU_MISS_STATE(4049, "菜单权限参数错误：状态"),
// SYS_MENU_IS_EXIST(4009, "菜单权限已存在"),
// SYS_MENU_IS_NOT_EXIST(4010, "菜单权限不存在"),
// SYS_MENU_PARENT_IS_EXIST(4019, "菜单权限上级已存在"),
// SYS_MENU_PARENT_IS_NOT_EXIST(4020, "菜单权限上级不存在"),
