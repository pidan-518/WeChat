import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Input } from '@tarojs/components'
import './coupons.less'

export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  // 跳转到优惠券中心页面
  handleGetCoupon = () => {
    Taro.navigateTo({
      url: `/pages/certificate/certificate`,
    })
  }

  onShareAppMessage() {
    const shareRecommend = Taro.getStorageSync('shareRecommend')
    return {
      title: '【爱港猫双十一专区】大牌美妆护肤低至5折，限量抢购！',
      path: `pageA/activity7/activity7?shareRecommend=${shareRecommend}`,
      imageUrl: 'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity7/ad.jpg'
    }
  }

  config = {
    navigationBarTitleText: '领取优惠券',
  }

  render() {
    return (
      <View className="coupons">
        <View className="posters">
          <Image
            className="posterImg"
            src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity7/poster.png"
          ></Image>
        </View>
        <View className="button">
          <Image
            className="buttonImg"
            src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity7/button.gif"
            onClick={this.handleGetCoupon}
          ></Image>
        </View>
      </View>
    )
  }
}
