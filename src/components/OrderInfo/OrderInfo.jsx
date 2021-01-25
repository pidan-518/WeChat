import Taro, { Component } from '@tarojs/taro';
import { View, Text, Checkbox, CheckboxGroup, Input } from '@tarojs/components'
import { CarryTokenRequest } from '../../common/util/request';
import "../../common/globalstyle.less";
import "./OrderInfo.less";

export default class OrderInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "orderDetail": {
        "imgUrl": '',
        "proName": "",
        "sellerName": "",
        "phone": 0,
        "orderID": 0,
        "type": "",
        "amount": 0,
        "price": 0,
        "result": 1, //1：成功  4：失败 
      },
      "businessUser": {},
      "returnOfGoods": {}
    }
  }

  //获取售后申请详情
  getAfterSaleDetail = () => {
    const postData = {
      "orderDetailId": this.state.orderDetail.orderDetailId
    };
    CarryTokenRequest(ServicePath.afterSaleDetail, postData)
      .then(res => {
        if (res.data.code === 0) {
          const rdd = res.data.data;
          const orderDetail = this.state.orderDetail;
          orderDetail.phone = rdd.businessUser.mobile;
          orderDetail.sellerName = rdd.shopName;
          this.setState({
            "businessUser": rdd.businessUser,
            "returnOfGoods": rdd.returnOfGoods
          });
        }
      })
      .catch(err => {
        console.log("接口异常 - 查看售后申请详情：", err);
      })
  }

  //查看订单事件：跳转订单详情
  handleSeeOrder = () => {
    const state = {
      "orderNo": this.props.orderDetail.orderID
    }
    Taro.navigateTo({
      url: `../orderdetails/orderdetails?state=${JSON.stringify(state)}`
    })
  }

  componentDidShow() {}

  componentDidUpdate() {
    if (this.state.orderDetail !== this.props.orderDetail) {
      this.setState({
        orderDetail: this.props.orderDetail
      })
    }
  }

  render() {
    
    return(
      <View class="orderInfo">
        <View class="proInfo">
            <Image src={this.props.orderDetail.imgUrl}  class="star" />
            <View class="right">
              <View class="line proName">
                <Text class="value">{this.props.orderDetail.proName}</Text>
              </View>
              <View class="line type">
                <Text class="value">{this.props.orderDetail.type}</Text>
              </View>
              <View class="line type">
                <Text class="value">{this.props.orderDetail.className}</Text>
              </View>
              <View class="line amount">
                <Text class="prop" decode="true">数量：&nbsp;</Text>
                <Text class="value">x{this.props.orderDetail.amount}</Text>
              </View>
              <View class="line price">
                <Text class="value currency">{this.props.orderDetail.price}</Text>
              </View>
            </View>
        </View>

        <View class="order">
            <View class="line sellerName">
              <Text class="prop">卖家名称：</Text>
              <Text class="value">{this.props.orderDetail.sellerName}</Text>
            </View>
            <View class="line phone">
              <Text class="prop">联系电话：</Text>
              <Text class="value">{this.props.orderDetail.phone}</Text>
            </View>
            <View class="line orderID">
              <Text class="prop">订单编号：</Text>
              <Text class="value">{this.props.orderDetail.orderID}</Text>
            </View>
            <Button class="check" onClick={this.handleSeeOrder}>查看订单</Button>
        </View>
      </View>
    )
  }
}
