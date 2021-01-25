import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import "./address.less";
import "../../common/globalstyle.less";
import servicePath from "../../common/util/api/apiUrl";
import { CarryTokenRequest } from "../../common/util/request";
import CommonEmpty from "../../components/CommonEmpty/CommonEmpty";

// 添加地址
class AddRess extends Component {
  state = {
    addressList: [],
  };

  // 添加地址点击事件
  handleNavigateTo = () => {
    Taro.navigateTo({
      url: "/pages/editaddress/editaddress",
    });
  };

  // 地址列表的编辑点击事件
  handleEditClick = (item) => {
    Taro.navigateTo({
      url: `/pages/editaddress/editaddress?status=0&item=${JSON.stringify(
        item
      )}`,
    });
  };

  // 获取收货地址
  getLogisticsAddress() {
    CarryTokenRequest(servicePath.logisticsAddress, {
      len: 15,
      current: 1,
    })
      .then((res) => {
        console.log("获取收货地址成功", res.data.data);
        if (res.data.code === 0) {
          this.setState({ addressList: res.data.data.records });
        }
      })
      .catch((err) => {
        console.log("获取收货地址失败", err);
      });
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {
    this.getLogisticsAddress();
  }

  config = {
    navigationBarTitleText: "收货地址",
    usingComponents: {},
  };

  render() {
    const { addressList } = this.state;
    return (
      <View id="address">
        <View className="address-wrap">
          {addressList.length === 0 ? (
            <CommonEmpty content="暂无收货地址" />
          ) : (
            addressList.map((item) => (
              <View className="address-item" key={item.addressId}>
                <View className="item-left">
                  <View className="address-bg"></View>
                  {item.inCommonUse === 1 ? (
                    <View className="address-ac">默认</View>
                  ) : (
                    ""
                  )}
                </View>
                <View className="item-right">
                  <View className="user-info">
                    <Text
                      className="user-name"
                      style={{
                        display: "-webkit-box",
                        "-webkit-box-orient": "vertical",
                        "-webkit-line-clamp": 1,
                        overflow: "hidden",
                      }}
                    >
                      {item.addresser}
                    </Text>
                    <Text className="phone-num">{item.telephone}</Text>
                  </View>
                  <View
                    className="address-txt"
                    style={{
                      display: "-webkit-box",
                      "-webkit-box-orient": "vertical",
                      "-webkit-line-clamp": 2,
                      overflow: "hidden",
                    }}
                  >
                    {item.regionPath.replace(/[:]/g, "")}
                    {item.addressInfo}
                  </View>
                </View>
                <View
                  className="address-edit"
                  onClick={this.handleEditClick.bind(this, item)}
                >
                  编辑
                </View>
              </View>
            ))
          )}
        </View>
        <View className="address-btn">
          <Button onClick={this.handleNavigateTo}>添加地址</Button>
        </View>
      </View>
    );
  }
}

export default AddRess;
