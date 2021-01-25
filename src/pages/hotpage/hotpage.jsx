import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Form, Input, Textarea, Switch } from '@tarojs/components'
import '../../common/globalstyle.less'
import './hotpage.less';
import servicePath from '../../common/util/api/apiUrl';
import { CarryTokenRequest } from '../../common/util/request';

// 爆款页面
class HotPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '爆款页面',
    usingComponents: {}
  }

  render () {

    return (
      <View id='hotpage'>
      </View>
    )
  }
}

export default HotPage;