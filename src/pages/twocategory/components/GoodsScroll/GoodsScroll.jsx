import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView, Text, Image } from '@tarojs/components';
import './GoodsScroll.less';

// 品牌代购
class GoodsScroll extends Component {
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
    const { goodsData, titleImg, title } = this.props;
    return (
      <View className="goods-swiper-wrap">
        <View className="goods-swiper-box">
          <View
            className="goods-title"
            style={{ backgroundImage: `url(${titleImg})` }}
          >
            {title}
          </View>
          <View className="goods-list">
            <ScrollView className="goods-scrollView" scrollX>
              {goodsData.map((item) => (
                <View
                  className="item-goods"
                  key={item.id}
                  onClick={this.handleGoodsClick.bind(this, item)}
                >
                  <View className="goods-img-wrap">
                    <Image className="goods-img" src={item.image} webp />
                  </View>
                  <View
                    style={{
                      display: '-webkit-box',
                      '-webkit-box-orient': 'vertical',
                      '-webkit-line-clamp': 2,
                      overflow: 'hidden',
                    }}
                    className="goods-name"
                  >
                    {item.itemName}
                  </View>
                  <View className="goods-price">
                    <Text className="price-symbol">￥</Text>
                    <Text className="price-text">
                      {item.price === item.discountPrice
                        ? item.price
                        : item.discountPrice !== null
                        ? item.discountPrice
                        : item.price}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}

GoodsScroll.defaultProps = {
  goodsData: [],
  titleImg: '',
};

export default GoodsScroll;
