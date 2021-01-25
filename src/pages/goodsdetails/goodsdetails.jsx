import Taro, { Component } from "@tarojs/taro";
import {
  View,
  Text,
  Button,
  Input,
  Navigator,
  ScrollView,
} from "@tarojs/components";
import servicePath from "../../common/util/api/apiUrl";
import { postRequest, CarryTokenRequest } from "../../common/util/request";
import { AtFloatLayout } from "taro-ui";
import "taro-ui/dist/style/components/float-layout.scss";
import "taro-ui/dist/style/components/tabs.scss";
import "./goodsdetails.less";
import "../../common/globalstyle.less";
import utils from "../../common/util/utils";
import GoodsSwiper from "./components/GoodsSwiper/GoodsSwiper";
import GoodsName from "./components/GoodsName/GoodsName";
import ShopPreferred from "./components/ShopPreferred/ShopPreferred";
import GoodsList from "../../components/GoodsList/GoodsList";
import GoodsComment from "./components/GoodsComment/GoodsComment";
import GoodsInfo from "./components/GoodsInfo/GoodsInfo";
import Platform from "./components/Platform/Platfrom";
import ShopInfo from "./components/ShopInfo/ShopInfo";

// 商品详情
class GoodsDetails extends Component {
  state = {
    cartTotal: "", // 购物车数量
    goodsSwiper: [],
    goodsImgUrl: "", // 商品图片
    swiperCurrent: 0, // 轮播图当前索引
    goodsNum: "", // 商品数量
    visible: false, // 隐藏加入购物车弹出层
    shopInfo: {
      itemVOList: [],
      shopConfVOList: [],
    }, // 店铺信息
    goodsInfo: {
      businessId: "",
      signName: "",
      itemName: "",
    }, // 商品信息
    specreList: [], // 商品的类型规格数组
    specRelId: "", // 商品规格id
    specTagArr: [], // 商品规格数组
    specTagName: "", // 商品规格名
    specTagTitle: "", // 商品规格字段
    classTagArr: [], // 商品类数组
    classTagName: "", // 商品类名
    classTagTitle: "", // 商品类字段
    price: "", // 商品原价
    discountPrice: "", // 商品折扣价
    classPrice: "", // 规格商品原价价格
    classDiscountPrice: "", // 规格商品折扣价
    stockNum: "", // 商品库存
    isDismount: false, // 商品是否下架
    shopAccid: "", // 店铺IM号
    goodsOrigin: "", // 商品产地图标
    expressFree: "", // 商品包邮状态
    taxFree: "", // 商品包税状态
    itemId: "", // 商品id
    purchaseQuantity: null, // 起购数量
    singlePurchaseState: 0, // 是否可单独购买
    lookGoodsList: [], // 看了又看商品数据
    lookCurrent: 1, // 看了又看分页当前页
    lookPages: 1, // 看了又看总页数
    screenHeight: "", // 设备高度
    tabsItemId: 1,
    shop_preferred: "", // 店铺优选高度
    scrollViewBottom: "",
    goodsInfoTop: "",
    commentTop: "",
    detailsTop: "",
    recommendTop: "",
    isBackTop: false, // 显示返回顶部按钮值
    backTop: -1, // 设置scroll-view滚动条位置
    loadingText: "加载完毕",
    tabsOpacity: 0, // tabs透明度
    tabsHeight: "", // tabs高度
  };

  // 返回顶部按钮事件
  handleBackTop = () => {
    this.setState({
      backTop: 0,
    });
  };

  // 返回上一页按钮事件
  handleNavigateBack = () => {
    Taro.navigateBack({
      delta: 1,
    });
  };

  // 顶部tabs点击事件
  handleTabsClick = (item, e) => {
    const { backTop } = this.state;
    this.setState(
      {
        toView: item.id,
        tabsItemId: item.itemId,
        backTop: backTop + 0.1,
      },
      () => {
        switch (item.id) {
          case "info":
            this.setState({
              backTop: 0,
            });
            break;
          case "comment":
            this.setState({
              backTop: this.state.goodsInfoTop,
            });
            break;
          case "details":
            this.setState({
              backTop: this.state.detailsTop,
            });
            break;
          case "recommend":
            this.setState({
              backTop: this.state.recommendTop,
            });
            break;
          default:
            break;
        }
      }
    );
  };

