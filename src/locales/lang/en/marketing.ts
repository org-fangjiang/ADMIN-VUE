export default {
  action: {
    addCustomer: 'addCustomer',
    preview: 'preview',
    add: 'add',
    update: 'update',
    delete: 'delete',
    reEnable: 'reEnable',
    see: 'see',
    success: 'success',
    fail: 'fail',
    reset: 'reset',
    onSubmit: 'onSubmit',
    transfer: 'transfer',
    receive: 'receive',
    addFollow: 'addFollow',
    updateFollow: 'updateFollow',
    publish: 'publish',
    addPC: 'addPC',
    addSale: 'addSale',
    refresh: 'refresh',
    clear: 'clear',
  },
  state: 'state',
  operation: 'operation',
  STATE_0: 'Not claimed',
  STATE_1: 'received',
  STATE_2: 'invalid',
  HOUSE_TYPE_1: 'new house',
  HOUSE_TYPE_2: 'Second hand house',
  PURPOSE_1: 'improve',
  PURPOSE_2: 'rigid demand',
  PURPOSE_3: 'marry',
  PURPOSE_4: 'investment',
  PURPOSE_5: 'other',
  SOURCE_1: 'focus on',
  SOURCE_2: 'price reminder',
  SOURCE_3: 'help you',
  SOURCE_4: 'car looking for',
  SOURCE_5: 'group bargaining',
  SOURCE_6: 'subscribe',
  SOURCE_7: 'dynamic',
  SOURCE_8: 'Transaction price',
  SOURCE_9: 'open',
  SOURCE_10: 'periphery',
  SOURCE_11: 'advantages and disadvantages',
  SOURCE_12: 'Kuaishou',
  SOURCE_13: 'Tiktok',
  SOURCE_14: 'Video promotion',
  SOURCE_15: 'Activity promotion',
  SOURCE_16: 'Surplus House',
  FOLLOW_RESULT_1: 'FOLLOW_RESULT_1',
  FOLLOW_RESULT_2: 'FOLLOW_RESULT_2',
  FOLLOW_RESULT_3: 'FOLLOW_RESULT_3',
  FOLLOW_RESULT_4: 'FOLLOW_RESULT_4',
  FOLLOW_RESULT_5: 'FOLLOW_RESULT_5',
  CITY: 'city',
  GROUP: 'group',
  COMPANY: 'company',
  PRIVATE: 'private',
  DEAL: 'deal',
  INVALIDATE: 'invalidate',
  clue: {
    createTime: 'createTime',
    username: 'username',
    purpose: 'purpose',
    intentionProject: 'intentionProject',
    contact: 'contact',
    source: 'source',
    houseType: 'houseType',
    intentionCity: 'intentionCity',
    nickname: 'nickname',
    gender: 'gender',
    liveInProvince: 'liveInProvince',
    liveInCity: 'liveInCity',
    liveInArea: 'liveInArea',
    liveInAddress: 'liveInAddress',
    workInProvince: 'workInProvince',
    workInCity: 'workInCity',
    workInArea: 'workInArea',
    workInAddress: 'workInAddress',
    intentionProvince: 'intentionProvince',
    intentionArea: 'intentionArea',
    demand: 'demand',
    demandDescription: 'demandDescription',
    activityId: 'activityId',
    updateBy: 'updateBy',
    liveIn: 'liveIn',
    workIn: 'workIn',
    intention: 'intention',
  },
  clueFollow: {
    content: 'content',
    followResult: 'followResult',
  },
  clueActivity: {
    STATE_0: 'offline',
    STATE_1: 'online',
    STATE_2: 'unpublished',
    SORT_1: 'Special Offer Houses',
    SORT_2: 'Limited time discount',
    SORT_3: 'Preferential subsidy',
    SORT_4: 'deal gift',
    SORT_5: 'Recommended Houses',
    SORT_6: 'special car',
    TYPE_1: 'PC',
    TYPE_2: 'sale',
    title: 'title',
    type: 'type',
    sort: 'sort',
    expireTime: 'expireTime',
    projectEntities: 'projectEntities',
    description: 'description',
    headImg: 'headImg',
    userNumber: 'userNumber',
  },
  timeRule: {
    clueDropLevel: 'clueDropLevel',
    clueUnFollow: 'clueUnFollow',
    clueUnclaimed: 'clueUnclaimed',
    companyId: 'companyId',
    privateToGroup: 'privateToGroup',
    groupToCompany: 'groupToCompany',
    companyToCity: 'companyToCity',
    afterFollow: 'afterFollow',
  },
  customer: {
    DEAL: 'Deal',
    EFFECTIVE: 'EFFECTIVE',
    INVALID: 'INVALID',
    STATE_2: 'Not claimed',
    STATE_3: 'TimeOut No Claimed',
    STATE_4: 'Deal To be reviewed',
    STATE_5: 'Deal',
    STATE_6: 'Invalid To be reviewed',
    STATE_7: 'Invalid',
    STATE_8: 'Deal Reviewed Failed',
    STATE_9: 'Invalid Reviewed Failed',
    female: 'FEMALE',
    male: 'MALE',
    contact: 'contact',
    username: 'username',
    gender: 'gender',
    intentionCity: 'intentionCity',
    source: 'source',
    state: 'state',
    intention_project: 'Intention Project',
    purpose: 'purpose',
    liveIn: 'liveIn',
    workIn: 'workIn',
    intentionProvince: 'intentionProvince',
    intentionArea: 'intentionArea',
    demand: 'demand',
    demandDescription: 'demandDescription',
    activityId: 'activity',
    buyIntentionRange: 'buyIntentionRange',
    autoBugIntentionRange: 'autoBugIntentionRange',
    breakPromiseTimes: 'breakPromiseTimes',
    lookTime: 'lookTime',
    reportTime: 'reportTime',
    viewTime: 'viewTime',
    transferTime: 'transferTime',
    intentionProject: 'intentionProject',
    companyId: 'companyId',
    updateUser: 'updateUser',
    examine: 'examine',
  },
  follow: {
    EFFECTIVE: 'EFFECTIVE',
    INVALID: 'INVALID',
    RESULT_TYPE_1: 'no answered',
    RESULT_TYPE_2: 'Hang up after answering',
    RESULT_TYPE_3: 'on call',
    RESULT_TYPE_4: 'block',
    RESULT_TYPE_5: 'empty number',
    RESULT_TYPE_6: 'do not buy',
    RESULT_TYPE_7: 'peer',
    description: 'description',
    resultType: 'resultType',
    projectId: 'projectId',
    nextFollowTime: 'nextFollowTime',
    customerId: 'customerId',
    videoAddress: 'videoAddress',
    state: 'state',
  },
  report: {
    STATE_2: 'Report Time',
    STATE_3: 'Look Time',
    STATE_4: 'Channel Customer',
    STATE_5: 'Fail',
    STATE_6: 'To be reviewed',
    saleId: 'saleId',
    customerId: 'customerId',
    groupId: 'groupId',
    companyId: 'companyId',
    projectId: 'projectId',
    state: 'state',
    lookTime: 'lookTime',
    mobile: 'mobile',
    addLook: '录入带看',
  },
  look: {
    STATE_2: 'No Look',
    STATE_3: 'No Review',
    STATE_4: 'Reviewed Fail',
    STATE_5: 'Reviewed Success',
    saleId: 'saleId',
    customerId: 'customerId',
    groupId: 'groupId',
    companyId: 'companyId',
    projectId: 'projectId',
    state: 'state',
    lookTime: 'estimate lookTime',
    mobile: 'mobile',
    photoAddress: 'photo address',
    realLook: 'Real LookTime',
  },
};
