import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Icon } from "@tarojs/components";
import { AtTabs, AtTabsPane } from "taro-ui";
import "taro-ui/dist/style/components/tabs.scss";
import "./favorite.less";
import "../../common/globalstyle.less";
import servicePath from "../../common/util/api/apiUrl";
import { CarryTokenRequest } from "../../common/util/request";
import CommonEmpty from "../../components/CommonEmpty/CommonEmpty";
/* import GoodsList from '../../components/GoodsList/GoodsList'; */

// 我的收藏
class Favorite extends Component {
  state = {
    tabsCurrent: 0, // tabs索引值
    scrollViewHeight: "", // scrollView高度
    goodsList: [], // 收藏商品列表
    shopList: [], // 收藏店铺列表
    goodPages: "", // 商品列表总页数
    goodCurrent: 1, // 商品列表当前页
    shopPages: "", // 店铺列表总页数
    shopCurrent: 1, // 店铺列表当前页
    isShow: false, // 显示单选框
    editText: "编辑",
    isAllSelect: false, // 全选框
    deleteList: [], // 取消商品收藏的id
  };

  // tabs点击事件
  handleAtTabsClick = (tabsCurrent) => {
    this.setState({ tabsCurrent });
  };

  // 编辑点击事件
  handleEditClick = () => {
    if (this.state.isShow) {
      this.setState({
        editText: "编辑",
        isShow: false,
      });
    } else {
      let goodsList = this.state.goodsList;
      goodsList.map((item) => {
        item.checkd = false;
        return goodsList;
      });
      this.setState({
        editText: "完成",
        isShow: true,
        goodsList,
        isAllSelect: false,
        deleteList: [],
      });
    }
  };

  // 商品checkbox点击事件
  handleCheckboxClick = (itemId, checkd) => {
    let goodsList = this.state.goodsList;
    let deleteList = [];
    for (let item of goodsList) {
      if (item.itemId === itemId) {
        if (checkd) {
          this.setState({
            isAllSelect: false,
          });
          item.checkd = false;
        } else {
          item.checkd = true;
        }
      }

      if (item.checkd === true) {
        deleteList.push(item.itemId);
      }
    }
    this.setState(
      {
        goodsList,
        deleteList,
      },
      () => {
        if (this.state.deleteList.length === goodsList.length) {
          this.setState({
            isAllSelect: true,
          });
        }
      }
    );
  };

  // 商品全选checkbox点击事件
  handleAllSelectClick = () => {
    let goodsList = this.state.goodsList;
    let deleteList = [];
    if (this.state.isAllSelect) {
      goodsList.map((item) => {
        item.checkd = false;
        return item;
      });
      this.setState({
        isAllSelect: false,
        goodsList,
        deleteList: [],
      });
    } else {
      goodsList.map((item) => {
        item.checkd = true;
        deleteList.push(item.itemId);
        return item;
      });
      this.setState({
        isAllSelect: true,
        goodsList,
        deleteList,
      });
    }
  };

  // 商品取消收藏点击事件
  handleCancelClick = () => {
    let deleteList = this.state.deleteList;
    if (deleteList.length === 0) {
      Taro.showModal({
        title: "提示",
        content: "请选择一件商品再进行操作哦",
        showCancel: false,
        confirmText: "确定",
        confirmColor: "#ff5d8c",
      });
    } else {
      CarryTokenRequest(servicePath.userAtItemRemoveByIds, {
        itemIdList: deleteList,
      }).then((res) => {
        if (res.data.code === 0) {
          console.log("取消收藏成功", res.data);
          Taro.showToast({
            title: "取消收藏成功",
            icon: "success",
            duration: 1500,
            success: (res) => {
              this.setState(
                {
                  goodsList: [],
                  isAllSelect: false,
                  isShow: false,
                  editText: "编辑",
                },
                () => {
                  this.getUserAtItemList(1);
                }
              );
            },
          });
        } else {
          Taro.showToast({
            title: "取消收藏失败",
            icon: "none",
            duration: 1500,
          });
        }
      });
    }
  };

  // 商品列表scroll-view上拉事件
  goodsListOnScrollToLower = () => {
    if (this.state.goodCurrent === this.state.goodPages) {
      console.log("没有更多数据了");
    } else {
      this.getUserAtItemList(this.state.goodCurrent + 1);
    }
  };

  // 店铺列表scroll-view上拉事件
  shopListOnScrollToLower = () => {
    if (this.state.shopCurrent === this.state.shopPages) {
      console.log("没有更多数据了");
    } else {
      this.getUserAtItemList(this.state.shopCurrent + 1);
    }
  };

  //获取商品列表
  getUserAtItemList = (current) => {
    const postData = {
      current: current,
      len: 10,
    };
    CarryTokenRequest(servicePath.userAtItemList, postData)
      .then((res) => {
        console.log("获取收藏商品列表成功", res.data);
        if (res.data.code === 0) {
          let data = res.data.data.records.map((item) => {
            item.checkd = false;
            return item;
          });
          this.setState(
            {
              goodsList: [...this.state.goodsList, ...data],
              goodPages: res.data.data.pages,
              goodCurrent: res.data.data.current,
            },
            () => {
              console.log(this.state.goodsList);
            }
          );
        }
      })
      .catch((err) => {
        console.log("接口异常 - 获取商品列表：", err);
      });
  };

