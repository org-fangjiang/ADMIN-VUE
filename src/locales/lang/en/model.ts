export default {
  company: {
    name: 'Company Name',
    managerId: 'Company Legal person',
    province: 'Of Province',
    city: 'Of City',
    area: 'Of Area',
    companyAddress: 'Company Details Address',
    companyPhone: 'Company Phone',
    businessLicense: 'Company Business License',
    companySize: 'Company Size',
    commission: 'Company Commission',
    commissionMode: 'Company Commission mode',
    onlineNumber: 'Company Online number',
    state: 'State',
    expirationData: 'Company Expiration Data',
    renewalData: 'Company Renewal Data',
    createBy: 'Company Manager',
    action: 'Action',
    invalid: 'INVALID',
    effective: 'EFFECTIVE',
    locked: 'LOCKED',
    size0: '不限',
    size1: '0~20人',
    size2: '20～99人',
    size3: '100～499人',
    size4: '500～999人',
    size5: '1000～9999人',
    size6: '10000人以上',
    add: 'Add Company',
    save: 'Save Company',
    save_success: 'Save Company Success',
    save_failed: 'Save Company Failed',
    cancel: 'ReSet Company',
    updateInfo: 'Update Company Info',
    update_success: 'Update Company Info Success',
    update_failed: 'Update Company Info Failed',
    updateState: 'Update State',
    updateLocked: 'LOCKED',
    updateUnLocked: 'UNLOCKED',
    addRole: 'ADD ROLE',
    changeCreateBy: 'Change Manage',
    updateRenewalData: 'Renew',
    add_name: 'Please enter company name',
    add_provinceId: 'Please select the province where the company belongs',
    add_cityId: 'Please select the city where the company belongs',
    add_areaId: 'Please select the district where the company belongs',
    add_businessLicense: 'Please enter the business license number',
    add_companyAddress: "Please enter the company's detailed address",
    add_companyPhone: "Please enter the company's contact number",
    add_companySize: 'Please select the size of the company',
    add_expirationData: 'Please enter the business expiration time',
    add_createBy: 'Please select the person in charge of the company',
    admin: 'Set Admin',
    deleteCompanyUser: 'Delete',
    addCompanyUser: 'Add Company User',
    companyId: 'CompanyId',
  },
  location: {
    area: {
      id: 'id',
      name: 'name',
      state: 'State',
      invalidState: 'Invalid',
      validState: 'Valid',
      areaId: 'AreaId',
      action: 'Action',
      recoveryArea: 'Recovery Area',
      deleteArea: 'Delete Area',
      addArea: 'Add Area',
      updateArea: 'Update Area',
      cancel: 'Cancel',
      save: 'Save Area',
      success: 'Success',
      fail: 'Failed',
    },
    city: {
      id: 'id',
      name: 'name',
      firstLetter: 'First Letter',
      state: 'State',
      action: 'Action',
      provinceId: 'CityId',
      invalidState: 'Invalid',
      validState: 'Valid',
      recoveryCity: 'Recovery City',
      deleteCity: 'Delete City',
      updateCity: 'Update City',
      addCity: 'Add City',
      cancel: 'Cancel',
      success: 'Success',
      fail: 'Failed',
    },
    province: {
      provinceName: 'Province',
      state: 'State',
      invalidState: 'Invalid',
      validState: 'Valid',
      id: 'id',
      name: 'name',
      action: 'Action',
      recoveryProvince: 'Recovery Province',
      deleteProvince: 'Delete Province',
      updateProvince: 'UpDate Province',
      addProvince: 'Add Province',
      cancel: 'Cancel',
      reset: 'Reset',
      success: 'Success',
      fail: 'Failed',
    },
  },
  dict: {
    group: {
      id: 'Group Id',
      name: 'Name',
      state: 'State',
      isExist: 'IS EXIST',
      isNotExist: 'IS NOT EXIST',
      invalidState: 'Invalid',
      validState: 'Valid',
      action: 'Action',
      recoveryGroup: 'Recovery Group',
      deleteGroup: 'Delete Group',
      addGroup: 'Add Group',
      updateGroup: 'Update Group',
      cancel: 'Cancel',
      reset: 'Reset',
      success: 'Success',
      fail: 'Failed',
    },
    detail: {
      id: 'Detail Id',
      value: 'Value',
      state: 'State',
      groupId: 'GroupId',
      isExist: 'IS EXIST',
      isNotExist: 'IS NOT EXIST',
      invalidState: 'Invalid',
      validState: 'Valid',
      action: 'Action',
      recoveryDetail: 'Recovery Detail',
      deleteDetail: 'Delete Detail',
      addDetail: 'Add Detail',
      updateDetail: 'Update Detail',
      cancel: 'Cancel',
      reset: 'Reset',
      success: 'Success',
      fail: 'Failed',
    },
  },
  perms: {
    id: 'Id',
    parentId: 'Parent Id',
    parentName: 'Parent Name',
    menuName: 'Menu Name',
    buttonName: 'Button Name',
    path: 'Path',
    component: 'Component',
    perms: 'PERMS',
    icon: 'Icon',
    type: 'Type',
    orderNum: 'OrderNum',
    createTime: 'Create Time',
    updateTime: 'Update Time',
    createBy: 'Create By',
    state: 'State',
    effective: 'EFFECTIVE',
    invalid: 'INVALID',
    action: 'Action',
    addMenu: 'ADD MENU',
    updateMenu: 'UPDATE MENU',
    deleteMenu: 'DELETE MENU',
    reEnableMenu: 'ReEnableMenu',
    button: 'Button',
    menu: 'Menu',
    reset: 'Reset',
    success: 'Success',
    fail: 'Failed',
    addButton: 'ADD BUTTON',
    updateButton: 'UPDATE Button',
    deleteButton: 'DELETE Button',
  },
  role: {
    id: 'Id',
    roleName: 'Role Name',
    action: 'Action',
    remake: 'Remake',
    companyId: 'CompanyId',
    companyName: 'Company Name',
    reset: 'Reset',
    success: 'Success',
    fail: 'Failed',
    addRole: 'Add Role',
    updateRole: 'Update Role',
    setRoleMenu: 'setRoleMenu',
    createBy: 'Create By',
    updateBy: 'Update By',
    deleteRole: 'Delete Role',
    reEnableRole: 'ReEnable Role',
    createTime: 'Create Time',
    updateTime: 'Update Time',
    sysRoleMenusById: 'RoleMenus',
    state: 'State',
    effective: 'EFFECTIVE',
    invalid: 'INVALID',
  },
  department: {
    deptId: 'Dept Id',
    parentId: 'Parent Id',
    parentName: 'Parent Name',
    deptName: 'Dept Name',
    orderNum: 'Order Num',
    companyId: 'Company Id',
    companyName: 'Company Name',
    action: 'Action',
    addDept: 'Add Dept',
    updateDept: 'Update Dept',
    deleteDept: 'Delete Dept',
    reEnableDept: 'ReEnable Dept',
    reset: 'Reset',
    success: 'Success',
    fail: 'Failed',
    addUser: 'Add User',
  },
  link: {
    id: 'Id',
    page: 'Page',
    title: 'Title',
    address: 'Address',
    state: 'State',
    action: 'Action',
    provinceId: 'ProvinceId',
    cityId: 'CityId',
    areaId: 'AreaId',
    effective: 'EFFECTIVE',
    invalid: 'INVALID',
    reset: 'Reset',
    success: 'Success',
    fail: 'Failed',
    addLink: 'Add Link',
    updateLink: 'Update Link',
    deleteLink: 'Delete Link',
    reEnableLink: 'ReEnable Link',
  },
  user: {
    extNumber: 'extNumber',
    id: 'Id',
    userName: 'UserName',
    password: 'Password',
    realName: 'RealName',
    nickName: 'NickName',
    sex: 'Sex',
    email: 'E-mail',
    mobile: 'Mobile',
    theme: 'Theme',
    avatar: 'Avatar',
    description: 'Description',
    deptId: 'DeptId',
    deptName: 'DeptName',
    companyName: 'CompanyName',
    roleId: 'RoleId',
    roleName: 'RoleName',
    sysRoleBeans: 'sysRoleBeans',
    state: 'State',
    action: 'Action',
    effective: 'EFFECTIVE',
    invalid: 'INVALID',
    reset: 'Reset',
    success: 'SUCCESS',
    fail: 'FAIL',
    addUser: 'Add User',
    updateUser: 'Update User',
    deleteUser: 'Delete User',
    reEnableUser: 'ReEnable User',
    setRole: 'Set User Role',
    setDeptId: 'Set User DeptId',
    setMobile: 'Set User Mobile',
    setEmail: 'Set User Email',
  },
  metro: {
    invalid: 'INVALID',
    effective: 'EFFECTIVE',
    planning: 'PLANNING',
    lineName: 'lineName',
    stationName: 'stationName',
    stationInfo: 'stationInfo',
    orderNum: 'orderNum',
  },
  metroStation: {
    id: 'id',
    name: 'name',
    longitude: 'longitude',
    latitude: 'latitude',
    state: 'state',
    cityId: 'cityId',
    operation: 'operation',
    form: {
      name: 'please enter metro station name',
      longitude: 'please enter metro station longitude',
      latitude: 'please enter metro station latitude',
      state: 'please enter metro station state',
      cityId: 'please enter metro station cityId',
    },
    result: {
      delete: 'Delete Station Success',
      reEnable: 'ReEnable Station Success',
      update: 'Update Station Success',
      addStation: 'AddStation Metro Line Success',
      failed: 'Action Station Failed',
    },
  },
  metroLine: {
    id: 'id',
    name: 'name',
    cityId: 'cityId',
    startStation: 'startStation',
    endStation: 'endStation',
    state: 'state',
    stations: 'stations',
    operation: 'operation',
    form: {
      name: 'please enter metro line name',
      cityId: 'please enter metro line of cityId',
      startStation: 'please enter metro line startStation',
      endStation: 'please enter metro line endStation',
    },
    result: {
      delete: 'Delete Metro Line Success',
      reEnable: 'ReEnable Metro Line Success',
      update: 'Update Metro Line Success',
      addStation: 'AddStation Metro Line Success',
      failed: 'Action Metro Line Failed',
      success: 'Operation Success',
    },
  },
  poi: {
    0: 'All',
    150500: 'metro',
  },
  trading: {
    name: 'name',
    description: 'description',
    longitude: 'longitude',
    latitude: 'latitude',
    state: 'state',
    invalid: 'invalid',
    effective: 'effective',
    radius: 'radius',
    provinceId: 'provinceId',
    cityId: 'cityId',
    areaId: 'areaId',
    tradingInfo: 'tradingInfo action',
    success: 'success',
    fail: 'fail',
    delete: 'delete',
    reenable: 'reenable',
  },
  violation: {
    value: 'violation',
    state: 'state',
    add: 'add',
    delete: 'delete',
    update: 'update',
    success: 'success',
    fail: 'fail',
    reEnable: 'reEnable',
  },
  question: {
    pass: 'Pass',
    fail: 'Fail',
    content: 'Content',
    willPass: 'WillPass',
    delete: 'Delete',
    failed: 'Failed',
  },
  answer: {
    pass: 'Pass',
    fail: 'Fail',
    content: 'Content',
    delete: 'Delete',
    failed: 'Failed',
  },
  sale: {
    maxGetCustomer: 'maxGetCustomer',
    score: 'score',
    scoreTime: 'scoreTime',
    baseScore: 'baseScore',
    companyId: 'companyId',
    groupId: 'groupId',
  },
};
