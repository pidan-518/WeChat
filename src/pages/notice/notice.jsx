import Taro, { Component } from '@tarojs/taro';
import { View, Text, Checkbox, CheckboxGroup, Input, Button } from '@tarojs/components'
import "../../common/globalstyle.less";
import "./notice.less";

export default class Notice extends Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  //按住事件
  handleTouchStart = () => {
    this.timing = setTimeout(() => {
      Taro.switchTab({
        url: '../index/index'
      })
    }, 5000);
  }

  //停按事件
  handleTouchEnd = () => {
    clearTimeout(this.timing);
  }


  render() {
    return(
      <View className="notice">
        <View className="wrap">
          <Text className="title">Comming Soon</Text>
          <Button 
            className="descripition" 
            onTouchStart={this.handleTouchStart}
            onTouchEnd={this.handleTouchEnd}
          >
            7月3日 正式开启
          </Button>
        </View>
      </View>
    )
  }
}