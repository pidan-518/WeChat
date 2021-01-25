import Taro, { Component } from '@tarojs/taro';
import { View, Text, Checkbox, CheckboxGroup, Input } from '@tarojs/components'
import ServicePath from '../../common/util/api/apiUrl';
import post from '../../common/util/taroRequest';
import { CarryTokenRequest } from '../../common/util/request';
import "../../common/globalstyle.less";
import "./Success.less";
 
export default class Success extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // "businessUser": {}        //商家信息7
    }
  }

  //接收退换列表页信息
  getPageProReturn = () => {
    const businessUser =  this.props.businessUser;
    console.log(businessUser)
    this.setState({
      "businessUser": businessUser
    })
  }

  componentDidMount() {
    // this.getPageProReturn();
  }

  componentDidUpdate() {
    console.log(this.props.businessUser, 'this.props.businessUser') 
  }

  render() {
    // const st = this.state;

    return(
      <View class="Success" style={{display: this.props.result===1?"block":"none"}}>
        <View class="top">
          <View class="left" >
            <Image src={require("../../static/common/tick-green.png")} />
            <Text>已同意退货</Text>
          </View>
          <image src={require('../../static/orderpart/truck.png')} class="right" />              
        </View>
        {/* <Text class="title">申请退货成功</Text> */}
        <View class="returnInfo">
          <View class="left">
            <Image src={require("../../static/common/location_blue.png")} />
          </View>
          <View class="right">
            <View class="reciverAddress line">
              <Text class="prop">经营地址：</Text>
              <Text class="value">{this.props.businessUser.businessAddress}</Text>
            </View>
            <View class="reciver line">
              <Text class="prop">负责人：</Text>
              <Text class="value">{this.props.businessUser.owner}</Text>
            </View>
            <View class="phone line">
              <Text class="prop">联系方式：</Text>
              <Text class="value">{this.props.businessUser.mobile}</Text>
            </View>
          </View>
          {/* <Text>退款已受理，原订单号 {this.props.orderID} 。</Text> */}
        </View>        
      </View>
    )
  }
}
