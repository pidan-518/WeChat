import Taro, { Component } from "@tarojs/taro";
import { View, Text, Input, Button } from "@tarojs/components";
import { AtDrawer } from "taro-ui";
import "taro-ui/dist/style/components/drawer.scss";
import "taro-ui/dist/style/components/list.scss";
import { postRequest } from "../../common/util/request";
import servicePath from "../../common/util/api/apiUrl";
import "./categoryGoods.less";
import "../../common/globalstyle.less";
import GoodsList from "../../components/GoodsList/GoodsList";
import CommonEmpty from "../../components/CommonEmpty/CommonEmpty";
import CommonTop from "../../components/CommonTop/CommonTop";

// 三级分类商品
class categoryGoods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topFliter: "", // 筛选框和顶部的距离
      bannerImage: "", //
      riseIcon: require("../../static/category/filter-top.png"), // 销量正序图标
      dropIcon: require("../../static/category/filter-bottom.png"), // 销量倒序图标
      ascSortIcon:
        "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/common/ascending.png", // 升序图标
      ascSortIconAc:
        "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/common/ascending-ac.png", // 升序点击后的图标
      descSortIcon:
        "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/common/descending.png", // 降序图标
      descSortIconAc:
        "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/common/descending-ac.png", // 降序点击后的图标
      filterDrawer: false, // 控制筛选弹框
      isComplex: true, // 综合排序
      sortPrice: "", // 价格排序
      sortSaleNum: "", // 销量排序
      minPrice: "", // 最低价格
      maxPrice: "", // 最高价格
      discId: "", // 包邮包税id
      discounts: [
        { discText: "包邮", id: 1 },
        { discText: "包税", id: 2 },
        { discText: "包邮包税", id: 3 },
      ],
      isBackTop: false,
      goodsList: [], // 商品列表
      goodsCurrent: "", // 商品列表当前页
      goodsPages: "", // 商品列表总页数
      hotText: "", // 输入框默认值
      isBackTop: false,
      loadingText: "加载完毕",
    };
  }

  // 左上角返回按钮
  handleNavigateBack = () => {
    Taro.navigateBack({
      delta: 1,
    });
  };

  // 搜索框点击事件
  handleNavigateTo = () => {
    Taro.navigateTo({
      url: `/pages/searchpage/searchpage?hotText=${this.state.hotText || ""}`,
    });
  };

  // 筛选聚合事件
  handleSortClick = (e) => {
    e.stopPropagation();
    const { name } = e.currentTarget.dataset;
    switch (name) {
      case "complexSort":
        this.complexSort();
        break;
      case "priceSort":
        this.sortPrice();
        break;
      case "salesSort":
        this.sortSaleNum();
        break;
      default:
        break;
    }
  };

  // 综合排序
  complexSort = () => {
    const { isComplex } = this.state;
    if (!isComplex) {
      this.setState(
        {
          goodsList: [],
          sortSaleNum: "",
          sortPrice: "",
          isComplex: true,
          filterDrawer: false,
        },
        () => {
          this.getKeywordsAndClassIdSearch();
        }
      );
    }
  };

  // 价格排序
  sortPrice = () => {
    const { sortPrice } = this.state;
    if (!sortPrice) {
      this.setState(
        {
          sortPrice: true,
          goodsList: [],
          sortSaleNum: "",
          isComplex: false,
          filterDrawer: false,
        },
        () => {
          this.getKeywordsAndClassIdSearch();
        }
      );
    } else {
      this.setState(
        {
          sortPrice: false,
          goodsList: [],
          sortSaleNum: "",
          isComplex: false,
          filterDrawer: false,
        },
        () => {
          this.getKeywordsAndClassIdSearch();
        }
      );
    }
  };

  // 销量排序
  sortSaleNum = () => {
    const { sortSaleNum } = this.state;
    if (sortSaleNum !== 1) {
      this.setState(
        {
          sortSaleNum: 1,
          isComplex: false,
          sortPrice: "",
          goodsList: [],
          filterDrawer: false,
        },
        () => {
          this.getKeywordsAndClassIdSearch();
        }
      );
    } else {
    }
  };

  handleDiscClick = (id) => {
    this.setState({
      discId: id,
    });
  };

  // 筛选点击事件
  handleFilterClick = (e) => {
    e.stopPropagation();
    this.setState({
      filterDrawer: true,
      /* isComplex: false,
      sortPrice: '',
      sortSaleNum: '', */
    });
  };

  handleAtDrawerClose = () => {
    this.setState({
      filterDrawer: false,
    });
  };

  // 筛选表单重置
  handleFilterReset = (e) => {
    this.setState({
      discId: "",
    });
  };

  // 筛选表单提交
  handleFilterSubmit = (e) => {
    const { minPrice, maxPrice } = e.detail.value;
    this.setState(
      {
        minPrice,
        maxPrice,
        filterDrawer: false,
        goodsList: [],
      },
      () => {
        this.getKeywordsAndClassIdSearch();
      }
    );
  };

  // 上拉事件
  onReachBottom = () => {
    if (this.state.goodsCurrent !== this.state.goodsPages) {
      this.setState(
        {
          loadingText: "正在加载...",
        },
        () => {
          setTimeout(() => {
            postRequest(servicePath.getKeywordsAndClassIdSearch, {
              comIds: [this.$router.params.comIds],
              current: this.state.goodsCurrent + 1,
              len: 10,
              source: 10,
              saleOrder: this.state.saleOrder,
              priceOrder: this.state.priceOrder,
              updatePrder: "",
            })
              .then((res) => {
                console.log("获取商品成功", res.data);
                if (res.data.code === 0) {
                  this.setState({
                    goodsCurrent: res.data.data.current,
                    goodsPages: res.data.data.pages,
                    goodsList: [
                      ...this.state.goodsList,
                      ...res.data.data.records,
                    ],
                    loadingText: "加载完毕",
                  });
                }
              })
              .catch((err) => {
                console.log("获取商品失败", err);
              });
          }, 500);
        }
      );
    } else {
      this.setState({
        loadingText: "已经全部加载完毕",
      });
    }
  };

  // 根据分类id获取商品
  getKeywordsAndClassIdSearch(current = 1) {
    const { sortPrice, minPrice, maxPrice, discId, sortSaleNum } = this.state;
    postRequest(servicePath.getKeywordsAndClassIdSearch, {
      comIds: [this.$router.params.comIds],
      current: current,
      len: 10,
      source: 10,
      sortPrice: sortPrice === true ? 0 : sortPrice === false ? 1 : "",
      sortSaleNum: sortSaleNum === 1 ? 1 : "",
      minPrice: minPrice,
      maxPrice: maxPrice,
      expressFree: discId === 1 || discId === 3 ? 1 : "",
      taxFree: discId === 2 || discId === 3 ? 1 : "",
    })
      .then((res) => {
        console.log("获取商品成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            goodsCurrent: res.data.data.current,
            goodsPages: res.data.data.pages,
            goodsList: res.data.data.records,
          });
        }
      })
      .catch((err) => {
        console.log("获取商品失败", err);
      });
  }

  componentWillMount() {
    Taro.getSystemInfo({}).then((res) => {
      this.setState({
        maskHeight: res.windowHeight,
      });
    });
  }

  componentDidMount() {
    this.getKeywordsAndClassIdSearch();
    Taro.createSelectorQuery()
      .select(".category-goods-head")
      .boundingClientRect((rect) => {
        this.setState({
          topFliter: rect.height,
        });
      })
      .exec();
  }

  componentWillUnmount() {}

  componentDidShow() {
    this.setState({
      bannerImage: this.$router.params.banner,
      hotText: this.$router.params.hotText,
    });
  }

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

  componentDidHide() {}

  config = {
    /* navigationBarTitleText: '搜索',
    usingComponents: {} */
    navigationStyle: "custom",
    onReachBottomDistance: 50,
  };

  render() {
    const {
      topFliter,
      bannerImage,
      hotText,
      goodsList,
      ascSortIcon,
      ascSortIconAc,
      descSortIcon,
      descSortIconAc,
      filterDrawer,
      isComplex,
      sortPrice,
      sortSaleNum,
      discounts,
      discId,
      isBackTop,
      maskHeight,
      loadingText,
    } = this.state;

    return (
      <View id="category-goods">
        <CommonTop show={isBackTop} />
        <View
          className="category-goods-head"
          style={{ paddingTop: `${Taro.$navBarMarginTop}px` }}
        >
          <Image
            onClick={this.handleNavigateBack}
            className="left-icon"
            src={require("../../static/searchpage/left.png")}
          />
          <View className="search-box" onClick={this.handleNavigateTo}>
            <Input
              className="search-input"
              disabled
              placeholder={hotText || ""}
            />
          </View>
        </View>
        {bannerImage ? (
          <View className="category-banner">
            <Image className="banner-img" src={bannerImage} />
          </View>
        ) : null}
        {/* 条件筛选 */}
        <View className="filter-row" style={{ top: `${topFliter}px` }}>
          <View
            className="filter-item-box"
            onClick={this.handleSortClick}
            style={{ color: isComplex ? "#000" : "#98989E" }}
            data-name="complexSort"
          >
            <View className="filter-item">
              <View>综合排序</View>
            </View>
          </View>
          <View className="line"></View>
          <View
            className="filter-item-box"
            onClick={this.handleSortClick}
            data-name="priceSort"
            style={{ color: sortPrice === "" ? "#98989E" : "#000" }}
          >
            <View className="filter-item">
              <View>价格</View>
              <View className="item-sort">
                <Image
                  src={sortPrice !== true ? ascSortIcon : ascSortIconAc}
                  className="sort-icon"
                />
                <Image
                  src={sortPrice !== false ? descSortIcon : descSortIconAc}
                  className="sort-icon"
                />
              </View>
            </View>
          </View>
          <View className="line"></View>
          <View
            className="filter-item-box"
            style={{ color: sortSaleNum === "" ? "#98989E" : "#000" }}
            data-name="salesSort"
            onClick={this.handleSortClick}
          >
            <View className="filter-item">
              <View>销量</View>
            </View>
          </View>
          <View className="line"></View>
          <View className="filter-item-box" onClick={this.handleFilterClick}>
            <View className="filter-item">
              <View>筛选</View>
              <Image
                className="filter-icon"
                src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/common/filter.png"
              />
            </View>
          </View>
        </View>
        {/* 筛选弹框 */}
        <AtDrawer
          show={filterDrawer}
          right
          mask
          height={`${maskHeight}px`}
          width="614rpx"
          onClose={this.handleAtDrawerClose}
        >
          <Form
            onSubmit={this.handleFilterSubmit}
            onReset={this.handleFilterReset}
          >
            <View className="drawer-wrap">
              <View className="drawer-item">
                <View className="item-title">折扣和服务</View>
                <View className="item-list">
                  {discounts.map((item) => (
                    <View
                      className={
                        item.id === discId ? "list-label-ac" : "list-label"
                      }
                      key={item.id}
                      onClick={this.handleDiscClick.bind(this, item.id)}
                    >
                      {item.discText}
                    </View>
                  ))}
                </View>
              </View>
              <View className="drawer-item">
                <View className="item-title">价格区间</View>
                <View className="price-box">
                  <Input
                    className="price-input"
                    placeholder="最低价"
                    type="text"
                    name="minPrice"
                  />
                  <View className="line"></View>
                  <Input
                    className="price-input"
                    placeholder="最高价"
                    type="text"
                    name="maxPrice"
                  />
                </View>
              </View>
              <View className="btn-box">
                <Button className="reset-btn" formType="reset">
                  重置
                </Button>
                <Button className="confirm-btn" formType="submit">
                  确定
                </Button>
              </View>
            </View>
          </Form>
        </AtDrawer>
        {goodsList.length === 0 ? (
          <CommonEmpty content="暂无商品" />
        ) : (
          <View className="goods-content">
            <GoodsList hasTitle goodsList={goodsList} />
            <View className="loading-text">{loadingText}</View>
          </View>
        )}
      </View>
    );
  }
}

export default categoryGoods;
