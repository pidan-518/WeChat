import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import './person.less';
import '../../common/globalstyle.less';
import servicePath from '../../common/util/api/apiUrl';
import { CarryTokenRequest } from '../../common/util/request';

class Person extends Component {
  state = {
    guessList: [], // 猜你喜欢列表
    userInfo: '', // 用户信息
    headPic: '', // 用户头像
  };

  handleUserNameClick = () => {
    Taro.navigateTo({
      url: '/pages/myinfo/myinfo',
    });
  };

  // 消息模块点击事件
  handleAdminItemClick = (url) => {
    Taro.navigateTo({ url });
  };

  // cxz 基本信息模块点击事件
  handleNavigateTo = (item) => {
    if (item.txt === '联系客服') {
      // Taro.showModal({
      //   title: '提示',
      //   content: '系统升级，如有疑问请联系客服电话',
      //   showCancel: false,
      //   confirmText: '确定',
      //   confirmColor: '#ff5d8c'
      // });
      this.handeImService();
      return;
    }
    const url = item.url;
    Taro.navigateTo({ url });
  };

  // 获取用户信息
  getUserInfo() {
    Taro.request({
      url: servicePath.getUserInfo,
      method: 'POST',
      data: {},
      header: {
        'Content-Type': 'application/json; charset=utf-8',
        'JWT-Token': Taro.getStorageSync('JWT-Token'),
      },
      success: (res) => {
        console.log('获取个人信息成功', res);
        if (res.statusCode === 403) {
          Taro.removeStorageSync('userinfo');
          Taro.removeStorageSync('JWT-Token');
          this.setState({
            userInfo: '',
          });
        } else if (res.data.code === 0) {
          const user = Taro.getStorageSync('userinfo');
          if (user !== '') {
            this.setState({
              userInfo: JSON.parse(user),
              headPic: JSON.parse(user).headPic,
            });
          } else {
            this.setState({
              userInfo: '',
            });
          }
        }
      },
    });
  }

  // 查询推荐喜欢列表
  /* getSimilarProductList(categoryComId) {
    const postData = {
      current: "1",
      len: "5",
      categoryComId: categoryComId
    };
    postRequest(servicePath.similarProductList, postData)
      .then((res) => {
        console.log("推荐产品返回数据成功", res);
        if (res.data.code === 0) {
          this.setState({
            guessList: res.data.data.records,
          });
        }
      })
      .catch((err) => {
        console.log("返回数据失败", err);
      });
  } */

  //联系客服
  handeImService = () => {
    CarryTokenRequest(servicePath.getCustomerServiceAccid).then((res) => {
      if (res.data.code === 0) {
        const rdd = res.data.data;
        if (rdd) {
          Taro.navigateTo({
            url: `../../IM/partials/chating/chating?chatTo=${rdd}`,
          });
        } else {
          Taro.showModal({
            title: '提示',
            content: '抱歉，当前暂无客服在线',
            showCancel: false,
          });
        }
      }
    });
  };

  componentWillMount() {
    /* this.getSimilarProductList(Taro.getStorageSync('categoryBusId')); */
  }

  componentDidMount() {}

  componentDidShow() {
    this.getUserInfo();
  }

  componentDidHide() {}

  config = {
    navigationStyle: 'custom',
    usingComponents: {},
  };

