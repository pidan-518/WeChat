import Taro, { Component } from '@tarojs/taro';
import { View, Text, Input , Image, Button, Form } from '@tarojs/components';
import ServicePath  from '../../common/util/api/apiUrl';
import { CarryTokenRequest, postRequest } from '../../common/util/request';
import '../../common/globalstyle.less';
import './bindwechat.less';

export default class BindWeChat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      code: '', //用户code
      openId: 0, //用户openId
      unionId: 0, //用户unionId
      imgCodeUrl: '', //图形验证码图片
      phone: '', //填写手机号
      imgCode: '', //填写图形码
      phoneCode: 0, //填写手机验证码
      sendText: '获取验证码', //按钮文字
      allowSendCode: true, //是否允许获取验证码（是否冷却中）
      sendTiming: 0, //获取倒计时
      nickName: '', //用户昵称
      headPic: 0, //头像图片地址
      sex: 0, //性别  1：男 2：女 3：其他
      encryptedData: 0, //用户信息加密数据
      iv: 0, //加密算法的初始向量
    }

  }

  // 综合获取openId、unionId,成功后获取一次图形验证码
  getOpenId = () => {
    // 使用code获取openId、unionId
    const getWechatJsAppOpenId = (code) => {
      let openId = '';
      let unionId = '';
      const postData = {
        code: code,
        encryptedData: this.state.encryptedData,
        iv: this.state.iv
      };
      CarryTokenRequest(ServicePath.getWechatJsAppOpenId, postData)
        .then(res => {
          if (res.data.code === 0) {
            openId = res.data.data.openId;
            unionId = res.data.data.unionId
            Taro.setStorage({
              key: 'openId',
              data: openId,
            });
            Taro.setStorage({
              key: 'unionId',
              data: unionId,
            });
            this.setState({openId, unionId}, () => {
              this.getWechatBindCode(unionId);
            })
          }
        })
    }
    let unionId = Taro.getStorageSync('unionId');
    if (unionId) {
      this.setState({ unionId }, () => {
        this.getWechatBindCode(unionId);
      })
    } else {
      const thisTansit = this
      Taro.login({
        success: function (res) {
          if (res.code) {
            thisTansit.setState({code: res.code});
            getWechatJsAppOpenId(res.code);
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }
  }

  //获取图形验证码
  getWechatBindCode = () => {
    if (this.state.unionId) {
      const postData = {
        unionId: this.state.unionId
      };
      CarryTokenRequest(ServicePath.wechatBindCode, postData)
        .then(res => {
          if (res.data.code === 0) {
            this.setState({
              imgCodeUrl: res.data.data.img
            })
          }
        })
    }
  }

  //填写手机号事件
  handleInputPhone = (e) => {
    this.setState({
      phone: e.target.value
    })
  }

  //填写图形验证码事件
  handleInputImgCode = (e) => {
    this.setState({
      imgCode: e.target.value
    })
  }

  //发送绑定微信短信验证码
  sendBindSmsCode = (phone, imgCode) => {
    const postData = {
      mobile: phone,
      code: imgCode,
      unionId: this.state.unionId,
      // openId: this.state.openId,
    };
    CarryTokenRequest(ServicePath.sendBindSmsCode, postData)
      .then(res => {
        if (res.data.code === 0) {
          this.setState({
            sendText: `已发送(60s)`,
            allowSendCode: false,
            sendTiming: 60,
          }, this.sendCodeTiming())
        } else {
          Taro.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      })
  }

  //获取验证码倒计时
  sendCodeTiming = () => {
    this.sendTiming = setInterval(() => {
      this.setState({
        sendTiming: this.state.sendTiming - 1,
        sendText: `已发送(${this.state.sendTiming}s)`
      });
      if (this.state.sendTiming === 1) {
        clearInterval(this.sendTiming);
        setTimeout(() => {
          this.setState({
            sendText: '获取验证码',
            allowSendCode: true,
          })
        }, 1000);
      }
    }, 1000);
  }

  //获取短信验证码事件
  handleSmsCode = () => {
    if (this.state.phone === '') {
      Taro.showToast({
        title: "请输入手机号",
        duration: 2000,
        icon: 'none'
      });
    } else if (this.state.imgCode === '') {
      Taro.showToast({
        title: "请输入图形验证码",
        duration: 2000,
        icon: 'none'
      });
    } else {
      this.sendBindSmsCode(this.state.phone, this.state.imgCode)
    }
  }

  //提交验证事件
  handleSubmit = (e) => {
    const phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[0-9])\d{8}$|^(5|6|8|9)\d{7}$/;
    const value = e.detail.value;
    if (value.phone === '') {
      Taro.showToast({
        title: "请输入手机号",
        duration: 2000,
        icon: 'none'
      });
      return false;
    } else if (!phoneReg.test(value.phone)) {
      /* console.log(phoneReg.test(value.phone)); */
      Taro.showToast({
        title: '请输入正确的手机号',
        duration: 2000,
        icon: "none"
      });
      return false;
    } else if (value.phoneCode === '') {
      Taro.showToast({
        title: "请输入手机验证码",
        duration: 2000,
        icon: 'none'
      });
      return false;
    } else {
    const postData = {
      mobile: value.phone,
      smsCode: value.phoneCode,
      unionId: this.state.unionId,
      nickName: this.state.nickName,
      headPic: this.state.headPic, 
      sex: this.state.sex, 
    };
    this.bindWeChat(postData);
    }
  }

  //绑定微信号
  bindWeChat = (postData) => {
    const loginByWeChat = this.loginByWeChat
    CarryTokenRequest(ServicePath.bindWechat, postData)
      .then(res => {
        if (res.data.code === 0) {
          Taro.showToast({
            title: '恭喜绑定成功,即将自动登录跳转',
            // title: '绑定成功,返回登录页后请重新点击微信登录',
            icon: 'none',
            // duration: 3000,
            complete() {
              setTimeout(() => {
                loginByWeChat()
              }, 3000);
            }
          });
        } else {
          Taro.showToast({
            title: res.data.msg,
            duration: 2000,
            icon: 'none'
          })
        }
      })
  }

  //获取用户信息
  getWeChatUserInfo = () => {
    const setState = this.setState.bind(this);
    const t = this;
    Taro.getUserInfo({
      success: function(res) {
        setState({
          nickName: res.userInfo.nickName,
          headPic: res.userInfo.avatarUrl,
          sex: res.userInfo.gender,
          encryptedData: res.encryptedData,
          iv: res.iv,
        }, () => {
          t.getOpenId();
          t.getWechatBindCode();
        })
      }
    })
  }

  //微信登录
  loginByWeChat = () => {
    //登录
    const login = (code) => {
      const postData = {
        code: code
      };
      postRequest(ServicePath.wechatLogin, postData)
        .then(res => {
          if (res.data.code === 0) {
            Taro.setStorage({
              key: 'JWT-Token',
              data: res.header["JWT-Token"],
              success: () => {
                this.getUserInfo();
                this.getMyRecommondCode();
                this.updateRecommendCode();
                Taro.showToast({
                  title: "登录成功",
                  duration: 1500,
                  icon: 'none',
                  complete() {
                    setTimeout(() => {
                      Taro.navigateBack({
                        delta: 2,
                        fail: err => {
                          Taro.switchTab({
                            url: "../index/index"
                          })
                        }
                      });
                    }, 1500);
                  }
                })
              }
            });
          } else {
            Taro.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        })
    }
    Taro.login({
      success: function (res) {
        if (res.code) {
          login(res.code);
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }

  // 获取用户信息
  getUserInfo() {
    CarryTokenRequest(ServicePath.getUserInfo, "")
      .then(res => {
        console.log("获取用户信息成功", res.data);
        if (res.data.code === 0) {
          res.data.data.mobile = res.data.data.mobile.replace(
            /^(\d{3})\d{4}(\d+)/,
            "$1****$2"
          );
          Taro.setStorage({
            key: 'userinfo',
            data: JSON.stringify(res.data.data),
          });
          Taro.setStorage({
            key: 'accid',
            data: res.data.data.accid, //IM帐号
          });
          Taro.setStorage({
            key: 'netToken',
            data: res.data.data.netToken, //IMtoken
          });
        }
      })
      .catch(err => {
        console.log("获取用户信息失败", err);
      })
  }

  //获取我的推荐码
  getMyRecommondCode = () => {
    CarryTokenRequest(ServicePath.getMyRecommondCode)
      .then(res => {
        if (res.data.code === 0) {
          Taro.setStorage({
            key: 'shareRecommend',
            data: res.data.data
          })
        }
      })
  }

  //更新绑定推荐码
  updateRecommendCode = () => {
    const registerRecommend = Taro.getStorageSync('registerRecommend')
    const recommendTime = Taro.getStorageSync('recommendTime')
    const postData = {
      recommend: registerRecommend,
      recommendTime
    }
    CarryTokenRequest(ServicePath.updateRecommendCode, postData)
  }

  //已登录时自动填写手机号
  getPhone = () => {
    Taro.request({
      url: ServicePath.getUserInfo,
      method: 'POST',
      data: {},
      header: {
        'Content-Type': 'application/json; charset=utf-8',
        'JWT-Token': Taro.getStorageSync('JWT-Token'),
      },
      success: (res) => {
        if (res.data.code === 0) {
          const phone = res.data.data.mobile
          this.setState({phone})
        }
      }
    })
  }

  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: '绑定微信'
    })
    this.getWeChatUserInfo()
    this.getPhone()
  }


  render() {
    const { imgCodeUrl, sendText, allowSendCode, phone } = this.state;
    return(
      <View className="bindWeChat">
        <Text className="title">请填写以下验证信息</Text>
        <Form onSubmit={this.handleSubmit}>
          <View className="item_list">
            <View className="item phone">
              <Text className="item_desc">手机号：</Text>
              <Input className="value" name="phone" placeholder='请输入手机号' onInput={this.handleInputPhone} value={phone} />
            </View>
            <View className="item imgCode">
              <Text className="item_desc">验证码：</Text>
              <Input className="value" name="imgCode" placeholder='请输入图形验证码' onInput={this.handleInputImgCode} />
              <Image src={imgCodeUrl} onClick={this.getWechatBindCode} />
            </View>
            <View className="item phoneCode">
              <Text className="item_desc">手机验证码：</Text>
              <Input className={`value ${allowSendCode===false?'disable':''}`} name="phoneCode" placeholder='请输入手机验证码' />
              <Button 
                className={allowSendCode===false?'disable':''} 
                onClick={this.handleSmsCode}
                disabled={allowSendCode===true?'':'disabled'}
              >
                {sendText}
              </Button>
            </View>
          </View>
          <Button formType="submit" className="submit">绑定微信</Button>
        </Form>
      </View>
    )
  }
}