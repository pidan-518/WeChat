import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import './DetaiLed.less';
import '../../../../common/globalstyle.less'
/* import servicePath from '../../common/util/api/apiUrl';
import { CarryTokenRequest } from '../../common/util/request'; */

class DetaiLed extends Component {
  constructor(props) {
    super(props);
    console.log(props);
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
      <View className="detailed-item">
        <Navigator url={`/pages/goodsdetails/goodsdetails?itemId=${this.props.goodsInfo.itemId}`}>
          <Image className="detailed-main-img" src={this.props.MainImg} />
        </Navigator>
        <View className="detailed-img-list">
          {
            this.props.goodsInfo.images.slice(0, 3).map((item, index) => {
              return (
                <Navigator url={`/pages/goodsdetails/goodsdetails?itemId=${this.props.goodsInfo.itemId}`} key={index+1}>
                  <Image src={item} key={index} />
                </Navigator>
              )}
            )
          }
        </View>
      </View>
    )
  }
}

DetaiLed.defaultProps = {
  goodsInfo: {
    images: ["", "", ""]
  }
}

export default DetaiLed;