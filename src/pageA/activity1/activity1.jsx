import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Swiper, SwiperItem } from '@tarojs/components';
import './activity1.less';
import '../../common/globalstyle.less';
import { AtTabs, AtTabsPane } from 'taro-ui';
import 'taro-ui/dist/style/components/tabs.scss';
import { postRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';
/* import servicePath from '../../common/util/api/apiUrl';
import { CarryTokenRequest } from '../../common/util/request'; */

// 品牌代购
class Activity1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentTop: '',
      tabList: [], // tabs数据
      tabsCurrent: 0, // tabs当前引索
      bannerList: [], // banner数据
      boutiqueListOne: [], // 今日精品
      boutiqueListTwo: [], // 今日精品
      boutiqueListThree: [], // 今日精品
      goodsList: [], // 商品列表
    };
  }

  // tabs点击事件
  handleTabsClick = (tabsCurrent) => {
    for (let i = 0; i < this.state.tabList.length; i++) {
      if (i === tabsCurrent) {
        this.setState({ tabsCurrent }, () => {
          this.getShopIndexList(this.state.tabList[i].businessId);
          this.getSingleShopIndexList(this.state.tabList[i].businessId);
        });
      }
    }
  };

  // 导航栏左边图标点击事件
  handlegoBack = () => {
    Taro.navigateBack({
      delta: 1,
    });
  };

  // 获取店铺列表
  getShopGetListByKey = () => {
    postRequest(servicePath.getShopGetListByKey, {
      shopKey: 'WECHAT_APPLET',
    })
      .then((res) => {
        console.log('获取店铺列表成功', res.data);
        if (res.data.code === 0) {
          this.setState(
            {
              tabList: JSON.parse(
                JSON.stringify(res.data.data).replace(/name/g, 'title')
              ),
            },
            () => {
              this.getShopIndexList(res.data.data[0].businessId);
              this.getSingleShopIndexList(res.data.data[0].businessId);
            }
          );
        }
      })
      .catch((err) => {
        console.log('获取店铺列表失败', err);
      });
  };

  // 获取店铺商品
  getShopIndexList(businessId) {
    postRequest(servicePath.getShopIndexList, {
      businessId: businessId,
    })
      .then((res) => {
        console.log('店铺首页信息返回成功', res.data);
        if (res.data.code === 0) {
          this.setState(
            {
              bannerList: res.data.data.bannerList,
              goodsList: [
                ...res.data.data.hotList,
                ...res.data.data.itemList,
                ...res.data.data.newList,
              ],
            },
            () => {
              console.log(this.state.goodsList);
            }
          );
        }
      })
      .catch((err) => {
        console.log('店铺首页返回数据失败', err);
      });
  }

  // 根据类型获取店铺列表信息
  getSingleShopIndexList(businessId) {
    postRequest(servicePath.getSingleShopIndexList, {
      businessId: businessId,
      type: 4,
      len: 12,
    })
      .then((res) => {
        console.log('类型商品返回成功', res.data);
        if (res.data.code === 0) {
          this.setState({
            boutiqueListOne: res.data.data.resultList.slice(0, 4),
            boutiqueListTwo: res.data.data.resultList.slice(4, 8),
            boutiqueListThree: res.data.data.resultList.slice(8),
          });
        }
      })
      .catch((err) => {
        console.log('类型商品返回失败', err);
      });
  }

  componentWillMount() {
    this.getShopGetListByKey();
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {
    Taro.createSelectorQuery()
      .select('#activity-head')
      .boundingClientRect((rect) => {
        this.setState({
          contentTop: rect.height,
        });
      })
      .exec();
  }

  config = {
    navigationBarTitleText: '',
    usingComponents: {},
    navigationStyle: 'custom',
  };

  render() {
    const {
      contentTop,
      tabsCurrent,
      tabList,
      bannerList,
      boutiqueListOne,
      boutiqueListTwo,
      boutiqueListThree,
      goodsList,
    } = this.state;
    return (
      <View>
        <View id="activity-bg">
          <View
            id="activity-head"
            style={{ paddingTop: `${Taro.$navBarMarginTop}px` }}
          >
            <View className="head-nav">
              <Image
                onClick={this.handlegoBack}
                className="go-back-icon"
                src={require('../../static/searchpage/left.png')}
              />
              <Text>品牌代购</Text>
            </View>
          </View>
        </View>
        <View id="activity-content" style={{ paddingTop: `${contentTop}px` }}>
          <AtTabs
            current={tabsCurrent}
            tabList={tabList}
            onClick={this.handleTabsClick.bind(this)}
            scroll
          >
            {tabList.map((item, index) => (
              <AtTabsPane current={tabsCurrent} index={index} key={item.shopId}>
                {/* 轮播图 */}
                <View className="shop-swiper">
                  <Swiper
                    className="swiper-wrap"
                    autoplay
                    circular
                    indicatorDots
                    indicatorActiveColor="#ff5d8c"
                    indicatorColor="#fff"
                  >
                    {bannerList.map((itemBanner) => {
                      return (
                        <SwiperItem className="swiper-item" key={itemBanner.id}>
                          <Image src={itemBanner.image} />
                        </SwiperItem>
                      );
                    })}
                  </Swiper>
                </View>
                {/* 今日精品 */}
                <View className="shop-boutique">
                  <View className="boutique-content">
                    <View className="boutique-title">
                      <Text className="boutique-txt">今日精品</Text>
                      {/* <View className="boutique-more">
                          <View className="more-txt">更多产品</View>
                          <Image src={require("../../static/activity/right.png")} />
                        </View> */}
                    </View>
                    <View className="boutique-goods">
                      <Swiper className="boutique-swiper" autoplay circular>
                        <SwiperItem className="boutique-swiper-item">
                          {boutiqueListOne.map((itemBou) => (
                            <Navigator
                              url={`/pages/goodsdetails/goodsdetails?itemId=${itemBou.itemId}`}
                              key={itemBou.itemId}
                            >
                              <View className="boutique-swiper-item-goods">
                                <Image
                                  className="item-goods-img"
                                  src={itemBou.image}
                                />
                                <View
                                  className="item-goods-name"
                                  style={{
                                    display: '-webkit-box',
                                    '-webkit-box-orient': 'vertical',
                                    '-webkit-line-clamp': 2,
                                    overflow: 'hidden',
                                  }}
                                >
                                  {itemBou.itemName}
                                </View>
                              </View>
                            </Navigator>
                          ))}
                        </SwiperItem>
                        <SwiperItem className="boutique-swiper-item">
                          {boutiqueListTwo.map((itemBou) => (
                            <Navigator
                              url={`/pages/goodsdetails/goodsdetails?itemId=${itemBou.itemId}`}
                              key={itemBou.itemId}
                            >
                              <View className="boutique-swiper-item-goods">
                                <Image
                                  className="item-goods-img"
                                  src={itemBou.image}
                                />
                                <View
                                  className="item-goods-name"
                                  style={{
                                    display: '-webkit-box',
                                    '-webkit-box-orient': 'vertical',
                                    '-webkit-line-clamp': 2,
                                    overflow: 'hidden',
                                  }}
                                >
                                  {itemBou.itemName}
                                </View>
                              </View>
                            </Navigator>
                          ))}
                        </SwiperItem>
                        <SwiperItem className="boutique-swiper-item">
                          {boutiqueListThree.map((itemBou) => (
                            <Navigator
                              url={`/pages/goodsdetails/goodsdetails?itemId=${itemBou.itemId}`}
                              key={itemBou.itemId}
                            >
                              <View className="boutique-swiper-item-goods">
                                <Image
                                  className="item-goods-img"
                                  src={itemBou.image}
                                />
                                <View
                                  className="item-goods-name"
                                  style={{
                                    display: '-webkit-box',
                                    '-webkit-box-orient': 'vertical',
                                    '-webkit-line-clamp': 2,
                                    overflow: 'hidden',
                                  }}
                                >
                                  {itemBou.itemName}
                                </View>
                              </View>
                            </Navigator>
                          ))}
                        </SwiperItem>
                      </Swiper>
                    </View>
                  </View>
                </View>
                {/* 商品list */}
                <View className="shop-goods-list">
                  {goodsList.map((itemGoods) => (
                    <Navigator
                      url={`/pages/goodsdetails/goodsdetails?itemId=${itemGoods.itemId}`}
                      key={itemGoods.itemId}
                    >
                      <View className="shop-goods-item">
                        <Image
                          className="shop-goods-img"
                          src={itemGoods.image}
                        />
                        <View className="item-info">
                          <View
                            className="shop-goods-name"
                            style={{
                              display: '-webkit-box',
                              '-webkit-box-orient': 'vertical',
                              '-webkit-line-clamp': 2,
                              overflow: 'hidden',
                            }}
                          >
                            {itemGoods.itemName}
                          </View>
                          {itemGoods.price === itemGoods.discountPrice ? (
                            <View className="item-price">
                              {/* <View className="price-txt">原价：￥ <Text >{itemGoods.price}</Text></View> */}
                              <View className="discountPrice">
                                折扣价：￥{' '}
                                <Text style={{ fontSize: '34rpx' }}>
                                  {itemGoods.price}
                                </Text>
                              </View>
                            </View>
                          ) : itemGoods.discountPrice !== null ? (
                            <View className="item-price">
                              <View className="price-txt">
                                原价：￥ <Text>{itemGoods.price}</Text>
                              </View>
                              <View className="discountPrice">
                                折扣价：￥{' '}
                                <Text style={{ fontSize: '34rpx' }}>
                                  {itemGoods.discountPrice}
                                </Text>
                              </View>
                            </View>
                          ) : (
                            <View className="item-price">
                              <View className="discountPrice">
                                折扣价：￥{' '}
                                <Text style={{ fontSize: '34rpx' }}>
                                  {itemGoods.price}
                                </Text>
                              </View>
                            </View>
                          )}
                        </View>
                      </View>
                    </Navigator>
                  ))}
                </View>
              </AtTabsPane>
            ))}
          </AtTabs>
        </View>
      </View>
    );
  }
}

export default Activity1;
