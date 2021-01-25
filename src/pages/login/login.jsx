import Taro, { Component } from "@tarojs/taro";
import {
  View,
  Image,
  Form,
  Input,
  Button,
  Navigator,
} from "@tarojs/components";
import "./login.less";
import "../../common/globalstyle.less";
import servicePath from "../../common/util/api/apiUrl";
import { postRequest, CarryTokenRequest } from "../../common/util/request";

class Login extends Component {
  state = {
    openId: 0, //用户openId
  };

  // 登录表单提交事件
  handleLoginSubmit = (e) => {
    const phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[0-9])\d{8}$|^(5|6|8|9)\d{7}$/;
    if (e.detail.value.phone === "") {
      Taro.showToast({
        title: "请输入手机号",
        duration: 1500,
        icon: "none",
      });
      return false;
    } else if (!phoneReg.test(e.detail.value.phone)) {
      Taro.showToast({
        title: "请输入正确的手机号",
        duration: 1500,
        icon: "none",
      });
      return false;
    } else if (e.detail.value.password === "") {
      Taro.showToast({
        title: "请输入密码",
        duration: 1500,
        icon: "none",
      });
      return false;
    } else {
      const postData = {
        loginName: `${e.detail.value.phone}`,
        password: `${e.detail.value.password}`,
        source: "smallRoutine",
      };
      this.getLogin(postData);
    }
  };

  // 登录接口
  getLogin(params) {
    Taro.request({
      url: servicePath.Login,
      data: params,
      method: "POST",
      success: (res) => {
        console.log("登录返回数据成功", res.data);
        if (res.data.code === 0) {
          Taro.setStorage({
            key: "JWT-Token",
            data: res.header["JWT-Token"],
            success: () => {
              this.getUserInfo();
              this.getMyRecommondCode();
              this.updateRecommendCode();
              Taro.showToast({
                title: "登录成功",
                duration: 1500,
                icon: "success",
                success: (res) => {
                  setTimeout(() => {
                    Taro.navigateBack({
                      delta: 1,
                      success: (res) => {},
                      fail: (err) => {
                        if (res.errMsg.indexOf("f") === -1) {
                          Taro.switchTab({
                            url: "../index/index",
                          });
                        }
                      },
                    });
                  }, 1500);
                },
              });
            },
          });
        } else {
          Taro.showToast({
            title: res.data.msg,
            duration: 1500,
            icon: "none",
          });
        }
      },
      fail: (err) => {
        console.log("登录接口异常", err);
      },
    });
  }

  // 获取用户信息
  getUserInfo() {
    CarryTokenRequest(servicePath.getUserInfo, "")
      .then((res) => {
        console.log("获取用户信息成功", res.data);
        if (res.data.code === 0) {
          res.data.data.mobile = res.data.data.mobile.replace(
            /^(\d{3})\d{4}(\d+)/,
            "$1****$2"
          );
          Taro.setStorage({
            key: "userinfo",
            data: JSON.stringify(res.data.data),
          });
          Taro.setStorage({
            key: "accid",
            data: res.data.data.accid, //IM帐号
          });
          Taro.setStorage({
            key: "netToken",
            data: res.data.data.netToken, //IMtoken
          });
        }
      })
      .catch((err) => {
        console.log("获取用户信息失败", err);
      });
  }

  //获取我的推荐码
  getMyRecommondCode = () => {
    CarryTokenRequest(servicePath.getMyRecommondCode).then((res) => {
      if (res.data.code === 0) {
        Taro.setStorage({
          key: "shareRecommend",
          data: res.data.data,
        });
      }
    });
  };

  //更新绑定推荐码
  updateRecommendCode = () => {
    const registerRecommend = Taro.getStorageSync("registerRecommend");
    const recommendTime = Taro.getStorageSync("recommendTime");
    const postData = {
      recommend: registerRecommend,
      recommendTime,
    };
    CarryTokenRequest(servicePath.updateRecommendCode, postData).then((res) => {
      if (res.data.code === 0) {
        Taro.removeStorageSync("registerRecommend");
        Taro.removeStorageSync("recommendTime");
      }
    });
  };

  //综合获取openId
  getOpenId = () => {
    //使用code获取openId
    const getWechatJsAppOpenId = (code) => {
      let openId = 0;
      const postData = {
        code: code,
      };
      CarryTokenRequest(ServicePath.getWechatJsAppOpenId, postData).then(
        (res) => {
          if (res.data.code === 0) {
            openId = res.data.data;
            this.setState({ openId });
          }
        }
      );
    };

    let openId = Taro.getStorageSync("openId");
    if (openId) {
      this.setState({ openId });
    } else {
      Taro.login({
        success: function(res) {
          if (res.code) {
            getWechatJsAppOpenId(res.code);
          } else {
            console.log("登录失败！" + res.errMsg);
          }
        },
      });
    }
  };

  //允许获取手机号回调 （暂无权限）- linshi
  getPhoneNumber = (e) => {};

  //微信登录
  loginByWeChat = () => {
    //登录
    const login = (code) => {
      const postData = {
        code: code,
      };
      postRequest(servicePath.wechatLogin, postData).then((res) => {
        if (res.data.code === 0) {
          Taro.setStorage({
            key: "JWT-Token",
            data: res.header["JWT-Token"],
            success: () => {
              this.getUserInfo();
              this.getMyRecommondCode();
              this.updateRecommendCode();
              Taro.showToast({
                title: "登录成功",
                duration: 1500,
                icon: "none",
                complete() {
                  setTimeout(() => {
                    Taro.navigateBack({
                      delta: 1,
                      fail: (err) => {
                        Taro.switchTab({
                          url: "../index/index",
                        });
                      },
                    });
                  }, 1500);
                },
              });
            },
          });
        } else {
          Taro.navigateTo({
            url: "../bindwechat/bindwechat",
          });
        }
      });
    };

    Taro.login({
      success: function(res) {
        if (res.code) {
          login(res.code);
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      },
    });
  };

  componentDidMount() {}

  config = {
    navigationBarTitleText: "登录",
  };

  render() {
    return (
      <View id="login">
        <View className="login-bg">
          <Image src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/login/register-bg.png" />
        </View>
        <View className="login-form">
          <Form onSubmit={this.handleLoginSubmit}>
            <View className="form-item">
              <Image
                className="form-item-icon"
                src={require("../../static/login/account-num.png")}
              />
              <View className="form-item-input">
                <Input name="phone" type="text" placeholder="请输入手机号码" />
              </View>
            </View>
            <View className="form-item">
              <Image
                className="form-item-icon"
                src={require("../../static/login/password.png")}
              />
              <View className="form-item-input">
                <Input
                  name="password"
                  type="password"
                  placeholder="请输入密码"
                />
              </View>
            </View>
            <View className="form-submit-btn">
              <Button formType="submit">登录</Button>
              <View className="login-links">
                <Navigator url="/pages/register/register">注册</Navigator>
                <Navigator url="/pages/resetpassword/resetpassword">
                  忘记密码
                </Navigator>
              </View>
            </View>
          </Form>
        </View>
        <Button
          className="wechat-icon"
          /* openType="getPhoneNumber" bindgetphonenumber={this.getPhoneNumber} */

          // onClick={this.loginByWeChat}
          openType="getUserInfo"
          onGetUserInfo={this.loginByWeChat}
        >
          <Image src={require("../../static/login/wechat.png")} />
          <View>微信快速登录</View>
        </Button>
      </View>
    );
  }
}

export default Login;
