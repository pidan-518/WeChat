import Taro, { Component } from '@tarojs/taro'
import { View, Input, Form, Picker, Button, Icon } from '@tarojs/components'
import '../../common/globalstyle.less'
import './myinfo.less';
import servicePath from '../../common/util/api/apiUrl';
import { CarryTokenRequest } from '../../common/util/request';

class MyInfo extends Component {

  state = {
    headImg: '', // 头像
    otherHeadImg: '', // 传给后台的头像
    gender: ['男', '女'], // 性别选择器
    genderIndex: 0, // 性别选择器选择后的数据
    /* livePlace: ['广东省', '深圳市', '南山区'], // 现居住地展示数据
    bornPlace: ['广东省', '深圳市', '南山区'], // 身份证地区展示数据 */
    myInfo: {}, // 我的信息数据
    unionId: null, //绑定微信标识
  }

  // 头像点击事件
  ChangeAvatar = e => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: res => {
        let tempFilePaths = res.tempFilePaths;
        Taro.uploadFile({
          url: servicePath.uploadUserHeadImage,
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",
            'JWT-Token': Taro.getStorageSync("JWT-Token")
          },
          success: res => {
            const data = JSON.parse(res.data);
            if (data.code === 0) {
              this.setState({
                headImg: tempFilePaths[0],
                otherHeadImg: data.data
              })
            }
          },
          fail: err => {
            console.log(err);
          }
        })
      }
    })
  }

  // 性别选择器事件
  handleGenderSelector = (e) => {
    this.setState({
      genderIndex: Number(e.detail.value)
    })
  }

  // 保存信息提交事件
  handleSubmitMyinfo = (e) => {
    const { nickName } = e.detail.value;
    let p = /\s+/g;
    if (nickName === '') {
      Taro.showToast({
        title: '昵称不能为空',
        duration: 1500,
      });
    }  else if (p.test(nickName)) {
      Taro.showToast({
        title: '昵称不能为空',
        duration: 1500,
      });
    } else {
      Taro.showLoading({
        title: '加载中...',
        success: () => {
          this.getSaveBaseInfo(e.detail.value);
        }
      });
    }
  }

  // 退出登录按钮点击事件
  handleSignOut = () => {
    CarryTokenRequest(servicePath.Logout)
      .then(res => {
        console.log('退出成功', res.data);
        if (res.data.code === 0) {
          Taro.removeStorageSync('userinfo');
          Taro.removeStorageSync('JWT-Token');
          Taro.showToast({
            title: '退出登录成功',
            icon: 'none',
            duration: 1500,
            success: (res) => {
              setTimeout(() => {
                Taro.navigateBack({
                  delta: 1
                });
              }, 1500);
            }
          })
        }
      })
      .catch(err => {
        console.log('退出失败', err);
      })
  }

  // 更新个人信息
  getSaveBaseInfo(params) {
    const postData = {
      // liveAddressPath: params.livePlace.join(':'),
      // bornAddressPath: params.bornPlace.join(':'),
      sex: params.gender === 0 ? 1 : 2,
      headPic: this.state.otherHeadImg,
      nickName: `${params.nickName !== "" ? params.nickName : this.state.myInfo.nickName}`,
    };
    CarryTokenRequest(servicePath.saveBaseInfo, postData)
      .then((res) => {
        console.log("保存个人信息成功", res.data);
        Taro.hideLoading();
        if (res.data.code === 0) {
          const getUser = JSON.parse(Taro.getStorageSync('userinfo'));
          getUser.nickName = params.nickName;
          getUser.sex = params.gender === 0 ? 1 : 2;
          getUser.headPic = `${this.state.otherHeadImg}?${(new Date()).valueOf()}`;
          Taro.setStorageSync('userinfo', JSON.stringify(getUser));
          Taro.showToast({
            title: '保存个人信息成功',
            icon: 'none',
            duration: 1000,
            success: () => {
              setTimeout(() => {
                Taro.navigateBack({
                  delta: 1
                });
              }, 1500)
            }
          });
        } else {
          Taro.showToast({
            title: '保存个人信息失败',
            icon: 'none',
            duration: 1000,
          });
        }
      })
      .catch((err) => {
        Taro.hideLoading();
        Taro.showToast({
          title: '保存个人信息失败',
          icon: 'none',
          duration: 1000,
        });
        console.log("更新个人信息失败", err);
      });
  }

  //绑定微信
  bindWeChat = () => {
    Taro.navigateTo({
      url: '../bindwechat/bindwechat'
    })
  }

  //绑定微信
  unBindWeChat = () => {
    Taro.navigateTo({
      url: '../unbindwechat/unbindwechat'
    })
  }

  //获取unionId
  getOpenId = () => {
    CarryTokenRequest(servicePath.getUserInfo)
      .then(res => {
        if (res.data.code === 0) {
          this.setState({
            unionId: res.data.data.unionId
          })
        } else {
          Taro.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false
          })
        }
      })
  }

  componentWillMount () { }

  componentDidMount () {
  }

  componentDidShow () {
    this.getOpenId();

    let getUser = Taro.getStorageSync('userinfo');
    if (getUser !== '') {
      getUser = JSON.parse(getUser);
      let {
        headPic,
        sex
      } = getUser;
      let genderIndex = sex === 1 ? 0 : 1;
      this.setState({
        myInfo:  getUser,
        genderIndex,
        // livePlace,
        // bornPlace,
        headImg: headPic,
        otherHeadImg: headPic
      });
    }
  }


  config = {
    navigationBarTitleText: '我的信息',
    usingComponents: {}
  }

  render () {

    const {
      gender,
      genderIndex,
      headImg,
      myInfo,
      unionId,
    } = this.state;

    return (
      <View>
        <View id="my-info">
          <View id="my-head" onClick={this.ChangeAvatar}>
            <Image className="my-head-img" src={headImg} />
            <View className="my-head-txt">更换头像</View>
          </View>
          <View id="my-info-form">
            <Form onSubmit={this.handleSubmitMyinfo}>
              <View className="my-info-item">
                <View className="item-label">昵称</View>
                <View className="item-value">
                  <Input name="nickName" value={myInfo.nickName !== null ? myInfo.nickName : myInfo.mobile}  />
                </View>
              </View>
              <View className="my-info-item">
                <View className="item-label">真实姓名</View>
                <View className="item-value">
                  <Input name="realName" disabled={true} value={myInfo.realName} />
                </View>
              </View>
              <View className="my-info-item">
                <View className="item-label">性别</View>
                <View className="item-value">
                  <Picker name="gender" range={gender} value={genderIndex} mode="selector" onChange={this.handleGenderSelector}>
                    <View className="gender">{gender[genderIndex]}</View>
                  </Picker>
                </View>
              </View>
              <Button
                className="bindWeChat my-info-item"
                style={{display: unionId===null?'':'none'}}
                onClick={this.bindWeChat}
              >
                绑定微信号
              </Button>
              <Button
                className="unbindWeChat my-info-item"
                style={{display: unionId!==null?'':'none'}}
                onClick={this.unBindWeChat}
              >
                解除绑定微信号
              </Button>
              <View className="form-submit-btn">
                <Button formType="submit">保存信息</Button>
                <View className="operation">
                  <Navigator url='/pages/resetpassword/resetpassword'>
                    <Button className="modify-password">修改密码</Button>
                  </Navigator>
                  <Button className="sign-out-btn" onClick={this.handleSignOut}>退出登录</Button>
                </View>
              </View>
            </Form>
          </View>
        </View>
      </View>
    )
  }
}

export default MyInfo;
