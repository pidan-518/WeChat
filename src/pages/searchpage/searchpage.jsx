import Taro, { Component } from "@tarojs/taro";
import { View, Text, Input, Image, Button, Form } from "@tarojs/components";
import { AtDrawer } from "taro-ui";
import "taro-ui/dist/style/components/drawer.scss";
import "taro-ui/dist/style/components/list.scss";
import "./searchpage.less";
import "../../common/globalstyle.less";
import { postRequest } from "../../common/util/request";
import servicePath from "../../common/util/api/apiUrl";
import CommonEmpty from "../../components/CommonEmpty/CommonEmpty";
import GoodsList from "../../components/GoodsList/GoodsList";
import CommonTop from "../../components/CommonTop/CommonTop";

// 搜索页面
class SearchPage extends Component {
  state = {
    searchVal: "", // 搜索框值
    timer: null, // 防抖函数定时器
    TopHeight: "", // 搜索列表对顶部的距离
    searchListHeight: "", // 搜索列表的高度
    searchList: [], // 搜索结果的list
    paddingTop: "",
    goodsList: [], // 商品列表
    isShow: false, // 显示搜索结果list的值
    goodsCurrent: 1, // 商品列表当前页
    goodsPages: "", // 商品列表总页数
    visible: false, // 显示搜索历史热搜词框
    searchHistory: [], // 搜索历史数据
    hotWords: [], // 热搜词
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
    // 筛选text高亮
    discId: "", // 包邮包税id
    discounts: [
      { discText: "包邮", id: 1 },
      { discText: "包税", id: 2 },
      { discText: "包邮包税", id: 3 },
    ],
    isBackTop: false,
    loadingText: "加载完毕",
  };

  // 左上角返回按钮
  handleNavigateBack = () => {
    Taro.navigateBack({
      delta: 1,
    });
  };

  // 搜索框输入事件
  handleSearchInput = (e) => {
    clearTimeout(this.state.timer);
    this.setState({
      searchVal: e.detail.value,
      isShow: false,

      filterDrawer: false,
    });
    if (e.detail.value === "") {
      this.setState({
        searchList: [],
        isShow: true,
        visible: false,
      });
      return;
    } else if (e.detail.value.match(/^\s*$/)) {
      return;
    }
    this.state.timer = setTimeout(() => {
      this.searchItems(e.detail.value, 1);
    }, 500);
  };

  // 搜索框点击完成按钮时触发事件
  handleSearchInputConfirm = (e) => {
    if (e.detail.value.match(/^\s*$/)) {
      return;
    }
    let searchHistory = this.state.searchHistory;
    searchHistory.unshift(this.state.searchVal);
    this.setState(
      {
        goodsList: [],
        isShow: true,
        visible: true,
        searchVal: e.detail.value,
        searchHistory: this.unique(searchHistory),
        filterDrawer: false, // 控制筛选弹框
        isComplex: false, // 综合排序
        sortPrice: "", // 价格排序
        sortSaleNum: "", // 销量排序
        minPrice: "", // 最低价格
        maxPrice: "", // 最高价格
        // 筛选text高亮
        discId: "", // 包邮包税id
      },
      () => {
        Taro.setStorageSync(
          "searchHistory",
          JSON.stringify(this.state.searchHistory)
        );
        this.getSearchGoods();
      }
    );
  };

  // 搜索框获取焦点事件
  handleSearchInputFocus = (e) => {
    console.log("进入");
    const { searchVal } = this.state;
    if (e.detail.value === "") {
      this.setState({
        isShow: true,
        visible: false,
        filterDrawer: false,
      });
      return;
    } else if (e.detail.value.match(/^\s*$/)) {
      return;
    } else {
      if (searchVal !== "") {
        this.setState(
          {
            isShow: false,
            filterDrawer: false,
          },
          () => {
            this.searchItems(this.state.searchVal, 1);
          }
        );
      }
    }
  };

  // 搜索框失去焦点事件
  handleSearchInputBlur = (e) => {
    this.setState({
      isShow: true,
    });
  };

  // 搜索结果列表item的点击事件
  handleSearchItemClick = (itemName) => {
    let searchHistory = this.state.searchHistory;
    searchHistory.unshift(itemName);
    this.setState(
      {
        goodsList: [],
        isShow: true,
        visible: true,
        searchVal: itemName,
        searchHistory: this.unique(searchHistory),
        filterDrawer: false, // 控制筛选弹框
        isComplex: true, // 综合排序
        sortPrice: "", // 价格排序
        sortSaleNum: "", // 销量排序
        minPrice: "", // 最低价格
        maxPrice: "", // 最高价格
        // 筛选text高亮
        discId: "", // 包邮包税id
      },
      () => {
        Taro.setStorageSync(
          "searchHistory",
          JSON.stringify(this.state.searchHistory)
        );
        this.getSearchGoods();
      }
    );
  };

