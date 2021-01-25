import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import './logistics.less';
import '../../common/globalstyle.less';
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';
import CommonEmpty from '../../components/CommonEmpty/CommonEmpty'

// 物流信息
class Logistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logisticsData: [], // 物流信息
      packagingData: [], // 包裹列表
      marketType: [], // 是否为营销商品
    }
  }

  // 获取包裹信息
  getOrderPackagingDetail() {
    CarryTokenRequest(servicePath.getOrderPackagingDetail, {
      packagingNo: this.$router.params.packagingNo // "1594803404464",
    })
      .then(res => {
        console.log("获取包裹信息成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            packagingData: res.data.data.shops,
            packagingNo: res.data.data.packagingNo,
            marketType: res.data.data.marketType,
          });
          this.getQueryLogisticsTracking(res.data.data.packagingNo);
          // this.getQueryLogisticsTracking(res.data.data.logisticsNo);
        }
      })
      .catch(err => {
        console.log("获取包裹信息失败", err);
      })
  }

  // 获取订单详情数据
  /* getItemOrderView() {
    CarryTokenRequest(servicePath.getItemOrderView, {
      orderNo: "202007041000225" //this.$router.params.orderNo
    })
      .then(res => {
        console.log("查询订单详情成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            orderData: res.data.data,
            orderList: res.data.data.parkets
          });
          this.getQueryLogisticsTracking(res.data.data.parkets[0].logisticsNo);
        }
      })
      .catch(err => {
        console.log("查询订单详情失败", err);
      })
  } */

  // 获取物流信息
  getQueryLogisticsTracking(packagingNo) {
    CarryTokenRequest(servicePath.queryLogisticsTracking, {
      // logisticsNo: logisticsNo
      packagingNo: packagingNo
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

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { 
    
  }

  componentDidShow () {
    /* this.getQueryLogisticsTracking(); */
    this.getOrderPackagingDetail();
  }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '物流信息',
    usingComponents: {}
  }

  render () {
    const { marketType, logisticsData, packagingData, packagingNo } = this.state;

    return (
      <View id='logistics'>
        <View className="good-info">
          <View className="good-info-list">
            <View className="list-item">
              {/* <View className="order-operation">
                <View className="order-num">
                  <View className="num-txt">订单号：{orderData.orderNo}</View>
                </View>
              </View> */}
              <View className="package-Info">
                <View className="package-num">
                  <Text>包裹号：{packagingNo}</Text>
                </View>
              </View>
              {
                packagingData.map(item => {
                  let orderDetails = item.orderDetails;
                  return (
                    <View className="item-shop" key={item.businessId}>
                      <View className="shop-name">{item.name}</View>
                      <View className="goods-list">
                        {
                          orderDetails.map(itemDetails => {
                            return (
                              <Navigator 
                                url={`/pages/goodsdetails/goodsdetails?itemId=${itemDetails.itemId}`} 
                                key={itemDetails.itemId} 
                                style={{
                                  pointerEvents:
                                    marketType !== 1
                                      ? ''
                                      : 'none',
                                }}
                              >
                                <View className="goods-item" key={itemDetails.itemId}>
                                  <Image className="goods-img" src={itemDetails.itemImage} />
                                  <View className="goods-info">
                                    <View 
                                      className="goods-name"
                                      style={{
                                        display: '-webkit-box', 
                                        '-webkit-box-orient': 'vertical',
                                        '-webkit-line-clamp': 2,
                                        overflow: 'hidden'
                                      }}
                                    >
                                      {itemDetails.itemName}
                                    </View>
                                    <View className="goods-spec">
                                      <Text class="specName-text">
                                        {itemDetails.itemSpecClassRel.specName}
                                      </Text>
                                      <Text class="class-text">
                                        {itemDetails.itemSpecClassRel.className}
                                      </Text>
                                    </View>
                                    <View className="order-amount">x {itemDetails.itemNum}</View>
                                    <View className="goods-price">￥ {(itemDetails.price * itemDetails.itemNum).toFixed(2)}</View>
                                  </View>
                                </View>
                              </Navigator>
                            )
                          })
                        }
                      </View>
                    </View>
                  )
                })
              }
            </View>
          </View>
        </View>
        {/* <View className="order-info-wrap">
          <View className="order-info-title">订单信息</View>
          <View className="order-info-list">
            <View className="order-info-item">
              <View className="item-label">订单编号：</View>
              <View className="item-value">{orderData.orderNo}</View>
            </View>
            <View className="order-info-item">
              <View className="item-label">支付单号：</View>
              <View className="item-value">13212313213212311</View>
            </View>
            <View className="order-info-item">
              <View className="item-label">创建时间：</View>
              <View className="item-value">{orderData.createTime}</View>
            </View>
            <View className="order-info-item">
              <View className="item-label">付款时间：</View>
              <View className="item-value">{orderData.payTime}</View>
            </View>
            <View className="customer-service">
              <Button>联系卖家</Button>
              <Button>联系客服</Button>
            </View>
          </View>
        </View> */}
        <View className="logistics-info">
          <View className="logistics-title">物流信息：</View>
          {
              logisticsData.length === 0 ? <CommonEmpty content="暂无物流信息" /> 
              :
              <View className="time-line-list">
                {
                  logisticsData.map((item, index) => 
                    <View className="list-item" key={index}>
                      <View className="logistics-time">
                        {item.time}
                      </View>
                      <View className="time-line-content">
                        <View className="time-line-circle"></View>
                        <View className="content-text">
                          {item.context}
                        </View>
                      </View>
                    </View>
                  )
                }
              </View>
            }
        </View>
      </View>
    )
  }
}

export default Logistics;