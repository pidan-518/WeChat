import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import './Platform.less';

class Platform extends Component {
  state = {};
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  config = {
    navigationBarTitleText: '首页',
    usingComponents: {},
  };

  render() {
    const authentic =
      '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;爱港猫卖家出售的商品，全部由卖家从香港直邮至国内，保证正品，假一赔十！';
    const platform =
      '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您在爱港猫商城购买的所有商品均由平台严格审核，绝无假货，请放心购买，售后服务由卖家提供。\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：因所有商品是香港商家直邮，商品一经售出，非质量问题，不予以退还，请下单前仔细核对商品规格、型号，避免退换。';
    return (
      <View className="platform">
        <View className="title-text">平台承诺</View>
        <View className="platform-content">
          <Text decode>{platform}</Text>
        </View>
        <View className="title-text">正品保证</View>
        <View className="platform-content">
          <Text decode>{authentic}</Text>
        </View>
      </View>
    );
  }
}

export default Platform;
