import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView } from "@tarojs/components";
import "./shophome.less";
import "../../common/globalstyle.less";
import { AtTabBar, AtTabs, AtTabsPane } from "taro-ui";
import "taro-ui/dist/style/components/tab-bar.scss";
import "taro-ui/dist/style/components/tabs.scss";
import { postRequest, CarryTokenRequest } from "../../common/util/request";
import servicePath from "../../common/util/api/apiUrl";
import GoodsList from "../../components/GoodsList/GoodsList";
import CommonEmpty from "../../components/CommonEmpty/CommonEmpty";
import utils from "../../common/util/utils";

// 店铺首页
class ShopHome extends Component {
  state = {
    tabBarcurrent: 0, // 店铺tabbar下标
    tabsCurrent: 0, // 店铺tabs下标
    verticalCurrent: 0, // 分类垂直tabs下标
    categoryTabsList: [], // 垂直tabs的数据
    shopInfo: {}, // 店铺信息
    hotList: [], // 爆款商品
    newList: [], // 新品商品
    itemList: [], // 其他商品
    categoryGoodList: [], // 分类商品数据
    categoryCurrent: 1, // 分类商品当前页
    categoryGoodPages: "", // 分类商品总页数
    allGoodsList: [], // 全部商品数据
    allGoodsPages: "", // 全部商品分页总数
    allGoodsCurrent: "", // 全部商品当前页
    scrollViewHeight: "", // 首页scrollView的高度
    allGoodScrollViewHeight: "", // 全部商品scrollView的高度
    collectImg: require("../../static/common/collect.png"), // 收藏图标
    hasCollect: "", //店铺是否收藏值
    categoryTitle: "", // 分类title
    shopAccid: "", // 店铺IM号
  };

  /* constructor(props) {
    super(props);

    this.
  } */

  // Tabbar点击事件
  handleAtTabBarClick(tabBarcurrent) {
    this.setState({ tabBarcurrent });
    if (tabBarcurrent === 3) {
      this.setState({ tabBarcurrent: 0 });
      if (this.state.shopAccid) {
        CarryTokenRequest(servicePath.getUserInfo).then((res) => {
          if (res.data.code === 0) {
            Taro.navigateTo({
              url: `/IM/partials/chating/chating?chatTo=${this.state.shopAccid}`,
            });
          }
        });
      } else {
        Taro.showModal({
          title: "提示",
          content: "抱歉，该店铺暂不支持在线咨询",
          showCancel: false,
        });
        this.setState({ tabBarcurrent: 0 });
      }
    }
  }

  // 店铺tabs点击事件
  handleAtTabsClick = (tabsCurrent) => {
    this.setState({ tabsCurrent });
  };

  // 分类tabs点击事件
  handleVertivalTabsClick = (verticalCurrent) => {
    const { categoryTabsList } = this.state;
    for (let i = 0; i < categoryTabsList.length; i++) {
      if (i === verticalCurrent) {
        this.setState(
          {
            categoryTitle: categoryTabsList[i].title,
            categoryGoodList: [],
          },
          () => {
            this.searchItemByCategoryCom(1);
          }
        );
      }
    }
    this.setState({ verticalCurrent });
  };

  // 分类商品的scroll-view上拉事件
  categoryOnScrollToLower = () => {
    if (this.state.categoryCurrent === this.state.categoryGoodPages) {
      console.log("没有更多数据了");
    } else {
      this.searchItemByCategoryCom(this.state.categoryCurrent + 1);
    }
  };

  // 全部商品的scroll-view上拉事件
  AllGoodsListOnScrollToLower = () => {
    if (this.state.allGoodsCurrent === this.state.allGoodsPages) {
      console.log("没有更多数据了");
    } else {
      this.getShopAllGoods(this.state.allGoodsCurrent + 1);
    }
  };

  // 收藏点击事件
  handleFollowShop = () => {
    if (this.state.hasCollect) {
      this.setUserAtShopRemove();
    } else {
      this.setUserAtShopAdd();
    }
  };

