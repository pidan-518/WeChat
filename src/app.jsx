import Taro, { Component } from "@tarojs/taro";
import Index from "./pages/index";
import "./app.less";

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {
  componentDidMount() {}

  componentDidShow() {
    Taro.getSystemInfo({}).then((res) => {
      Taro.$navBarMarginTop = res.statusBarHeight || 0;
    });
  }

  componentDidHide() {}

  componentDidCatchError() {}

  config = {
    pages: [
      "pages/index/index", // 首页 --li
      "pages/loveRobPurchase/loveRobPurchase", // 爱抢购 -- cyl
      "pages/category/category", // 分类页 --li
      "pages/drpjoin/drpjoin",
      "pages/drpgoods/drpgoods", //营销商品页面
      "pages/drpgoodsdetails/drpgoodsdetails",
      "pages/cart/cart", //购物车
      "pages/anothercart/anothercart", // 二级购物车 --li
      "pages/goodsdetails/goodsdetails", // 商品详情 --li
      "pages/usercomment/usercomment", // 用户评论 --li
      "pages/login/login", // 登录页 --li
      "pages/findgoods/findgoods", //发现好物 ---kzh--
      "pages/searchpage/searchpage", // 搜索页 --li
      "pages/bindwechat/bindwechat",
      "pages/unbindwechat/unbindwechat",
      "pages/myorder/myorder",
      "pages/proreturn/proreturn",
      "pages/person/person", // 个人中心 --li
      "pages/returnapply/returnapply",
      "pages/evaldetails/evaldetails",
      "pages/logistics/logistics",
      "pages/categoryGoods/categoryGoods", // 分类商品 --li
      "pages/ordersubmit/ordersubmit",
      "pages/myinfo/myinfo", // 个人信息 --li
      "pages/orderpaysuccess/orderpaysuccess",
      "pages/notice/notice",
      "pages/searchshop/searchshop", // 搜索店铺 --li
      'pages/agmfaq/agmfaq',//爱港猫
      "pages/orderdetails/orderdetails",
      "pages/changeaddress/changeaddress",
      "pages/register/register", // 注册页 --li
      "pages/searchgoods/searchgoods", // 开业庆典活动商品分类搜索页 --li
      "pages/usecertificate/usecertificate", // 使用优惠券 --li
      "pages/certificate/certificate", // 优惠券 --li
      "pages/mycertificate/mycertificate", // 我的卡券 --li
      "pages/historycertificate/historycertificate", // 历史卡券 --li
      "pages/resetpassword/resetpassword", // 修改密码 --li
      "pages/evaluate/evaluate", // 评论 --li
      "pages/shophome/shophome", // 店铺首页 --li
      "pages/realname/realname", // 实名认证 --li
      "pages/favorite/favorite", // 我的收藏 -li
      "pages/returnprocessing/returnprocessing",
      "pages/editaddress/editaddress", // 编辑地址 --li
      "pages/orderpay/orderpay",
      "pages/address/address", // 添加地址 --li
      "pages/returnresult/returnresult",
      "pages/hotpage/hotpage",
      "pages/shopqualifications/shopqualifications", // 店铺资质 --li
      "pages/messagecenter/messagecenter", // 消息中心 --li
      "pages/brand/brand", // 品牌闪购 -- wq
      "pages/brandlist/brandlist", // 品牌专场 -- wq
      "pages/hotlist/hotlist", // 热销榜单 -- dzk
      "pages/WebView/WebView", // WebView组件 -- dzk
      "pages/twocategory/twocategory", // 二级页面 --li
      "pages/threecategory/threecategory", // 二级页面 --li
    ],
    subPackages: [
      {
        root: "pageA",
        pages: [
          "activity3/activity3",
          "activity1/activity1",
          "activity2/activity2",
          "activity4/activity4",
          "activity5/activity5",
          "activity7/activity7", // 双十一活动首页--dzk
          "activity7/activitylist/activitylist", // 双十一活动商品页--dzk
          "activity7/coupons/coupons", // 双十一领券页--dzk
          "doubletwelve/doubletwelve", // 双十二活动首页--dzk
          "newyear/newyear", // 双旦活动首页--dzk
          "newyear/activitylist/activitylist", // 双旦活动商品页--dzk
          "newshopping/newshopping", // 年货节活动首页--dzk
          "newshopping/activitylist/activitylist", // 年货节活动商品页--dzk
          "spring/spring", // 春节活动首页--dzk
          "spring/activitylist/activitylist", // 春节活动商品页--dzk
        ],
      },
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      // navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: "black",
    },
    tabBar: {
      color: "#b5b5b5",
      selectedColor: "#ff5d8c",
      borderStyle: "black",
      list: [
        {
          pagePath: "pages/index/index",
          text: "首页",
          iconPath: "./static/tabbar/home.png",
          selectedIconPath: "./static/tabbar/home-ac.png",
        },
        {
          pagePath: "pages/category/category",
          text: "分类",
          iconPath: "./static/tabbar/category.png",
          selectedIconPath: "./static/tabbar/category-ac.png",
        },
        /* {
          pagePath: 'pages/hotpage/hotpage',
          text: "爆款",
          iconPath: "./static/tabbar/hot-money.png",
          selectedIconPath: "./static/tabbar/hot-money-ac.png",
        }, */
        {
          pagePath: "pages/cart/cart",
          text: "购物车",
          iconPath: "./static/tabbar/cart.png",
          selectedIconPath: "./static/tabbar/cart-ac.png",
        },
        {
          pagePath: "pages/person/person",
          text: "我的",
          iconPath: "./static/tabbar/person.png",
          selectedIconPath: "./static/tabbar/person-ac.png",
        },
      ],
    },
  };

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Index />;
  }
}

Taro.render(<App />, document.getElementById("app"));
