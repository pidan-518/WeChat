import Taro, { Component } from '@tarojs/taro';
import { View, Navigator } from '@tarojs/components';
import TimeLimit from './components/TimeLimit/TimeLimit';
import './activity4.less';
import '../../common/globalstyle.less';
import DetaiLed from './components/DetaiLed/DetaiLed';
import servicePath from '../../common/util/api/apiUrl';
import { postRequest } from '../../common/util/request';

// 限时限购
class Activity4 extends Component {
  state = {
    goodsList: [], // 商品列表
    shopList: [
      {
        businessId: 40,
        customUrl: '/sasa/',
        logoPath:
          'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/shop/logo/1589798724892/1.png',
        name: 'Sasa莎莎代購店',
        shopId: 39,
      },
      {
        businessId: 42,
        customUrl: '/wanning/',
        logoPath:
          'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/shop/logo/1589852683403/萬寧1.png',
        name: '萬寧代購店',
        shopId: 41,
      },
      {
        businessId: 38,
        customUrl: '/dfs/',
        logoPath:
          'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/shop/logo/1589370226942/店铺logo.jpg',
        name: 'DFS代購店',
        shopId: 37,
      },
      {
        businessId: 39,
        customUrl: '/colourmax/',
        logoPath:
          'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/shop/logo/1589366325738/logo1.jpg',
        name: 'Colour Max代購店',
        shopId: 38,
      },
      {
        businessId: 43,
        logoPath:
          'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/shop/logo/1589893026490/1.png',
        name: '卓悅代購店',
        shopId: 42,
      },
      {
        businessId: 41,
        logoPath:
          'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/shop/logo/1589852060511/屈臣氏0.png',
        name: '屈臣氏代購店',
        shopId: 40,
      },
      {
        businessId: 47,
        logoPath:
          'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/shop/logo/1590398807740/babyHK.png',
        name: 'babyHK代購店',
        shopId: 46,
      },
      {
        businessId: 46,
        logoPath:
          'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/shop/logo/1590390511244/百佳.jfif',
        name: 'PARKnSHOP百佳代購店',
        shopId: 45,
      },
    ], // 店鋪列表
  };

  // 根据传入的商品号列表查询商品信息集合
  getItemInfoList() {
    const arr = [
      {
        itemNo: 'sp20200518100839',
      },
      {
        itemNo: 'sp20200518100841',
      },
      {
        itemNo: 'sp20200509100216',
      },
      {
        itemNo: 'sp20200509100233',
      },
      {
        itemNo: 'sp20200509100375',
      },
      {
        itemNo: 'sp20200807107663',
      },
      {
        itemNo: 'sp20200513100524',
      },
      {
        itemNo: 'sp20200514100648',
      },
      {
        itemNo: 'sp20200518100809',
      },
      {
        itemNo: 'sp20200618103949',
      },
      {
        itemNo: 'sp20200607103129',
      },
      {
        itemNo: 'sp20200601102224',
      },
      {
        itemNo: 'sp20200602102671',
      },
      {
        itemNo: 'sp20200602102827',
      },
      {
        itemNo: 'sp20200601102223',
      },
      {
        itemNo: 'sp20200602102607',
      },
      {
        itemNo: 'sp20200602102521',
      },
      {
        itemNo: 'sp20200602102666',
      },
      {
        itemNo: 'sp20200618104003',
      },
      {
        itemNo: 'sp20200602102610',
      },
      {
        itemNo: 'sp20200512100467',
      },
      {
        itemNo: 'sp20200601102272',
      },
      {
        itemNo: 'sp20200513100605',
      },
      {
        itemNo: 'sp20200513100603',
      },
      {
        itemNo: 'sp20200515100671',
      },
      {
        itemNo: 'sp20200525101126',
      },
      {
        itemNo: 'sp20200601102183',
      },
      {
        itemNo: 'sp20200525101073',
      },
      {
        itemNo: 'sp20200617103908',
      },
      {
        itemNo: 'sp20200525101072',
      },
      {
        itemNo: 'sp20200525101024',
      },
      {
        itemNo: 'sp20200519100860',
      },
      {
        itemNo: 'sp20200806107561',
      },
      {
        itemNo: 'sp20200514100640',
      },
      {
        itemNo: 'sp20200512100475',
      },
      {
        itemNo: 'sp20200512100482',
      },
      {
        itemNo: 'sp20200512100459',
      },
      {
        itemNo: 'sp20200518100799',
      },
      {
        itemNo: 'sp20200518100725',
      },
      {
        itemNo: 'sp20200616103792',
      },
      {
        itemNo: 'sp20200603102858',
      },
      {
        itemNo: 'sp20200601102254',
      },
      {
        itemNo: 'sp20200615103669',
      },
      {
        itemNo: 'sp20200615103672',
      },
      /* ,
      {
        "itemNo": "sp20200512100475"
      },
      {
        "itemNo": "sp20200512100482"
      },
      {
        "itemNo": "sp20200512100459"
      },
      {
        "itemNo": "sp20200512100443"
      },
      {
        "itemNo": "sp20200518100799"
      },
      {
        "itemNo": "sp20200519100859"
      },
      {
        "itemNo": "sp20200603102858"
      }, 
      {
        "itemNo": "sp20200601102254"
      },
      {
        "itemNo": "sp20200601102235"
      },
      {
        "itemNo": "sp20200520100865"
      } */
    ];
    postRequest(servicePath.itemInfoList, arr)
      .then((res) => {
        console.log('获取规定商品列表成功', res.data);
        if (res.data.code === 0) {
          this.setState({
            goodsList: res.data.data,
          });
        }
      })
      .catch((err) => {
        console.log('获取规定商品列表失敗', err);
      });
  }

