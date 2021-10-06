export default {
  EFFECTIVE: '上线',
  INVALID: '下线',
  TYPE: {
    HOUSE: '住宅',
    FLATS: '公寓',
    SHOP: '商铺',
    OFFICE: '写字楼',
    STORE: '仓库',
  },
  DECORATION: {
    ROUGHCAST: '毛坯',
    PAPERBACK: '简装 ',
    HARDBACK: '精装',
    ROUGHCAST_PAPERBACK: '毛坯与简装',
    ROUGHCAST_HARDBACK: '毛坯与精装',
  },
  BUILD_TYPE: {
    PASSIVE: '被动式',
    PREFABRICATED: '装配式',
    POURING: '浇筑式',
    PART_PREFABRICATED: '部分装配式',
    PART_POURING: '部分浇筑式',
  },
  WATER: {
    UNKNOWN: '未知',
    CIVIL: '民用',
    COMMERCIAL: '商用',
  },
  HEAT: {
    UNKNOWN: '未知',
    MUNICIPAL: '市政供暖',
    CONCENTRATED: '集体供暖',
  },
  COMMISSION: {
    FIXED: '固定值',
    PERCENTAGE: '百分比',
  },
  SALE: {
    ON: '在售',
    OFF: '待售',
    SALE_OVER: '售罄',
  },
  LOAN: {
    ALL: '全款',
    COMMERCE: '商业贷款',
    PROVIDENT_FUND: '公积金',
    COMPOSE: '组合贷款',
    CITY: '市直公积金',
    PROVINCE: '省直公积金',
    RAILWAY: '铁路公积金',
    ARMY: '军队公积金',
    TEACHER: '教师公积金',
  },
  FACES: {
    FACE_SOUTH: '南',
    FACE_NORTH: '北',
    FACE_EAST: '东',
    FACE_WESTERN: '西',
    FACE_SOUTH_EAST: '东南',
    FACE_SOUTH_WEST: '西南',
    FACE_NORTH_EAST: '东北',
    FACE_NORTH_WEST: '西北',
  },
  REMARK_STATES: {
    REMARK_OFF: '未标记到图片',
    REMARK_ON: '标记到图片',
  },
  IN_MOBILES: {
    NOT_IN_MOBILE: '不在手机端展示',
    IN_MOBILE: '在手机端展示',
  },
  SORTS: {
    GROUND_NEWS: '拿地资讯',
    OPENING_NEWS: '开盘资讯',
    POLICY: '楼市政策',
    INTEREST: '房贷利率',
    AREA_PLANNING: '区域规划',
    AREA_PRICE: '区域房价',
    PROJECT: '实探楼盘',
  },
  dynamicSort: {
    OPEN: '楼盘开盘',
    PROCESS_RATE: '工程进度',
    OVER: '项目封顶',
    PAY: '项目交房',
    ACTIVITY: '优惠活动',
    ADD_BUILD: '加推楼栋',
    SALE_BUILD: '在售楼栋',
    OVER_BUILD: '楼栋售罄',
    PRICE_INFO: '特价信息',
  },
  name: '名称',
  type: '项目类型',
  buildType: '建筑类型',
  property: '产权年限',
  longitude: '经度',
  latitude: '维度',
  province: '省',
  city: '市',
  area: '区',
  address: '详细地址',
  saleState: '出售状态',
  saleAddress: '出售地址',
  buildingTotal: '总建筑数',
  number: '400电话分机号',
  decorationType: '装修类型',
  waterMethod: '供水方式',
  electricityMethod: '供电方式',
  heatMethod: '供暖方式',
  commissionMode: '抽成方式',
  commission: '抽成',
  price: '项目平均价格',
  state: '状态',
  operation: '操作',
  aliasName: '别名',
  labels: '标签',
  decorationStandard: '元/平方',
  getLandTime: '拿地时间',
  locationScore: '位置评分',
  educationScore: '教育评分',
  medicalScore: '医疗评分',
  trafficScore: '交通评分',
  matchingScore: '商业评分',
  openTime: '开盘时间',
  payTime: '交房时间',
  lowTotalPrice: '最低总价',
  highTotalPrice: '最高总价',
  priceDescription: '价格描述',
  priceDays: '价格有效时间',
  updatePriceTime: '价格更新时间',
  loanType: '贷款方式',
  landArea: '占地面积',
  buildArea: '建筑面积',
  volumeRate: '容积率',
  greenRate: '绿化率',
  parking: '停车位信息',
  houseTotal: '总户数',
  elevatorInfo: '电梯信息',
  estateCompany: '物业公司',
  estatePrice: '物业费',
  estateDescription: '物业费描述',
  trafficInfo: '交通信息',
  medicalInfo: '医疗信息',
  matchingInfo: '匹配信息',
  educationInfo: '教育信息',
  otherInfo: '其他信息',
  description: '描述',
  lookTime: '项目被浏览次数',
  orderNum: '排序',
  hLayoutsById: '户型',
  firstImg: '项目首图',
  action: {
    add: '添加',
    update: '更新',
    delete: '删除',
    reEnable: '恢复',
    success: '成功',
    fail: '失败',
    reset: '重置',
    onSubmit: '提交',
    setResource: '设置资源',
    setLayout: '设置户型',
    setBuild: '设置楼栋',
    setSandImg: '设置项目沙盘图',
    setFirstImg: '设置项目首图',
    setLicense: '设置许可证',
    setDynamicNews: '设置动态文章',
  },
  layout: {
    room: '卧室',
    hall: '客厅',
    toilet: '卫生间',
    area: '面积',
    saleState: '销售状态',
    face: '朝向',
    projectId: '项目编号',
    labels: '标签',
    description: '描述',
    resourceId: '资源信息',
    setSource: '设置资源',
    setLicense: '设置预售证',
  },
  source: {
    title: '图标Title',
    description: '描述',
    address: '资源地址',
    keyword: '关键字',
    sort: '类型',
    projectId: '项目编号',
    projectName: '项目名称',
    sorts: {
      HOUSE: '户型',
      SAND_TABLE: '沙盘图',
      LICENSE: '预售证',
      EFFECT: '效果图',
      REAL_SCENE: '实景图',
      VIDEO: '视频',
      VR: 'VR',
    },
  },
  build: {
    number: '楼栋号',
    floors: '层高',
    price: '楼栋均价',
    priceDescription: '价格描述',
    description: '楼栋描述',
    projectId: '所属项目',
    licenseId: '预售证',
    saleState: '销售状态',
    remark: '标记图片',
    locationX: '经度',
    locationY: '维度',
    addLayout: '关联户型',
    removeLayout: '移除户型',
  },
  license: {
    number: '许可证号',
    projectId: '项目id',
    resourceId: '资源id',
    setBuild: '关联楼栋',
    hBuildsById: '楼栋信息',
  },
  news: {
    title: '标题',
    description: '描述',
    keywords: '关键字',
    content: '正文',
    img: '图片',
    sort: '分类',
    source: '来源',
    author: '作者',
    inMobile: '是否在手机端展示',
    projects: '项目',
    lookTimes: '浏览次数',
    orderNum: '排序',
    province: '省',
    city: '市',
    setProject: '设置项目',
  },
  dynamicNews: {
    title: '动态标题',
    description: '动态描述',
    content: '动态正文',
    sort: '动态分类',
    author: '作者',
    projectId: '项目',
  },
  recommend: {
    cityId: '市',
    projectId: '项目编号',
    projectName: '项目名称',
  },
};
