import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "../../common/globalstyle.less";
import "./orderpaysuccess.less";

export default class OrderPaySuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backTiming: 5, // 自动跳转倒计时
    };
  }

  // 计时
  timing = () => {
    this.time = setInterval(() => {
      this.setState({
        backTiming: this.state.backTiming - 1,
      });
      if (this.state.backTiming === 1) {
        clearInterval(this.time);
        setTimeout(() => {
          Taro.switchTab({
            url: "../cart/cart",
          });
        }, 1000);
      }
    }, 1000);
  };

  // 返回购物车
  handleCart = () => {
    Taro.switchTab({
      url: "../cart/cart",
    });
  };

  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: "支付成功",
    });
    this.timing();
  }

  componentDidHide() {
    clearInterval(this.time);
  }

  render() {
    return (
      <View class="orderPaySuccess">
        <View class="ct-orderPaySuccess">
          <View class="success">
            <View class="main">
              <Image
                src={require("../../static/orderpart/pay_success.png")}
                alt=""
              />
              <View class="right">
                <Text class="title">支付成功</Text>
                <View class="back">
                  <Text class="time">{this.state.backTiming}</Text>
                  <Text class="back" decode="ture">
                    &nbsp;秒后返回购物车
                  </Text>
                </View>
              </View>
            </View>
            <View class="action">
              <Button class="cart" onClick={this.handleCart}>
                立即返回购物车
              </Button>
              <Button class="home">继续购物</Button>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
