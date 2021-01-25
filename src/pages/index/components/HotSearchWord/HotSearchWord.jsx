import Taro, { Component } from "@tarojs/taro";
import { View, Input, ScrollView } from "@tarojs/components";
import { AtCurtain } from "taro-ui";
import "./HotSearchWord.less";
import "taro-ui/dist/style/components/curtain.scss";

// 首页
class HotSearchWord extends Component {
  state = {
    isOpened: false,
  };

  // 更多点击事件
  handleMoreClick = () => {
    if (this.state.isOpened) {
      this.setState({
        isOpened: false,
      });
    } else {
      this.setState({
        isOpened: true,
      });
    }
  };

  // 热搜词模板关闭按钮
  handleClose = () => {
    this.setState({
      isOpened: false,
    });
  };

  // 蒙版禁止滑动事件
  handleCatchtouchMove = () => {
    return;
  };

  // 热搜词点击事件
  handleHotSearchWord = (item) => {
    Taro.navigateTo({
      url: `/pages/searchpage/searchpage?hotText=${item.title}`,
    });
  };

  componentWillMount() {}

  componentDidMount() {}

  componentDidShow() {}

  render() {
    const { isOpened } = this.state;
    const { hotSearchWordList, top } = this.props;
    return (
      <View className="wrap">
        <View className="hot-search-word">
          <View className="word-specific">精选专区</View>
          <View className="word-list">
            <ScrollView className="word-scroll" scrollX>
              {hotSearchWordList.map((item) => (
                <View
                  className="word-item"
                  key={item.id}
                  onClick={this.handleHotSearchWord.bind(this, item)}
                >
                  {item.title}
                </View>
              ))}
            </ScrollView>
          </View>
          <View className="more" onClick={this.handleMoreClick}>
            <Image
              className="more-icon"
              src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/home/more-icon-2.png"
            />
          </View>
        </View>
        {/* 热搜词蒙版 */}
        <View
          className="word-mask"
          style={{ display: isOpened ? "block" : "none", top: `${top}px` }}
          catchtouchmove={this.handleCatchtouchMove}
        >
          <View className="mask-title">
            <View className="title-text">全部标签</View>
            <View className="close-box" onClick={this.handleClose}>
              <Image
                className="close-icon"
                src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/home/close.png"
              />
            </View>
          </View>
          <View className="mask-word-list">
            {hotSearchWordList.map((item) => (
              <View
                className="mask-word-item"
                key={item.id}
                onClick={this.handleHotSearchWord.bind(this, item)}
              >
                {item.title}
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }
}

HotSearchWord.defaultProps = {
  hotSearchWordList: [],
  top: "",
};

export default HotSearchWord;
