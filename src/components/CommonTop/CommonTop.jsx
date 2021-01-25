import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "../../common/globalstyle.less";
import "./CommonTop.less";

export default class CommonTop extends Component {
  handleBackTop = () => {
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    });
  };

  componentDidShow() {}

  componentDidUpdate() {}

  render() {
    return (
      <View
        className="common-top"
        style={{ display: this.props.show ? "block" : "none" }}
        onClick={this.handleBackTop}
      >
        <Image src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/public/top.png" />
      </View>
    );
  }
}

CommonTop.defaultProps = {
  show: true,
};
