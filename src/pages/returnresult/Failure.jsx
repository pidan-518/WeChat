import Taro, { Component } from '@tarojs/taro';
import { View, Text, Checkbox, CheckboxGroup, Input } from '@tarojs/components'
import "../../common/globalstyle.less";
import "./Failure.less";
 
export default class Failure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "remarks": "",  //拒绝原因备注
      "createTime": "", //时间
    }
  }

  componentDidShow() {
  }

  render() {

    // const returnOfGoods = this.props.returnOfGoods;
    // console.log(returnOfGoods)

    return(
      <View class="failure" style={{display: this.props.result===6?"block":"none"}}>
        
        <View class="top">
          <View class="left" >
            {/* <Image src={require("../../static/common/cross-red.png")} /> */}
            <Text>退货申请已拒绝</Text>
          </View>
          <image src={require('../../static/orderpart/truck.png')} class="right" />
        </View>

        <View class="failureInfo">
          <View class="line reason">
            <Text class="prop">卖家原因描述：</Text>
            {/* <Text class="value">{this.state.remarks}</Text> */}
            <Text class="value">{this.props.returnOfGoods[0].busDesc}</Text>
          </View>
          <View class="line time">
            <Text class="prop">时间：</Text>
            <Text class="value">{this.props.returnOfGoods[0].createTime}</Text>
            {/* <Text class="value">{this.state.createTime}</Text> */}
          </View>
        </View>
      </View>
    )
  }
}
