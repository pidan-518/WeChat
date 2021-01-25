import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Form } from '@tarojs/components';
import './realname.less';
import '../../common/globalstyle.less';
import servicePath from '../../common/util/api/apiUrl';
import { CarryTokenRequest, postRequest } from '../../common/util/request';

// 实名认证
class RealName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasDisabled: '',
      frontImg:
        'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/realname/front-img.png', // 身份证正面照
      backImg:
        'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/realname/back-img.png', // 身份证反面照
      otherFrontImg: '', // 传给后端的身份证正面照
      otherBackImg: '', // 传给后端的身份证反面照
    };
  }

  // 表单提交事件
  handleFormSubmit = (e) => {
    const { idName, idNum } = e.detail.value;
    const idNumReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (idName === '') {
      Taro.showToast({
        icon: 'none',
        duration: 1000,
        title: '请输入姓名',
      });
      return false;
    } else if (!idNumReg.test(idNum)) {
      Taro.showToast({
        icon: 'none',
        duration: 1000,
        title: '请输入正确的身份证号码',
      });
      return false;
    } else {
      Taro.showLoading({
        title: '正在实名认证，请稍候...',
        // title: "加载中...",
        mask: true,
        success: () => {
          this.realNameAuthAdd(e.detail.value);
        },
      });
      //
    }
  };

  // 立即返回按钮点击事件
  handleSwitchTab = (e) => {
    Taro.switchTab({
      url: '/pages/person/person',
    });
  };

  // 上传正面身份证照
  handleSubmitFront = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        let tempFilePaths = res.tempFilePaths;
        Taro.uploadFile({
          url: servicePath.upload,
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'Content-Type': 'multipart/form-data',
            'JWT-Token': Taro.getStorageSync('JWT-Token'),
          },
          formData: {
            type: '0',
          },
          success: (res) => {
            const data = JSON.parse(res.data);
            console.log(data);
            if (data.code === 0) {
              this.setState({
                frontImg: tempFilePaths[0],
                otherFrontImg: data.data,
              });
            }
          },
          fail: (err) => {
            console.log(err);
          },
        });
      },
    });
  };

  // 上传反面身份证照
  handleSubmitBack = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        let tempFilePaths = res.tempFilePaths;
        Taro.uploadFile({
          url: servicePath.upload,
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'Content-Type': 'multipart/form-data',
            'JWT-Token': Taro.getStorageSync('JWT-Token'),
          },
          formData: {
            type: '1',
          },
          success: (res) => {
            const data = JSON.parse(res.data);
            console.log(data);
            if (data.code === 0) {
              this.setState({
                backImg: tempFilePaths[0],
                otherBackImg: data.data,
              });
            }
          },
          fail: (err) => {
            console.log(err);
          },
        });
      },
    });
  };

  // 上传实名认证信息
  realNameAuthAdd(params) {
    CarryTokenRequest(servicePath.realNameAuthAdd, {
      realName: `${params.idName}`,
      idCard: `${params.idNum}`,
      frontImage: `${this.state.otherFrontImg}`,
      backImage: `${this.state.otherBackImg}`,
      handHoldImage: `${this.state.otherFrontImg}`,
    })
      .then((res) => {
        console.log('实名认证保存成功', res.data);
        Taro.hideLoading();
        if (res.data.code === 0) {
          Taro.showToast({
            title: '实名认证成功',
            duration: 1000,
            icon: 'none',
            success: () => {
              this.realNameAuthView();
              this.getUserInfo();
            },
          });
        } else {
          Taro.showToast({
            title: res.data.message,
            duration: 1000,
            icon: 'none',
          });
        }

        if (res.data.status === 403) {
          Taro.showModal({
            title: '提示',
            content: '您尚未登录，是否需要登录？',
            cancelColor: '#ff5d8c',
            confirmColor: '#ff5d8c',
            success: (res) => {
              if (res.confirm) {
                Taro.navigateTo({
                  url: '/pages/login/login',
                });
              }
            },
          });
        }
      })
      .catch((err) => {
        Taro.hideLoading();
        console.log('实名认证保存失败', err);
      });
  }

  // 获取用户信息
  getUserInfo() {
    CarryTokenRequest(servicePath.getUserInfo, '')
      .then((res) => {
        console.log('获取用户信息成功', res.data);
        if (res.data.code === 0) {
          res.data.data.mobile = res.data.data.mobile.replace(
            /^(\d{3})\d{4}(\d+)/,
            '$1****$2'
          );
          Taro.setStorage({
            key: 'userinfo',
            data: JSON.stringify(res.data.data),
          });
        }
      })
      .catch((err) => {
        console.log('获取用户信息失败', err);
      });
  }

  // 查看实名认证信息
  realNameAuthView() {
    CarryTokenRequest(servicePath.realNameAuthView, '')
      .then((res) => {
        console.log('查看实名认证成功', res.data);
        if (res.data.code === 0) {
          if (res.data.data) {
            this.setState({
              idCardData: res.data.data,
              hasDisabled: res.data.data.realStatus === 0 ? true : false,
            });
          }
        }
      })
      .catch((err) => {
        console.log('查看实名认证失败', err);
      });
  }

  componentWillMount() {
    this.realNameAuthView();
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  config = {
    navigationBarTitleText: '实名认证',
    usingComponents: {},
  };

  render() {
    const { hasDisabled, frontImg, backImg } = this.state;

    return (
      <View>
        <View id="realname" style={{ display: hasDisabled ? 'none' : 'block' }}>
          <View className="realname-title">
            <Text>身份信息</Text>
            <Text className="title-detail">
              请确保身份证信息真实有效，否则无法通过审核
            </Text>
          </View>
          <View className="realname-form">
            <Form onSubmit={this.handleFormSubmit}>
              <View className="form-item">
                <View className="form-item-label">您的姓名</View>
                <Input
                  className="form-item-value"
                  placeholder="请填写身份证上的真实姓名"
                  name="idName"
                />
              </View>
              <View className="form-item">
                <View className="form-item-label">您的身份证号</View>
                <Input
                  className="form-item-value"
                  placeholder="请填写身份证号码"
                  name="idNum"
                />
              </View>
              <View className="realname-btn">
                <Button formType="submit">提交上传</Button>
              </View>
            </Form>
          </View>
          {/* <View className="id-warp">
            <View className="id-warp-title">
              <Text>身份证照片</Text>
              <Text className="title-detail">上传身份证正反面照片让通关更便捷</Text>
            </View>
            <View className="front-warp" onClick={this.handleSubmitFront}>
              <Image src={frontImg} />
            </View>
            <View className="back-warp" onClick={this.handleSubmitBack}>
              <Image src={backImg} />
            </View>
          </View> */}
        </View>
        <View
          className="real-success-box"
          style={{ display: hasDisabled ? 'block' : 'none' }}
        >
          <View className="success-box">
            <Image
              src={require('../../static/register/submit-icon.png')}
              className="success-icon"
            />
            <Text className="success-txt">实名成功</Text>
          </View>
          <View className="success-btn" onClick={this.handleSwitchTab}>
            立即返回
          </View>
        </View>
      </View>
    );
  }
}

export default RealName;
