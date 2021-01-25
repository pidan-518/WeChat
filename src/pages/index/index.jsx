import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView } from "@tarojs/components";
import "./index.less";
import "../../common/globalstyle.less";
import { postRequest, CarryTokenRequest } from "../../common/util/request";
import servicePath from "../../common/util/api/apiUrl";
import utils from "../../common/util/utils";
/* import GoodsList from '../../components/GoodsList/GoodsList';
import Header from './components/Header/Header'; */
import Banner from "./components/Banner/Banner";
import Category from "./components/Category/Category";
import Activity from "./components/Activity/Activity";
import HotSearchWord from "./components/HotSearchWord/HotSearchWord";
import LovingShopping from "./components/LovingShopping/LovingShopping";
import CommonTop from "../../components/CommonTop/CommonTop";

// 首页
class Index extends Component {
  state = {
    searchHeight: "", // 搜索框高度
    roaChartImg: [], // 轮播图
    categoryIcon: [], // 分类icon
    hotSearchWordList: [], // 热搜词数据
    indexMiddleBannerData: {
      image:
        "https://iconmall-test.oss-cn-shenzhen.aliyuncs.com/client/activity/icon/1603183068178.png",
      url: "http://192.168.0.181/h5/#/pagesapp/findgoods/findgoods",
    }, // 首页广告图
    lovingShoppingData: {
      activityId: "",
      endMilliTime: "",
      panicBuyingItemList: [], // 商品列表
      startTime: "", // 活动开始时间
      endTime: "", // 活动结束时间
      activeState: "", // 活动状态 0=未开始，1=正在进行，2=已结束
      nextSessionState: "",
    }, // 爱抢购数据
    nextMilliTime: 0, // 距离下一场次毫秒数
    hotListData: {}, // 热销榜单
    brandFlashSale: {}, // 品牌闪购
    /* specialSurprise: {}, // 特价惊喜 */
    foundGoodThingsData: {},
    tabsList: [], // 分类数据
    tabsIndex: 0, // 分类下标
    tabScroll: "", // tabs自动偏移
    comIds: [], // 分类下的所有分类id
    goodsList: [], // 分类商品
    goodsCurrent: 1, // 分类商品当前页
    goodsPages: 1, // 分类商品总页数
    timer: "", // 定时器Id
    scrollTimer: "",
    scrollTop: "",
    isBackTop: false,
  };

  // 搜索框点击事件
  handleSearchInputClick = () => {
    Taro.navigateTo({
      url: "/pages/searchpage/searchpage",
    });
  };

  // 扫码点击事件
  handleScanCode = () => {
    Taro.scanCode({
      success: (res) => {
        switch (res.scanType) {
          case "QR_CODE":
            if (res.result.match("iconmall://")) {
              utils.mutiLink(res.result);
            } else {
              let urls = [
                "aigangmao",
                "istgc",
                "121.42.231.22",
                "192.168.0.181",
              ];
              for (let itemUrl of urls) {
                if (res.result.match(itemUrl)) {
                  return false;
                } else {
                  Taro.showToast({
                    title: "抱歉，该二维码非爱港猫商城二维码",
                    icon: "none",
                    duration: 2000,
                  });
                }
              }
            }
            break;
          default:
            break;
        }
      },
    });
  };

  // 首页中部轮播图点击事件
  handleMainBannerClick = ({ url }) => {
    utils.mutiLink(url);
  };

  // 商品点击事件
  handleGoodsClick = (item) => {
    Taro.navigateTo({
      url: "/pages/goodsdetails/goodsdetails?itemId=" + item.itemId,
    });
  };

  // tabs点击事件
  handleTabsClick = (index, item, e) => {
    let tabWidth = this.state.windowWidth;
    const query = Taro.createSelectorQuery();
    const comIds = [];
    item.itemCategoryList.forEach((item) => comIds.push(item.categoryComId));
    query.select(".tabs-item").boundingClientRect();
    query.exec((res) => {
      this.setState(
        {
          tabScroll:
            e.currentTarget.offsetLeft - tabWidth / 2 + res[0].width / 2,
          tabsIndex: index,
          goodsList: [],
          comIds: comIds,
        },
        () => {
          Taro.pageScrollTo({
            scrollTop: this.state.scrollTop,
            duration: 0,
          });
          this.getItemCategoryItemByComIds(comIds);
        }
      );
    });
  };

  // 获取商品分类接口
  getIndexCategoryImg() {
    postRequest(servicePath.getIndexCategoryImg, {
      confType: 12,
      source: 10,
    })
      .then((res) => {
        console.log("获取聚合数据成功", res.data);
        if (res.data.code === 0) {
          const {
            hotSearchWordList,
            configCategoryList,
            indexConfImgList,
          } = res.data.data;
          this.setState({
            categoryIcon: configCategoryList,
            roaChartImg: indexConfImgList,
            hotSearchWordList: hotSearchWordList,
          });
        }
      })
      .catch((err) => {
        console.log("聚合接口异常", err);
      });
  }

