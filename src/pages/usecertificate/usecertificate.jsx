import Taro, { Component, getCurrentPages } from "@tarojs/taro";
import {
  View,
  Text,
  Checkbox,
  CheckboxGroup,
  Button,
  Label,
} from "@tarojs/components";
import "./usecertificate.less";
import "../../common/globalstyle.less";
import { CarryTokenRequest } from "../../common/util/request";
import servicePath from "../../common/util/api/apiUrl";

// 使用优惠券
class UseCertificate extends Component {
  state = {
    couponList: [], // 优惠券列表
    fullCoupon:
      "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/coupon/coupon1.png", // 满减券
    discountCoupon:
      "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/coupon/coupon2.png", // 折扣券
    deductionCoupon:
      "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/coupon/coupon3.png", // 抵扣券
    couponRecordIds: [], // 传给后台的优惠券id
    orderData: "", // 订单数据
    fdId: "", // 满减券或折扣券id
    deductId: "", // 抵扣券id
    sureUse: "",
  };

  // 优惠券checkbox事件
  checkboxChange = (e) => {
    let arr = [];
    let couponRecordIds = [];
    let values = e.detail.value;
    for (let i = 0, lenI = values.length; i < lenI; ++i) {
      arr.push(JSON.parse(e.detail.value[i]).couponType);
      couponRecordIds.push(JSON.parse(e.detail.value[i]).couponRecordId);
    }
    let couponList = this.state.couponList;
    couponList.map((item) => {
      if (arr.includes(item.couponType)) {
        if (couponRecordIds.includes(item.couponRecordId)) {
          item.disabled = false;
        } else {
          item.disabled = true;
        }
      } else {
        item.disabled = false;
        /* this.getUseCouponList(); */
        if (item.couponType === 1 && item.canUse === 0) {
          item.disabled = true;
        }

        if (
          (arr.includes(3) && item.couponType === 1) ||
          (arr.includes(1) && item.couponType === 3)
        ) {
          item.disabled = true;
        }
      }
      return item;
    });
    this.setState({
      couponList,
      couponRecordIds,
    });
  };

  // 取消按钮点击事件
  handleCancel = () => {
    this.setState(
      {
        couponRecordIds: [],
      },
      () => {
        this.cancelUseConpon();
      }
    );
  };

  // 完成按钮点击事件
  handleComplete = () => {
    this.reCalculateFee();
  };

  // 获取可使用优惠券
  getUseCouponList() {
    CarryTokenRequest(servicePath.getUserCouponList, {
      orderNo: this.$router.params.orderId,
      len: 100,
      source: 10,
    })
      .then((res) => {
        console.log("获取优惠券成功", res.data);
        if (res.data.code === 0) {
          let couponRecordIds = [];
          let couponTypes = [];
          res.data.data.forEach((item) => {
            if (item.used === 1) {
              couponRecordIds.push(item.couponRecordId);
              couponTypes.push(item.couponType);
            }
          });
          let data = res.data.data.map((item) => {
            if (item.used === 1) {
              item.disabled = false;
            } else {
              item.disabled = true;
              if (couponRecordIds.includes(item.couponRecordId)) {
                item.disabled = false;
              } else {
                if (couponRecordIds.length !== 0) {
                  item.disabled = true;
                } else {
                  item.disabled = false;
                }
              }

              if (couponTypes.includes(item.couponType)) {
                item.disabled = true;
              } else {
                item.disabled = false;

                if (couponTypes.includes(1) && item.couponType === 3) {
                  item.disabled = true;
                } else if (couponTypes.includes(3) && item.couponType === 1) {
                  item.disabled = true;
                }

                if (item.canUse === 0) {
                  item.disabled = true;
                }
              }
            }
            return item;
          });
          this.setState({
            couponList: data,
            couponRecordIds,
          });
        }
      })
      .catch((err) => {
        console.log("获取优惠券失败", err);
      });
  }

