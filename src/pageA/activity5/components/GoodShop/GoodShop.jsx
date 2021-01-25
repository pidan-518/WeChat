import Taro, { Component } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem } from '@tarojs/components'
import './GoodShop.less';
import '../../../../common/globalstyle.less'

class GoodShop extends Component {

  constructor(props) {
    super(props);
    // console.log(props);
    this.state = {
    }
  }

  componentWillMount () {  }

  componentDidMount () { }

  componentDidUpdate() {  }

  componentWillUnmount () { }

  componentDidShow () {  
    
  }

  componentDidHide () { }

  config = {
  }

  render () {
    return (
      <View className='good-shop-wrap'>
        <Image className="good-shop-bg" src={this.props.shopImage} />
        <View className="goods-shop-box">
          <View className="shop-logo">
            <Navigator url={`/pages/shophome/shophome?businessId=${this.props.shopData.businessId}`}>
              <Image src={this.props.shopData.logoPath} />
            </Navigator>
          </View>
          <View className="shop-goods-list">
            <Swiper 
              className="shop-goods-swiper" 
              autoplay 
              circular 
              interval={2000} 
              displayMultipleItems={3}
            >
              {
                this.props.shopGoodsList.map(item =>
                  <SwiperItem className="shop-goods-swiper-item" key={item.itemId}>
                    <Navigator url={`/pages/goodsdetails/goodsdetails?itemId=${item.itemId}`}>
                      <Image className="swiper-goods-img" src={item.image} />
                    </Navigator>
                  </SwiperItem>
                )
              }
            </Swiper>
          </View>
        </View>
      </View>
    )
  }
}

export default GoodShop;