import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./mycertificate.less";
import "../../common/globalstyle.less";
import { CarryTokenRequest } from "../../common/util/request";
import servicePath from "../../common/util/api/apiUrl";
import CommonEmpty from "../../components/CommonEmpty/CommonEmpty";

class Mycertificate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      couponList: [], // 优惠券列表
      fullCoupon:
        "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/coupon/coupon1.png", // 满减券
      discountCoupon:
        "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/coupon/coupon2.png", // 折扣券
      deductionCoupon:
        "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/coupon/coupon3.png", // 抵扣券
    };
  }

  // 获取我的优惠券（可用）
  getMyCoupon() {
    CarryTokenRequest(servicePath.getmyCoupon, {
      current: 1,
      len: 10,
      useStatus: 0,
    })
      .then((res) => {
        console.log("获取我的优惠券成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            couponList: res.data.data,
          });
        }
      })
      .catch((err) => {
        console.log("获取优惠券失败", err);
      });
  }

  componentWillMount() {}

  componentDidMount() {}

  componentDidShow() {
    this.getMyCoupon();
  }

  config = {
    navigationBarTitleText: "我的卡券",
    usingComponents: {},
  };

  render() {
    const {
      couponList,
      fullCoupon,
      discountCoupon,
      deductionCoupon,
    } = this.state;
    return (
      <View id="my-certificate">
        <View className="certificate-title">
          <Navigator url="">
            <Text>可使用卡券</Text>
          </Navigator>
          <Navigator url="/pages/historycertificate/historycertificate">
            <Text>历史记录</Text>
          </Navigator>
        </View>
        <View className="certificate-list">
          {couponList.length === 0 ? (
            <CommonEmpty content="暂无优惠券" />
          ) : (
            couponList.map((item) => (
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
                        <Text className="price-text">{item.couponAmount}</Text>
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
            ))
          )}
        </View>
      </View>
    );
  }
}

export default Mycertificate;