  // ScrollView滚动事件
  handleScrollView(e) {
    const { scrollTop } = e.detail;
    let navHeight = 41;
    let query = Taro.createSelectorQuery();
    query.select("#info").boundingClientRect();
    query.select("#comment").boundingClientRect();
    query.select("#details").boundingClientRect();
    query.select("#recommend").boundingClientRect();
    query.exec((res) => {
      let goodsInfoTop = parseInt(res[0].height - navHeight);
      let commentTop = parseInt(goodsInfoTop);
      let detailsTop = parseInt(commentTop + res[1].height);
      let recommendTop = parseInt(res[2].height + detailsTop);
      this.setState({
        goodsInfoTop,
        commentTop,
        detailsTop,
        recommendTop,
      });
      /* console.log("goodsInfoTop", goodsInfoTop);
      console.log("commentTop", commentTop);
      console.log("detailsTop", detailsTop);
      console.log("recommendTop", recommendTop);
      console.log(Math.ceil(scrollTop)); */
      if (scrollTop <= goodsInfoTop) {
        this.setState({
          tabsItemId: 1,
        });
      }
      if (scrollTop >= commentTop && scrollTop < detailsTop) {
        this.setState({
          tabsItemId: 2,
        });
      }
      if (
        Math.ceil(scrollTop) >= detailsTop &&
        Math.ceil(scrollTop) < recommendTop
      ) {
        this.setState({
          tabsItemId: 3,
        });
      }
      if (Math.ceil(scrollTop) >= recommendTop) {
        this.setState({
          tabsItemId: 4,
        });
      }
    });

    if (scrollTop > 10) {
      this.setState({
        tabsOpacity: scrollTop / 100,
      });
    } else {
      this.setState({
        tabsOpacity: 0,
        backTop: -1,
      });
    }

    if (scrollTop > 1000) {
      this.setState({
        isBackTop: true,
      });
    } else {
      this.setState({
        isBackTop: false,
      });
    }
  }

  // 点击加号事件
  handleAdd = () => {
    if (this.state.stockNum === 0) {
      Taro.showToast({
        title: "商品数量不足",
        icon: "none",
        duration: 1500,
      });
      return false;
    } else if (this.state.stockNum <= this.state.goodsNum) {
      Taro.showToast({
        title: "不能再多了哦！",
        icon: "none",
        duration: 1500,
      });
      return false;
    } else {
      this.setState({
        goodsNum: this.state.goodsNum + 1,
      });
    }
  };

  // 商品数量输入框事件
  handleStockInput = (e) => {
    this.setState({
      goodsNum: Number(e.detail.value),
    });
  };

  // 商品数量输入框失去焦点事件
  handleStockInputBlur = (e) => {
    const { purchaseQuantity } = this.state;
    const reg = /\b(0+)/gi;
    if (reg.test(e.detail.value)) {
      e.detail.value = e.detail.value.replace(/\b(0+)/gi, 1);
      this.setState({
        goodsNum: Number(e.detail.value),
      });
      return;
    } else if (e.detail.value === "") {
      e.detail.value = e.detail.value.replace("", 1);
      this.setState({
        goodsNum: Number(e.detail.value),
      });
    } else if (purchaseQuantity !== null && e.detail.value < purchaseQuantity) {
      e.detail.value = purchaseQuantity;
      this.setState({
        goodsNum: Number(e.detail.value),
      });
    }
  };

  // 点击减号事件
  handleReduce = () => {
    const { goodsNum, purchaseQuantity } = this.state;
    if (
      (goodsNum !== 1 && purchaseQuantity === null) ||
      (goodsNum > purchaseQuantity && goodsNum > 1)
    ) {
      let num = this.state.goodsNum - 1;
      this.setState({
        goodsNum: num,
      });
    } else {
      if (purchaseQuantity !== null) {
        Taro.showToast({
          title: `最少购买${purchaseQuantity}件哦！`,
          icon: "none",
          duration: 1500,
        });
      }
    }
  };

