import Taro, { Component } from '@tarojs/taro'
import { View, Text, WebView } from '@tarojs/components'
import './WebView.less';

class CommonEmpty extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toLink: null
    }
  }

  componentWillMount () { }

  componentDidMount () {
    const toLink = this.$router.params.link
    console.log(toLink)

    this.setState({
      toLink
    })
  }

  componentWillUnmount () { }

  componentDidShow () { 
  }

  componentDidHide () { }

  handleMessage = (e) => {
    console.log(e)
  }

  config = {
    navigationBarTitleText: 'iconmall web',
    usingComponents: {}
  }

  render () {
    const {toLink} = this.state
    return (
      <View className="webview">
        <WebView src={toLink} onMessage={this.handleMessage} />
      </View>
    )
  }
}

export default CommonEmpty;