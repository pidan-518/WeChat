import Taro, { Component } from "@tarojs/taro";
import {
  View,
  Button,
  Form,
  Input,
  Textarea,
  Switch,
} from "@tarojs/components";
import TaroRegionPicker from "../../components/taro-region-picker";
import "./editaddress.less";
import "../../common/globalstyle.less";
import servicePath from "../../common/util/api/apiUrl";
import { CarryTokenRequest } from "../../common/util/request";

// 编辑地址
class EditAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchChecked: false, // 默认地址值
      region: "广东省-深圳市-南山区", // 所在地区选择器数据
      status: "", // 页面状态 如果是0表示修改地址
      addressInfo: {}, // 修改地址的数据
    };
  }

  // 所在区选择器事件
  handleEegionChange = (region) => {
    this.setState({ region });
  };

  // 保存地址表单提交事件
  handleSubmitAddress = (e) => {
    let { phone, location, AddressDetails, checkAddress } = e.detail.value;
    const phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[0-9])\d{8}$|^(5|6|8|9)\d{7}$/;
    if (phone === "") {
      Taro.showToast({
        title: "请输入手机号码",
        duration: 1500,
        icon: "none",
      });
    } else if (!phoneReg.test(phone)) {
      Taro.showToast({
        title: "请输入正确手机号码",
        duration: 1500,
        icon: "none",
      });
    } else if (location === "") {
      Taro.showToast({
        title: "请选择所在地区",
        duration: 1500,
        icon: "none",
      });
    } else if (AddressDetails === "") {
      Taro.showToast({
        title: "请选择填写详细地址",
        duration: 1500,
        icon: "none",
      });
    } else {
      Taro.showLoading({
        title: "加载中...",
        success: () => {
          this.logisticsAddressUpdate(e.detail.value);
        },
      });
    }
  };

  // 删除地址按钮点击事件
  handleRemoveAddress = () => {
    if (this.state.addressInfo.inCommonUse === 1) {
      Taro.showModal({
        title: "提示",
        cancelColor: "#ff5d8c",
        confirmColor: "#ff5d8c",
        content: "该地址为默认地址，请先修改其他地址为默认地址后进行删除操作",
        success(res) {
          if (res.confirm) {
            console.log("用户点击确认");
          } else {
            console.log("用户点击取消");
          }
        },
      });
    } else {
      Taro.showModal({
        cancelColor: "#ff5d8c",
        confirmColor: "#ff5d8c",
        title: "提示",
        content: "确认删除该地址？",
        success: (res) => {
          if (res.confirm) {
            this.logisticsAddressremove();
          } else {
            console.log("用户点击取消");
          }
        },
      });
    }
  };

  // 保存地址
  logisticsAddressUpdate(params) {
    const { addressInfo, region } = this.state;
    CarryTokenRequest(servicePath.saveOrUpdate, {
      regionPath: `${region.toString().replace(/[-]/g, ":")}`,
      addresser: `${params.consignee}`,
      telephone: `${params.phone}`,
      inCommonUse: params.checkAddress === true ? 1 : 0,
      direction: 1,
      addressInfo: `${params.AddressDetails}`,
      userId: JSON.parse(Taro.getStorageSync("userinfo")).userId,
      addressId: `${
        addressInfo.addressId !== undefined ? addressInfo.addressId : ""
      }`,
    })
      .then((res) => {
        Taro.hideLoading();
        console.log("保存或修改地址成功", res.data);
        if (res.data.code === 0) {
          Taro.showToast({
            title: "保存地址成功",
            duration: 1000,
            icon: "none",
            success: () => {
              setTimeout(() => {
                Taro.navigateBack({
                  delta: 1,
                });
              }, 1000);
            },
          });
        } else {
          Taro.showToast({
            title: "保存地址失败",
            duration: 1000,
            icon: "none",
          });
        }
      })
      .catch((err) => {
        console.log("保存或修改地址失败", err);
      });
  }

  // 删除地址接口
  logisticsAddressremove() {
    CarryTokenRequest(servicePath.logisticsAddressRemove, {
      addressId: `${this.state.addressInfo.addressId}`,
    })
      .then((res) => {
        console.log("删除地址成功", res.data);
        if (res.data.code === 0) {
          Taro.showToast({
            title: "删除地址成功",
            icon: "none",
            duration: 1500,
            success: (res) => {
              setTimeout(() => {
                Taro.navigateBack({
                  delta: 1,
                });
              }, 1500);
            },
          });
        }
      })
      .catch((err) => {
        console.log("删除地址失败", err);
      });
  }

  componentWillMount() {
    let getUser = Taro.getStorageSync("userinfo");
    if (getUser !== "") {
      /* 7.21移除 */
      // this.setState({
      //   addresser: JSON.parse(getUser).realName
      // })
    }
    if (this.$router.params.hasOwnProperty("status")) {
      const addressInfo = JSON.parse(this.$router.params.item);
      console.log(addressInfo.regionPath);
      this.setState({
        status: Number(this.$router.params.status),
        addressInfo,
        switchChecked: addressInfo.inCommonUse === 1 ? true : false,
        region: addressInfo.regionPath.split(":").join("-"),
      });
    }
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  config = {
    navigationBarTitleText: "填写地址",
    usingComponents: {},
  };

  render() {
    const { switchChecked, region, addressInfo, addresser } = this.state;

    return (
      <View id="editAddress">
        <Form onSubmit={this.handleSubmitAddress}>
          <View className="form-item">
            <View className="form-item-label">收货人</View>
            <Input
              maxLength="100"
              className="form-item-value"
              // disabled={addresser === null ? false : true}
              value={addressInfo.addresser}
              placeholder="请填写真实姓名"
              name="consignee"
            />
          </View>
          <View className="form-item">
            <View className="form-item-label">手机号码</View>
            <Input
              className="form-item-value"
              value={addressInfo.telephone}
              placeholder="手机号码"
              name="phone"
            />
          </View>
          {/* <View className="form-item">
            <View className="form-item-label">邮政编码</View>
            <Input className="form-item-value" value={addressInfo.postalCode}  placeholder="邮政编码" name="postalCode" />
          </View> */}
          <View className="form-item">
            <View className="form-item-label">所在地区</View>
            <TaroRegionPicker
              value={region}
              name="location"
              onGetRegion={this.handleEegionChange}
            />
          </View>
          <View className="form-item-textarea">
            <Textarea
              className="form-item-value"
              placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元 室等"
              name="AddressDetails"
              maxlength="100"
              value={addressInfo.addressInfo}
            />
          </View>
          <View className="form-switch">
            <View className="form-item-label">设置默认地址</View>
            <Switch
              style={{ zoom: ".6" }}
              color="#ff5d8c"
              checked={switchChecked}
              name="checkAddress"
            />
          </View>
          <View className="form-submit-btn">
            {this.state.status !== "" ? (
              <Button className="remove" onClick={this.handleRemoveAddress}>
                删除地址
              </Button>
            ) : null}
            <Button formType="submit">保存地址</Button>
          </View>
        </Form>
      </View>
    );
  }
}

export default EditAddress;