  // 加入购物车按钮点击事件
  handleCartClick = () => {
    const { purchaseQuantity } = this.state;
    this.setState({
      visible: true,
      goodsNum: purchaseQuantity ? purchaseQuantity : 1,
    });
  };

  // 加入购物车弹框交叉点击事件
  handleForkClick = () => {
    this.setState({
      visible: false,
    });
  };

  // 加入购物车弹出层Close事件
  AtFloatLayouyClose = () => {
    this.setState({
      visible: false,
    });
  };

  // 选择款式点击事件
  handleGoodStyleClick = () => {
    const { purchaseQuantity } = this.state;
    this.setState({
      visible: true,
      goodsNum: purchaseQuantity ? purchaseQuantity : 1,
    });
  };

  // 商品主规格点击事件
  changeSpecTagIndex(item) {
    const { specreList, classTagName } = this.state;
    for (let idx of specreList) {
      if (idx.specName === item && idx.className === classTagName) {
        this.setState({
          specTagName: item,
          specRelId: idx.id,
          classPrice: idx.classPrice,
          stockNum: idx.stockNum,
          classDiscountPrice:
            idx.discountPrice !== null ? idx.discountPrice : idx.classPrice,
          purchaseQuantity:
            idx.purchaseQuantity !== null ? idx.purchaseQuantity : 1,
          goodsNum: idx.purchaseQuantity !== null ? idx.purchaseQuantity : 1,
          singlePurchaseState:
            idx.singlePurchaseState !== null ? idx.singlePurchaseState : 0,
        });
      }
    }
  }

  // 商品子规格点击事件
  changeClassTagIndex(item) {
    const { specreList, specTagName } = this.state;
    for (let idx of specreList) {
      if (idx.className === item && idx.specName === specTagName) {
        this.setState({
          classTagName: item,
          specRelId: idx.id,
          classPrice: idx.classPrice,
          stockNum: idx.stockNum,
          classDiscountPrice:
            idx.discountPrice !== null ? idx.discountPrice : idx.classPrice,
          purchaseQuantity:
            idx.purchaseQuantity !== null ? idx.purchaseQuantity : 1,
          goodsNum: idx.purchaseQuantity !== null ? idx.purchaseQuantity : 1,
          singlePurchaseState:
            idx.singlePurchaseState !== null ? idx.singlePurchaseState : 0,
        });
      }
    }
  }

  // 弹出层加入购物车按钮点击事件
  handleAddCart() {
    this.getShoppingCart();
  }

  // 加入购物车左边图标点击事件
  handleRedirectTo(url, txt) {
    if (txt === "店铺") {
      Taro.redirectTo({
        url: `${url}?businessId=${this.state.goodsInfo.businessId}`,
      });
    } else if (txt === "联系卖家") {
      if (this.state.shopAccid) {
        CarryTokenRequest(servicePath.getUserInfo)
          .then((res) => {
            if (res.data.code === 0) {
              Taro.navigateTo({
                url: `${url}?chatTo=${this.state.shopAccid}`,
              });
            }
          })
          .catch((err) => {
            if (err.statusCode === 403) {
              Taro.showToast({
                title: "暂未登录",
                duration: 1000,
                icon: "none",
                success: () => {
                  setTimeout(() => {
                    Taro.navigateTo({
                      url: "/pages/login/login",
                    });
                  }, 1000);
                },
              });
            } else {
              Taro.showToast({
                title: err.data.msg,
                duration: 1000,
                icon: "none",
              });
            }
          });
      } else {
        Taro.showModal({
          title: "提示",
          content: "抱歉，该店铺暂不支持在线咨询",
          showCancel: false,
        });
      }
    } else {
      Taro.redirectTo({
        url: `${url}?businessId=${this.state.goodsInfo.businessId}`,
      });
      return;
    }
  }

