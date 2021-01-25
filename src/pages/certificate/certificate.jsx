import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import './certificate.less';
import '../../common/globalstyle.less';
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';
import CommonEmpty from '../../components/CommonEmpty/CommonEmpty';

// 优惠券
class Certificate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      couponList: [], // 优惠券列表
      fullCoupon:
        'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/coupon/coupon1.png', // 满减券
      discountCoupon:
        'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/coupon/coupon2.png', // 折扣券
      deductionCoupon:
        'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/coupon/coupon3.png', // 抵扣券
    };
  }

  // 领取点击事件
  handleReceive = (couponId) => {
    CarryTokenRequest(servicePath.saveCouponRecord, {
      couponId: couponId,
      current: 1,
      len: 10,
      distributionMethod: 2,
      // distributionMethod: 2
    })
      .then((res) => {
        console.log('领取优惠券成功', res.data);
        if (res.data.code === 0) {
          Taro.showToast({
            title: '领取成功',
            icon: 'none',
            duration: 1000,
            success: (res) => {
              this.getMyCouponList();
            },
          });
        } else {
          Taro.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000,
          });
        }
      })
      .catch((err) => {
        console.log('领取优惠券失败', err);
      });
  };

  // 获取优惠券
  getMyCouponList() {
    CarryTokenRequest(servicePath.getmyCouponList, {
      current: 1,
      len: 10,
      distributionMethod: 2,
    })
      .then((res) => {
        console.log('获取优惠券成功', res.data);
        if (res.data.code === 0) {
          this.setState({
            couponList: res.data.data,
          });
        } else {
          this.setState({
            couponList: [],
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
    this.getMyCouponList();
  }

  componentDidHide() {}

  config = {
    navigationBarTitleText: '卡券中心',
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
      <View id="certificate">
        {couponList.length === 0 ? (
          <CommonEmpty content="暂无优惠券" />
        ) : (
          <View className="certificate-list">
            {couponList.map((item) => (
              <View
                className="certificate-item"
                onClick={this.handleReceive.bind(this, item.couponId)}
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
                  <View className="receive-btn">
                    <Button
                      style={{
                        backgroundColor:
                          item.couponType === 1
                            ? '#53B6FB'
                            : item.couponType === 2
                            ? '#FFAB19'
                            : '#FF275D',
                      }}
                      className="btn"
                    >
                      {item.collectionStatus ? '已领取' : '领取'}
                    </Button>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
        <Navigator url="/pages/mycertificate/mycertificate">
          <View className="certificate-footer">查看我的卡券 {'>'}</View>
        </Navigator>
      </View>
    );
  }
}

export default Certificate;