  // 获取店铺信息
  getShopInfoByBusinessId() {
    postRequest(servicePath.getShopInfoByBusinessId, {
      businessId: this.$router.params.businessId,
    })
      .then((res) => {
        console.log("获取店铺头像成功", res.data);
        if (res.data.code === 0) {
          Taro.setNavigationBarTitle({
            title: res.data.data.shopVO.name,
          });
          this.setState({
            shopInfo: res.data.data.shopVO,
            shopAccid: res.data.data.shopVO.accid, // 店铺IM号
          });
          this.getIsFavorite(res.data.data.shopVO.shopId);
        }
      })
      .catch((err) => {});
  }

  // 获取店铺首页商品
  getShopIndexList() {
    postRequest(servicePath.getShopIndexList, {
      businessId: this.$router.params.businessId,
      source: 10,
    })
      .then((res) => {
        console.log("店铺首页信息返回成功", res.data);
        if (res.data.code === 0) {
          const { hotList, newList, itemList } = res.data.data;
          this.setState({
            hotList,
            newList,
            itemList,
          });
        }
      })
      .catch((err) => {
        console.log("店铺首页返回数据失败", err);
      });
  }

  // 获取店铺是否收藏
  getIsFavorite(shopId) {
    CarryTokenRequest(servicePath.isFavorite, {
      shopId: shopId,
    })
      .then((res) => {
        console.log("获取店铺收藏成功", res.data);
        if (res.data.code === 0) {
          const hasCollect = res.data.data === 1 ? true : false;
          if (res.data.data === 1) {
            this.setState({
              collectImg: require("../../static/common/collect-active.png"),
              hasCollect,
            });
          } else {
            this.setState({
              collectImg: require("../../static/common/collect.png"),
              hasCollect,
            });
          }
        }
      })
      .catch((err) => {
        console.log("获取店铺收藏失败", err);
      });
  }

  // 获取店铺分类
  getShopSubCategory() {
    postRequest(servicePath.getShopSubCategory, {
      businessId: this.$router.params.businessId, // this.$router.params.businessId,
      parentId: 0,
    })
      .then((res) => {
        console.log("获取店铺分类成功", res.data);
        if (res.data.code === 0) {
          if (res.data.data.length !== 0) {
            this.setState(
              {
                categoryTabsList: JSON.parse(
                  JSON.stringify(res.data.data).replace(/name/g, "title")
                ),
                categoryTitle: JSON.parse(JSON.stringify(res.data.data))[0]
                  .name,
              },
              () => {
                this.searchItemByCategoryCom(1);
              }
            );
          }
        }
      })
      .catch((err) => {
        console.log("获取店铺分类失败", err);
      });
  }