  // 获取首页下半部分内容
  getCurrentIndexActivities() {
    postRequest(servicePath.getCurrentIndexActivities, {
      source: 50,
    })
      .then((res) => {
        console.log("获取首页下半部分内容成功", res.data);
        if (res.data.code === 0) {
          const {
            lovingShopping,
            indexMiddleBanner,
            foundGoodThings,
            hotList,
            brandFlashSale,
            categoryShowList,
          } = res.data.data;
          let nextMilliTime =
            lovingShopping.nextMilliTime === null
              ? lovingShopping.endMilliTime
              : lovingShopping.nextMilliTime;
          if (nextMilliTime > 0) {
            this.state.timer = setInterval(() => {
              if (nextMilliTime < 1000) {
                clearInterval(this.state.timer);
                setTimeout(() => {
                  this.getCurrentIndexActivities();
                }, 1000);
                return;
              }

              if (nextMilliTime >= 0) {
                nextMilliTime -= 1000;
                this.setState({
                  nextMilliTime,
                });
              } else {
                clearInterval(this.state.timer);
              }
            }, 1000);
          }
          this.setState(
            {
              indexMiddleBannerData: indexMiddleBanner,
              lovingShoppingData: lovingShopping,
              hotListData: hotList,
              brandFlashSaleData: brandFlashSale,
              foundGoodThingsData: foundGoodThings,
              nextMilliTime: nextMilliTime,
              tabsList: categoryShowList ? categoryShowList.slice(0, 4) : [],
            },
            () => {
              const comIds = [];
              categoryShowList[0].itemCategoryList.map((item) =>
                comIds.push(item.categoryComId)
              );
              this.setState(
                {
                  comIds: comIds,
                },
                () => {
                  this.getItemCategoryItemByComIds(comIds);
                }
              );
            }
          );
        }
      })
      .catch((err) => {
        console.log("获取首页下半部分内容异常", err);
      });
  }

  // 获取分类IDs查询商品
  getItemCategoryItemByComIds(comIds, current = 1) {
    postRequest(servicePath.getItemCategoryItemByComIds, {
      comIds: comIds,
      current: current,
      len: 10,
      source: 50,
      updateOrder: "desc",
    })
      .then((res) => {
        console.log("获取分类商品成功", res.data);
        if (res.data.code === 0) {
          const { records, current, pages } = res.data.data;
          this.setState({
            goodsList: [...this.state.goodsList, ...records],
            goodsCurrent: current,
            goodsPages: pages,
          });
        }
      })
      .catch((err) => {
        console.log("获取分类商品异常", err);
      });
  }

  //更新绑定推荐码
  updateRecommendCode = (registerRecommend) => {
    const postData = {
      recommend: registerRecommend || "",
    };
    CarryTokenRequest(servicePath.updateRecommendCode, postData);
  };

  // 上拉事件
  onReachBottom = () => {
    const { goodsPages, goodsCurrent, goodsList } = this.state;
    if (goodsPages > goodsCurrent && goodsList.length !== 0) {
      this.getItemCategoryItemByComIds(
        this.state.comIds,
        this.state.goodsCurrent + 1
      );
    }
  };

  onPageScroll(e) {
    if (e.scrollTop >= 2200) {
      this.setState({
        isBackTop: true,
      });
    } else {
      this.setState({
        isBackTop: false,
      });
    }
  }

  //--------------------

  componentWillMount() {}

  componentDidMount() {
    const query = Taro.createSelectorQuery();
    query.select(".tabs-content").boundingClientRect();
    query.exec((res) => {
      this.setState({
        scrollTop: res[0].top,
      });
    });
    this.getIndexCategoryImg();
    this.getCurrentIndexActivities();
  }

