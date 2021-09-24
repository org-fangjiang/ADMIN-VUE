export default {
  company: {
    name: '企业名称',
    managerId: '企业法人',
    province: '所属省',
    city: '所属市',
    area: '所属区',
    companyAddress: '详情地址',
    companyPhone: '联系电话',
    businessLicense: '营业执照编号',
    companySize: '企业规模',
    commission: '企业抽成',
    commissionMode: '企业抽成方式',
    onlineNumber: '企业在线人数',
    state: '状态',
    expirationData: '到期时间',
    renewalData: '续期时间',
    createBy: '负责人',
    action: '操作',
    invalid: '到期',
    effective: '正常',
    locked: '锁定',
    size0: '不限',
    size1: '0~20人',
    size2: '20～99人',
    size3: '100～499人',
    size4: '500～999人',
    size5: '1000～9999人',
    size6: '10000人以上',
    add: '添加企业',
    save: '保存企业信息',
    save_success: '保存企业成功',
    save_failed: '保存企业失败',
    cancel: '重置',
    updateInfo: '更新企业信息',
    update_success: '更新企业成功',
    update_failed: '更新企业失败',
    updateState: '修改企业状态',
    updateLocked: '锁定',
    updateUnLocked: '解锁',
    addRole: '添加角色',
    changeCreateBy: '切换负责人',
    updateRenewalData: '续期',
    add_name: '请输入企业名称',
    add_provinceId: '请选择企业所属省',
    add_cityId: '请选择企业所属市',
    add_areaId: '请选择企业所属区',
    add_businessLicense: '请输入企业营业执照编号',
    add_companyAddress: '请输入企业详细地址',
    add_companyPhone: '请输入企业联系电话',
    add_companySize: '请选择企业规模',
    add_expirationData: '请输入企业到期时间',
    add_createBy: '请选择企业负责人',
    admin: '管理员管理',
    deleteCompanyUser: '删除',
    addCompanyUser: '添加企业管理员',
    companyId: '企业编号',
  },
  location: {
    area: {
      id: '编号',
      name: '名称',
      state: '状态',
      invalidState: '无效',
      validState: '有效',
      areaId: '地区编号',
      action: '操作',
      recoveryArea: '恢复地区',
      deleteArea: '删除地区',
      addArea: '添加地区',
      updateArea: '更新地区',
      cancel: '取消',
      success: '操作成功',
      fail: '操作失败',
    },
    city: {
      id: '编号',
      name: '名称',
      firstLetter: '首字母',
      state: '状态',
      action: '操作',
      provinceId: '城市编号',
      invalidState: '无效',
      validState: '有效',
      recoveryCity: '恢复城市',
      deleteCity: '删除城市',
      updateCity: '修改城市',
      addCity: '添加城市',
      cancel: '取消',
      success: '操作成功',
      fail: '操作失败',
    },
    province: {
      provinceName: '省份',
      state: '状态',
      invalidState: '无效',
      validState: '有效',
      id: '编号',
      name: '名称',
      action: '操作',
      recoveryProvince: '恢复省',
      deleteProvince: '删除省',
      updateProvince: '修改省',
      addProvince: '添加省',
      cancel: '取消',
      reset: '重置',
      success: '操作成功',
      fail: '操作失败',
    },
  },
  dict: {
    group: {
      id: '分组编号',
      name: '分组名称',
      state: '状态',
      isExist: '已存在',
      isNotExist: '不存在',
      invalidState: '无效',
      validState: '有效',
      action: '操作',
      recoveryGroup: '恢复分组',
      deleteGroup: '删除分组',
      addGroup: '添加分组',
      updateGroup: '更新分组',
      cancel: '取消',
      reset: '重置',
      success: '操作成功',
      fail: '操作失败',
    },
    detail: {
      id: '详情编号',
      value: '值',
      state: '状态',
      groupId: '所属分组',
      isExist: '已存在',
      isNotExist: '不存在',
      invalidState: '无效',
      validState: '有效',
      action: '操作',
      recoveryDetail: ' 恢复字典详情',
      deleteDetail: '删除字典详情',
      addDetail: '添加字典详情',
      updateDetail: '更新字典详情',
      cancel: '取消',
      reset: '重置',
      success: '操作成功',
      fail: '操作失败',
    },
  },
  perms: {
    id: '编号',
    parentId: '上级编号',
    parentName: '上级名称',
    menuName: '菜单名称',
    buttonName: '按钮名称',
    path: '路径',
    component: '组件',
    perms: '权限标识符',
    icon: '图标',
    type: '类型',
    orderNum: 'OrderNum',
    createTime: '创建时间',
    updateTime: '更新时间',
    createBy: '创建人',
    state: '状态',
    effective: '有效',
    invalid: '无效',
    action: '操作',
    addMenu: '添加',
    updateMenu: '更新',
    deleteMenu: '删除',
    reEnableMenu: '恢复',
    button: '按钮',
    menu: '菜单',
    reset: '重置',
    success: '操作成功',
    fail: '操作失败',
    addButton: '添加按钮',
    updateButton: '更新按钮',
    deleteButton: '删除按钮',
  },
  role: {
    id: '编号',
    roleName: '角色名',
    action: '操作',
    remake: '描述',
    companyId: '公司编号',
    companyName: '企业名称',
    reset: '重置',
    success: '成功',
    fail: '失败',
    addRole: '添加角色',
    updateRole: '更新角色',
    deleteRole: '删除角色',
    setRoleMenu: '修改权限',
    createBy: '创建人',
    updateBy: '更新人',
    reEnableRole: '恢复角色',
    createTime: '创建时间',
    updateTime: '更新时间',
    sysRoleMenusById: '菜单',
    state: '状态',
    effective: '有效',
    invalid: '无效',
  },
  department: {
    deptId: '部门编号',
    parentId: '上级部门编号',
    parentName: '上级部门名称',
    deptName: '部门名称',
    orderNum: '排序',
    companyId: '企业编号',
    companyName: '企业名称',
    action: '操作',
    addDept: '添加部门',
    updateDept: '修改部门',
    deleteDept: '删除部门',
    reEnableDept: '恢复部门',
    reset: '重置',
    success: '成功',
    fail: '失败',
  },
  link: {
    id: '编号',
    page: '页码',
    title: '标题',
    address: '地址',
    state: '状态',
    action: '操作',
    provinceId: '省份编号',
    cityId: '城市编号',
    areaId: '区域编号',
    effective: '有效',
    invalid: '无效',
    reset: '重置',
    success: '成功',
    fail: '失败',
    addLink: '添加链接',
    updateLink: '更新链接',
    deleteLink: '删除链接',
    reEnableLink: '恢复链接',
  },
  user: {
    id: '编号',
    userName: '用户名',
    password: '密码',
    realName: '真实姓名',
    nickName: '昵称',
    sex: '性别',
    email: '邮箱',
    mobile: '手机号',
    theme: '主题',
    avatar: '头像',
    description: '描述',
    deptId: '部门编号',
    deptName: '部门名称',
    companyName: '企业名称',
    roleId: '角色编号',
    roleName: '角色名',
    sysRoleBeans: '角色集合',
    state: '状态',
    action: '操作',
    effective: '有效',
    invalid: '无效',
    reset: '重置',
    success: '成功',
    fail: '失败',
    addUser: '添加用户信息',
    updateUser: '更新用户信息',
    deleteUser: '删除用户信息',
    reEnableUser: '恢复用户信息',
    setRole: '设置用户角色',
    setDeptId: '设置用户部门',
    setMobile: '设置用户手机号',
    setEmail: '设置用户邮箱',
  },
  metro: {
    invalid: '无效',
    effective: '运营中',
    planning: '规划中',
    lineName: '线路名称',
    stationName: '站点名称',
  },
  metroStation: {
    id: '编号',
    name: '名称',
    longitude: '经度',
    latitude: '纬度',
    state: '状态',
    cityId: '城市编号',
    operation: '操作',
    form: {
      name: '请输入地铁站name',
      longitude: '请输入地铁站longitude',
      latitude: '请输入地铁站latitude',
      state: '请输入地铁站state',
      cityId: '请输入地铁站cityId',
    },
    result: {
      delete: '删除站点信息成功',
      reEnable: '恢复站点信息成功',
      update: '更新站点信息成功',
      addStation: '添加地铁站点',
      failed: '站点信息相关操作失败',
    },
  },
  metroLine: {
    id: '编号',
    name: '名称',
    cityId: '城市编号',
    startStation: '始发站',
    endStation: '终点站',
    state: '状态',
    stations: '途经站',
    operation: '操作',
    form: {
      name: '请输入地铁线路name',
      cityId: '请输入地铁线路of cityId',
      startStation: '请输入地铁线路startStation',
      endStation: '请输入地铁线路endStation',
    },
    result: {
      delete: '删除地铁线路成功',
      reEnable: '恢复地铁线路成功',
      update: '更新地铁线路成功',
      addStation: '添加地铁站点',
      failed: '地铁线路相关操作失败',
      success: '操作成功',
    },
  },
  poi: {
    0: '全部',
    150500: '地铁',
  },
};
