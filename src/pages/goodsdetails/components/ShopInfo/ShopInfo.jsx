import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import "./ShopInfo.less";
import { CarryTokenRequest } from "../../../../common/util/request";
import servicePath from "../../../../common/util/api/apiUrl";

class ShopInfo extends Component {
  state = {};

  handleService = () => {
    const { shopAccid } = this.props;
    if (shopAccid) {
      CarryTokenRequest(servicePath.getUserInfo)
        .then((res) => {
          if (res.data.code === 0) {
            Taro.navigateTo({
              url: `${url}?chatTo=${shopData.shopAccid}`,
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
  };

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  config = {
    usingComponents: {},
  };

  render() {
    const { shopData } = this.props;
    return (
      <View className="shop-Info">
        <Navigator
          url={`/pages/shophome/shophome?businessId=${shopData.businessId}`}
        >
          <View className="shop-header">
            <View className="shop-log">
              <Image className="shop-log-img" src={shopData.logoPath} />
            </View>
            <View className="shop-name-box">
              <View className="shop-name-text">{shopData.name}</View>
              <View>{shopData.introduction ? shopData.introduction : ""}</View>
            </View>
          </View>
        </Navigator>
        <View className="shop-goods-list">
          {shopData.itemVOList.slice(0, 3).map((item) => (
            <Navigator
              url={`/pages/goodsdetails/goodsdetails?itemId=${item.itemId}`}
              key={item.itemId}
            >
              <View className="shop-goods-item">
                <Image src={item.image} className="goods-image" />
                <View className="price-box">
                  {item.price === item.discountPrice ? (
                    <Text>￥{item.discountPrice}</Text>
                  ) : item.discountPrice !== null ? (
                    <Text>￥{item.discountPrice}</Text>
                  ) : (
                    <Text>￥{item.price}</Text>
                  )}
                </View>
              </View>
            </Navigator>
          ))}
        </View>
        <View className="shop-btn">
          <Button onClick={this.handleService} className="service">
            <Image
              src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsdetails/service-icon.png"
              className="service-image"
            />
            <Text>联系客服</Text>
          </Button>
          <Navigator
            url={`/pages/shophome/shophome?businessId=${shopData.businessId}`}
          >
            <Button className="to-shop">
              <Image
                src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsdetails/to-shop-icon.png"
                className="to-shop-image"
              />
              <Text>进店逛逛</Text>
            </Button>
          </Navigator>
        </View>
      </View>
    );
  }
}

ShopInfo.defaultProps = {
  shopData: {
    itemVOList: [],
    introduction: "",
  },
};

export default ShopInfo;
