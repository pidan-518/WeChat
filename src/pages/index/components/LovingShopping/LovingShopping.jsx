import Taro, { Component } from "@tarojs/taro";
import { View, ScrollView, Text } from "@tarojs/components";
import "./LovingShopping.less";
import utils from "../../../../common/util/utils";

// 爱抢购
class LovingShopping extends Component {
  state = {};

  // 点击查看更多跳转事件
  handleNavgator = (url, activityId) => {
    const { activeState, sessionsId } = this.props.lovingShoppingData;
    utils.mutiLink(`${url}?activityId=${activityId}&sessionsId=${sessionsId}`);
  };

  componentWillMount() {}

  MillisecondToDate(my_time) {
    let days = my_time / 1000 / 60 / 60 / 24;
    let daysRound =
      Math.floor(days) <= 9 ? `0${Math.floor(days)}` : Math.floor(days);
    let hours = my_time / 1000 / 60 / 60 - 24 * daysRound;
    let hoursRound =
      Math.floor(hours) <= 9 ? `0${Math.floor(hours)}` : Math.floor(hours);
    let minutes = my_time / 1000 / 60 - 24 * 60 * daysRound - 60 * hoursRound;
    let minutesRound =
      Math.floor(minutes) <= 9
        ? `0${Math.floor(minutes)}`
        : Math.floor(minutes);
    let seconds = Math.floor(
      my_time / 1000 -
        24 * 60 * 60 * daysRound -
        60 * 60 * hoursRound -
        60 * minutesRound
    );
    let secondsRound = seconds <= 9 ? `0${seconds}` : seconds;
    let time = `${hoursRound}:${minutesRound}:${secondsRound}`;
    return {
      hoursRound,
      minutesRound,
      secondsRound,
    };
    /* let days = (my_time / 1000 / 60 / 60 / 24).toFixed(0);
    let daysRound  = days <= 9 ? `0${days}` : days;
    let hours = (my_time / 1000 / 60 / 60 % 24).toFixed(0);
    let hoursRound = hours <= 9 ? `0${hours}` : hours;
    let minutes = (my_time / 1000 / 60 % 60).toFixed(0);
    let minutesRound = minutes <= 9 ? `0${minutes}` : minutes;
    let seconds = (my_time / 1000 % 60).toFixed(0);
    let secondsRound = seconds <= 9 ? `0${seconds}` : seconds;
    let time = `${daysRound} ${hoursRound} ${minutesRound} ${secondsRound}`
    return time; */
  }

  componentDidMount() {}

  componentDidShow() {}

  render() {
    const {
      activityId,
      url,
      panicBuyingItemList,
      nextSession,
      activeState,
      name,
      sessionsId,
    } = this.props.lovingShoppingData;
    return (
      <View className="wrap">
        <View className="title-box">
          <View className="box-left">
            <Text className="title-text">
              <Text>{name}</Text>
            </Text>
            {activeState === 0 ? (
              <View className="time">
                <View className="spot-field-text">{nextSession}</View>
                <View className="time-text">
                  {this.MillisecondToDate(this.props.nextMilliTime).hoursRound}
                </View>
                <View className="time-text">
                  {
                    this.MillisecondToDate(this.props.nextMilliTime)
                      .minutesRound
                  }
                </View>
                <View className="time-text">
                  {
                    this.MillisecondToDate(this.props.nextMilliTime)
                      .secondsRound
                  }
                </View>
              </View>
            ) : activeState === 2 ? (
              "已结束"
            ) : (
              <View className="time">
                <View className="spot-field-text">{nextSession}</View>
                <View className="time-text">
                  {this.MillisecondToDate(this.props.nextMilliTime).hoursRound}
                </View>
                <View className="time-text">
                  {
                    this.MillisecondToDate(this.props.nextMilliTime)
                      .minutesRound
                  }
                </View>
                <View className="time-text">
                  {
                    this.MillisecondToDate(this.props.nextMilliTime)
                      .secondsRound
                  }
                </View>
              </View>
            )}
          </View>
          {/* <View
            className="box-right"
            onClick={this.handleNavgator.bind(this, url, activityId)}
          >
            <Text>查看更多</Text>
            <Image
              className="return-icon"
              src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/home/return-icon.png"
            />
          </View> */}
        </View>
        <View className="loving-shopping-list">
          <ScrollView className="list-scroll" scrollX>
            {panicBuyingItemList.map((item) => (
              <View
                key={item.itemId}
                className="list-item"
                style={{ backgroundImage: `url(${item.itemImage})` }}
                onClick={this.handleNavgator.bind(this, url, activityId)}
              >
                <View className="goods-info">
                  <Text
                    className="goods-name"
                    style={{
                      display: "-webkit-box",
                      "-webkit-box-orient": "vertical",
                      "-webkit-line-clamp": 2,
                      overflow: "hidden",
                    }}
                  >
                    {item.itemName}
                  </Text>
                  <View className="goods-price">
                    <Text className="price-tag">抢购价</Text>
                    <Text className="price-box">
                      <Text>￥</Text>
                      <Text className="price-text">
                        {item.promotionPrice ? item.discountPrice : item.price}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }
}

LovingShopping.defaultProps = {
  lovingShoppingData: {
    activityId: "", // 活动id
    url: "", // 跳转页面路径
    panicBuyingItemList: [], // 商品列表
    nextSessionState: 0, // 是否小于两小时 0=大于两小时，1=小于等于两小时
    nextSession: "", // 下一场次
    activeState: "", // 活动状态 0=未开始，1=正在进行，2=已结束
  },
};

export default LovingShopping;
