import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import './threecategory.less';
import '../../common/globalstyle.less';
import { postRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';

// 品牌代购
class ThreeCategory extends Component {
  state = {
    goodsList: [], // 商品列表
    goodsPages: 1, // 列表总页数
    goodsCurrent: 1, // 列表当前页
  };

  // 商品点击事件
  handleGoodsClick = (item) => {
    Taro.navigateTo({
      url: '/pages/goodsdetails/goodsdetails?itemId=' + item.itemId,
    });
  };

  // 获取二级下所有分类商品
  getThirdCategory(current = 1) {
    console.log(current);
    postRequest(servicePath.getThirdCategory, {
      categoryId: this.$router.params.categoryId,
      current: current,
      len: 10,
      type: 2,
    })
      .then((res) => {
        console.log('获取二级分类商品成功', res.data);
        if (res.data.code === 0) {
          this.setState({
            goodsList: [...this.state.goodsList, ...res.data.data.records],
            goodsPages: res.data.data.pages,
            goodsCurrent: res.data.data.current,
          });
        }
      })
      .catch((err) => {
        console.log('获取二级分类商品失败', err);
      });
  }

  componentWillMount() {}

  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: this.$router.params.title,
    });
    this.getThirdCategory();
  }

  componentWillUnmount() {}

  componentDidShow() {}

  // 上拉事件
  onReachBottom() {
    if (this.state.goodsPages > this.state.goodsCurrent) {
      this.getThirdCategory(this.state.goodsCurrent + 1);
    }
  }

  config = {
    onReachBottomDistance: 50,
  };

  render() {
    const { goodsList } = this.state;
    return (
      <View id="three-category-goods">
        {goodsList.map((item) => (
          <View
            className="goods-item"
            onClick={this.handleGoodsClick.bind(this, item)}
            key={item.id}
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
    );
  }
}

export default ThreeCategory;
