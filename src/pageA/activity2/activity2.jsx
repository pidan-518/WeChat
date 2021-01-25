import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Swiper, SwiperItem } from '@tarojs/components';
import { AtTabs, AtTabsPane } from 'taro-ui';
import 'taro-ui/dist/style/components/tabs.scss';
import './activity2.less';
import '../../common/globalstyle.less';
import { postRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';
/* import servicePath from '../../common/util/api/apiUrl';
import { CarryTokenRequest } from '../../common/util/request'; */

// 排行榜
class Activity2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentTop: '',
      bannerList: [
        {
          id: 0,
          image:
            'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/home-banner2.png',
        },
        {
          id: 1,
          image:
            'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/home-banner3.png',
        },
        {
          id: 2,
          image:
            'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/home-banner.png',
        },
      ], // banner数据
      tabsCurrent: 0, // tabs索引
      tabList: [], // tab列表
      namePath: '', // 分类名
      goodsList: [], // 商品列表
      goodsCurrent: 1, // 商品列表当前页
      goodsPages: '', // 商品列表总数
    };
  }

  // tabs点击事件
  handleTabsClick = (tabsCurrent) => {
    this.setState({ tabsCurrent });
    for (let i = 0; i < this.state.tabList.length; i++) {
      if (i === tabsCurrent) {
        // console.log('进入', tabsCurrent, i, this.state.tabList[i].titlePath);
        this.setState(
          {
            tabsCurrent,
            goodsList: [],
            namePath: this.state.tabList[i].titlePath,
          },
          () => {
            this.searchItemByCategoryCom(1);
          }
        );
      }
    }
  };

  // 导航栏左边图标点击事件
  handlegoBack = () => {
    Taro.navigateBack({
      delta: 1,
    });
  };

  // 获取二级分类
  getListByKey() {
    postRequest(servicePath.getListByKey, {
      source: 10,
      key: 'WECHAT_APPLET',
    })
      .then((res) => {
        console.log('获取二级分类成功', res.data);
        if (res.data.code === 0) {
          this.setState(
            {
              tabList: JSON.parse(
                JSON.stringify(res.data.data).replace(/name/g, 'title')
              ),
              namePath: res.data.data[0].namePath,
            },
            () => {
              this.searchItemByCategoryCom(1);
            }
          );
        }
      })
      .catch((err) => {
        console.log('获取二级分类失败', err);
      });
  }

  // 获取二级分类下的商品
  searchItemByCategoryCom(current) {
    postRequest(servicePath.searchItemByCategoryCom, {
      categoryComPath: `${this.state.namePath}`,
      current: current,
      len: 10,
      brand: '',
      minPrice: '',
      maxPrice: '',
      sortSaleNum: 0,
      sortPrice: -1,
      source: 10,
    })
      .then((res) => {
        console.log('获取二级分类商品成功', res.data);
        if (res.data.code === 0) {
          this.setState({
            goodsList: [...this.state.goodsList, ...res.data.data.records],
            goodsCurrent: res.data.data.current,
            goodsPages: res.data.data.pages,
          });
        }
      })
      .catch((err) => {
        console.log('获取二级分类的商品失败', err);
      });
  }

  // 上拉事件
  onReachBottom() {
    if (this.state.goodsCurrent === this.state.goodsPages) {
      console.log('进入');
    } else if (this.state.goodsPages !== 0) {
      this.searchItemByCategoryCom(this.state.goodsCurrent + 1);
    }
  }

  componentWillMount() {
    this.getListByKey();
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {
    Taro.createSelectorQuery()
      .select('#ranking-head-nav')
      .boundingClientRect((rect) => {
        this.setState({
          contentTop: rect.height,
        });
      })
      .exec();
  }

  config = {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
    onReachBottomDistance: 50,
    usingComponents: {},
  };

  render() {
    const {
      contentTop,
      bannerList,
      tabList,
      tabsCurrent,
      goodsList,
    } = this.state;
    return (
      <View>
        <View id="ranking-head-bg">
          <View
            id="ranking-head-nav"
            style={{ paddingTop: `${Taro.$navBarMarginTop}px` }}
          >
            <View className="head-nav">
              <Image
                onClick={this.handlegoBack}
                className="go-back-icon"
                src={require('../../static/searchpage/left.png')}
              />
              <Text>排行榜</Text>
            </View>
          </View>
        </View>
        <View id="ranking-content" style={{ paddingTop: `${contentTop}px` }}>
          <View className="ranking-banner">
            <Swiper
              className="banner-swiper"
              autoplay
              circular
              indicatorDots
              indicatorActiveColor="#ff5d8c"
              indicatorColor="#fff"
            >
              {bannerList.map((item) => (
                <SwiperItem className="swiper-item" key={item.id}>
                  <Image src={item.image} />
                </SwiperItem>
              ))}
            </Swiper>
          </View>
          <View className="ranking-tabs">
            <AtTabs
              current={tabsCurrent}
              tabList={tabList}
              onClick={this.handleTabsClick.bind(this)}
              scroll
            >
              {tabList.map((item, index) => (
                <AtTabsPane current={tabsCurrent} index={index} key={item.id}>
                  <View className="goods-list">
                    {goodsList.map((itemGoods) => (
                      <Navigator
                        url={`/pages/goodsdetails/goodsdetails?itemId=${itemGoods.itemId}`}
                        key={itemGoods.id}
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
      </View>
    );
  }
}

export default Activity2;