  // 获取全部商品
  getShopAllGoods(current) {
    postRequest(servicePath.searchShopItems, {
      businessId: this.$router.params.businessId,
      current: current,
      len: 10,
      source: 10,
    })
      .then((res) => {
        console.log("获取店铺全部商品成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            allGoodsList: [
              ...this.state.allGoodsList,
              ...res.data.data.records,
            ],
            allGoodsPages: res.data.data.pages,
            allGoodsCurrent: res.data.data.current,
          });
        }
      })
      .catch((err) => {
        console.log("获取店铺全部商品失败", err);
      });
  }

  // 获取分类的商品
  searchItemByCategoryCom(current) {
    postRequest(servicePath.searchItemByCategoryCom, {
      categoryBusPath: `${this.state.categoryTitle}`,
      businessId: this.$router.params.businessId,
      len: 10,
      current: current,
      source: 10,
    })
      .then((res) => {
        console.log("获取商品分类成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            categoryGoodList: [
              ...this.state.categoryGoodList,
              ...res.data.data.records,
            ],
            categoryGoodPages: res.data.data.pages,
            categoryCurrent: res.data.data.current,
          });
        }
      })
      .catch((err) => {
        console.log("获取商品分类失败", err);
      });
  }

  // 添加关注店铺
  setUserAtShopAdd() {
    CarryTokenRequest(servicePath.userAtShopAdd, {
      shopId: this.state.shopInfo.shopId,
    })
      .then((res) => {
        console.log("添加关注店铺成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            collectImg: require("../../static/common/collect-active.png"),
            hasCollect: true,
          });
          Taro.showToast({
            title: "关注店铺成功",
            icon: "none",
            duration: 1000,
          });
        } else if (res.data.code === -1) {
          Taro.showModal({
            title: "提示",
            content: "您尚未登录，是否需要登录？",
            cancelColor: "#ff5d8c",
            confirmColor: "#ff5d8c",
            success: (res) => {
              if (res.confirm) {
                Taro.navigateTo({
                  url: "/pages/login/login",
                });
              }
            },
          });
        } else {
          Taro.showToast({
            title: "关注店铺失败",
            icon: "none",
            duration: 1000,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("添加关注店铺失败", err);
      });
  }

  // 取消关注店铺
  setUserAtShopRemove() {
    CarryTokenRequest(servicePath.userAtShopRemove, {
      shopId: this.state.shopInfo.shopId,
    })
      .then((res) => {
        console.log("取消关注店铺成功", res.data);
        if (res.data.code === 0) {
          this.setState(
            {
              collectImg: require("../../static/common/collect.png"),
              hasCollect: false,
            },
            () => {
              Taro.showToast({
                title: "取消关注店铺成功",
                icon: "none",
                duration: 1000,
              });
            }
          );
        } else {
          Taro.showToast({
            title: "取消关注店铺成功",
            icon: "none",
            duration: 1000,
          });
        }
      })
      .catch((err) => {
        console.log("取消关注店铺失败", err);
      });
  }

  // 埋点消息
  setEventPush() {
    postRequest(servicePath.setEventPush, {
      eventCode: "SHOP_BROWSING",
      params: {
        businessId: this.$router.params.businessId,
      },
      source: 10,
    })
      .then((res) => {
        console.log("埋点消息返回成功", res.data);
      })
      .catch((err) => console.log("埋点消息异常", err));
  }

  componentWillMount() {}

  componentDidMount() {
    this.getShopInfoByBusinessId();
    this.getShopIndexList();
    this.getShopSubCategory();
    this.getShopAllGoods(1);
    this.setEventPush();
  }

  componentDidShow() {
    if (this.state.tabBarcurrent === 2) {
      this.setState({
        tabBarcurrent: 0,
      });
    }
    Taro.getSystemInfo({}).then((res) => {
      Taro.createSelectorQuery()
        .select(".shop-head")
        .boundingClientRect((rect) => {
          this.setState({
            scrollViewHeight: res.windowHeight - (rect.height + (43 + 65)),
            allGoodScrollViewHeight: res.windowHeight - (rect.height + 65),
          });
        })
        .exec();
    });

    utils.updateRecommendCode(this.$router.params.shareRecommend); //绑定、存储代理码
  }

  onShareAppMessage() {
    const shareRecommend = Taro.getStorageSync("shareRecommend");
    return {
      title: "极品秒杀~快来看看吧!",
      path: `pages/shophome/shophome?businessId=${this.$router.params.businessId}&shareRecommend=${shareRecommend}`,
    };
  }

  config = {
    usingComponents: {},
  };

  render() {
    const {
      tabBarcurrent,
      tabsCurrent,
      verticalCurrent,
      categoryTabsList,
      shopInfo,
      hotList,
      newList,
      itemList,
      scrollViewHeight,
      allGoodsList,
      allGoodScrollViewHeight,
      collectImg,
      categoryGoodList,
    } = this.state;

    const TabBarList = [
      {
        title: "首页",
        image: require("../../static/shophome/shop-home.png"),
        selectedImage: require("../../static/shophome/shop-home-ac.png"),
      },
      {
        title: "分类",
        image: require("../../static/shophome/category.png"),
        selectedImage: require("../../static/shophome/category-ac.png"),
      },
      {
        title: "全部商品",
        image: require("../../static/shophome/shop-good.png"),
        selectedImage: require("../../static/shophome/shop-good-ac.png"),
      },
      {
        title: "联系客服",
        image: require("../../static/shophome/service.png"),
        selectedImage: require("../../static/shophome/service-ac.png"),
      },
    ];

    const tabsList = [
      { title: "爆款榜单" },
      { title: "新品首发" },
      { title: "商家精选" },
    ];

    return (
      <View id="shop-home">
        <View className="shop-head">
          <View className="head-left">
            <Image src={shopInfo.logoPath} />
            <View className="shop-info">
              <View>{shopInfo.name}</View>
              <View className="authen-img">
                <Navigator
                  url={`/pages/shopqualifications/shopqualifications?shopId=${shopInfo.shopId}`}
                >
                  <Image src={require("../../static/goodsdetails/qog.png")} />
                  <Image
                    src={require("../../static/goodsdetails/vip-ac.png")}
                  />
                </Navigator>
              </View>
            </View>
          </View>
          <View className="collection" onClick={this.handleFollowShop}>
            <Image src={collectImg} />
            <Text>收藏</Text>
          </View>
        </View>
        {
          {
            0: (
              <View>
                <AtTabs
                  current={tabsCurrent}
                  tabList={tabsList}
                  onClick={this.handleAtTabsClick.bind(this)}
                >
                  <AtTabsPane current={tabsCurrent} index={0}>
                    <ScrollView
                      scrollY
                      style={{ height: `${scrollViewHeight}px` }}
                      className="scroll-view"
                    >
                      <View className="tabs-content">
                        {hotList.length === 0 ? (
                          <CommonEmpty content="暂无商品" />
                        ) : (
                          <GoodsList goodsList={hotList} hasTitle />
                        )}
                      </View>
                    </ScrollView>
                  </AtTabsPane>
                  <AtTabsPane current={tabsCurrent} index={1}>
                    <ScrollView
                      scrollY
                      style={{ height: `${scrollViewHeight}px` }}
                      className="scroll-view"
                    >
                      <View className="tabs-content">
                        {newList.length === 0 ? (
                          <CommonEmpty content="暂无商品" />
                        ) : (
                          <GoodsList goodsList={newList} hasTitle />
                        )}
                      </View>
                    </ScrollView>
                  </AtTabsPane>
                  <AtTabsPane current={tabsCurrent} index={2}>
                    <ScrollView
                      scrollY
                      style={{ height: `${scrollViewHeight}px` }}
                      className="scroll-view"
                    >
                      <View className="tabs-content">
                        {itemList.length === 0 ? (
                          <CommonEmpty content="暂无商品" />
                        ) : (
                          <GoodsList goodsList={itemList} hasTitle />
                        )}
                      </View>
                    </ScrollView>
                  </AtTabsPane>
                </AtTabs>
              </View>
            ),
            1: (
              <AtTabs
                onClick={this.handleVertivalTabsClick.bind(this)}
                current={verticalCurrent}
                tabList={categoryTabsList}
                scroll
              >
                {categoryTabsList.map((item, index) => (
                  <AtTabsPane
                    index={index}
                    current={verticalCurrent}
                    key={index}
                  >
                    <ScrollView
                      className="scroll-view category-scroll"
                      onScrollToLower={this.categoryOnScrollToLower}
                      scrollY
                      style={{ height: `${scrollViewHeight}px` }}
                    >
                      <View className="category-content">
                        {categoryGoodList.length === 0 ? (
                          <CommonEmpty content="暂无商品" />
                        ) : (
                          <GoodsList goodsList={categoryGoodList} hasTitle />
                        )}
                      </View>
                    </ScrollView>
                  </AtTabsPane>
                ))}
              </AtTabs>
            ),
            2: (
              <ScrollView
                scrollY
                className="scroll-view"
                style={{ height: `${allGoodScrollViewHeight}px` }}
                onScrollToLower={this.AllGoodsListOnScrollToLower}
              >
                <View className="tabs-content">
                  {allGoodsList.length === 0 ? (
                    <CommonEmpty content="暂无商品" />
                  ) : (
                    <GoodsList goodsList={allGoodsList} hasTitle />
                  )}
                </View>
              </ScrollView>
            ),
            3: <View></View>,
          }[tabBarcurrent]
        }
        <AtTabBar
          fixed
          color="#303030"
          selectedColor="#ff5d8c"
          tabList={TabBarList}
          current={tabBarcurrent}
          onClick={this.handleAtTabBarClick.bind(this)}
        />
      </View>
    );
  }
}

export default ShopHome;
