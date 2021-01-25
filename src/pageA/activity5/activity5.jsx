import Taro, { Component } from '@tarojs/taro';
import { View, Text, Swiper, SwiperItem } from '@tarojs/components';
import './activity5.less';
import '../../common/globalstyle.less';
import Popularity from './components/Popularity/Popularity';
import GoodShop from './components/GoodShop/GoodShop';
import GoodsList from '../../components/GoodsList/GoodsList';
import { postRequest, CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';
import activityData from './activityData';

// 好物推荐
class Activity5 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goodsList: activityData,
      bannerList: [
        {
          id: 1,
          image:
            'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity5/activity5-banner1.jpg',
        },
        {
          id: 2,
          image:
            'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity5/activity5-banner3.jpg',
        },
        {
          id: 3,
          image:
            'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity5/activity5-banner4.jpg',
        },
        {
          id: 4,
          image:
            'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity5/activity5-banner5.jpg',
        },
      ], // banner数据
      categoryList: [], // 分类数据
      hotList: [], // 热销爆款数据
      guessList: [], // 猜你喜欢数据
      shopData1: '',
      shopData2: '',
      shopData3: '',
      shopData4: '',
      shopData5: '',
      shopData6: '',
      couponScale: '',
      couponList: ['', ''], // 优惠券列表
      fullCoupon:
        'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity5/coupon-bg2.png', // 满减券
      discountCoupon:
        'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity5/coupon-bg1.png', // 折扣券
      deductionCoupon:
        'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity5/coupon-bg3.png', // 抵扣券
    };
  }

  // 分类点击事件
  handleCategoryClick = (categoryList) => {
    let categoryIds = [];
    for (let val of categoryList) {
      categoryIds.push(val.id);
    }
    Taro.navigateTo({
      url: `/pages/searchgoods/searchgoods?comIds=${JSON.stringify(
        categoryIds
      )}`,
    });
  };

  // 优惠券点击事件
  handleCouponClick = (couponId) => {
    CarryTokenRequest(servicePath.saveCouponRecord, {
      couponId: couponId,
      // distributionMethod: 2
    })
      .then((res) => {
        console.log('领取优惠券成功', res.data);
        if (res.data.code === 0) {
          Taro.showToast({
            title: '领取成功',
            icon: 'none',
            duration: 1000,
            success: (res) => {
              this.getCouponList();
            },
          });
        } else {
          Taro.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000,
          });
        }
      })
      .catch((err) => {
        console.log('领取优惠券失败', err);
      });
    this.setState(
      {
        couponScale: 'scale(1.1)',
      },
      () => {
        setTimeout(() => {
          this.setState({
            couponScale: '',
          });
        }, 1000);
      }
    );
  };

  // 获取优惠券
  getCouponList() {
    CarryTokenRequest(servicePath.getCouponList, {
      current: 1,
      len: 10,
      distributionMethod: 2,
    })
      .then((res) => {
        console.log('获取优惠券成功', res.data);
        if (res.data.code === 0) {
          this.setState({
            couponList: res.data.data,
          });
        }
      })
      .catch((err) => {
        console.log('获取优惠券失败', err);
      });
  }

  // 获取店铺列表
  getShopGetListByKey = () => {
    postRequest(servicePath.getShopGetListByKey, {
      shopKey: 'WECHAT_APPLET_SHOP_GOOD',
    })
      .then((res) => {
        console.log('获取店铺列表成功', res.data);
        if (res.data.code === 0) {
          this.setState({
            shopData1: res.data.data[0],
            shopData2: res.data.data[1],
            shopData3: res.data.data[2],
            shopData4: res.data.data[3],
            shopData5: res.data.data[4],
            shopData6: res.data.data[5],
          });
        }
      })
      .catch((err) => {
        console.log('获取店铺列表失败', err);
      });
  };

  // 根据传入的商品号列表查询商品信息集合
  getItemInfoList() {
    const arr = [
      // 热销爆款
      {
        itemNo: 'sp20200511100413',
      },
      {
        itemNo: 'sp20200519100863',
      },
      {
        itemNo: 'sp20200511100422',
      },
      {
        itemNo: 'sp20200519100861',
      },
      {
        itemNo: 'sp20200602102528',
      },
      {
        itemNo: 'sp20200602102579',
      },
      {
        itemNo: 'sp20200602102709',
      },
      {
        itemNo: 'sp20200601102333',
      },
      {
        itemNo: 'sp20200513100562',
      },
      {
        itemNo: 'sp20200525101038',
      },
      {
        itemNo: 'sp20200513100627',
      },
      {
        itemNo: 'sp20200519100859',
      },
      {
        itemNo: 'sp20200608103202',
      },
      {
        itemNo: 'sp20200511100431',
      },
      {
        itemNo: 'sp20200602102444',
      },
      // 人气榜单
      {
        itemNo: 'sp20200527101596',
      },
      {
        itemNo: 'sp20200603102859',
      },
      {
        itemNo: 'sp20200615103714',
      },
      {
        itemNo: 'sp20200601102181',
      },
      {
        itemNo: 'sp20200512100468',
      },
      {
        itemNo: 'sp20200525101070',
      },
      {
        itemNo: 'sp20200602102695',
      },
      {
        itemNo: 'sp20200602102585',
      },
      {
        itemNo: 'sp20200602102843',
      },
      // 必逛好店
      // dfs
      {
        itemNo: 'sp20200529101992',
      },
      {
        itemNo: 'sp20200529102017',
      },
      {
        itemNo: 'sp20200601102313',
      },
      {
        itemNo: 'sp20200601102275',
      },
      {
        itemNo: 'sp20200601102291',
      },
      {
        itemNo: 'sp20200601102274',
      },
      {
        itemNo: 'sp20200616103792',
      },
      {
        itemNo: 'sp20200603102851',
      },
      {
        itemNo: 'sp20200616103868',
      },
      // 莎莎
      {
        itemNo: 'sp20200518100796',
      },
      {
        itemNo: 'sp20200518100783',
      },
      {
        itemNo: 'sp20200511100414',
      },
      {
        itemNo: 'sp20200511100422',
      },
      {
        itemNo: 'sp20200511100407',
      },
      {
        itemNo: 'sp20200511100393',
      },
      {
        itemNo: 'sp20200511100410',
      },
      {
        itemNo: 'sp20200511100399',
      },
      {
        itemNo: 'sp20200511100413',
      },
      // 屈臣氏
      {
        itemNo: 'sp20200512100473',
      },
      {
        itemNo: 'sp20200512100484',
      },
      {
        itemNo: 'sp20200512100481',
      },
      {
        itemNo: 'sp20200512100466',
      },
      {
        itemNo: 'sp20200512100480',
      },
      {
        itemNo: 'sp20200512100459',
      },
      {
        itemNo: 'sp20200525100939',
      },
      {
        itemNo: 'sp20200512100483',
      },
      {
        itemNo: 'sp20200512100474',
      },
      // 万宁
      {
        itemNo: 'sp20200513100489',
      },
      {
        itemNo: 'sp20200513100597',
      },
      {
        itemNo: 'sp20200518100744',
      },
      {
        itemNo: 'sp20200513100498',
      },
      {
        itemNo: 'sp20200518100835',
      },
      {
        itemNo: 'sp20200518100828',
      },
      {
        itemNo: 'sp20200518100822',
      },
      {
        itemNo: 'sp20200513100501',
      },
      {
        itemNo: 'sp20200515100656',
      },
      // 卓悦
      {
        itemNo: 'sp20200513100545',
      },
      {
        itemNo: 'sp20200513100547',
      },
      {
        itemNo: 'sp20200513100548',
      },
      {
        itemNo: 'sp20200513100518',
      },
      {
        itemNo: 'sp20200513100521',
      },
      {
        itemNo: 'sp20200513100520',
      },
      {
        itemNo: 'sp20200514100648',
      },
      {
        itemNo: 'sp20200514100640',
      },
      {
        itemNo: 'sp20200514100641',
      },
      // 智林商城
      {
        itemNo: 'sp20200602102847',
      },
      {
        itemNo: 'sp20200602102826',
      },
      {
        itemNo: 'sp20200607103129',
      },
      {
        itemNo: 'sp20200602102843',
      },
      {
        itemNo: 'sp20200602102674',
      },
      {
        itemNo: 'sp20200611103463',
      },
      {
        itemNo: 'sp20200602102827',
      },
      {
        itemNo: 'sp20200602102470',
      },
      {
        itemNo: 'sp20200602102523',
      },
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

  // 获取分类列表
  getListByTag() {
    postRequest(servicePath.getListByTag, {
      tag: 'kaiyehuodong',
    })
      .then((res) => {
        console.log('获取分类列表成功', res.data);
        if (res.data.code === 0) {
          this.setState({
            categoryList: res.data.data.filter(
              (item) => item.categoryComShow.name !== 'A'
            ),
          });
        }
      })
      .catch((err) => {
        console.log('获取分类列表失败', err);
      });
  }

  // 获取猜你喜欢的商品
  searchItemByCategoryCom() {
    let getSessCategory = Taro.getStorageSync('categoryComPath');
    let categoryComPath = getSessCategory
      ? getSessCategory
      : '美妆护肤:美容/修饰类化妆品:口紅';
    postRequest(servicePath.searchItemByCategoryCom, {
      categoryComPath: categoryComPath,
      current: 1,
      len: 30,
      brand: '',
      minPrice: '',
      maxPrice: '',
      sortSaleNum: -1,
      sortPrice: -1,
      source: 10,
    })
      .then((res) => {
        console.log('获取猜你喜欢成功', res.data);
        if (res.data.code === 0) {
          this.setState({
            guessList: res.data.data.records,
          });
        }
      })
      .catch((err) => {
        console.log('获取猜你喜欢成功', err);
      });
  }

  componentWillMount() {}

  componentDidMount() {
    this.getCouponList();
    this.getShopGetListByKey();
    this.getListByTag();
    this.getItemInfoList();
  }

  componentDidShow() {
    this.searchItemByCategoryCom();
  }

  componentDidHide() {}

  config = {
    navigationBarTitleText: '好物推荐',
    navigationBarBackgroundColor: '#9B0C0C',
    navigationBarTextStyle: 'white',
  };

  render() {
    const {
      goodsList,
      bannerList,
      categoryList,
      shopData1,
      shopData2,
      shopData3,
      shopData4,
      shopData5,
      shopData6,
      guessList,
    } = this.state;

    return (
      <View id="activity-page">
        {/* 轮播 */}
        <View className="activity-banner">
          <Swiper
            autoplay
            circular
            className="swiper-wrap"
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
        {/* 分类 */}
        <View className="activity-category">
          {categoryList.map((item) => (
            <View
              className="category-item"
              key={item.id}
              onClick={this.handleCategoryClick.bind(
                this,
                item.categoryCommonList
              )}
            >
              <Image className="item-img" src={item.categoryComShow.image} />
              <View className="item-text">{item.categoryComShow.name}</View>
            </View>
          ))}
        </View>
        {/* 热销爆款 */}
        <View className="hot-sale-wrap">
          <View className="hot-sale-bg">
            <View className="hot-goods-list">
              <Swiper
                className="hot-swiper"
                autoplay
                circular
                interval={2000}
                displayMultipleItems={4}
              >
                {goodsList.slice(0, 15).map((item) => (
                  <SwiperItem className="hot-swiper-item" key={item.id}>
                    <Navigator
                      url={`/pages/goodsdetails/goodsdetails?itemId=${item.itemId}`}
                    >
                      <View className="item-goods">
                        <Image src={item.image} />
                        <View
                          className="item-goods-name"
                          style={{
                            display: '-webkit-box',
                            '-webkit-box-orient': 'vertical',
                            '-webkit-line-clamp': 1,
                            overflow: 'hidden',
                          }}
                        >
                          {item.itemName}
                        </View>
                      </View>
                    </Navigator>
                  </SwiperItem>
                ))}
              </Swiper>
            </View>
          </View>
        </View>
        <View className="popularity-wrap">
          <Popularity
            goodsList={goodsList.slice(15, 18)}
            bgImage={
              'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/popularity-goods-bg1.png'
            }
          />
          <Popularity
            goodsList={goodsList.slice(18, 21)}
            bgImage={
              'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/popularity-goods-bg2.png'
            }
          />
          <Popularity
            goodsList={goodsList.slice(21, 24)}
            bgImage={
              'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/popularity-goods-bg3.png'
            }
          />
        </View>
        <View className="good-shop">
          <View className="good-shop-bg">
            <GoodShop
              shopGoodsList={goodsList.slice(69)}
              shopData={shopData6}
              shopImage="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/good-shop-item-bg6.png"
            />
            <GoodShop
              shopGoodsList={goodsList.slice(24, 33)}
              shopData={shopData1}
              shopImage="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/good-shop-item-bg1.png"
            />
            <GoodShop
              shopGoodsList={goodsList.slice(33, 42)}
              shopData={shopData2}
              shopImage="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/good-shop-item-bg2.png"
            />
            <GoodShop
              shopGoodsList={goodsList.slice(42, 51)}
              shopData={shopData3}
              shopImage="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/good-shop-item-bg4.png"
            />
            <GoodShop
              shopGoodsList={goodsList.slice(51, 60)}
              shopData={shopData4}
              shopImage="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/good-shop-item-bg5.png"
            />
            <GoodShop
              shopGoodsList={goodsList.slice(60, 69)}
              shopData={shopData5}
              shopImage="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/good-shop-item-bg3.png"
            />
          </View>
        </View>
        <View className="guess-wrap">
          <Image
            className="guess-bg"
            src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity6-guess-bg.png"
          />
          <View className="guess-goods-box">
            <GoodsList goodsList={guessList} hasTitle />
          </View>
        </View>
      </View>
    );
  }
}

export default Activity5;
