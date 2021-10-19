import { ResourceBean } from './ResourceBean';
import { SysDictDetailBean } from './SysDictDetailBean';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export interface LayoutModel {
  id?: string;
  room?: number;
  hall?: number;
  toilet?: number;
  area?: number;
  saleState?: string;
  labels?: string;
  face?: string;
  description?: string;
  projectId?: string;
  resourceId?: string;
  hResourceByResourceId?: ResourceBean;
  state?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  sysDictDetailBeans?: SysDictDetailBean[];
}

export interface LayoutCondition {
  id?: string;
  state?: string;
  projectId?: string;
}

export const _LayoutConst = {
  EFFECTIVE: '1', // 有效
  INVALID: '0', // 无效
  STATES: [
    { value: '0', label: t('host.INVALID'), color: 'volcano' },
    { value: '1', label: t('host.EFFECTIVE'), color: 'geekblue' },
  ],
  SALE_STATES: [
    { value: '1', label: t('host.SALE.ON'), color: 'volcano' }, //SALE_ON在售
    { value: '2', label: t('host.SALE.OFF'), color: 'geekblue' }, //待售
    { value: '3', label: t('host.SALE.SALE_OVER'), color: 'volcano' }, //SALE_OVER售罄
  ],
  FACES: [
    { value: '1', label: t('host.FACES.FACE_SOUTH'), color: 'volcano' },
    { value: '2', label: t('host.FACES.FACE_NORTH'), color: 'geekblue' },
    { value: '3', label: t('host.FACES.FACE_EAST'), color: 'volcano' },
    { value: '4', label: t('host.FACES.FACE_WESTERN'), color: 'geekblue' },
    { value: '5', label: t('host.FACES.FACE_SOUTH_EAST'), color: 'volcano' },
    { value: '6', label: t('host.FACES.FACE_SOUTH_WEST'), color: 'geekblue' },
    { value: '7', label: t('host.FACES.FACE_NORTH_EAST'), color: 'volcano' },
    { value: '8', label: t('host.FACES.FACE_NORTH_WEST'), color: 'geekblue' },
  ],
  _PERMS: {
    SELECT: 'layout:select',
    ADD: 'layout:add',
    UPDATE: 'layout:update',
    DELETE: 'layout:delete',
  },
  _UPDATE_FIELDS: [
    'hall',
    'toilet',
    'area',
    'saleState',
    'labels',
    'face',
    'description',
    'resourceId',
  ],
  _RULES: {
    room: [{ required: true, type: 'number', message: t('host.layout.room'), trigger: 'blur' }],
    hall: [{ required: true, type: 'number', message: t('host.layout.hall'), trigger: 'blur' }],
    toilet: [{ required: true, type: 'number', message: t('host.layout.toilet'), trigger: 'blur' }],
    area: [{ required: true, type: 'number', message: t('host.layout.area'), trigger: 'blur' }],
    saleState: [{ required: true, message: t('host.layout.saleState'), trigger: 'blur' }],
    face: [{ required: true, message: t('host.layout.face'), trigger: 'blur' }],
    projectId: [{ required: true, message: t('host.layout.projectId'), trigger: 'blur' }],
    resourceId: [{ required: true, message: t('host.layout.resourceId'), trigger: 'blur' }],
  },
};

export const _Columns = [
  {
    title: t('host.layout.resourceId'),
    key: 'hResourceByResourceId',
    dataIndex: 'hResourceByResourceId',
    ellipsis: 'true',
    slots: { customRender: 'hResourceByResourceId' },
  },
  {
    title: t('host.layout.room'),
    key: 'room',
    dataIndex: 'room',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.layout.hall'),
    key: 'hall',
    dataIndex: 'hall',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.layout.toilet'),
    key: 'toilet',
    dataIndex: 'toilet',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.layout.area'),
    key: 'area',
    dataIndex: 'area',
    ellipsis: 'true',
    slots: '',
  },
  {
    title: t('host.layout.face'),
    key: 'face',
    dataIndex: 'face',
    ellipsis: 'true',
    slots: { customRender: 'face' },
  },
  {
    title: t('host.layout.saleState'),
    key: 'saleState',
    dataIndex: 'saleState',
    ellipsis: 'true',
    slots: { customRender: 'saleState' },
  },
  {
    title: t('host.state'),
    key: 'state',
    dataIndex: 'state',
    ellipsis: 'true',
    slots: { customRender: 'state' },
  },
];

export const _ColumnsLayout = [
  ..._Columns,
  {
    title: t('host.operation'),
    key: 'operation',
    ellipsis: 'true',
    slots: { customRender: 'operation' },
  },
];
