import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import "./ShopPreferred.less";

// 店铺优选组件
class ShopPreferred extends Component {
  state = {};

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  config = {
    usingComponents: {},
  };

  render() {
    const { goodsList } = this.props;
    return (
      <View className="shop-preferred">
        <View className="shop-preferred-title"></View>
        <View className="preferred-list">
          {goodsList.slice(3).map((item) => (
            <Navigator
              url={`/pages/goodsdetails/goodsdetails?itemId=${item.itemId}`}
              key={item.itemId}
            >
              <View className="goods-item">
                <Image src={item.image} className="goods-img" />
                <View
                  className="goods-name"
                  style={{
                    display: "-webkit-box",
                    overflow: "hidden",
                    "text-overflow": "ellipsis",
                    "work-break": "break-all",
                    "-webkit-box-orient": "vertical",
                    "-webkit-line-clamp": 2,
                  }}
                >
                  {item.itemName}
                </View>
                <View className="goods-price">
                  <Text>￥</Text>
                  {item.price === item.discountPrice ? (
                    <Text className="goods-price-text">
                      {item.discountPrice}
                    </Text>
                  ) : item.discountPrice !== null ? (
                    <Text className="goods-price-text">
                      {item.discountPrice}
                    </Text>
                  ) : (
                    <Text className="goods-price-text">{item.price}</Text>
                  )}
                </View>
              </View>
            </Navigator>
          ))}
        </View>
      </View>
    );
  }
}

ShopPreferred.defaultProps = {
  goodsList: [],
};

export default ShopPreferred;
