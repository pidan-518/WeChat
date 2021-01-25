import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./GoodsName.less";
import servicePath from "../../../../common/util/api/apiUrl";
import { CarryTokenRequest } from "../../../../common/util/request";

class GoodsName extends Component {
  state = {
    collectImg:
      "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsdetails/favorites.png", // 收藏图标
    hasCollect: "", // 商品是否收藏
    itemId: "",
  };

  // 收藏图标点击事件
  handleCollectClick = () => {
    if (this.props.goodsInfo.state === 20) {
      Taro.showToast({
        title: "商品已下架",
        icon: "none",
        duration: 1000,
      });
    } else {
      if (this.state.hasCollect) {
        // 取消关注
        this.setUserAtItemRemove();
      } else {
        // 添加关注
        this.setUserAtItemAdd();
      }
    }
  };

  // 添加收藏商品
  setUserAtItemAdd() {
    CarryTokenRequest(servicePath.userAtItemAdd, {
      itemIdList: [this.props.goodsInfo.itemId],
    })
      .then((res) => {
        console.log("添加收藏商品成功", res.data);
        if (res.data.code === 0) {
          this.setState(
            {
              collectImg:
                "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsdetails/favorites-ac.png",
              hasCollect: true,
            },
            () => {
              Taro.showToast({
                title: "收藏商品成功",
                icon: "success",
                duration: 1000,
              });
            }
          );
        } else {
          Taro.showToast({
            title: "收藏商品失败",
            icon: "none",
            duration: 1000,
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
        console.log("添加收藏商品失败", err);
      });
  }

  // 取消收藏商品
  setUserAtItemRemove() {
    CarryTokenRequest(servicePath.userAtItemRemove, {
      itemId: this.props.goodsInfo.itemId,
    })
      .then((res) => {
        console.log("取消收藏商品成功", res.data);
        if (res.data.code === 0) {
          this.setState(
            {
              collectImg:
                "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsdetails/favorites.png",
              hasCollect: false,
            },
            () => {
              Taro.showToast({
                title: "取消收藏成功",
                icon: "success",
                duration: 1000,
              });
            }
          );
        } else {
          Taro.showToast({
            title: "取消收藏商品失败",
            icon: "none",
            duration: 1000,
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
        console.log("取消收藏商品失败", err);
      });
  }

  // 查询商品是否收藏
  getUserAtItemisFavorite(itemId) {
    Taro.request({
      url: servicePath.userAtItemisFavorite,
      method: "POST",
      data: {
        itemId: itemId,
      },
      header: {
        "Content-Type": "application/json; charset=utf-8",
        "JWT-Token": Taro.getStorageSync("JWT-Token"),
      },
      success: (res) => {
        console.log("查询收藏商品成功", res.data);
        if (res.statusCode === 200) {
          if (res.data.data === 1) {
            this.setState({
              collectImg:
                "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsdetails/favorites-ac.png",
              hasCollect: true,
            });
          } else {
            this.setState({
              hasCollect: false,
            });
          }
        }
      },
    });
  }

  componentDidUpdate() {
    if (this.props.goodsInfo.itemId !== this.state.itemId) {
      this.setState({
        itemId: this.props.goodsInfo.itemId,
      });
      this.getUserAtItemisFavorite(this.props.goodsInfo.itemId);
    }
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  config = {
    navigationBarTitleText: "首页",
    usingComponents: {},
  };

  render() {
    const {
      discountPrice,
      price,
      goodsName,
      signName,
      sign,
      expressFree,
      taxFree,
    } = this.props;
    return (
      <View className="goods-info-wrap">
        <View className="goods-price">
          <View className="goods-detail-price">
            {discountPrice === price ? (
              <Text>
                <Text className="price-symbol">￥</Text>
                <Text className="price-text">{price}</Text>
              </Text>
            ) : discountPrice === null ? (
              <Text>
                <Text className="price-symbol">￥</Text>
                <Text className="price-text">{price}</Text>
              </Text>
            ) : price === "" ? (
              <Text>
                <Text className="price-symbol">￥</Text>
                <Text className="price-text">{discountPrice}</Text>
              </Text>
            ) : (
              <View>
                <Text>
                  <Text className="price-symbol">￥</Text>
                  <Text className="price-text">{discountPrice}</Text>
                </Text>
                <Text className="original-price">原价:￥ {price}</Text>
              </View>
            )}
          </View>
          <View className="favorites" onClick={this.handleCollectClick}>
            <Image className="favorites-icon" src={this.state.collectImg} />
          </View>
        </View>
        <View className="goods-name-box">
          {signName ? (
            <Text className="goods-sign">
              <Text
                className="sign-icon"
                style={{ backgroundImage: `url(${sign})` }}
              ></Text>
              <Text>{signName}</Text>
            </Text>
          ) : null}
          {expressFree === 0 && taxFree === 0 ? null : (
            <Text className="goods-status">
              {expressFree === 1 && taxFree === 1
                ? "包邮包税"
                : taxFree === 1
                ? "包税"
                : expressFree === 1
                ? "包邮"
                : null}
            </Text>
          )}
          <Text className="goods-name">{goodsName}</Text>
        </View>
        <View className="promise-title">
          <Image
            className="promise-image"
            src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsdetails/promise-image.png"
          />
        </View>
      </View>
    );
  }
}

GoodsName.defaultProps = {
  discountPrice: "",
  price: "",
  goodsName: "",
  signName: "",
  sign: "",
  expressFree: "",
  taxFree: "",
  goodsInfo: {
    itemId: "",
  },
};

export default GoodsName;