  render() {
    // 消息管理模块icon
    const adminIcon = [
      {
        iconImg: require('../../static/personcenter/message-icon.png'),
        txt: '消息提醒',
        url: '/pages/messagecenter/messagecenter',
      },
      {
        iconImg: require('../../static/personcenter/order-icon.png'),
        txt: '订单管理',
        url: '/pages/myorder/myorder',
      },
      {
        iconImg: require('../../static/personcenter/comment-icon.png'),
        txt: '评价管理',
        url: '/pages/evaluate/evaluate',
      },
    ];
    // 基本信息模块icon
    const menuIcon = [
      {
        iconImg: require('../../static/personcenter/userinfo-icon.png'),
        txt: '基础信息',
        url: '/pages/myinfo/myinfo',
      },
      {
        iconImg: require('../../static/personcenter/follow-icon.png'),
        txt: '我的收藏',
        url: '/pages/favorite/favorite',
      },
      {
        iconImg: require('../../static/personcenter/integral-icon.png'),
        txt: '退货管理',
        url: '/pages/proreturn/proreturn',
      },
      {
        iconImg: require('../../static/personcenter/coupon-icon.png'),
        txt: '卡券中心',
        url: '/pages/certificate/certificate',
      },
      {
        iconImg: require('../../static/personcenter/location.png'),
        txt: '收货地址',
        url: '/pages/address/address',
      },
      {
        iconImg: require('../../static/personcenter/serve-icon.png'),
        txt: '联系客服',
        url: '',
      },
      {
        iconImg: require('../../static/personcenter/authen-icon.png'),
        txt: '实名认证',
        url: '/pages/realname/realname',
      },
      {
        iconImg: require('../../static/personcenter/iconmallfaq.png'),
        txt: '爱港猫FAQ',
        url: '/pages/agmfaq/agmfaq',
      },
    ];

    const { guessList, userInfo, headPic } = this.state;

    return (
      <View>
        <View
          id="person-head"
          style={{ paddingTop: Taro.$navBarMarginTop + 'px' }}
        >
          <View className="person-nav">我的</View>
        </View>
        <View id="user-info">
          {userInfo !== '' ? (
            <View>
              <View className="user-info-bg"></View>
              <View className="user-info-box">
                <Image src={headPic} />
                <View className="user-name" onClick={this.handleUserNameClick}>
                  <Text>
                    {userInfo.nickName !== null
                      ? userInfo.nickName
                      : userInfo.mobile}
                  </Text>
                  <Image
                    src={require('../../static/personcenter/setting-icon.png')}
                  />
                </View>
              </View>
            </View>
          ) : (
            <View className="login-btn">
              <Navigator url="/pages/login/login">
                <Button>登录 / 注册</Button>
              </Navigator>
            </View>
          )}
        </View>

        <View id="person">
          <View className="person-adminwrap">
            {adminIcon.map((item) => (
              <View
                className="adminItem"
                key={item.txt}
                onClick={this.handleAdminItemClick.bind(this, item.url)}
              >
                <Image src={item.iconImg} />
                <Text>{item.txt}</Text>
              </View>
            ))}
          </View>
          <View className="person-menu">
            {menuIcon.map((item) => (
              <View
                className="menu-item"
                key={item.txt}
                onClick={this.handleNavigateTo.bind(this, item)}
              >
                <View className="menu-label">
                  <Image src={item.iconImg} />
                  <Text>{item.txt}</Text>
                </View>
                <Image src={require('../../static/goodsdetails/right.png')} />
              </View>
            ))}
          </View>
        </View>
        {/* {
          guessList.length === 0 ? null :
            <View id="guess-wrap">
              <View className="guess-title">
                <Image src={require("../../static/home/guesslike.png")} />
              </View>
              <View className="guess-list">
                {
                  guessList.map(item => 
                    <Navigator key={item.id} url={`/pages/goodsdetails/goodsdetails?itemId=${item.itemId}`}>
                      <View className="list-item" >
                        <Image src={item.image} />
                        <View className="good-detail">
                          <Text className="good-name" 
                            style={{
                              display: '-webkit-box', 
                              '-webkit-box-orient': 'vertical',
                              '-webkit-line-clamp': 2,
                              overflow: 'hidden'
                            }}
                          >
                            {item.itemName}
                          </Text>
                          {
                            item.discountPrice !== null ? 
                            <View className="good-price">
                              <View className="good-discountPrice">￥ {item.discountPrice}</View>
                              <View className="good-price-txt">￥ {item.price}</View>
                            </View>
                            :
                            <View className="good-price">
                              <View className="good-discountPrice">
                                ￥ {item.discountPrice !== null ? item.discountPrice : item.price}
                              </View>
                            </View>
                          }
                        </View>
                      </View>
                    </Navigator>
                  )
                }
              </View>
            </View>
        } */}
      </View>
    );
  }
}

export default Person;