  // 获取商品详情基本信息
  getItemDetailList(itemId) {
    postRequest(servicePath.itemDetailList, { itemId: itemId })
      .then((res) => {
        console.log("详情信息返回数据成功", res.data);
        if (res.data.code === 0) {
          const {
            state,
            categoryComPath,
            categoryBusId,
            detailVO,
            image,
            itemSpecRelList,
            price,
            discountPrice,
            sign,
            expressFree,
            taxFree,
            shopVO,
          } = res.data.data;
          Taro.setStorageSync("categoryComPath", categoryComPath);
          Taro.setStorageSync("categoryBusId", categoryBusId);
          const classTagArr = [];
          const specTagArr = [];
          itemSpecRelList.forEach((item) => {
            classTagArr.push(item.className);
            specTagArr.push(item.specName);
          });
          if (state === 20) {
            this.setState(
              {
                isDismount: true,
              },
              () => {
                Taro.showModal({
                  title: "提示",
                  content: "商品已下架",
                  cancelColor: "#ff5d8c",
                  confirmText: "确认",
                  showCancel: false,
                });
              }
            );
          }
          this.setState({
            goodsInfo: res.data.data,
            goodsSwiper:
              detailVO === null ? [image] : detailVO.images.split(","),
            goodsImgUrl: image,
            specreList: itemSpecRelList,
            classTagArr: this.unique(classTagArr),
            specTagArr: this.unique(specTagArr),
            specRelId: itemSpecRelList[0].id,
            specTagName: itemSpecRelList[0].specName,
            specTagTitle: itemSpecRelList[0].specTagName,
            classTagName: itemSpecRelList[0].className,
            classTagTitle: itemSpecRelList[0].classTagName,
            classPrice: itemSpecRelList[0].classPrice,
            classDiscountPrice: itemSpecRelList[0].discountPrice,
            price: price,
            singlePurchaseState: itemSpecRelList[0].singlePurchaseState,
            discountPrice: discountPrice,
            stockNum: itemSpecRelList[0].stockNum,
            goodsOrigin: sign,
            expressFree: expressFree,
            taxFree: taxFree,
            itemId: Number(itemId),
            shopInfo: shopVO,
            shopAccid: shopVO.accid,
            purchaseQuantity: itemSpecRelList[0].purchaseQuantity,
            goodsNum:
              itemSpecRelList[0].purchaseQuantity === null
                ? 1
                : itemSpecRelList[0].purchaseQuantity,
            isDismount:
              itemSpecRelList[0].purchaseQuantity > itemSpecRelList[0].stockNum
                ? true
                : false,
          });
        }
      })
      .catch((err) => {
        console.log("详情信息返回数据失败", err);
      });
  }

  // 获取商品所属二级分类的所有商品
  getItemCategoryItemByItemId(itemId, current = 1) {
    CarryTokenRequest(servicePath.getItemCategoryItemByItemId, {
      itemId: itemId,
      current: current,
      len: 10,
    })
      .then((res) => {
        const { current, pages, records } = res.data.data;
        if (res.data.code === 0) {
          this.setState({
            lookGoodsList: [...this.state.lookGoodsList, ...records],
            lookCurrent: current,
            lookPages: pages,
            loadingText: "加载完毕",
          });
        }
      })
      .catch((err) => {
        console.log("获取商品所属二级分类的所有商品数据失败", err);
      });
  }

  // 加入购物车接口
  getShoppingCart() {
    CarryTokenRequest(servicePath.shoppingCart, {
      shopId: this.state.shopInfo.shopId,
      itemId: this.$router.params.itemId,
      itemNum: this.state.goodsNum === 0 ? 1 : this.state.goodsNum,
      price: this.state.discountPrice,
      itemSpecClassId: this.state.specRelId,
    })
      .then((res) => {
        console.log("加入购物车成功", res.data);
        if (res.data.code === 0) {
          Taro.showModal({
            title: "操作成功",
            content: "加入购物车成功，是否前往购物车？",
            confirmText: "去看看",
            cancelText: "继续逛逛",
            success: (res) => {
              this.setState({
                visible: false,
              });
              if (res.confirm) {
                Taro.switchTab({
                  url: "../cart/cart",
                });
              }
            },
          });
        } else {
          Taro.showToast({
            title: res.data.msg,
            duration: 1000,
            icon: "none",
          });
        }
      })
      .catch((err) => {
        if (err.statusCode === 403) {
          Taro.showToast({
            title: "请先注册/登陆后再加入购物车",
            duration: 1000,
            icon: "none",
            success: () => {
              setTimeout(() => {
                Taro.navigateTo({
                  url: "/pages/login/login",
                });
              }, 1000);
            },
          });
        } else {
          Taro.showToast({
            title: err.data.msg,
            duration: 1000,
            icon: "none",
          });
        }
        console.log("加入购物车失败", err);
      });
  }

