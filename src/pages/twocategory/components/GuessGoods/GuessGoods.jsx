import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import './GuessGoods.less';

// 品牌代购
class GuessGoods extends Component {
  state = {};

  // 商品点击事件
  handleGoodsClick = (item) => {
    Taro.navigateTo({
      url: '/pages/goodsdetails/goodsdetails?itemId=' + item.itemId,
    });
  };

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  config = {};

  render() {
    const { goodsData, titleImg } = this.props;
    return (
      <View className="parity-goods">
        <View
          className="parity-goods-title"
          style={{ backgroundImage: `url(${titleImg})` }}
        >
          猜你喜欢
        </View>
        <View className="parity-goods-list">
          {goodsData.map((item) => (
            <View
              className="goods-item"
              key={item.categoryComId}
              onClick={this.handleGoodsClick.bind(this, item)}
            >
              <View className="goods-status">
                <Image
                  className="status-img"
                  src={
                    item.taxFree === 1 && item.expressFree === 1
                      ? 'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsStatus/goods-status1.png'
                      : item.taxFree === 1
                      ? 'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsStatus/goods-status2.png'
                      : item.expressFree === 1
                      ? 'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsStatus/goods-status3.png'
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
                  display: '-webkit-box',
                  '-webkit-box-orient': 'vertical',
                  '-webkit-line-clamp': 2,
                  overflow: 'hidden',
                }}
              >
                {item.itemName}
              </Text>
              <View className="goods-price">
                {item.price === item.discountPrice ? (
                  <View className="price-box">
                    <View className="origin-price">
                      <Text className="price-symbol">￥</Text>
                      <Text className="price-text">{item.price}</Text>
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
                {item.sign ? (
                  <View className="sign-img-wrap">
                    <Image className="sign-img" src={item.sign} alt="" />
                  </View>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }
}

GuessGoods.defaultProps = {
  goodsData: [],
  titleImg: '',
};

export default GuessGoods;
