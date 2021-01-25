import Taro, { Component } from '@tarojs/taro';
import { View, Input } from '@tarojs/components';
import './Header.less';

// 首页
class Header extends Component {
  state = {};

  // 搜索框点击事件
  handleSearchInputClick = () => {
    Taro.navigateTo({
      url: '/pages/searchpage/searchpage',
    });
  };

  onPageScroll(e) {}

  //--------------------

  componentWillMount() {}

  componentDidMount() {}

  componentDidShow() {}

  render() {
    return (
      <View
        className="index-head"
        style={{ paddingTop: `${Taro.$navBarMarginTop}px` }}
      >
        <View className="nav-box" onClick={this.handleSearchInputClick}>
          <View className="nav-input">
            <Image src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/twocategory/search-icon.png" />
            <Input disabled type="text" placeholder="点击搜索您想要的商品" />
          </View>
        </View>
      </View>
    );
  }
}

export default Header;