  // 埋点消息
  setEventPush() {
    postRequest(servicePath.setEventPush, {
      eventCode: "ITEM_BROWSING",
      params: {
        itemId: this.$router.params.itemId,
      },
      source: 10,
    })
      .then((res) => {
        console.log("埋点消息返回成功", res.data);
      })
      .catch((err) => console.log("埋点消息异常", err));
  }

  //更新绑定推荐码
  updateRecommendCode = (registerRecommend) => {
    const postData = {
      // recommend: '8MO5C2'
      recommend: registerRecommend,
    };
    CarryTokenRequest(servicePath.updateRecommendCode, postData);
  };

  // 数组去重
  unique(arr) {
    return Array.from(new Set(arr));
  }

  onShareAppMessage() {
    const shareRecommend = Taro.getStorageSync("shareRecommend");
    return {
      title: "极品秒杀~快来看看吧!",
      path: `pages/goodsdetails/goodsdetails?itemId=${this.$router.params.itemId}&shareRecommend=${shareRecommend}`,
    };
  }

  onReachBottom() {
    const { lookCurrent, lookPages } = this.state;
    let itemId = this.$router.params.itemId;
    if (lookCurrent < lookPages) {
      this.setState(
        {
          loadingText: "加载中...",
        },
        () => {
          setTimeout(() => {
            this.getItemCategoryItemByItemId(itemId, lookCurrent + 1);
          }, 1000);
        }
      );
    } else {
      this.setState({
        loadingText: "已全部加载完毕",
      });
    }
  }

  onPageScroll(e) {}

  componentWillMount() {
    this.getItemDetailList(this.$router.params.itemId);
    this.getItemCategoryItemByItemId(this.$router.params.itemId);
    Taro.getSystemInfo({}).then((res) => {
      this.setState({
        screenHeight: res.windowHeight - Taro.$navBarMarginTop,
      });
    });
  }

  componentDidMount() {
    this.setEventPush();
    const registerRecommend = this.$router.params.shareRecommend; //代理码，注册、购物分佣两用
    // this.updateRecommendCode(registerRecommend)
    Taro.setStorage({
      key: "registerRecommend",
      data: registerRecommend,
    });

    utils.updateRecommendCode(this.$router.params.shareRecommend); //绑定、存储代理码

    let query = Taro.createSelectorQuery();
    query.select("#cart-wrap").boundingClientRect();
    query.select(".tabs").boundingClientRect();
    query.exec((res) => {
      this.setState({
        scrollViewBottom: res[0].height,
        tabsHeight: res[1].height,
      });
    });
  }

  componentDidHide() {}

  config = {
    navigationStyle: "custom",
  };

