import Taro, { Component } from "@tarojs/taro";
import { View, Text, Navigator, Image } from "@tarojs/components";
import "./GoodsList.less";

// 商品列表
class GoodsList extends Component {
  state = {
    goodsStatus1:
      "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsStatus/goods-status1.png",
    goodsStatus2:
      "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsStatus/goods-status2.png",
    goodsStatus3:
      "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsStatus/goods-status3.png",
    goodsStatus4:
      "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsStatus/goods-status4.png",
    isUpdate: false,
  };

  componentWillMount() {}

  componentDidMount() {}

  componentDidUpdate() {
    /* if (!this.state.isUpdate) {
      const query = Taro.createSelectorQuery().in(this.$scope);
      query
        .select(".goods-wrap")
        .boundingClientRect((res) => {
          this.props.parent("goods-list", res.top);
          Taro.setStorageSync("goodsListHeight", res.height);
        })
        .exec();
      this.state.isUpdate = true;
    } */
  }

  componentDidShow() {}

  render() {
    return (
      <View className="goods-wrap">
        <View className="goods-list">
          {this.props.goodsList.map((item) => (
            <Navigator
              key={item.id}
              url={`/pages/goodsdetails/goodsdetails?itemId=${item.itemId}`}
            >
              <View
                className="goods-item"
                /* onClick={this.handleGoodsClick.bind(this, item)} */
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
            </Navigator>
          ))}
        </View>
      </View>
    );
  }
}

GoodsList.defaultProps = {
  goodsList: [],
};

export default GoodsList;
