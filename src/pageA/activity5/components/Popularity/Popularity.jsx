import Taro, { Component } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem } from '@tarojs/components'
import './Popularity.less';
import '../../../../common/globalstyle.less'

class Popularity extends Component {

  constructor(props) {
    super(props) 
    this.state = { }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
  }

  render () {
    return (
      <View className='popularity-goods'>
        <Image className="popularity-goods-bg" src={this.props.bgImage} />
        <View className="goods-item-wrap">
          {
            this.props.goodsList.map(item => 
              <Navigator className="goods-item" url={`/pages/goodsdetails/goodsdetails?itemId=${item.itemId}`} key={item.itemId}>
                <Image className="goods-img" src={item.image} />
              </Navigator>
            )
          }
        </View>
      </View>
    )
  }
}

Popularity.defaultProps = {
  goodsList: []
}

export default Popularity;