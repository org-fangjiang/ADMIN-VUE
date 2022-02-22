export default {
  action: {
    preview: '预览',
    add: '添加',
    update: '更新',
    delete: '删除',
    reEnable: '恢复',
    see: '查看',
    success: '成功',
    fail: '失败',
    reset: '重置',
    onSubmit: '提交',
    transfer: '转移',
    receive: '领取',
    addFollow: '添加跟进信息',
    updateFollow: '更新跟进信息',
    publish: '发布',
    addPC: '添加PC端',
    addSale: '销售添加',
    refresh: '刷新',
    clear: '清空',
  },
  state: '状态',
  operation: '操作',
  STATE_0: '未领取',
  STATE_1: '已领取',
  STATE_2: '无效',
  HOUSE_TYPE_1: '新房',
  HOUSE_TYPE_2: '二手房',
  PURPOSE_1: '改善',
  PURPOSE_2: '刚需',
  PURPOSE_3: '结婚',
  PURPOSE_4: '投资',
  PURPOSE_5: '其他',
  SOURCE_1: '关注楼盘',
  SOURCE_2: '变价提醒',
  SOURCE_3: '帮您找房',
  SOURCE_4: '专车找房',
  SOURCE_5: '组团砍价',
  SOURCE_6: '订阅楼盘',
  SOURCE_7: '动态通知',
  SOURCE_8: '成交价查询',
  SOURCE_9: '开盘通知',
  SOURCE_10: '了解周边',
  SOURCE_11: '了解楼盘优缺点',
  SOURCE_12: '快手',
  SOURCE_13: '抖音',
  SOURCE_14: '视频推广',
  SOURCE_15: '活动推广',
  SOURCE_16: '余房查询',
  FOLLOW_RESULT_1: '无效',
  FOLLOW_RESULT_2: '不买房',
  FOLLOW_RESULT_3: '同行',
  FOLLOW_RESULT_4: '号码错误',
  FOLLOW_RESULT_5: '已转为客户',
  CITY: '城市池',
  GROUP: '小组池',
  COMPANY: '公司池',
  PRIVATE: '个人池',
  DEAL: '成交池',
  INVALIDATE: '无效池',
  clue: {
    username: '用户名',
    purpose: '购房用途',
    intentionProject: '意向楼盘',
    contact: '联系方式',
    source: '类型',
    houseType: '房子类型',
    intentionCity: '意向城市',
    nickname: '昵称',
    gender: '性别',
    liveInProvince: '居住地省',
    liveInCity: '居住地市',
    liveInArea: '居住地区',
    liveInAddress: '居住地详细信息',
    workInProvince: '工作地省',
    workInCity: '工作地市',
    workInArea: '工作地区',
    workInAddress: '工作地详细地址',
    intentionProvince: '意向省份',
    intentionArea: '意向区',
    demand: '购房需求',
    demandDescription: '需求描述',
    activityId: '关联活动',
    updateBy: '线索领取人',
    liveIn: '居住地',
    workIn: '工作地',
    intention: '意向地',
  },
  clueFollow: {
    content: '跟进内容',
    followResult: '跟进结果',
  },
  clueActivity: {
    STATE_0: '下线',
    STATE_1: '上线',
    STATE_2: '待发布',
    SORT_1: '特价楼盘',
    SORT_2: '限时折扣',
    SORT_3: '特惠补贴',
    SORT_4: '成交好礼',
    SORT_5: '推荐楼盘',
    SORT_6: '专车接送',
    TYPE_1: '网站',
    TYPE_2: '销售',
    title: '标题',
    type: '类型',
    sort: '分类',
    expireTime: '过期时间',
    projectEntities: '楼盘信息',
    description: '描述信息',
    headImg: '头图',
    userNumber: '活动人数',
  },
  timeRule: {
    clueDropLevel: '线索未跟进掉级',
    clueUnFollow: '线索待跟进提醒（分钟）',
    clueUnclaimed: '线索待领取提醒（分钟',
    companyId: '企业',
    privateToGroup: '个人未跟进转小组池（分钟）',
    groupToCompany: '小组客户未跟进转企业池（分钟）',
    companyToCity: '企业客户未跟进转城市池（分钟）',
    afterFollow: '个人客户提前提醒（分钟）',
  },
  customer: {
    DEAL: '成交',
    EFFECTIVE: '有效',
    INVALID: '无效',
    STATE_2: '待跟进',
    STATE_3: '超时待跟进',
    STATE_4: '成交待审核',
    STATE_5: '成交客户',
    STATE_6: '无效待审核',
    STATE_7: '无效',
    STATE_8: '成交审核不通过',
    STATE_9: '无效审核不通过',
    female: '女',
    male: '男',
    contact: '联系方式',
    username: '用户名',
    gender: '性别',
    intentionCity: '意向城市',
    source: '来源',
    state: '状态',
    intention_project: '意向楼盘',
    purpose: '购房目的',
    liveIn: '居住地',
    workIn: '工作地',
    intentionProvince: '意向省',
    intentionArea: '意向区',
    demand: '需求',
    demandDescription: '需求描述',
    activityId: '活动',
    buyIntentionRange: '意向强度',
    autoBugIntentionRange: '系统给出意向强度',
    breakPromiseTimes: '失信次数',
    lookTime: '带看次数',
    reportTime: '报备次数',
    viewTime: '被浏览次数',
    transferTime: '流转次数',
    intentionProject: '意向楼盘',
    companyId: '企业',
    updateUser: '跟进人',
  },
};
