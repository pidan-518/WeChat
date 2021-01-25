let ipUrl = "";
switch (envConstants) {
  case "pro":
    ipUrl = "https://www.aigangmao.com/client-core/v101";
    break;
  case "pre":
    ipUrl = "http://121.42.231.22/client-core";
    break;
  case "dev":
    ipUrl = "http://192.168.0.181/client-core";
    break;
  default:
    break;
}

const servicePath = {
  // 登录和注册API
  VerCode: ipUrl + "/register/code", // 获取验证码
  checkUserName: ipUrl + "/register/checkUserName", //检查用户名是否可用
  checkMobile: ipUrl + "/register/checkMobile", // 检查手机号是都可用
  sendSmsCode: ipUrl + "/register/sendSmsCode", // 发送手机验证码，传参手机号和图形验证码，每次验证后主动调用刷新图形验证码
  doRegister: ipUrl + "/register/doRegister", // 注册 ，每次验证后主动调用刷新图形验证码
  Login: ipUrl + "/login", // 登录
  Logout: ipUrl + "/logout", // 退出登录
  resetPassword: ipUrl + "/register/resetPassword",
  getMyRecommondCode: ipUrl + "/user/getMyRecommondCode", //获取“我的推荐码”
  checkReconmend: ipUrl + "/register/checkReconmend", // 检查推荐码

  wechatLogin: ipUrl + "/wechatLogin", //微信登录
  bindWechat: ipUrl + "/bindWechat", //绑定微信号
  wechatBindCode: ipUrl + "/wechatBindCode", //获取綁定微信圖形验证码
  sendBindSmsCode: ipUrl + "/sendBindSmsCode", //发送绑定微信短信验证码
  wechatUnBindCode: ipUrl + "/user/wechatUnBindCode", //解绑时获取图形验证码
  sendUnBindSmsCode: ipUrl + "/user/sendUnBindSmsCode", //发送解绑微信短信
  unBindWechat: ipUrl + "/user/unBindWechat", //解绑微信号

  // 首页商品图片和商品信息API
  homeProducts: ipUrl + "/index/homeProducts", // 查询首页产品信息
  homePicture: ipUrl + "/index/homePicture", // 首页图片接口
  getNewItemList: ipUrl + "/index/getNewItemList", // 获取新品首发产品信息
  hotSearchWord: ipUrl + "/index/hotSearchWord", // 搜索框热搜词接口
  suspensionTag: ipUrl + "/index/suspensionTag", // 悬浮标签接口
  searchItems: ipUrl + "/index/searchItems", // 根据用户输入关键字搜索商品
  getCustomerServiceAccid: ipUrl + "/user/getCustomerServiceAccid", // 随机获取一条客服云信账号
  getSencondCategory: ipUrl + "/index/getSencondCategory", // 获取配置二级页面详情（banner+二级分类图标+新品模块+爆品模块+天天平价）
  getThirdCategory: ipUrl + "/index/getThirdCategory", // 推荐模块+三级分类商品界面
  getIndexCategoryImg: ipUrl + "/index/getIndexCategoryImg", // （首页轮播图+首页分类配置）

  // 购物流程API
  shoppingCart: ipUrl + "/shoppingCart/insert", // 保存购物车信息 注：就是加入购物车接口
  getCart: ipUrl + "/shopping/getCart", //获得购物车信息
  gotoSettlement: ipUrl + "/shopping/gotoSettlement", //获得结算页信息
  getOrderFee: ipUrl + "/shopping/getOrderFee", //单独计算运税费
  deleteProduction: ipUrl + "/shoppingCart/delete", //删除商品
  submitOrder: ipUrl + "/shopping/submitOrder", //生成并获得订单信息
  cancelOrder: ipUrl + "/shopping/cancelOrder", //取消订单
  payOrder: ipUrl + "/shopping/payOrder", //发起支付
  getPayOrder: ipUrl + "/shopping/getPayOrder", //支付结果查询
  getWechatJsAppOpenId: ipUrl + "/index/getWechatJsAppOpenId", //根据小程序登录凭证获取微信用户的openId、unionId
  shoppingCartUpdate: ipUrl + "/shoppingCart/update", //修改购物车信息

  //退换货相关API
  afterSaleList: ipUrl + "/user/afterSale/list", //获得退换列表信息
  afterSaleUploadImage: ipUrl + "/user/afterSale/uploadImage", //售后图片上传
  afterSaleApply: ipUrl + "/user/afterSale/apply", //提交退换申请
  afterSaleDetail: ipUrl + "/user/afterSale/detail", //查看售后申请详情

  /** 商品详情相关API */
  itemDetailList: ipUrl + "/item/itemDetailList", // 商品详情基本信息接口
  regionList: ipUrl + "/item/regionList", // 获取商品详情页的配送地址
  similarProductList: ipUrl + "/item/similarProductList", // 推荐产品接口
  recommendByCategory: ipUrl + "/item/recommendByCategory", // 获取商品页推荐产品列表
  searchItemByCategoryCom: ipUrl + "/item/searchItemByCategoryCom", // 商品分类搜索
  itemIntroduction: ipUrl + "/item/itemIntroduction", // 商品介绍接口
  getCount: ipUrl + "/shoppingCart/getCount", // 获取购物车数量
  getShopInfoByBusinessId: ipUrl + "/shopIndex/getShopInfoByBusinessId", // 获取店铺信息
  getLogisticsFee: ipUrl + "/item/getLogisticsFee", // 获取物流费税费
  getBrandList: ipUrl + "/item/getBrandList", // 根据分类查询对应品牌列表
  itemInfoList: ipUrl + "/item/itemInfoList", // 根据传入的商品号列表查询商品信息集合
  getLastShelfUpItems: ipUrl + "/item/getLastShelfUpItems", // 获取 最后更新的上架的商品
  getFestiveItemList: ipUrl + "/festiveItem/getFestiveItemList", // 根据传入的商品号列表查询商品信息集合
  getCountDown: ipUrl + "/festiveItem/getCountDown", // 倒计时差
  getItemCategoryItemByItemId: ipUrl + "/item/getItemCategoryItemByItemId", // 获取某个商品所属二级分类的所有商品

  // 商品类目API
  getFirstList: ipUrl + "/itemCategoryCommon/getFirstList", // 获取第一级类目
  getSubCategoryList: ipUrl + "/itemCategoryCommon/getSubCategoryList", // 获取子分类列表
  getListByKey: ipUrl + "/itemCategoryCommon/getListByKey", // 根据key 获取分类列表
  getListByTag: ipUrl + "/itemCategoryCommon/getListByTag", // 根据tag 获取分类列表
  getItemListByComIds: ipUrl + "/itemCategoryCommon/getItemListByComIds", // 根据分类id获取商品
  getBottomCategoryNavigation:
    ipUrl + "/itemCategoryCommon/getBottomCategoryNavigation", // 获取底部分类导航

  // 商品订单评价API
  commodityEvaluate: ipUrl + "/orderEvaluate/commodityEvaluate", // 查询店铺商品评价信息
  orderEvaluateInsert: ipUrl + "/orderEvaluate/orderEvaluateInsert", // 保存评论信息
  uploadPhoto: ipUrl + "/orderEvaluate/uploadPhoto", // 上传评论图片
  selectOrderEvaluate: ipUrl + "/orderEvaluate/selectOrderEvaluate", // 查询评论详情

  // 店铺信息API
  shopPraise: ipUrl + "/shop/shopPraise", // 获取店铺好评商品
  shopInformation: ipUrl + "/shop/shopInformation", // 获取商品详情里店铺等级之类的数据
  getShopSubCategory: ipUrl + "/shopIndex/getShopSubCategory", // 获取获取店铺分类列表
  searchShopByName: ipUrl + "/shop/searchShopByName", // 根據名字搜索店铺
  getShopGetListByKey: ipUrl + "/shop/getListByKey",
  searchShopItems: ipUrl + "/shop/searchShopItems", // 查詢店鋪全部商品

  // 店铺首页管理API
  getShopIndexList: ipUrl + "/shopIndex/getShopIndexList", // 获取店铺首页信息
  getSingleShopIndexList: ipUrl + "/shopIndex/getSingleShopIndexList", // 根据类型获取店铺首页列表信息
  getQualificationCertInfo: ipUrl + "/shopIndex/getQualificationCertInfo", // 获取资质信息
  getShopInfo: ipUrl + "/shopIndex/getShopInfo", // 获取店铺信息

  // 个人中心API
  getUserInfo: ipUrl + "/user/getUserInfo", // 获取用户个人信息
  saveBaseInfo: ipUrl + "/user/saveBaseInfo", // 更新个人信息
  myMessageList: ipUrl + "/user/myMessageList", // 我的消息列表
  myMessageDetail: ipUrl + "/user/myMessageDetail", // 查看消息明细
  myNotReadMessage: ipUrl + "/user/myNotReadMessage", // 查询未读消息条数
  setMessageRead: ipUrl + "/message/read", // 设置单个消息标记已读
  setMessageReadAll: ipUrl + "/message/readAll", // 设置全部消息为已读
  recommendLikeItems: ipUrl + "/user/recommendLikeItems", // 猜你喜欢
  recommendNewItems: ipUrl + "/user/recommendNewItems", // 精品推荐
  userCenterStatistics: ipUrl + "/user/userCenterStatistics", // 个人中心统计信息查询
  uploadUserHeadImage: ipUrl + "/user/uploadUserHeadImage", // 上传头像
  checkMobileUsable: ipUrl + "/user/checkMobileUsable", // 校验手机号

  getFaqConfig:ipUrl + '/Faq/getFaqConfig',//爱港猫FAQ

  // 用户实名认证
  upload: ipUrl + "/realNameAuth/upload", // 实名认证上传
  realNameAuthAdd: ipUrl + "/realNameAuth/add", // 保存实名认证信息
  realNameAuthView: ipUrl + "/realNameAuth/view", // 查看实名认证信息
  idCardCheck: ipUrl + "/logisticsAddress/idCardCheck", // 地址关联身份证号码实名验证

  // 买家关注商店、商品
  userAtShopList: ipUrl + "/userAtShop/list", // 分页查询
  userAtItemList: ipUrl + "/userAtItem/list", // 分页查询商品
  userAtShopAdd: ipUrl + "/userAtShop/add", // 添加关注商铺
  userAtShopRemove: ipUrl + "/userAtShop/remove", // 取消关注店铺
  userAtItemAdd: ipUrl + "/userAtItem/add", //关注商品
  userAtItemRemove: ipUrl + "/userAtItem/remove", //取消关注商品
  isFavorite: ipUrl + "/userAtShop/isFavorite", // 查询店铺是否
  userAtItemisFavorite: ipUrl + "/userAtItem/isFavorite", // 查询商品是否收藏
  userAtItemRemoveByIds: ipUrl + "/userAtItem/removeByIds", //批量取消收藏商品
  userAtShopRemoveByIds: ipUrl + "/userAtShop/removeByIds", //批量取消收藏店铺

  // 物流地址管理
  logisticsAddress: ipUrl + "/logisticsAddress/list", // 分页查询
  saveOrUpdate: ipUrl + "/logisticsAddress/saveOrUpdate", // 保存/修改
  setDefault: ipUrl + "/logisticsAddress/setDefault", // 设置默认地址
  logisticsAddressRemove: ipUrl + "/logisticsAddress/remove", // 删除地址

  // 订单管理API
  getItemOrderlList: ipUrl + "/user/itemOrder/list", // 订单列表分页查询
  getItemOrderView: ipUrl + "/user/itemOrder/view", // 查看订单详情
  orderEvaluate: ipUrl + "/user/itemOrder/orderEvaluate", // 查询用户评价信息接口
  queryLogisticsTracking:
    ipUrl + "/user/itemOrder/queryLogisticsTrackingByPackag", // 查询物流轨迹
  doReceived: ipUrl + "/user/itemOrder/doReceived", // 确认收货
  gotoPayOrder: ipUrl + "/shopping/gotoPayOrder", // 已提交订单，跳转支付页信息
  getOrderPackagingDetail: ipUrl + "/user/itemOrder/getOrderPackagingDetail", // 查询包裹详情

  // 快递地址信息查询API
  logisticsInfo: ipUrl + "/logisticsInfo/info", // 查询用户对应订单的收获地址信息

  // 店铺访问API
  shopVisitSave: ipUrl + "/shopVisit/save", // 保存店铺访问记录
  getShopVisitCount: ipUrl + "/shopVisit/getShopVisitCount", // 获取店铺访问记录

  // 活动列表API
  getTagList: ipUrl + "/activity/getSingleTagActivities",
  getItemListByKey: ipUrl + "/activity/getFoundGoodThings", //查询发现好物列表 --kzh--
  getItemByComIds: ipUrl + "/activity/getItemCategoryItemByComIds", //根据分类IDs查询商品（支持一级，二级分类）--kzh--

  getActivitiesList: ipUrl + "/activity/getPanicBuyingActivityList", //根据标签获取活动（爱抢购,发现好物）
  getActivityItemId: ipUrl + "/activity/getPanicBuyingItemById", //根据活动ID分页查询活动商品
  getItemListByKey: ipUrl + "/activity/getFoundGoodThings", //查询发现好物列表
  getItemByComIds: ipUrl + "/activity/getItemCategoryItemByComIds", //根据分类IDs查询商品（支持一级，二级分类）
  getCurrentIndexActivities: ipUrl + "/activity/getCurrentIndexActivities", // 获取首页下半页活动
  getItemCategoryItemByComIds: ipUrl + "/activity/getItemCategoryItemByComIds", // 根据分类IDs查询商品（支持一级，二级分类）
  getKeywordsAndClassIdSearch: ipUrl + "/index/keywordsAndClassIdSearch", // 分类id查询

  // 优惠券接口API
  getCouponList: ipUrl + "/coupon/couponList", // 获取优惠券列表
  getCouponIndexList: ipUrl + "/coupon/couponIndexList", // 获取指定优惠券
  getmyCouponList: ipUrl + "/coupon/myCouponList", // 获取我可领取的优惠券
  saveCouponRecord: ipUrl + "/coupon/saveCouponRecord", // 领取优惠券
  getmyCoupon: ipUrl + "/coupon/myCoupon", // 我的优惠券
  reCalculateFee: ipUrl + "/shopping/reCalculateFee", // 重新计算使用优惠券的费用
  getUserCouponList: ipUrl + "/shopping/getUserCouponList", // 获取用户优惠券列表
  getActivityCoupons: ipUrl + "/coupon/getCoupons", // 获取双十一活动优惠券

  //营销相关API
  getMarketingItemList: ipUrl + "/agentGood/getMarketingItemList", // 获取用户优惠券列表
  agentGoodDetail: ipUrl + "/agentGood/detail", // 获取营销商品详情
  msGotoSettlement: ipUrl + "/marketShopping/gotoSettlement", // 营销结算
  msSubmitOrder: ipUrl + "/marketShopping/submitOrder", // 营销提交订单
  msPayOrder: ipUrl + "/marketShopping/payOrder", // 营销发起支付
  msGetPayOrder: ipUrl + "/marketShopping/getPayOrder", // 营销查询支付信息
  updateRecommendCode: ipUrl + "/user/updateRecommendCode", // 更新绑定推荐码

  // 品牌闪购
  getBrandCategoryList: ipUrl + "/activity/getBrandCategoryList", //获取品牌分类列表
  getBrandSessionList: ipUrl + "/activity/getBrandSessionList", //获取品牌专场列表
  getItemByBrandId: ipUrl + "/activity/getItemByBrandId", //获取品牌商品列表
  getBrandByIds: ipUrl + "/activity/getBrandByIds", // 根据品牌关联ID查询品牌列表

  // APP-热销榜单
  getShufflyList: ipUrl + "/index/shufflyList", // 获取热销轮播图
  getSearcChoiceness: ipUrl + "/index/searcChoiceness", // 获取热销-精选商品
  getHotStyleList: ipUrl + "/index/hotStyleList", // 获取热销-精选商品
  getHotClassList: ipUrl + "/index/hotClassList", // 获取热销-分类
  getItemListByComIds: ipUrl + "/activity/getItemCategoryItemByComIds", // 获取热销-商品列表

  // 埋点事件API
  setEventPush: ipUrl + "/event/push", // 埋点消息
};

export default servicePath;