  //获取店铺列表
  getUserAtShopList = (current) => {
    const postData = {
      current: current,
      len: 10,
    };
    Taro.request({
      url: servicePath.userAtShopList,
      method: "POST",
      data: postData,
      header: {
        "Content-Type": "application/json; charset=utf-8",
        "JWT-Token": Taro.getStorageSync("JWT-Token"),
      },
      success: (res) => {
        console.log("获取收藏店铺成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            shopList: [...this.state.shopList, ...res.data.data.records],
            shopPages: res.data.data.pages,
            shopCurrent: res.data.data.current,
          });
        }
      },
      fail: (err) => {
        console.log("接口异常 - 获取商店列表：", err);
      },
    });
  };

  componentWillMount() {
    Taro.getSystemInfo({}).then((res) => {
      this.setState({
        scrollViewHeight: res.windowHeight - 43,
      });
    });
  }

  componentDidMount() {
    this.getUserAtItemList(1);
    this.getUserAtShopList(1);
  }

  componentDidShow() {}

  componentDidHide() {}

  config = {
    navigationBarTitleText: "我的收藏",
    usingComponents: {},
  };

  render() {
    // tabs数据
    const tabsList = [{ title: "商品" }, { title: "店铺" }];

    const {
      scrollViewHeight,
      tabsCurrent,
      goodsList,
      shopList,
      editText,
      isShow,
      isAllSelect,
    } = this.state;
    return (
      <View id="favorite">
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
              onScrollToLower={this.goodsListOnScrollToLower}
            >
              {goodsList.length === 0 ? null : (
                <View className="edit-text">
                  <Text onClick={this.handleEditClick}>{editText}</Text>
                </View>
              )}
              <View className="tabs-content">
                {goodsList.length === 0 ? (
                  <CommonEmpty content="暂无收藏商品" />
                ) : (
                  <View className="good-list">
                    {goodsList.map((item) => (
                      <View className="list-item" key={item.itemId}>
                        <Navigator
                          url={`/pages/goodsdetails/goodsdetails?itemId=${item.itemId}`}
                          key={item.itemId}
                        >
                          <Image src={item.image} />
                          <View
                            className="good-name"
                            style={{
                              textOverflow:
                                "-o-ellipsis-lastline" /*css3中webkit内核提供的一个方法类似ellipsis*/,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box" /*自适应盒子*/,
                              "-webkit-box-orient": "vertical",
                              "-webkit-line-clamp": 2,
                            }}
                          >
                            {item.itemName}
                          </View>
                        </Navigator>
                        <View
                          className="check-box"
                          style={{ display: isShow ? "block" : "none" }}
                          onClick={this.handleCheckboxClick.bind(
                            this,
                            item.itemId,
                            item.checkd
                          )}
                        >
                          <Icon
                            className="check"
                            style={{ display: item.checkd ? "none" : "block" }}
                            type="circle"
                            size="20"
                          ></Icon>
                          <Icon
                            style={{ display: item.checkd ? "block" : "none" }}
                            className="check-ac"
                            type="success"
                            size="20"
                            color="#ff5d8c"
                          ></Icon>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>
          </AtTabsPane>
          <AtTabsPane current={tabsCurrent} index={1}>
            <ScrollView
              onScrollToLower={this.shopListOnScrollToLower}
              scrollY
              style={{ height: `${scrollViewHeight}px` }}
              className="scroll-view"
            >
              <View className="shop-list">
                {shopList.length === 0 ? (
                  <CommonEmpty content="暂无收藏店铺" />
                ) : (
                  shopList.map((item) => (
                    <Navigator
                      url={`/pages/shophome/shophome?businessId=${item.businessId}`}
                      key={item.businessId}
                    >
                      <View className="shop-list-item">
                        <Image src={item.logoPath} />
                        <View className="shop-name">{item.shopName}</View>
                      </View>
                    </Navigator>
                  ))
                )}
              </View>
            </ScrollView>
          </AtTabsPane>
        </AtTabs>
        <View
          className="cancel-favorite-wrap"
          style={{ display: isShow ? "block" : "none" }}
        >
          <View className="wrap-left">
            <View
              className="all-select-icon"
              onClick={this.handleAllSelectClick}
            >
              <Icon
                className="all-check"
                style={{ display: isAllSelect ? "none" : "block" }}
                type="circle"
                size="20"
              ></Icon>
              <Icon
                style={{ display: isAllSelect ? "block" : "none" }}
                className="all-check-ac"
                type="success"
                size="20"
                color="#ff5d8c"
              ></Icon>
            </View>
            <Text>全选</Text>
          </View>
          <View className="cancel-text" onClick={this.handleCancelClick}>
            取消收藏
          </View>
        </View>
      </View>
    );
  }
}

export default Favorite;
