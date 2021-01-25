import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import './historycertificate.less';
import '../../common/globalstyle.less';
import CommonEmpty from '../../components/CommonEmpty/CommonEmpty';
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';

class HistoryCertificate extends Component {
  state = {
    couponList: [], // 优惠券列表
    expiredCoupon:
      'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/coupon/expired-coupon.png', // 满减券
  };

  // 获取历史优惠券
  getMyCoupon() {
    CarryTokenRequest(servicePath.getmyCoupon, {
      current: 1,
      len: 100,
    })
      .then((res) => {
        console.log('获取优惠券成功', res.data);
        if (res.data.code === 0) {
          this.setState({
            couponList: res.data.data,
          });
        }
      })
      .catch((err) => {
        console.log('获取优惠券失败', err);
      });
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {
    this.getMyCoupon();
  }

  componentDidHide() {}

  config = {
    navigationBarTitleText: '历史卡券',
    usingComponents: {},
  };

  render() {
    const { couponList, expiredCoupon } = this.state;
    return (
      <View id="history-certificate">
        <View className="certificate-title">
          <Text>历史卡券</Text>
        </View>
        {couponList.length === 0 ? (
          <CommonEmpty content="暂无历史优惠券" />
        ) : (
          <View className="certificate-list">
            {couponList.map((item) => (
              <View
                className="certificate-item"
                onClick={this.handleReceive.bind(this, item.couponId)}
                style={{
                  backgroundImage: `url(${expiredCoupon})`,
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
                        '无门槛'
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
                      ? '满减'
                      : item.couponType === 2
                      ? '抵扣'
                      : '折扣'}
                    券
                  </View>
                  <View className="rule-box">
                    <Text className="rule-text">{item.couponRule}</Text>
                  </View>
                  <View className="line"></View>
                </View>
                <View className="use-icon">
                  {item.useStatus === 1 ? (
                    <Image src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/coupon/use-icon.png" />
                  ) : item.expiredStatus ? (
                    <Image src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/coupon/expired.png" />
                  ) : (
                    <Image src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/coupon/not-expired.png" />
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }
}

export default HistoryCertificate;