  componentDidShow() {
    Taro.getSystemInfo({
      success: (res) => {
        this.setState({
          windowWidth: res.windowWidth,
        });
      },
    });
    setTimeout(() => {
      let searchHeight = Taro.createSelectorQuery();
      searchHeight
        .select(".index-head")
        .boundingClientRect((rect) => {
          this.setState({
            searchHeight: rect.height,
          });
        })
        .exec();
    }, 300);
    utils.updateRecommendCode(this.$router.params.shareRecommend); //绑定、存储代理码
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  onShareAppMessage() {
    const shareRecommend = Taro.getStorageSync("shareRecommend");
    return {
      imageUrl:
        "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/share/index-share-image.jpg",
      title: "香港直邮，急速发货，一站式购齐全球品质好物！",
      path: `pages/index/index?shareRecommend=${shareRecommend}`,
    };
  }

  config = {
    usingComponents: {},
    onReachBottomDistance: 50,
    navigationStyle: "custom",
  };

  render() {
    const {
      searchHeight,
      roaChartImg,
      categoryIcon,
      goodsList,
      hotSearchWordList,
      indexMiddleBannerData,
      lovingShoppingData,
      hotListData,
      brandFlashSaleData,
      foundGoodThingsData,
      nextMilliTime,
      tabsList,
      tabScroll,
      tabsIndex,
      isBackTop,
    } = this.state;
    return (
      <View>
        <View id="index">
          {/* 搜索框 */}
          <View
            className="index-head"
            style={{ paddingTop: `${Taro.$navBarMarginTop}px` }}
          >
            <View className="nav-box">
              <View className="nav-input">
                <Image
                  className="search-icon"
                  src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/home/search-icon.png"
                />
                <Input
                  disabled
                  type="text"
                  placeholder="点击搜索您想要的商品"
                  onClick={this.handleSearchInputClick}
                />
                <Image
                  onClick={this.handleScanCode}
                  className="scanit-icon"
                  src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/common/scanit-icon.png"
                />
              </View>
            </View>
          </View>
          <View className="content-bg">
            {/* 热搜词 */}
            <HotSearchWord
              hotSearchWordList={hotSearchWordList}
              top={searchHeight}
            />
            {/* banner模块 */}
            <Banner bannerData={roaChartImg} />
            {/* 商品分类模块 */}
            <Category categoryIcon={categoryIcon} />
          </View>
          <View style={{ padding: `0px 22rpx` }}>
            {indexMiddleBannerData.image ? (
              <View
                className="gif-image"
                onClick={this.handleMainBannerClick.bind(
                  this,
                  indexMiddleBannerData
                )}
              >
                <Image className="opening" src={indexMiddleBannerData.image} />
              </View>
            ) : null}
            {/* 爱抢购模块 */}
            {lovingShoppingData.activityId !== null &&
            lovingShoppingData.panicBuyingItemList.length !== 0 ? (
              <LovingShopping
                lovingShoppingData={lovingShoppingData}
                nextMilliTime={nextMilliTime}
              />
            ) : null}
            {/* 活动模块 */}
            <Activity
              hotListData={hotListData}
              brandFlashSaleData={brandFlashSaleData}
              foundGoodThingsData={foundGoodThingsData}
            />
          </View>
          <View className="category-tabs" style={{ top: `${searchHeight}px` }}>
            <ScrollView
              className="tabs-scroll"
              scrollX="true"
              scrollLeft={tabScroll}
              scrollWithAnimation
            >
              {tabsList.map((item, index) => (
                <View className="tabs-item-box" key={item.id}>
                  <View
                    className={
                      index === tabsIndex ? "tabs-item-active" : "tabs-item"
                    }
                    onClick={this.handleTabsClick.bind(this, index, item)}
                  >
                    <View className="item-title">{item.name}</View>
                    <View className="item-child-title">{item.subTitle}</View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
          <View className="tabs-content">
            {goodsList.map((item) => (
              <View
                className="goods-item"
                onClick={this.handleGoodsClick.bind(this, item)}
                key={item.id}
              >
                <View className="goods-status">
                  <Image
                    className="status-img"
                    src={
                      item.taxFree === 1 && item.expressFree === 1
                        ? "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsStatus/goods-status1.png"
                        : item.taxFree === 1
                        ? "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsStatus/goods-status2.png"
                        : item.expressFree === 1
                        ? "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsStatus/goods-status3.png"
                        : null
                    }
                  />
                </View>
                <View className="goods-img-wrap">
                  <Image className="goods-img" src={item.image} webp />
                </View>
                <Text
                  className="goods-name"
                  style={{
                    display: "-webkit-box",
                    "-webkit-box-orient": "vertical",
                    "-webkit-line-clamp": 2,
                    overflow: "hidden",
                  }}
                >
                  {item.itemName}
                </Text>
                <View className="goods-price">
                  {item.price === item.discountPrice ? (
                    <View className="price-box">
                      <View className="origin-price">
                        <Text className="price-symbol">￥</Text>
                        <Text className="price-text">{item.discountPrice}</Text>
                      </View>
                    </View>
                  ) : item.discountPrice !== null ? (
                    <View className="price-box">
                      <View className="origin-price">
                        <Text className="price-symbol">￥</Text>
                        <Text className="price-text">{item.discountPrice}</Text>
                      </View>
                      <View className="discount-price">￥{item.price}</View>
                    </View>
                  ) : (
                    <View className="price-box">
                      <View className="origin-price">
                        <Text className="price-symbol">￥</Text>
                        <Text className="price-text">{item.price}</Text>
                      </View>
                    </View>
                  )}
                  {item.sign !== null ? (
                    <View className="sign-img-wrap">
                      <Image className="sign-img" src={item.sign} alt="" />
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        </View>
        <CommonTop show={isBackTop} />
      </View>
    );
  }
}

export default Index;
