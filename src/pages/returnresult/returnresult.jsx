import Taro, { Component } from '@tarojs/taro';
import { View, Text, Checkbox, CheckboxGroup, Input } from '@tarojs/components'
import ServicePath from '../../common/util/api/apiUrl';
import { CarryTokenRequest } from '../../common/util/request';
import "../../common/globalstyle.less";
import "./returnresult.less";
import Success from "./Success";
import Failure from "./Failure";
import OrderInfo from "../../components/OrderInfo/OrderInfo"
 
export default class ReturnResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "orderDetail": {
        "imgUrl": require("../../static/common/production.png"),
        "proName": "xxxxxxx剃须刀",
        "sellerName": "盛世回首",
        "phone": 18712341234,
        "orderID": 3215461548848,
        "type": "黑色 XXL",
        "amount": 2,
        "price": 135,
        "result": 1,      //1：成功  4：失败 
      },
      "businessUser": {},
      "returnOfGoods": {},
    }
  }

  //接受退换订单页信息
  getPageProReturn = () => {
    // const itemPro = JSON.parse(this.$router.params.itemPro);
    // const itemPro = this.props.location.state.itemPro;
    // const businessUser = this.props.location.state.itemOrder.businessUser;
    // this.setState({
    //   "orderDetail": {
    //     "imgUrl": itemPro.imgUrl,
    //     "proName": itemPro.title,
    //     // "sellerName": businessUser.owner,
    //     // "phone": businessUser.mobile,
    //     "orderID": itemPro.orderID,
    //     "type": itemPro.sepecification,
    //     "amount": itemPro.amount_amount,
    //     "price": itemPro.price, 
    //     "proID": itemPro.proID,
    //     "orderDetailId": itemPro.orderDetailId,
    //     "result": itemPro.status      //1：成功  6：拒绝 
    //   }
    // }, () => {
    //   this.getAfterSaleDetail();
    // })
    const itemPro = JSON.parse(this.$router.params.state);
    const from = this.$router.params.from;
    console.log(itemPro, 'itemPro2')
    if (from === 'proreturn') { //从退货列表进入时
      this.setState({
        "orderDetail": {
          "imgUrl": itemPro.imgUrl,
          "proName": itemPro.title, 
          // "sellerName": itemPro.sellerName,
          // "phone": null,
          "orderID": itemPro.orderID,
          "type": `${itemPro.sepecification}`,
          "className": `${itemPro.sepcClass}`,
          // "type": `${itemPro.itemSpecClassRel.class} ${itemPro.itemSpecClassRel.specName}`,
          "amount": itemPro.amount_amount, 
          "price": itemPro.amount, 
          "proID": itemPro.proID,
          "orderDetailId": itemPro.orderDetailId,
          "result": itemPro.status      //1：成功  6：拒绝
        }
      }, () => {
        this.getAfterSaleDetail();
      })
    } else { //从订单列表进入时
      this.setState({
        "orderDetail": {
          "imgUrl": itemPro.item.image,
          "proName": itemPro.itemName, 
          // "sellerName": itemPro.sellerName,
          // "phone": null,
          "orderID": itemPro.orderNo,
          "type": `${itemPro.itemSpecClassRel.specName}`,
          "className": `${itemPro.itemSpecClassRel.className}`,
          // "type": `${itemPro.itemSpecClassRel.class} ${itemPro.itemSpecClassRel.specName}`,
          "amount": itemPro.itemNum, 
          "price": itemPro.price, 
          "proID": itemPro.itemId,
          "orderDetailId": itemPro.orderDetailId,
          "result": itemPro.refundState      //1：成功  6：拒绝
        }
      }, () => {
        this.getAfterSaleDetail();
      })
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

  //订单详情事件：跳转订单详情
  handleSeeOrder = () => {
    this.props.history.push({
      pathname: "/orderdetails",
      state: {
        "orderNo": this.state.orderDetail.orderID
      }
    })
  }

  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: '退货结果'
    });
    this.getPageProReturn();
  }

  componentDidShow() {
    // this.getPageProReturn();
  }

  render() {
    // const this.state.orderDetail = this.state.orderDetail;
    // const lst = this.props.location.state;

    return(
      <View class="returnResult">
        <View class="ct-wrap">
          <View class="ct-returnResult">
            <form class="applyWrap">
              <View class="actionAInfo">
                <View class="left">
                  <View class="result">
                    <Success
                      result={this.state.orderDetail.result} 
                      orderclass={this.state.orderDetail.orderID} 
                      // businessUser={lst.itemOrder.businessUser}
                      businessUser={this.state.businessUser}
                    />
                    <Failure 
                      result={this.state.orderDetail.result} 
                      businessUser={this.state.businessUser} 
                      returnOfGoods={this.state.returnOfGoods}  
                    />
                  </View>
                </View>
                <OrderInfo orderDetail={this.state.orderDetail} />
                {/* <View class="right">
                  <Text class="title">订单详情</Text>
                    <Image src={this.state.orderDetail.imgUrl}  class="star" />
                    <View class="info">
                      <View class="line proName">
                        <Text class="prop">商品名称：</Text>
                        <Text class="value">{this.state.orderDetail.proName}</Text>
                      </View>
                      <View class="line sellerName">
                        <Text class="prop">卖家名称：</Text>
                        <Text class="value">{this.state.orderDetail.sellerName}</Text>
                      </View>
                      <View class="line phone">
                        <Text class="prop">联系电话：</Text>
                        <Text class="value">{this.state.orderDetail.phone}</Text>
                      </View>
                      <View class="line orderID">
                        <Text class="prop">订单编号：</Text>
                        <Text class="value">{this.state.orderDetail.orderID}</Text>
                      </View>
                      <View class="line type">
                        <Text class="prop">规格分类：</Text>
                        <Text class="value">{this.state.orderDetail.type}</Text>
                      </View>
                      <View class="line amount">
                        <Text class="prop">数量：</Text>
                        <Text class="value">{this.state.orderDetail.amount}</Text>
                      </View>
                      <View class="line price">
                        <Text class="prop">单价：</Text>
                        <Text class="value currency">{this.state.orderDetail.price}</Text>
                      </View>
                    </View>
                    <Text class="check" onClick={this.handleSeeOrder}>查看订单</Text>
                </View> */}
              </View>
              <hr/>
              <View class="remind">
                <Text class="title">提示：</Text>
                <Text class="item">1.商品图片及信息仅供参考，不属质量问题，因拍摄灯光及不同显示器色差等问题可能造成商品图片与实物有色差，一切以实物为准。</Text>
                <Text class="item">2.为了不影响您商品的退货服务，请妥善保管商品的附件、赠品、包装至少15天。</Text>
                <Text class="item">3.商品送货时您需与送货人员开箱验机（外观），开箱后如产品有外观缺陷附件问题的，可直接拒收，签收后发生的外观损坏缺件等问题不予退换货。</Text>
              </View>
            </form>
          </View>          
        </View>
        {/* <View class="guessLikeWrap">
         <GuessLike /> 
        </View> */}
      </View>
    )
  }
}

