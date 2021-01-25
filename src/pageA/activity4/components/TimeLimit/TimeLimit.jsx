import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Image, Swiper, SwiperItem } from '@tarojs/components'
import './TimeLimit.less';
import '../../../../common/globalstyle.less'
/* import servicePath from '../../common/util/api/apiUrl';
import { CarryTokenRequest } from '../../common/util/request'; */

class TimeLimit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { 
  }

  config = {
    navigationBarTitleText: '',
    usingComponents: {}
  }

  render () {
    
    return (
      <View className="time-limit-goods-wrap" style={{backgroundColor: this.props.backgroundColor}}>
        <View className="wrap-left">
          <Image src={this.props.LeftImage} />
        </View>
        <View className="wrap-right">
          <Swiper className="right-swiper-wrap" autoplay circular interval={2000} displayMultipleItems={3}>
            {
              this.props.goodsList.map(item => 
                <SwiperItem className="swiper-goods-item" key={item.itemId}>
                  <View  key={item.itemId}>
                    <Navigator url={`/pages/goodsdetails/goodsdetails?itemId=${item.itemId}`}>
                      <Image src={item.image} />
                    </Navigator>
                  </View>
                </SwiperItem>
              )
            }
          </Swiper>
        </View>
      </View>
    )
  }
}

export default TimeLimit;