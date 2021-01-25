import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import './CommonEmpty.less';

class CommonEmpty extends Component {
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
    return (
      <View className="empty-box">
        <Image src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/empty-icon.png" />
        <View>{this.props.content}</View>
      </View>
    );
  }
}
CommonEmpty.defaultProps = {
  content: '暂无数据',
};
export default CommonEmpty;
