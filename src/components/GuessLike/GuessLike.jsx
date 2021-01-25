import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import '../../common/globalstyle.less'
import './GuessLike.less'

// 猜你喜欢列表
class GuessLike extends Component {

  constructor(props) {
    super(props);
    this.state = {
      guessList: []
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '首页',
    usingComponents: {}
  }

  render () {

    const { guessList } = this.state

    return (
      <View className="guess-wrap">
        <View className="guess-title">
          <Image src={this.props.titleImg} />
        </View>
        <View className="guess-list">
          {
            guessList.map(item => 
              <Navigator key={item.id} url={`/pages/goodsdetails/goodsdetails?itemId=${item.itemId}`}>
                <View className="list-item" >
                  <Image src={item.image} />
                  <View className="good-detail">
                    <Text className="good-name" 
                      style={{
                        display: '-webkit-box', 
                        '-webkit-box-orient': 'vertical',
                        '-webkit-line-clamp': 2,
                        overflow: 'hidden'
                      }}
                    >
                      {item.itemName}
                    </Text>
                    <View className="good-price">
                      <View className="good-discountPrice">￥ {item.discountPrice}</View>
                      <View className="good-price-txt">￥ {item.price}</View>
                    </View>
                  </View>
                </View>
              </Navigator>
            )
          }
        </View>
      </View>
    )
  }
}

export default GuessLike;