  render() {
    // 加入购物车模块图标
    const cartIcon = [
      {
        iconImg: require("../../static/goodsdetails/shop-icon.png"),
        iconTxt: "店铺",
        url: "/pages/shophome/shophome",
      },
      {
        iconImg: require("../../static/goodsdetails/service-icon.png"),
        iconTxt: "联系卖家",
        url: "/IM/partials/chating/chating",
      },
    ];

    const tabsItem = [
      {
        text: "商品",
        id: "info",
        itemId: 1,
      },
      {
        text: "评价",
        id: "comment",
        itemId: 2,
      },
      {
        text: "详情",
        id: "details",
        itemId: 3,
      },
      {
        text: "推荐",
        id: "recommend",
        itemId: 4,
      },
    ];

    const {
      goodsSwiper,
      goodsImgUrl,
      goodsNum,
      visible,
      goodsInfo,
      specTagArr,
      classTagArr,
      specTagTitle,
      classTagTitle,
      specTagName,
      classTagName,
      discountPrice,
      price,
      isDismount,
      stockNum,
      classPrice,
      classDiscountPrice,
      goodsOrigin,
      expressFree,
      taxFree,
      purchaseQuantity,
      singlePurchaseState,
      shopInfo,
      lookGoodsList,
      screenHeight,
      tabsItemId,
      scrollViewBottom,
      isBackTop,
      backTop,
      loadingText,
      tabsOpacity,
      tabsHeight,
    } = this.state;

    return (
      <View id="goods-details">
        <View
          style={{
            height: `${Taro.$navBarMarginTop}px`,
            backgroundColor: "#fff",
          }}
        ></View>
        <View className="left-icon-box">
          <View className="another-left-icon">
            <Image
              className="another-left-icon-img"
              src={require("../../static/searchpage/left.png")}
            />
          </View>
        </View>
        <View
          className="tabs"
          style={{ top: `${Taro.$navBarMarginTop}px`, opacity: tabsOpacity }}
        >
          {tabsItem.map((item) => (
            <View
              className={`tabs-item ${
                tabsItemId === item.itemId ? "tabs-item-ac" : ""
              }`}
              key={item.itemId}
            >
              <View
                onClick={this.handleTabsClick.bind(this, item)}
                data-id={item.id}
                className="tabs-item-text"
              >
                {item.text}
              </View>
            </View>
          ))}
          <Image
            onClick={this.handleNavigateBack}
            className="left-icon"
            src={require("../../static/searchpage/left.png")}
          />
        </View>
        <ScrollView
          scroll-with-animation
          style={{
            height: `${screenHeight}px`,
            paddingBottom: `${scrollViewBottom}px`,
            boxSizing: "border-box",
          }}
          scrollY
          /* scroll-into-view={toView} */
          onScroll={this.handleScrollView.bind(this)}
          onScrollToLower={this.onReachBottom.bind(this)}
          scroll-top={backTop}
        >
          <View id="info">
            <GoodsSwiper swiperData={goodsSwiper} />
            {/* 商品名模块 */}
            <GoodsName
              goodsInfo={goodsInfo}
              discountPrice={discountPrice}
              price={price}
              goodsName={goodsInfo.itemName}
              sign={goodsOrigin}
              signName={goodsInfo.signName}
              expressFree={expressFree}
              taxFree={taxFree}
            />
            <View id="goods-style" onClick={this.handleGoodStyleClick}>
              <View className="good-style-label">选择规格</View>
              <View className="good-style-value">
                <Text className="value-txt">{`${specTagName}/${classTagName}`}</Text>
                <Image src={require("../../static/goodsdetails/right.png")} />
              </View>
            </View>
            <ShopInfo shopAccid={this.state.shopAccid} shopData={shopInfo} />
          </View>
          {/* 商品规格模块 */}
          <View id="comment">
            <GoodsComment
              itemId={this.$router.params.itemId}
              businessId={goodsInfo.businessId}
              shopData={shopInfo}
            />
            <ShopPreferred goodsList={shopInfo.itemVOList} />
          </View>
          <View id="details">
            {/* 商品信息图 */}
            <GoodsInfo itemId={goodsInfo.itemId} />
            {/* 平台承诺 */}
            <Platform />
          </View>
          <View className="look-box" id="recommend">
            <View className="look-title">
              <Image
                className="look-title-image"
                src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsdetails/look-title-2.png"
              />
            </View>
            <View className="look-list">
              <GoodsList goodsList={lookGoodsList} />
              <View className="loading-text">{loadingText}</View>
            </View>
          </View>
        </ScrollView>
        {/* 加入购物车模块 */}
        <View id="cart-wrap">
          <View className="cart-icon">
            {cartIcon.map((item) => (
              <View
                className="cart-icon-item"
                key={item.iconTxt}
                onClick={this.handleRedirectTo.bind(
                  this,
                  item.url,
                  item.iconTxt
                )}
              >
                <Image src={item.iconImg} />
                <Text>{item.iconTxt}</Text>
              </View>
            ))}
            <Navigator
              url="/pages/anothercart/anothercart"
              className="cart-icon-item"
            >
              <View className="cart-icon-item">
                <Image src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsdetails/cart-icon.png" />
                <Text>购物车</Text>
              </View>
            </Navigator>
          </View>
          <View className="cart-btn">
            <Button /* disabled={isDismount} */ onClick={this.handleCartClick}>
              加入购物车
            </Button>
          </View>
        </View>
        {/* 商品规格模块 */}
        <AtFloatLayout isOpened={visible} onClose={this.AtFloatLayouyClose}>
          <View className="goods-specrel-box">
            <Image
              onClick={this.handleForkClick}
              className="fork"
              src={require("../../static/goodsdetails/fork.png")}
            />
            <View className="good-img">
              <Image src={goodsImgUrl} />
              <View className="good-price">
                <Text className="price-text">
                  <Text style={{ fontWeight: "300" }}>￥ </Text>
                  <Text className="text-num">
                    {classDiscountPrice === null
                      ? classPrice
                      : classDiscountPrice}
                  </Text>
                </Text>
                <Text decode className="stock-num">
                  库存&nbsp;{stockNum}
                </Text>
                <Text className="specrel-txt" decode>
                  请选择&nbsp;&nbsp;&nbsp;款式
                </Text>
              </View>
            </View>
            {/* 商品主规格 */}
            <View className="good-spec-wrap">
              <View className="spec-title">{specTagTitle}</View>
              <View className="spec-list">
                {specTagArr.map((item, index) => (
                  <Text
                    className={`${
                      item === specTagName ? "spec-item-ac" : "spec-item"
                    }`}
                    key={index}
                    onClick={this.changeSpecTagIndex.bind(this, item)}
                  >
                    {item}
                  </Text>
                ))}
              </View>
            </View>
            {/* 商品子规格 */}
            <View className="good-classTag-wrap">
              <View className="classTag-title">{classTagTitle}</View>
              <View className="classTag-list">
                {classTagArr.map((item, index) => (
                  <Text
                    key={index}
                    className={`${
                      item === classTagName
                        ? "classTag-item-ac"
                        : "classTag-item"
                    }`}
                    onClick={this.changeClassTagIndex.bind(this, item)}
                  >
                    {item}
                  </Text>
                ))}
              </View>
            </View>
            {/* 添加商品数量模块 */}
            <View className="goods-stock">
              <Text className="stock-label">数量：</Text>
              <View className="right-box">
                <Text className="purchase-quantity">
                  {purchaseQuantity > 1 && singlePurchaseState === 1
                    ? `（${purchaseQuantity}件起购，不可单独购买）`
                    : purchaseQuantity > 1
                    ? `（${purchaseQuantity}件起购）`
                    : singlePurchaseState === 1
                    ? "（不可单独购买）"
                    : ""}
                </Text>

                <View className="stock-box">
                  <View
                    style={{
                      color:
                        purchaseQuantity === null
                          ? "#ff5d8c"
                          : goodsNum > purchaseQuantity
                          ? "#ff5d8c"
                          : "#ccc",
                    }}
                    className="decrease"
                    onClick={this.handleReduce}
                  >
                    -
                  </View>
                  <Input
                    className="stock-input"
                    type="number"
                    maxLength="2"
                    onInput={this.handleStockInput.bind(this)}
                    onBlur={this.handleStockInputBlur.bind(this)}
                    value={goodsNum}
                  />
                  <View className="increase" onClick={this.handleAdd}>
                    +
                  </View>
                </View>
              </View>
            </View>
            <View className="Add-cart-btn">
              <Button
                disabled={isDismount || stockNum === 0}
                onClick={this.handleAddCart}
              >
                {stockNum === 0 ? "已售罄" : "加入购物车"}
              </Button>
            </View>
          </View>
        </AtFloatLayout>
        <View
          className="common-top"
          style={{ display: isBackTop ? "block" : "none" }}
          onClick={this.handleBackTop}
        >
          <Image src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/public/top.png" />
        </View>
      </View>
    );
  }
}

export default GoodsDetails;
