import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
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

export interface MenuByCondition {
  id?: string; // 菜单id
  parentId?: string; // 父级菜单id
  state?: string; // 菜单状态 查询菜单详情时此项不需要
}

export const MenuConst = {
  EFFECTIVE: '1',
  INVALID: '0',
  STATES: [
    { value: '0', label: t(''), color: 'volcano' },
    { value: '1', label: t(''), color: 'geekblue' },
  ],
  _TYPE: [
    { value: '0', label: t(''), color: 'volcano' }, // 菜单
    { value: '1', label: t(''), color: 'geekblue' }, // 按钮
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
    parentId: [{ required: true, message: t(''), trigger: 'blur' }],
    menuName: [{ required: true, message: t(''), trigger: 'blur' }],
    path: [{ required: true, message: t(''), trigger: 'blur' }],
    component: [{ required: false, message: t(''), trigger: 'blur' }],
    perms: [{ required: false, message: t(''), trigger: 'blur' }],
    icon: [{ required: false, message: t(''), trigger: 'blur' }],
    type: [{ required: true, message: t(''), trigger: 'blur' }],
    orderNum: [{ required: false, message: t(''), trigger: 'blur' }],
    createTime: [{ required: false, message: t(''), trigger: 'blur' }],
    updateTime: [{ required: false, message: t(''), trigger: 'blur' }],
    createBy: [{ required: false, message: t(''), trigger: 'blur' }],
    state: [{ required: true, message: t(''), trigger: 'blur' }],
  },
  _BUTTON_RULES: {
    parentId: [{ required: true, message: t(''), trigger: 'blur' }],
    menuName: [{ required: true, message: t(''), trigger: 'blur' }],
    path: [{ required: true, message: t(''), trigger: 'blur' }],
    component: [{ required: false, message: t(''), trigger: 'blur' }],
    perms: [{ required: false, message: t(''), trigger: 'blur' }],
    icon: [{ required: false, message: t(''), trigger: 'blur' }],
    type: [{ required: true, message: t(''), trigger: 'blur' }],
    orderNum: [{ required: false, message: t(''), trigger: 'blur' }],
    createTime: [{ required: false, message: t(''), trigger: 'blur' }],
    updateTime: [{ required: false, message: t(''), trigger: 'blur' }],
    createBy: [{ required: false, message: t(''), trigger: 'blur' }],
    state: [{ required: true, message: t(''), trigger: 'blur' }],
  },
  _PERMS: {
    SELECT: 'menu:select',
    ADD: 'menu:add',
    UPDATE: 'menu:update',
    DELETE: 'menu:delete',
  },
};

export const Columns = [
  {
    title: t(''),
    key: 'menuName',
    dataIndex: 'menuName',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t(''),
    key: 'path',
    dataIndex: 'path',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t(''),
    key: 'perms',
    dataIndex: 'perms',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t(''),
    key: 'icon',
    dataIndex: 'icon',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t(''),
    key: 'type',
    dataIndex: 'type',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t(''),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t(''),
    key: 'action',
    ellipsis: 'true',
    slots: { customRender: 'action' },
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
