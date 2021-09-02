import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export interface DepartmentModel {
  deptId?: string;
  parentId?: string;
  deptName?: string;
  orderNum?: number;
  createTime?: string;
  updateTime?: string;
  createBy?: string;
  updateBy?: string;
  companyId?: string;
  hasChild?: boolean;
}

export interface DepartmentByCondition {
  deptId?: string; // departmentId
  parentId?: string; // parent departmentId
}

export const DepartmentConst = {
  _ADD_FIELDS: ['deptId', 'parentId', 'deptName', 'orderNum'],
  _UPDATE_FIELDS: ['parentId', 'deptName', 'orderNum'],
  _RULES: {
    deptId: [{ required: true, message: t(''), trigger: 'blur' }],
    parentId: [{ required: true, message: t(''), trigger: 'blur' }],
    deptName: [{ required: true, message: t(''), trigger: 'blur' }],
    orderNum: [{ required: false, message: t(''), trigger: 'blur' }],
  },
  _PERMS: {
    SELECT: 'department:select',
    ADD: 'department:add',
    UPDATE: 'department:update',
    DELETE: 'department:delete',
  },
};

export const DepartmentColumns = [
  {
    title: t(''),
    key: 'id',
    dataIndex: 'deptId',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t(''),
    key: 'name',
    dataIndex: 'deptName',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.location.area.action'),
    key: 'action',
    ellipsis: 'true',
    slots: { customRender: 'action' },
  },
];