  // 重新计算使用优惠券的费用
  reCalculateFee() {
    CarryTokenRequest(servicePath.reCalculateFee, {
      couponRecordIds: this.state.couponRecordIds,
      orderNo: this.$router.params.orderId,
      source: 10,
    })
      .then((res) => {
        console.log("使用优惠卷成功", res.data);
        if (res.data.code === 0) {
          this.setState(
            {
              orderData: res.data.data,
            },
            () => {
              Taro.navigateBack({
                delta: 1,
              });
            }
          );
        } else {
          Taro.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 1000,
          });
        }
      })
      .catch((err) => {
        console.log("使用优惠卷失败", err);
      });
  }

  // 取消使用优惠券
  cancelUseConpon() {
    CarryTokenRequest(servicePath.reCalculateFee, {
      couponRecordIds: [],
      orderNo: this.$router.params.orderId,
      source: 10,
    })
      .then((res) => {
        console.log("取消使用优惠卷成功", res.data);
        if (res.data.code === 0) {
          this.setState(
            {
              orderData: res.data.data,
            },
            () => {
              Taro.navigateBack({
                delta: 1,
              });
            }
          );
        }
      })
      .catch((err) => {
        console.log("使用优惠卷失败", err);
      });
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {
    const orderData = this.state.orderData;
    if (orderData !== "") {
      let pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      // Taro.setStorageSync('couponRecordIds', JSON.stringify([this.state.fdId, this.state.deductId]));
      prevPage.$component.setState({
        type: 2,
        orderID: orderData.itemOrder.orderNo,
        totalAmount: orderData.itemOrder.discountPrice,
        logisticsFee: orderData.itemOrder.logisticsFee,
        taxFee: orderData.itemOrder.taxFee,
        couponRecordIds: this.state.couponRecordIds,
        proList: orderData.itemOrder.orderDetails.map((item) => {
          return {
            proID: item.itemId,
            imgUrl: item.itemImage,
            proInfo: item.itemName,
            platformPrice: item.price,
            amount_amount: item.itemNum,
            sepecification: item.specName,
            sepcClass: "规格",
            preferentialAmount: 0,
            subTotal: item.price * item.itemNum,
          };
        }),
        // couponType1: this.state.couponType1,
        // couponType2: this.state.couponType2
      });
    }
  }

  componentDidShow() {
    this.getUseCouponList();
  }

  componentDidHide() {}

  config = {
    navigationBarTitleText: "使用卡券",
    usingComponents: {},
  };

  render() {
    const {
      couponList,
      fullCoupon,
      discountCoupon,
      deductionCoupon,
      couponRecordIds,
    } = this.state;
    return (
      <View id="use-certificate">
        <View className="certificate-title">
          <Text>可使用卡券</Text>
        </View>
        <View className="certificate-list">
          {/* 满减、折扣券 */}
          <CheckboxGroup onChange={this.checkboxChange}>
            {couponList.map((item) => (
              <Label className="coupon-item-wrap" key={item.couponId}>
                <View className="checkbox">
                  <Checkbox
                    value={JSON.stringify(item)}
                    checked={item.used === 1 ? true : false}
                    color="#ff5d8c"
                    disabled={item.disabled}
                  ></Checkbox>
                </View>
                <View
                  className="certificate-item"
                  style={{
                    backgroundImage: `url(${
                      item.couponType === 1
                        ? fullCoupon
                        : item.couponType === 2
                        ? discountCoupon
                        : deductionCoupon
                    })`,
                  }}
                  key={item.couponId}
                >
                  <View className="item-left">
                    <View className="coupon-price">
                      {item.couponType !== 3 ? (
                        <View>
                          <Text className="price-symbol">￥</Text>
                          <Text className="price-text">
                            {item.couponAmount}
                          </Text>
                        </View>
                      ) : (
                        <View>
                          <Text className="price-text">
                            {item.couponAmount * 10} 折
                          </Text>
                        </View>
                      )}
                      <View className="price-rule">
                        {item.couponType === 2 ? (
                          "无门槛"
                        ) : item.couponType === 3 ? (
                          <View>
                            <Text>全场 {item.couponAmount * 10} 折</Text>
                          </View>
                        ) : (
                          <View>
                            <View>满￥ {item.satisfiedAmount}</View>
                            <View>减￥ {item.couponAmount}</View>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  <View className="item-right">
                    <View className="coupon-text">
                      {item.couponType === 1
                        ? "满减"
                        : item.couponType === 2
                        ? "抵扣"
                        : "折扣"}
                      券
                    </View>
                    <View className="rule-box">
                      <Text className="rule-text">{item.couponRule}</Text>
                    </View>
                    <View className="line"></View>
                    <View className="expirationEndTime">
                      有效期：
                      {item.couponCreateTime.slice(0, 10).replace(/\-/g, ".")}-
                      {item.expirationEndTime.slice(0, 10).replace(/\-/g, ".")}
                    </View>
                  </View>
                </View>
              </Label>
            ))}
          </CheckboxGroup>
        </View>
        <Navigator url="/pages/certificate/certificate">
          <View className="certificate-footer">
            更多优惠，前往领券中心 {">"}
          </View>
        </Navigator>
        <View className="certificate-btn">
          <Button onClick={this.handleCancel}>不使用优惠券</Button>
          <Button onClick={this.handleComplete}>完成</Button>
        </View>
      </View>
    );
  }
}

export default UseCertificate;