  // 删除搜索历史
  handleDeleteSearchHistory = () => {
    this.setState(
      {
        searchHistory: [],
      },
      () => {
        Taro.removeStorageSync("searchHistory");
      }
    );
  };

  // 搜索历史数据item点击事件
  handleSearchHistoryItem = (item) => {
    this.setState(
      {
        visible: true,
        goodsList: [],
        searchVal: item,
        filterDrawer: false, // 控制筛选弹框
        isComplex: true, // 综合排序
        sortPrice: "", // 价格排序
        sortSaleNum: "", // 销量排序
        minPrice: "", // 最低价格
        maxPrice: "", // 最高价格
        // 筛选text高亮
        discId: "", // 包邮包税id
      },
      () => {
        this.getSearchGoods();
      }
    );
  };

  // 热搜词item点击事件
  handleHotItemClick = (item) => {
    let searchHistory = this.state.searchHistory;
    searchHistory.unshift(item);
    this.setState(
      {
        visible: true,
        goodsList: [],
        searchVal: item,
        searchHistory: this.unique(searchHistory),
        filterDrawer: false, // 控制筛选弹框
        isComplex: false, // 综合排序
        sortPrice: "", // 价格排序
        sortSaleNum: "", // 销量排序
        minPrice: "", // 最低价格
        maxPrice: "", // 最高价格
        // 筛选text高亮
        discId: "", // 包邮包税id
      },
      () => {
        Taro.setStorageSync(
          "searchHistory",
          JSON.stringify(this.state.searchHistory)
        );
        this.getSearchGoods();
      }
    );
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

          discId: "",
        },
        () => {
          this.getSearchGoods();
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

          discId: "",
        },
        () => {
          this.getSearchGoods();
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

          discId: "",
        },
        () => {
          this.getSearchGoods();
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
          discId: "",
        },
        () => {
          this.getSearchGoods();
        }
      );
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
        this.getSearchGoods();
      }
    );
  };

  // 上拉事件
  onReachBottom() {
    if (this.state.goodsPages > this.state.goodsCurrent) {
      this.setState(
        {
          loadingText: "正在加载...",
          filterDrawer: false,
        },
        () => {
          setTimeout(() => {
            this.getSearchGoods(this.state.goodsCurrent + 1);
          }, 500);
        }
      );
    } else {
      this.setState({
        loadingText: "已经全部加载完毕",
        filterDrawer: false,
      });
    }
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

  // 搜索关键字
  searchItems(value, current) {
    postRequest(servicePath.searchItems, {
      current: current,
      len: 10,
      keyword: `${value}`,
      source: 10,
    })
      .then((res) => {
        console.log("搜索关键词返回数据成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            /* isShow: false, */
            searchList: res.data.data.records,
          });
        }
      })
      .catch((err) => {
        console.log("搜索关键词返回数据失败", err);
      });
  }

  // 热搜词接口
  getHotSearchWord = () => {
    const postData = {
      len: 30,
      current: 1,
    };
    postRequest(servicePath.hotSearchWord, postData)
      .then((res) => {
        console.log("获取热搜词成功", res.data);
        if (res.statusCode === 200) {
          this.setState({
            hotWords: res.data.records,
          });
        }
      })
      .catch((err) => {
        console.log("返回数据失败", err);
      });
  };

  // 获取搜索的商品
  getSearchGoods(current = 1) {
    const { sortPrice, minPrice, maxPrice, discId } = this.state;
    postRequest(servicePath.searchItems, {
      current: current,
      len: 10,
      keyword: this.state.searchVal,
      source: 10,
      sortPrice: sortPrice === true ? 0 : sortPrice === false ? 1 : "",
      sortSaleNum: this.state.sortSaleNum,
      minPrice: minPrice,
      maxPrice: maxPrice,
      expressFree: discId === 1 || discId === 3 ? 1 : "",
      taxFree: discId === 2 || discId === 3 ? 1 : "",
    })
      .then((res) => {
        console.log("搜索商品列表返回数据成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            goodsList: [...this.state.goodsList, ...res.data.data.records],
            goodsCurrent: res.data.data.current + 1,
            goodsPages: res.data.data.pages,
            loadingText: "加载完毕",
          });
        }
      })
      .catch((err) => {
        console.log("搜索关键词返回数据失败", err);
      });
  }

  // 数组去重
  unique(arr) {
    return Array.from(new Set(arr));
  }

  componentWillMount() {
    this.getHotSearchWord();
    let searchHistory = Taro.getStorageSync("searchHistory");
    if (searchHistory !== "") {
      this.setState({
        searchHistory: JSON.parse(searchHistory),
      });
    }
  }

  componentDidMount() {
    let navHeight = Taro.createSelectorQuery();
    navHeight
      .select("#search-page-head")
      .boundingClientRect((rect) => {
        this.setState(
          {
            TopHeight: rect.height,
          },
          () => {
            Taro.getSystemInfo({
              success: (res) => {
                this.setState(
                  {
                    searchListHeight: res.screenHeight,
                  },
                  () => {
                    Taro.getSystemInfo({}).then((res) => {
                      Taro.$navBarMarginTop = res.statusBarHeight || 0;
                    });
                    if (this.$router.params.hotText !== "") {
                      this.setState(
                        {
                          searchVal: this.$router.params.hotText || "",
                          isShow: true,
                          visible: true,
                        },
                        () => {
                          this.getSearchGoods();
                        }
                      );
                    }
                  }
                );
              },
            });
          }
        );
      })
      .exec();
  }

  componentDidShow() {}

  config = {
    onReachBottomDistance: 50,
    navigationStyle: "custom",
  };

  render() {
    const {
      TopHeight,
      searchListHeight,
      searchList,
      goodsList,
      isShow,
      searchVal,
      visible,
      searchHistory,
      hotWords,
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
      loadingText,
    } = this.state;
    return (
      <View>
        <CommonTop show={isBackTop} />
        {/* 搜索框 */}
        <View
          style={{ paddingTop: `${Taro.$navBarMarginTop}px` }}
          id="search-page-head"
        >
          <View className="search-page-head-nav">
            <Image
              onClick={this.handleNavigateBack}
              className="left-icon"
              src={require("../../static/searchpage/left.png")}
            />
            <View className="search-input">
              <Image src={require("../../static/home/search-icon.png")} />
              <Input
                id="searchInput"
                value={searchVal}
                onFocus={this.handleSearchInputFocus}
                onBlur={this.handleSearchInputBlur}
                placeholder="点击搜索您想要的商品"
                onConfirm={this.handleSearchInputConfirm}
                onInput={this.handleSearchInput}
                focus
              />
            </View>
          </View>
        </View>
        {/* 条件筛选 */}
        <View className="filter-row" style={{ top: `${TopHeight}px` }}>
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
          <View
            className="filter-item-box"
            /* style={{ color: isFilter ? '#000' : '#98989E' }} */
            onClick={this.handleFilterClick}
          >
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
          width="614rpx"
          height={`${searchListHeight - TopHeight}px`}
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
        {/* 搜索结果列表 */}
        <View
          id="search-list"
          style={{
            top: `${TopHeight}px`,
            height: `${searchListHeight - TopHeight}px`,
            display: isShow ? "none" : "block",
          }}
        >
          {searchList.map((item) => (
            <View
              className="search-list-item"
              key={item.itemId}
              onClick={this.handleSearchItemClick.bind(this, item.itemName)}
              style={{
                display: "-webkit-box",
                "-webkit-box-orient": "vertical",
                "-webkit-line-clamp": 1,
                overflow: "hidden",
              }}
            >
              {item.itemName}
            </View>
          ))}
        </View>
        {/* 搜索商品结果 */}
        <View id="search-page" style={{ paddingTop: `${TopHeight}px` }}>
          <View className="search-goods">
            {goodsList.length === 0 ? (
              <CommonEmpty content="暂无商品" />
            ) : (
              <View>
                <GoodsList goodsList={goodsList} hasTitle={true} />
                <View className="loading-text">{loadingText}</View>
              </View>
            )}
          </View>
        </View>
        <View
          id="history-record-wrap"
          style={{
            top: `${TopHeight}px`,
            height: `${searchListHeight - TopHeight}px`,
            display: visible ? "none" : "block",
          }}
        >
          {/* 搜索历史框 */}
          {searchHistory.length === 0 ? null : (
            <View className="history-content">
              <View className="history-line">
                <Text>搜索历史</Text>
                <Image
                  onClick={this.handleDeleteSearchHistory}
                  src={require("../../static/searchpage/delete.png")}
                />
              </View>
              <View className="history-list">
                {searchHistory.map((item, index) => (
                  <View
                    key={index + 1}
                    onClick={this.handleSearchHistoryItem.bind(this, item)}
                    className="history-list-item"
                    style={{
                      display: "-webkit-box",
                      "-webkit-box-orient": "vertical",
                      "-webkit-line-clamp": 1,
                      overflow: "hidden",
                    }}
                  >
                    {item}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 热搜词 */}
          <View className="hot-search-words">
            <View className="hot-title">热搜词</View>
            <View className="hot-list">
              {hotWords.map((item) => (
                <View
                  className="hot-list-item"
                  key={item.id}
                  onClick={this.handleHotItemClick.bind(this, item.title)}
                >
                  {item.title}
                </View>
              ))}
            </View>
          </View>
          {/* 搜索店铺 */}
          <View className="search-shop">
            <Navigator url="/pages/searchshop/searchshop">
              <View className="search-shop-text">切换店铺搜索</View>
            </Navigator>
          </View>
        </View>
      </View>
    );
  }
}

export default SearchPage;
