import { BuildEntity } from '../../project/model/buildEntity';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface LicenseModel {
  id?: string;
  number?: string;
  projectId?: string;
  resourceId?: string;
  state?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  hBuildsById?: BuildEntity[];
}

export interface LicenseCondition {
  id?: string;
  state?: string;
  projectId?: string;
  hBuildsById?: BuildEntity[];
}

export const _LicenseConst = {
  EFFECTIVE: '1', // 有效
  INVALID: '0', // 无效
  STATES: [
    { value: '0', label: t('host.INVALID'), color: 'volcano' },
    { value: '1', label: t('host.EFFECTIVE'), color: 'geekblue' },
  ],
  _PERMS: {
    SELECT: 'license:select',
    ADD: 'license:add',
    UPDATE: 'license:update',
    DELETE: 'license:delete',
  },
  _UPDATE_FIELDS: ['number', 'resourceId'],
  _RULES: {
    number: [{ required: true, message: t('host.license.number'), trigger: 'blur' }],
    resourceId: [{ required: true, message: t('host.license.resourceId'), trigger: 'blur' }],
    projectId: [{ required: true, message: t('host.license.projectId'), trigger: 'blur' }],
  },
};

export const _ColumnsLicense = [
  {
    title: t('host.license.number'),
    key: 'number',
    dataIndex: 'number',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.license.resourceId'),
    key: 'resourceId',
    dataIndex: 'resourceId',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.license.hBuildsById'),
    key: 'hBuildsById',
    dataIndex: 'hBuildsById',
    ellipsis: 'true',
    slots: { customRender: 'hBuildsById' },
  },
  {
    title: t('host.state'),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
  {
    title: t('host.operation'),
    key: 'operation',
    ellipsis: 'true',
    slots: { customRender: 'operation' },
  },
];
