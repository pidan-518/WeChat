import Taro, { Component } from '@tarojs/taro';
import { View, Text, Checkbox, CheckboxGroup, Input } from '@tarojs/components'
import "../../common/globalstyle.less";
import "./orderdetails.less";
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';

// 订单详情
class OrderDetails extends Component {

  constructor(props) {
    super(props);

    this.handleCancelOrder = this.handleCancelOrder.bind(this);

    this.state = {
      pcl_index: 0,
      orderDetails: "", // 订单详情数据
      logisticsData: [], // 物流轨迹数据
      logisticsInfo: "", // 物流信息数据
      commonState: "", // 订单状态
      state2: "",
      state3: "",
      state4: "",
      state5: "",
      statuImg2: require("../../static/personcenter/pay_icon.png"),
      statuImg3: require("../../static/personcenter/good-re.png"),
      statuImg4: require("../../static/personcenter/stay_rg.png"),
      statuImg5: require("../../static/personcenter/order-cpt.png"),
      orderDetailsList: [], // 订单详情
      orderGRNInfo: {},  //订单的收货信息
      consigneeRegion: "", // 地址
      totalPrice: "", // 应付金额
      shopInfo: {}, // 店铺信息
    };
  }

  // 取消订单点击事件
  handleCancelOrder() {
    CarryTokenRequest(servicePath.cancelOrder, {
      orderNo: this.state.orderDetails.orderNo,
    })
      .then(res => {
        console.log("取消订单成功", res.data);
        if (res.data.code === 0) {
          message.success("取消订单成功");
          this.getItemOrderView();
        } else {
          message.error(res.data.msg);
        }
      })
      .catch(err => {
        console.log("取消订单失败", err);
      })
  }

