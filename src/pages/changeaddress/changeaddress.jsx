import Taro, { Component } from '@tarojs/taro';
import { View, Text, Radio, RadioGroup, Button } from '@tarojs/components';
import '../../common/globalstyle.less';
import './changeaddress.less';

export default class ChangeAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentAddressID: null, //初始ID
      addressList: [],
      ifDefault: false,
      selectAddressID: false, //选择ID
    };
  }

  //接收提交订单页信息
  getPageOrderSubmit = () => {
    const params = this.$router.params;
    const currentAddressID = JSON.parse(params.currentAddressID);
    const addressList = JSON.parse(params.addressList);
    this.setState({
      currentAddressID: currentAddressID,
      selectAddressID: currentAddressID,
      addressList: addressList.map((itemAddress) => {
        return {
          addressID: itemAddress.addressId,
          recevier: itemAddress.addresser,
          address: itemAddress.addressInfo,
          phone: itemAddress.telephone,
          regionPath: itemAddress.regionPath,
          checked: false,
        };
      }),
    });
  };

  //地址选择
  selectAddress = (e) => {
    this.setState({
      selectAddressID: e.detail.value,
    });
  };

  //完成选择事件
  handleComplete = () => {
    const selectAddressID = this.state.selectAddressID;
    Taro.setStorage({
      key: 'selectAddressID',
      data: this.state.selectAddressID,
    });
    Taro.navigateBack({
      delta: 1,
    });
  };

  componentDidShow() {
    Taro.setNavigationBarTitle({
      title: '选择地址',
    });

    this.getPageOrderSubmit();
  }

  render() {
    const { addressList, currentAddressID, ts } = this.state;

    return (
      <View className="changeAddress">
        <RadioGroup className="addressList" onChange={this.selectAddress}>
          {addressList.map((itemAddress) => {
            return (
              /* 地址项 */
              <Label className="itemAddress">
                <View className="top line">
                  <Text className="name">{itemAddress.recevier}</Text>
                  <Radio
                    value={itemAddress.addressID}
                    checked={currentAddressID === itemAddress.addressID}
                    color="#ff5d8c"
                  />
                </View>
                <View className="phone line">
                  <Text className="line_desc">手机：</Text>
                  <Text className="value">{itemAddress.phone}</Text>
                </View>
                <View className="regionPath line">
                  <Text className="line_desc">地区：</Text>
                  <Text className="value">{itemAddress.regionPath}</Text>
                </View>
                <View className="address line">
                  <Text className="line_desc">地址：</Text>
                  <Text className="value">{itemAddress.address}</Text>
                </View>
              </Label>
            );
          })}
        </RadioGroup>
        <Button className="complete" onClick={this.handleComplete}>
          保存
        </Button>
      </View>
    );
  }
}
