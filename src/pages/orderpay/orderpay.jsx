import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { CarryTokenRequest } from "../../common/util/request";
import ServicePath from "../../common/util/api/apiUrl";
import "../../common/globalstyle.less";
import "./orderpay.less";

export default class OrderPay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalAmount: 0,
      codeUrl: "https://www.baidu.com",
      /**
       * 支付方式
       * FPS--转数快支付
       * ALIPAYHK--香港支付宝
       * ALIPAYCN--跨境支付宝
       * WECHAT--微信跨境支付
       * UPI--银联云闪付
       * WECHATHK--香港微信支付
       * ALIWAPCN--跨境支付宝wap支付
       * ALIWAPHK--香港支付宝wap支付
       * WECGATJS--微信小程序支付
       * WECHAT_APP--微信APP支付
       * WECHAT_WAP--微信WAP支付
       * UNIFIED_TRADE_NATIVE--统一扫码支付
       * ALIPAY_APP--支付宝APP支付
       * ALIPAY_WAP--支付宝WAP支付
       * ALIPAY_NATIVE--支付宝扫码支付
       * ALIPAY_JSPAY--支付宝服务窗支付
       * ALIPAY_PCPAY--支付宝电脑网站支付
       */
      payType: "WECHATJS",
      orderID: "2823781347",
      storeID: "123",
      storeName: "爱港猫旗舰店",
      remarks: "请尽快发货",
      logisticsFee: 0,
      taxFee: 0,
      proList: [],
      couponRecordIds: [],
      couponType: [],
      marketType: 0, // 1：营销支付
      recommend: "", //推荐码
      type: "", //页面跳转类型
    };
  }

  // 接收“订单提交”页信息
  getPageOrderSubmit = () => {
    const rs = JSON.parse(this.$router.params.state);
    const r = rs.pageOrderPayInfo;
    this.setState(
      {
        marketType:
          r.itemOrder.marketType === null ? 0 : r.itemOrder.marketType, //商品类型(营销/普通)
        recommend: r.itemOrder.recommend, //推荐码
        orderID: r.orderNo,
        storeID: r.itemOrder.shopId,
        storeName: r.itemOrder.shopName,
        remarks: r.remarks,
        addressId: r.address.addressId,
        logisticsFee: r.itemOrder.logisticsFee,
        taxFee: r.itemOrder.taxFee,
        proList: r.itemOrder.orderDetails.map((p) => {
          return {
            proID: p.itemId,
            imgUrl: p.itemImage,
            proInfo: p.itemName,
            platformPrice: p.price,
            amount_amount: p.itemNum,
            sepecification: p.specName,
            sepcClass: "规格",
            preferentialAmount: 0,
            subTotal: p.price * p.itemNum,
          };
        }),
      },
      () => {
        this.getUseCouponList(r.orderNo);
        this.totalAmount();
        this.codeAssignment();
      }
    );
  };

  // 获取可使用优惠券
  getUseCouponList(orderNo) {
    if (this.state.marketType !== 1) {
      CarryTokenRequest(ServicePath.getUserCouponList, {
        orderNo: orderNo,
        len: 10,
        source: 10,
      })
        .then((res) => {
          console.log("获取优惠券成功", res.data);
          if (res.data.code === 0) {
            let data = res.data.data;
            let couponType = [];
            let couponRecordIds = [];
            data.forEach((item) => {
              if (item.used === 1) {
                couponType.push(item);
                couponRecordIds.push(item.couponRecordId);
              }
            });
            this.setState({
              couponType,
              couponRecordIds,
            });
          }
        })
        .catch((err) => {
          console.log("获取优惠券失败", err);
        });
    }
  }

  //取消订单弹框
  handleCancelOrder = () => {
    //跳转购物车页面
    const gotoPageCart = () => {
      this.props.history.push({
        pathname: "/cart",
      });
    };
    //取消
    const cancel = () => {
      const postData = {
        orderNo: this.state.orderID,
      };
      CarryTokenRequest(ServicePath.cancelOrder, postData)
        .then((res) => {
          if (res.data.code === 0) {
            DialogCreate.open({
              title: "订单取消成功",
              para: "订单已成功取消，点击确定返回购物车页面",
              hasCancel: false,
              confirmCallBack: gotoPageCart,
            });
          } else message.error("订单取消失败");
        })
        .catch((err) => {
          console.log("接口异常 - 取消订单：", err);
        });
    };
    //二次确认
    DialogCreate.open({
      title: "取消订单",
      para: "是否确订取消订单？",
      confirmCallBack: cancel,
    });
    // this.removePageSubmitData(); //清除缓存
  };

  //计算总价
  totalAmount = () => {
    let a = 0;
    this.state.proList.forEach((p) => {
      a += p.subTotal;
    });
    this.setState({
      totalAmount: parseFloat(a.toFixed(2)),
    });
  };

  //选择支付方式
  handlePayType = (e) => {
    this.setState({
      payType: document.getElementById("zfb").checked ? "ALIPAYCN" : "WECHATJS",
    });
  };

  //支付事件
  handleGotoPay = () => {
    //发起支付
    const payApply = (openId) => {
      const postData = {
        orderNo: this.state.orderID,
        payMethod: this.state.payType,
        source: 10,
        couponRecordIds: this.state.couponRecordIds,
        isRaw: 1,
        openId: openId,
        recommend: this.state.recommend, //优惠码
        payAmount: (
          this.state.totalAmount +
          this.state.logisticsFee +
          this.state.taxFee
        ).toFixed(2), //应付金额
      };
      console.log("sdsds dsdsad", postData);
      CarryTokenRequest(ServicePath.payOrder, postData).then((res) => {
        if (res.data.code === 1100) {
          Taro.removeStorageSync("shareRecommend");
          Taro.redirectTo({
            url: "../orderpaysuccess/orderpaysuccess", //模拟支付成功
          });
        } else if (res.data.code === 0) {
          const r = res.data.data;
          const p = JSON.parse(r.result.payInfo);
          if (res.data.code === 0) {
            const date = new Date();
            const time = date.getTime();
            Taro.showLoading({
              title: "支付信息加载中",
              duration: 2000,
            });
            Taro.requestPayment({
              timeStamp: p.timeStamp,
              nonceStr: p.nonceStr,
              package: p.package,
              signType: p.signType,
              paySign: p.paySign,
              success: (res) => {
                Taro.removeStorageSync("shareRecommend");
                Taro.redirectTo({
                  url: "../orderpaysuccess/orderpaysuccess", //支付成功
                });
              },
              fail: (res) => {
                console.log("fail");
              },
            });
          }
        } else {
          Taro.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 1500,
          });
        }
      });
    };

    //获取openId并发起支付
    const getWechatJsAppOpenId = (code) => {
      let openId = 0;
      const postData = {
        code: code,
      };
      CarryTokenRequest(ServicePath.getWechatJsAppOpenId, postData)
        .then((res) => {
          if (res.data.code === 0) {
            openId = res.data.data.openId;
            payApply(openId);
          }
        })
        .catch((err) => {
          console.log("接口异常 - 获取openId：", err);
        });
    };
    //获取code
    Taro.login({
      success: function(res) {
        if (res.code) {
          getWechatJsAppOpenId(res.code);
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      },
    });
  };

  // 优惠码验证
  handlepromoCode = (e) => {
    // let value = e.detail.value;
    // const numberValue = /^[A-Za-z0-9]+$/; //限制输入
    const reg = /\s+/g; //替换空格
    const reg2 = /[\u4E00-\u9FA5]/g; //替换中文字符
    const reg3 = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/g; //替换特殊字符
    // console.log("e.detail.value:", e.detail.value);
    let value = e.detail.value.replace(reg, ""); //替换空格
    value = value.replace(reg2, ""); //替换中文
    value = value.replace(reg3, ""); //替换特色字符

    this.setState(
      {
        anotherRecommend: value,
      },
      () => {
        // console.log("新的:", this.state.anotherRecommend);
        this.codeAssignment();
      }
    );

    return this.state.anotherRecommend;
  };

  // 判断优惠码是需手动填写/传值(赋值)
  codeAssignment = () => {
    if (this.state.marketType === 1) {
      //营销商品
      this.setState(
        {
          recommend: this.state.recommend,
        },
        () =>
          console.log(
            this.state.marketType,
            "自动填写的优惠码赋值传给后台",
            this.state.recommend
          )
      );
    } else {
      //普通
      this.setState(
        {
          recommend: this.state.anotherRecommend,
        },
        () => console.log(this.state.recommend, "手动.....后台")
      );
    }
  };

  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: "订单支付",
    });
    this.getPageOrderSubmit();
  }

  componentDidShow() {
    let rs = JSON.parse(this.$router.params.state);
    let r = rs.pageOrderPayInfo;
    this.getUseCouponList(r.orderNo);
  }

  componentWillUnmount() {}

  render() {
    const { orderID, couponRecordIds, couponType } = this.state;
    return (
      <View class="orderPay">
        <View class="ct-orderPay">
          <View class="baseInfo item">
            <View class="left">
              <span class="remind">订单提交成功，支付单号：</span>
              <span class="payID">{this.state.orderID}</span>
            </View>
          </View>
          <View class="payType item">
            <View class="type">
              <label class="item wx_wrap">
                {" "}
                {/* 微信 */}
                <View class="left">
                  <Image
                    src={require("../../static/orderpart/pay_wx.png")}
                    alt=""
                  />
                  <Text>微信支付</Text>
                </View>
                <Radio
                  type="radio"
                  name="payType"
                  defaultChecked
                  checked="true"
                  class="wx"
                  value="1"
                  onChange={this.handlePayType.bind(this)}
                ></Radio>
              </label>
            </View>
          </View>
          {this.state.marketType === 1 ? null : (
            <Navigator
              url={`/pages/usecertificate/usecertificate?orderId=${orderID}&couponRecordIds=${couponRecordIds}`}
            >
              {
                <View className="coupon">
                  <View className="coupon-text">优惠券</View>
                  <View className="coupon-type">
                    {couponType.map((item, index) =>
                      item.couponType === 1 ? (
                        <View className="type" key={index}>
                          <Text className="type-text" decode>
                            满减券&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          </Text>
                          <Text className="coupon-num">
                            优惠 {item.couponAmount.toFixed(2)}
                          </Text>
                        </View>
                      ) : item.couponType === 3 ? (
                        <View className="type" key={index}>
                          <Text className="type-text" decode>
                            折扣券&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          </Text>
                          <Text className="coupon-num">
                            优惠 {item.couponAmount * 10} 折
                          </Text>
                        </View>
                      ) : null
                    )}
                    {couponType.map((item, index) =>
                      item.couponType === 2 ? (
                        <View className="type" key={index}>
                          <Text className="type-text" decode>
                            抵扣券&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          </Text>
                          <Text className="coupon-num">
                            优惠 {item.couponAmount.toFixed(2)}
                          </Text>
                        </View>
                      ) : null
                    )}
                  </View>
                </View>
              }
            </Navigator>
          )}
          <View class="action">
            <View class="right">
              <View class="info">
                <View class="line total">
                  <span class="prop">总计：</span>
                  <span class="value">￥ {this.state.totalAmount}</span>
                </View>
                <View class="line freightCharges">
                  <span class="prop">运费：</span>
                  <span class="value">{this.state.logisticsFee}</span>
                </View>
                <View class="line taxFee">
                  <span class="prop">税费：</span>
                  <span class="value">{this.state.taxFee}</span>
                </View>
              </View>
              <View class="amount">
                <span class="prop">应付金额：</span>
                <span class="amount-amount">
                  ￥{" "}
                  {(
                    this.state.totalAmount +
                    this.state.logisticsFee +
                    this.state.taxFee
                  ).toFixed(2)}
                </span>
              </View>
            </View>
          </View>
          {/* 优惠码开始 */}
          <From>
            <View className="promoCode item">
              <View className="content">
                <View className="content">
                  <Text className="text">输入优惠码:</Text>
                  <Input
                    onInput={this.handlepromoCode}
                    // onBlur={this.handlepromoCode}
                    className="promoode"
                    disabled={this.state.marketType === 1 ? true : false}
                    value={
                      this.state.marketType === 1
                        ? this.state.recommend
                        : this.state.anotherRecommend
                    }
                    placeholder="请输入优惠码6-12字符(选填)"
                    maxlength="12"
                  />
                </View>
              </View>
            </View>
          </From>
          {/* 优惠码结束 */}
          <View class="action-action">
            <Button class="complete" type="button" onClick={this.handleGotoPay}>
              <Text decode="true`">微信支付&nbsp;&nbsp; </Text>￥{" "}
              {(
                this.state.totalAmount +
                this.state.logisticsFee +
                this.state.taxFee
              ).toFixed(2)}
            </Button>
          </View>
        </View>
      </View>
    );
  }
}