  componentWillMount() {}

  componentDidMount() {
    this.getItemInfoList();
  }

  componentWillUnmount() {}

  componentDidShow() {}

  config = {
    navigationBarTitleText: '限时限购',
    usingComponents: {},
  };

  render() {
    const { goodsList, shopList } = this.state;
    return (
      <View id="activity">
        <View className="activity-banner">
          <Image src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity4-banner.png" />
        </View>
        {/* 热销爆款 */}
        <View className="time-limit">
          <View className="activity-title">
            <Image src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity4-title1.png" />
          </View>
          <TimeLimit
            LeftImage="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity4-4.png"
            backgroundColor="#FFF2F2"
            goodsList={goodsList.slice(0, 10)}
          />
          <TimeLimit
            LeftImage="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity4-1.png"
            backgroundColor="#FFE7EF"
            goodsList={goodsList.slice(20, 30)}
          />
          <TimeLimit
            LeftImage="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity4-3.png"
            backgroundColor="#FFD4D4"
            goodsList={goodsList.slice(10, 20)}
          />
        </View>
        {/* 猫选商家 */}
        <View className="shop-logo-wrap">
          <View className="activity-title">
            <Image src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity4-title2.png" />
          </View>
          <View className="shop-logo-list">
            {shopList.map((item) => (
              <Navigator
                className="shop-logo-img"
                url={`/pages/shophome/shophome?businessId=${item.businessId}`}
                key={item.businessId}
              >
                <Image src={item.logoPath} />
              </Navigator>
            ))}
          </View>
        </View>
        {/* 必购清单 */}
        <View className="detailed-wrap">
          <View className="activity-title">
            <Image src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity4-title3.png" />
          </View>
          <DetaiLed
            goodsInfo={goodsList[30]}
            MainImg="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity4-bigou1.png"
          />
          <DetaiLed
            goodsInfo={goodsList[31]}
            MainImg="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity4-bigou3.png"
          />
          <DetaiLed
            goodsInfo={goodsList[32]}
            MainImg="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity4-bigou2.png"
          />
          <DetaiLed
            goodsInfo={goodsList[33]}
            MainImg="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity4-bigou4.png"
          />
        </View>
        {/* 品牌特卖 */}
        <View className="barnd-spec">
          <View className="activity-title">
            <Image src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity4-title4.png" />
          </View>
          <View className="barnd-goods-list">
            {goodsList.slice(34).map((item) => (
              <View className="list-item" key={item.itemId}>
                <Navigator
                  url={`/pages/goodsdetails/goodsdetails?itemId=${item.itemId}`}
                >
                  <Image className="item-good-img" src={item.image} />
                  <View
                    className="item-good-name"
                    style={{
                      display: '-webkit-box',
                      '-webkit-box-orient': 'vertical',
                      '-webkit-line-clamp': 2,
                      overflow: 'hidden',
                    }}
                  >
                    {item.itemName}
                  </View>
                  {item.price === item.discountPrice ? (
                    <View className="good-price">
                      <View className="good-discountPrice">
                        ￥ {item.price}
                      </View>
                    </View>
                  ) : item.discountPrice !== null ? (
                    <View className="good-price">
                      <View className="good-discountPrice">
                        ￥ {item.discountPrice}
                      </View>
                      <View className="good-price-txt">￥ {item.price}</View>
                    </View>
                  ) : (
                    <View className="good-price">
                      <View className="good-discountPrice">
                        ￥ {item.price}
                      </View>
                    </View>
                  )}
                </Navigator>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }
}

export default Activity4;
