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
    deptId: [{ required: true, message: t('model.department.deptId'), trigger: 'blur' }],
    parentId: [{ required: false, message: t('model.department.parentId'), trigger: 'blur' }],
    deptName: [{ required: true, message: t('model.department.deptName'), trigger: 'blur' }],
    orderNum: [{ required: false, message: t('model.department.orderNum'), trigger: 'blur' }],
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
    title: t('model.department.deptId'),
    key: 'id',
    dataIndex: 'deptId',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.department.deptName'),
    key: 'name',
    dataIndex: 'deptName',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('model.department.action'),
    key: 'action',
    ellipsis: 'true',
    slots: { customRender: 'action' },
  },
];