  // 获取物流信息
  getQueryLogisticsTracking() {
    CarryTokenRequest(servicePath.queryLogisticsTracking, {
      logisticsNo: `${this.state.orderDetails.logisticsNo}`
    })
      .then(res => {
        console.log("获取物流信息成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            logisticsData: res.data.data.data,
            logisticsInfo: res.data.data
          })
        }
      })
      .catch(err => {
        console.log("获取物流信息失败", err)
      })
  }

  // 获取订单详情数据
  getItemOrderView() {

    // const orderNo = 202006211000129;
    const orderNo = JSON.parse(this.$router.params.state).orderNo;
    CarryTokenRequest(servicePath.getItemOrderView, {
      orderNo: orderNo
    })
      .then(res => {
        console.log("查询订单详情成功", res.data);
        if (res.data.code === 0) {

          let orderDetails = this.state;
          orderDetails.state = res.data.data.state;

          // const goodHeavy = res.data.data.orderDetails.forEach(item => console.log(item.item.heavy))
          let orderDetailsListTemp = [];
          res.data.data.parkets.forEach(itemParket => {
            itemParket.shops.forEach(itemShop => {
              itemShop.orderDetails.forEach(itemOrderDetail => {
                orderDetailsListTemp.push(itemOrderDetail)
              })
            })
          });
          console.log(orderDetailsListTemp, "orderDetailsListTemp")

          this.setState({
            orderDetails: res.data.data,
            // orderDetailsList: res.data.data.orderDetails
            orderDetailsList: orderDetailsListTemp
          }, () =>{
            const { orderDetails, orderDetailsList } = this.state;
            if (orderDetailsList.length === 1) {
              this.setState({
                totalPrice: orderDetailsList[0].shouldPayAmount,
                totalWeight: orderDetailsList[0].totalHeavy
              });
            } else {
              let totalPrice = 0;
              orderDetailsList.forEach(itemOrderDetail => {
                totalPrice += itemOrderDetail.shouldPayAmount;
              })
              // let totalPrice = orderDetailsList.reduce((prev, cur) => {
              //   return prev.shouldPayAmount + Math.round(cur.shouldPayAmount);
              // });

              let totalWeight = 0;
              orderDetailsList.forEach(itemOrderDetail => {
                totalWeight += itemOrderDetail.totalHeavy;
              })
              // let totalWeight = orderDetailsList.reduce((prev, cur) => {
              //   return prev.totalHeavy + cur.totalHeavy;
              // });              
              this.setState({
                totalPrice: totalPrice.toFixed(2),
                totalWeight: totalWeight.toFixed(2)
              })
            }
            this.setOrderStepStatus(orderDetails.state, orderDetails.logisticsState);
            this.setState({
              commonState: this.setOrderState(orderDetails.state, orderDetails.logisticsState)
            })
            this.getQueryLogisticsTracking();
            this.getShopInfoByBusinessId(orderDetailsListTemp[0].businessId);
          });
        }
      })
      .catch(err => {
        console.log("查询订单详情失败", err);
      })
  }

  // 设置订单步骤状态
  setOrderStepStatus(orderState, logisticsState) {
    // switch ()
    if (orderState === 20) {
      this.setState({
        state2: "pcl_bar",
        state3: "",
        state4: "",
        state5: "",
      })
      console.log("进入20");
      return false;
    } else if (logisticsState === 22) {
      this.setState({
        state2: "pcl_bar",
        state3: "pcl_bar",
        state4: "pcl_bar",
        state5: "",
      })
      console.log("进入22");
      return false;
    } else if(orderState === 25) {
      this.setState({
        state2: "pcl_bar",
        state3: "pcl_bar",
        state4: "pcl_bar",
        state5: "pclbar",
      })
      console.log("进入25");
    }
  }

  // 设置订单状态
  setOrderState(orderState, logisticsState) {
    if (orderState === 0) {
      return "已取消"
    } else if (orderState === 10) {
      return "未付款"
    } else if (orderState === 20) {
      if (logisticsState === 20) {
        return "待发货"
      } else if (logisticsState === 21) {
        return "待揽件"
      } else if (logisticsState === 22) {
        return "已发货"
      } else if (logisticsState === 23) {
        return "报关中"
      } else if (logisticsState === 24) {
        return "已收货"
      }
    } else if (orderState === 25) {
      return "交易成功"
    } else if (orderState === 30) {
      return "申请退款"
    } else if (orderState === 35) {
      return "平台仲裁"
    } else if (orderState === 40) {
      return "退款中"
    } else if (orderState === 50) {
      return "退款成功"
    } else if (orderState === 60) {
      return "交易关闭"
    }
  }

  // 获取店铺信息
  getShopInfoByBusinessId(businessId) {
    CarryTokenRequest(servicePath.getShopInfoByBusinessId, {
      businessId: businessId
    })
      .then(res => {
        console.log("获取店铺信息成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            shopInfo: res.data.data.shopVO,
          })
        }
      })
      .catch(err => {
      })
  }

  // 查询用户对应订单的收货地址信息
  getLogisticsInfoinfo() {

    // const orderNo = 202006211000129;
    const orderNo = JSON.parse(this.$router.params.state).orderNo;

    CarryTokenRequest(servicePath.logisticsInfo, {
      orderNo: orderNo
    })
      .then(res => {
        console.log("查询对应订单的收货信息成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            orderGRNInfo: res.data.data,
            consigneeRegion: res.data.data.consigneeRegion.replace(/[:]/g, "")
          })
        }
      })
      .catch(err => {
        console.log("查询对应订单的收货信息失败", err);
      })
  }

  componentDidMount() {
    /* Taro.setNavigationBarTitle({
      title: '订单详情'
    }); */
    // 获取订单详情数据
    this.getItemOrderView();
    // 查询用户对应订单的收货地址信息
    this.getLogisticsInfoinfo()
  }

  render() {
    const { 
      orderDetails, 
      logisticsData,
      logisticsInfo,
      state2,
      state3,
      state4,
      state5,
      commonState,
      orderDetailsList,
      orderGRNInfo,
      consigneeRegion,
      totalPrice,
      totalWeight,
      shopInfo
    } = this.state
    return (
      <View class="orderDetails">

        <View class="top">
          <View class="left" >
            {/* <Image src={require("../../static/common/tick-green.png")} /> */}
            <Text>订单详情</Text>
          </View>
          <image src={require('../../static/orderpart/truck.png')} class="right" />              
        </View>

        <Text class="status">{commonState}</Text>

        <View class="order-info">
            <ul class="order-info-list">
              <li class="order-info-li">
                <Text class="title">收货人信息</Text>
                <Text>收货人：{orderGRNInfo.consignee}</Text>
                <Text>手机号：{orderGRNInfo.consigneeTel}</Text>
                {/* <Text>备用号：10987654321</Text> */}
                <Text class="rece-add">
                  地址：{consigneeRegion}
                  {orderGRNInfo.placeOfReceipt}
                </Text>
              </li>
              <li class="order-info-li">
                <Text class="title">配送信息</Text>
                <Text>配送方式：直邮</Text>
                <Text>重量：预计{ totalWeight }克</Text>
                <Text>运费：￥ {orderDetails.logisticsFee}</Text>
                <Text>送达：7~9天</Text>
                {/* <Text>送达：仓库：成化区仓库</Text> */}
              </li>
              <li class="order-info-li">
                <Text class="title">付款信息</Text>
                <Text>付款方式：微信</Text>
                <Text>运费：￥ {orderDetails.logisticsFee}</Text>
                <Text>商品总计：￥ {orderDetails.discountPrice}</Text>
                <Text>税费：￥ {orderDetails.taxFee}</Text>
                {/* <Text>积分：￥ 0.00</Text> */}
                <Text>应付金额：￥ {totalPrice}</Text>
              </li>
              <li class="none_broder order-info-li">
                <Text class="title">发货人信息</Text>
                <Text>发货人：{shopInfo.name}</Text>
                <Text>经营地址：{shopInfo.businessAddress}</Text>
              </li>
            </ul>
          </View>

        
      </View>
    );
  }
}

export default OrderDetails;
