import Taro, { Component } from "@tarojs/taro";
import { View, Text, Form } from "@tarojs/components";
import "./resetpassword.less";
import { postRequest, CarryTokenRequest } from "../../common/util/request";
import servicePath from "../../common/util/api/apiUrl";

class ResetPassword extends Component {
  state = {
    isDisabled: false, // 禁用发送验证码按钮
    btnTxt: "获取验证码", // 发送验证码按钮text
    timer: "", // 验证码定时器
    phoneVal: "", // 手机号
    codeImg: "", // 图形验证码
    imgCodeVal: "", // 图片验证码输入框的值
    openId: "", // 传到后台的openId
    isMyselfPhone: false, // 是否是本人手机号
  };

  // 手机号输入框输入事件
  handlePhoneVal = (e) => {
    this.setState({
      phoneVal: e.target.value,
    });
  };

  // 校验手机号
  handlePhoneValBlur = (e) => {
    const phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[0-9])\d{8}$|^(5|6|8|9)\d{7}$/;
    if (e.detail.value === "") {
      Taro.showToast({
        title: "请输入手机号",
        duration: 1000,
        icon: "none",
      });
    } else if (!phoneReg.test(e.detail.value)) {
      Taro.showToast({
        title: "请输入正确的手机号",
        duration: 2000,
        icon: "none",
      });
    } else {
      CarryTokenRequest(servicePath.checkMobileUsable, {
        mobile: e.detail.value,
      })
        .then((res) => {
          console.log("校验手机号成功", res.data);
          if (res.data.code === 0) {
            this.setState({
              isMyselfPhone: false,
            });
          } else {
            Taro.showToast({
              title: res.data.msg,
              duration: 1500,
              icon: "none",
              success: () => {
                this.setState({
                  isMyselfPhone: true,
                });
              },
            });
          }
        })
        .catch((err) => {
          console.log("校验手机号失败", err);
        });
    }
  };

  // 获取验证码按钮点击事件
  handleVerCode = (e) => {
    const phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[0-9])\d{8}$|^(5|6|8|9)\d{7}$/;
    if (this.state.phoneVal === "") {
      Taro.showToast({
        title: "请输入手机号",
        duration: 1000,
        icon: "none",
      });
    } else if (!phoneReg.test(this.state.phoneVal)) {
      Taro.showToast({
        title: "请输入正确的手机号",
        duration: 2000,
        icon: "none",
      });
    } else if (this.state.imgCodeVal === "") {
      Taro.showToast({
        title: "请输入图形验证码",
        duration: 2000,
        icon: "none",
      });
    } else {
      this.getSendSmsCode();
    }
  };

  // 图形验证码输入框
  handleImgCodeVal = (e) => {
    this.setState({
      imgCodeVal: e.detail.value,
    });
  };

  // 表单提交事件
  handleSubmit = (e) => {
    const {
      confirmPassword,
      password,
      phone,
      verCode,
      imgCodeVal,
    } = e.detail.value;
    const phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[0-9])\d{8}$|^(5|6|8|9)\d{7}$/;
    if (phone === "") {
      Taro.showToast({
        title: "请输入手机号",
        duration: 1000,
        icon: "none",
      });
      return false;
    } else if (!phoneReg.test(phone)) {
      Taro.showToast({
        title: "请输入正确的手机号",
        duration: 1000,
        icon: "none",
      });
      return false;
    } else if (imgCodeVal === "") {
      Taro.showToast({
        title: "请输入图形验证码",
        duration: 1000,
        icon: "none",
      });
      return false;
    } else if (verCode === "") {
      Taro.showToast({
        title: "请输入验证码",
        duration: 1000,
        icon: "none",
      });
      return false;
    } else if (password === "") {
      Taro.showToast({
        title: "请输入密码",
        duration: 1000,
        icon: "none",
      });
      return false;
    } else if (confirmPassword !== password) {
      Taro.showToast({
        title: "两次密码不一致",
        duration: 1000,
        icon: "none",
      });
      return false;
    } else {
      this.getPaplVerCode();
      const postData = {
        mobile: `${phone}`,
        smsCode: `${verCode}`,
        password: `${password}`,
        code: `${imgCodeVal}`,
        confirmPassword: `${confirmPassword}`,
        type: 2,
        checkType: 2,
        deviceNo: this.state.openId,
      };
      Taro.showLoading({
        title: "加载中...",
        mask: true,
        success: () => {
          this.getResetPassword(postData);
        },
      });
    }
  };

  // 图形验证码点击事件
  CodeImgClick = () => {
    this.getPaplVerCode();
  };

  // 设置获取验证码按钮禁用
  setBtnDisabled() {
    this.setState({
      isDisabled: true,
    });
    let time = 60;
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.timer = setInterval(() => {
      time--;
      this.setState({
        btnTxt: `${time} s`,
      });
      if (time === 0) {
        clearInterval(this.state.timer);
        this.setState(
          {
            btnTxt: "获取验证码",
            isDisabled: false,
          },
          () => {
            this.getPaplVerCode();
          }
        );
      }
    }, 1000);
  }

  // 修改密码请求
  getResetPassword(postData) {
    postRequest(servicePath.resetPassword, postData)
      .then((res) => {
        console.log("修改密码成功", res.data);
        Taro.hideLoading();
        if (res.data.code === 0) {
          Taro.showToast({
            title: res.data.data,
            duration: 1500,
            icon: "none",
            success: (res) => {
              setTimeout(() => {
                Taro.navigateBack({
                  delta: 1,
                });
              }, 1500);
            },
          });
        } else {
          Taro.showToast({
            title: res.data.msg,
            duration: 1500,
            icon: "none",
          });
        }
      })
      .catch((err) => {
        Taro.hideLoading();
        console.log("返回数据失败", err);
      });
  }

  // 发送验证码
  getSendSmsCode() {
    const postData = {
      mobile: `${this.state.phoneVal}`,
      code: `${this.state.imgCodeVal}`,
      type: 2,
      deviceNo: this.state.openId,
    };
    postRequest(servicePath.sendSmsCode, postData)
      .then((res) => {
        console.log("返回数据成功", res.data);
        if (res.data.code === 0) {
          this.setBtnDisabled();
        } else {
          Taro.showToast({ title: res.data.msg, icon: "none", duration: 1000 });
          this.getPaplVerCode();
        }
      })
      .catch((err) => {
        console.log("返回数据失败", err);
      });
  }

  // 获取图形验证码
  getPaplVerCode() {
    postRequest(servicePath.VerCode, {
      deviceNo: this.state.openId,
    })
      .then((res) => {
        console.log("获取图形验证码成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            codeImg: res.data.data.img,
          });
        }
      })
      .catch((err) => {
        console.log("获取图形验证码失败", err);
      });
  }

  //获取openId
  getWechatJsAppOpenId(code) {
    const postData = {
      code: code,
    };
    postRequest(servicePath.getWechatJsAppOpenId, postData)
      .then((res) => {
        if (res.data.code === 0) {
          this.setState(
            {
              openId: res.data.data.openId,
            },
            () => {
              this.getPaplVerCode();
            }
          );
        }
      })
      .catch((err) => {
        console.log("接口异常 - 获取openId：", err);
      });
  }

  componentDidMount() {}

  componentDidShow() {
    Taro.login({
      success: (res) => {
        if (res.code) {
          console.log(res);
          this.getWechatJsAppOpenId(res.code);
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      },
    });
  }

  config = {
    navigationBarTitleText: "忘记密码",
    usingComponents: {},
  };

  render() {
    const { isDisabled, btnTxt, isMyselfPhone } = this.state;

    return (
      <View id="resetpassword">
        <View className="resetpassword-title">请填写以下信息</View>
        <View className="resetpasw-form">
          <Form onSubmit={this.handleSubmit}>
            <View className="form-item">
              <View className="form-item-title">
                <Image
                  className="item-icon"
                  src={require("../../static/register/phone-icon.png")}
                />
                <Text>手机号码</Text>
              </View>
              <View className="form-item-input">
                <Input
                  name="phone"
                  type="text"
                  onInput={this.handlePhoneVal}
                  placeholder="请输入您的手机号码"
                  onBlur={this.handlePhoneValBlur}
                />
              </View>
            </View>
            <View className="form-item">
              <View className="form-item-title">
                <Image
                  className="item-icon"
                  src={require("../../static/register/vercode-icon.png")}
                />
                <Text>图形验证码</Text>
              </View>
              <View className="form-item-input">
                <Input
                  className="verCode-input"
                  onInput={this.handleImgCodeVal}
                  name="imgCodeVal"
                  type="text"
                  placeholder="请输入图片上的结果"
                />
                <Image onClick={this.CodeImgClick} src={codeImg} />
              </View>
            </View>
            <View className="form-item">
              <View className="form-item-title">
                <Image
                  className="item-icon"
                  src={require("../../static/register/vercode-icon.png")}
                />
                <Text>验证码</Text>
              </View>
              <View className="form-item-input">
                <Input
                  className="verCode-input"
                  maxLength="8"
                  name="verCode"
                  type="text"
                  placeholder="请输入您收到验证码"
                />
              </View>
              <View className="ver-code-btn">
                <Button disabled={isDisabled} onClick={this.handleVerCode}>
                  {btnTxt}
                </Button>
              </View>
            </View>
            <View className="form-item">
              <View className="form-item-title">
                <Image
                  className="item-icon"
                  src={require("../../static/register/password-icon.png")}
                />
                <Text>请输入新密码</Text>
              </View>
              <View className="form-item-input">
                <Input
                  name="password"
                  type="password"
                  placeholder="请设置您的密码"
                />
              </View>
            </View>
            <View className="form-item">
              <View className="form-item-title">
                <Image
                  className="item-icon"
                  src={require("../../static/register/password-icon.png")}
                />
                <Text>请输入确认密码</Text>
              </View>
              <View className="form-item-input">
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="请设置您的密码"
                />
              </View>
            </View>
            <View className="form-item-btn">
              <Button
                className="form-btn"
                disabled={isMyselfPhone}
                formType="submit"
              >
                完成
              </Button>
            </View>
          </Form>
        </View>
      </View>
    );
  }
}

export default ResetPassword;
