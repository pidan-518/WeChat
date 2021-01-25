import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Swiper, SwiperItem, Image } from '@tarojs/components'
import './activity6.less'
import '../../common/globalstyle.less'
import { postRequest } from '../../common/util/request'
import servicePath from '../../common/util/api/apiUrl'

import activityData from './activityData'
import LovingShopping from './components/LovingShopping/LovingShopping'

// 品牌代购
class Activity7 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      bannerList: activityData.bannerList,
      lovingShoppingData: {
        activityItemList: [], // 商品列表
        startTime: '', // 活动开始时间
        endTime: '', // 活动结束时间
        nextSession: '', // 下一场次
        activeState: '', // 活动状态 0=未开始，1=正在进行，2=已结束
        nextSessionState: '',
      }, // 爱抢购数据
      nextMilliTime: 0, // 距离下一场次毫秒数
      len: 10,
      brandList: [99, 100, 70, 71, 72, 41, 42, 43, 31], // 九个品牌ID(测试)
      // brandList: [161, 162, 163, 122, 124, 125, 153, 156, 154], // 九个品牌ID(正式环境数据)
      themeCounterList: [], // 54个卖场展示商品
    }
  }

  componentWillMount() {}

  componentDidMount() {
    this.getCurrentIndexActivities() // 获取爱抢购信息
    this.getBrandById()
    this.getInfoList()
  }

  componentWillUnmount() {}

  componentDidShow() {}

  onShareAppMessage() {
    const shareRecommend = Taro.getStorageSync('shareRecommend')
    return {
      title: '【爱港猫双十一专区】大牌美妆护肤低至5折，限量抢购！',
      path: `pageA/activity6/activity6?shareRecommend=${shareRecommend}`,
      imageUrl: 'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity7/ad.jpg'
    }
  }

  // 获取首页下半部分内容
  getCurrentIndexActivities() {
    postRequest(servicePath.getCurrentIndexActivities, {
      source: 50,
    })
      .then(res => {
        if (res.data.code === 0) {
          console.log('获取爱抢购数据成功：', res.data)
          const { lovingShopping } = res.data.data
          let nextMilliTime = lovingShopping.nextMilliTime

          if (nextMilliTime !== 0 && lovingShopping.nextSessionState !== 0) {
            nextMilliTime -= 1000
            this.state.timer = setInterval(() => {
              if (nextMilliTime !== 0) {
                nextMilliTime -= 1000
                this.setState({
                  nextMilliTime: nextMilliTime,
                })
              } else {
                clearInterval(this.timer)
              }
            }, 1000)
          }
          this.setState({
            lovingShoppingData: lovingShopping,
            nextMilliTime: nextMilliTime,
          })
        }
      })
      .catch(err => {
        console.log('获取首页下半部分内容异常', err)
      })
  }

  // 获取展示商品数据
  getInfoList = () => {
    const arr = activityData.themeCounterList
    postRequest(servicePath.itemInfoList, arr)
      .then(res => {
        console.log('获取规定商品列表成功', res.data)
        if (res.data.code === 0) {
          this.setState({
            themeCounterList: res.data.data,
          })
        }
      })
      .catch(err => {
        console.log('获取规定商品列表失敗', err)
      })
  }

  // 获取品牌数据
  getBrandById = () => {
    const ids = this.state.brandList
    postRequest(servicePath.getBrandByIds, {
      ids,
    })
      .then(res => {
        console.log('获取品牌列表成功', res.data)
        if (res.data.code === 0) {
          this.setState({
            brandList: res.data.data,
          })
        }
      })
      .catch(err => {
        console.log('获取品牌列表失敗', err)
      })
  }

  config = {
    navigationBarTitleText: '“双十一”全球狂欢购',
    // navigationStyle: 'custom',
  }

  // 跳转到卖场页面
  handleToStore = (comid, name) => () => {
    Taro.navigateTo({
      url: `activitylist/activitylist?comid=${comid}&name=${name}&pageState=0`,
    })
  }

  // 跳转到品牌闪购页面
  handleToBrand = (brandId, name, index) => () => {
    const insideImage = this.state.brandList[index].insideImage
      ? this.state.brandList[index].insideImage
      : this.state.brandList[index].image
    Taro.setStorageSync('brandImage', insideImage)
    Taro.navigateTo({
      url: `activitylist/activitylist?brandId=${brandId}&name=${name}&pageState=1`,
    })
  }

  // 跳转到领券页面
  handleToCertificate = () => {
    Taro.navigateTo({
      url: `coupons/coupons`,
    })
  }

  // 跳转到商品详情
  handleToGoodDetail = (item, e) => {
    console.log('商品id：', item.itemId)
    Taro.navigateTo({
      url: `/pages/goodsdetails/goodsdetails?itemId=${item.itemId}`,
    })
    e.stopPropagation() // 阻止冒泡
  }

  render() {
    const {
      bannerList,
      lovingShoppingData,
      nextMilliTime,
      brandList,
      themeCounterList,
    } = this.state

    return (
      <View id="activity7">
        <Swiper className="firstScreen" circular autoplay>
          {bannerList.map(item => {
            return (
              <SwiperItem key={item.id}>
                <View className="">
                  <Image src={item.image} alt="loading false" className="firstScreen-img"></Image>
                </View>
              </SwiperItem>
            )
          })}
        </Swiper>

        {/* 优惠券领取 */}
        <View className="coupons" onClick={this.handleToCertificate}>
          <Image
            className="fullReduction-main"
            src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity7/coupons.png"
          ></Image>
        </View>

        {/* 爱抢购 */}
        <LovingShopping lovingShoppingData={lovingShoppingData} nextMilliTime={nextMilliTime} />

        {/* ---------------------- 主题卖场 ------------------- */}
        {/* 美容护肤 */}
        <View className="themeStore" onClick={this.handleToStore('214,217,219,221,223,224,227,228,229,230,231,232,244', '美容护肤')}>
          <Image
            className="theme-bg"
            src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity7/beauty.png"
          ></Image>
          <View className="titleView"></View>
          <View className="themeCounter">
            {themeCounterList.slice(0, 9).map(item => {
              return (
                <View
                  className="counter-item"
                  onClick={this.handleToGoodDetail.bind(this, item)}
                  key={item.itemId}
                >
                  <View className="counter-img-box">
                    <Image src={item.image} className="counter-img"></Image>
                  </View>
                  <Text className="shop-name" style={{ '-webkit-box-orient': 'vertical' }}>
                    {item.itemName}
                  </Text>
                  <View className="price-box">
                    <Text className="discountPrice">￥{item.discountPrice}</Text>
                    <Text className="price">￥{item.price}</Text>
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        {/* 专业彩妆 */}
        <View className="themeStore" onClick={this.handleToStore('211,218,252,256,259,262,269,270,271,618', '专业彩妆')}>
          <Image
            className="theme-bg"
            src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity7/colourMakeup.png"
          ></Image>
          <View className="titleView"></View>
          <View className="themeCounter">
            {themeCounterList.slice(9, 18).map((item, index) => {
              return (
                <View
                  className="counter-item"
                  onClick={this.handleToGoodDetail.bind(this, item)}
                  key={item.id}
                >
                  <View className="counter-img-box">
                    <Image src={item.image} className="counter-img"></Image>
                  </View>
                  <Text className="shop-name" style={{ '-webkit-box-orient': 'vertical' }}>
                    {item.itemName}
                  </Text>
                  <View className="price-box">
                    <Text className="discountPrice">￥{item.discountPrice}</Text>
                    <Text className="price">￥{item.price}</Text>
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        {/* 母婴必备 */}
        <View className="themeStore" onClick={this.handleToStore(`279,282,285,295,303,350,718,719,721,729,754,755,756,757`, '母婴必备')}>
          <Image
            className="theme-bg"
            src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity7/baby.png"
          ></Image>
          <View className="titleView"></View>
          <View className="themeCounter">
            {themeCounterList.slice(18, 27).map((item, index) => {
              return (
                <View
                  className="counter-item"
                  onClick={this.handleToGoodDetail.bind(this, item)}
                  key={item.id}
                >
                  <View className="counter-img-box">
                    <Image src={item.image} className="counter-img"></Image>
                  </View>
                  <Text className="shop-name" style={{ '-webkit-box-orient': 'vertical' }}>
                    {item.itemName}
                  </Text>
                  <View className="price-box">
                    <Text className="discountPrice">￥{item.discountPrice}</Text>
                    <Text className="price">￥{item.price}</Text>
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        {/* 个人护理 */}
        <View className="themeStore" onClick={this.handleToStore('219,220,233,238,239,240,241,245,246,247,248,249,251,255,306,646,647', '个人护理')}>
          <Image
            className="theme-bg"
            src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity7/nursing.png"
          ></Image>
          <View className="titleView"></View>
          <View className="themeCounter">
            {themeCounterList.slice(27, 36).map((item, index) => {
              return (
                <View
                  className="counter-item"
                  onClick={this.handleToGoodDetail.bind(this, item)}
                  key={item.id}
                >
                  <View className="counter-img-box">
                    <Image src={item.image} className="counter-img"></Image>
                  </View>
                  <Text className="shop-name" style={{ '-webkit-box-orient': 'vertical' }}>
                    {item.itemName}
                  </Text>
                  <View className="price-box">
                    <Text className="discountPrice">￥{item.discountPrice}</Text>
                    <Text className="price">￥{item.price}</Text>
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        {/* 家居必备 */}
        <View className="themeStore" onClick={this.handleToStore('117,304,626,650,657,658,659,738', '家居必备')}>
          <Image
            className="theme-bg"
            src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity7/home.png"
          ></Image>
          <View className="titleView"></View>
          <View className="themeCounter">
            {themeCounterList.slice(36, 45).map((item, index) => {
              return (
                <View
                  className="counter-item"
                  onClick={this.handleToGoodDetail.bind(this, item)}
                  key={item.id}
                >
                  <View className="counter-img-box">
                    <Image src={item.image} className="counter-img"></Image>
                  </View>
                  <Text className="shop-name" style={{ '-webkit-box-orient': 'vertical' }}>
                    {item.itemName}
                  </Text>
                  <View className="price-box">
                    <Text className="discountPrice">￥{item.discountPrice}</Text>
                    <Text className="price">￥{item.price}</Text>
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        {/* 食品保健 */}
        <View className="themeStore" onClick={this.handleToStore('317,330,332,335,337,338,339,340,343,349,352,383,384,', '食品保健')}>
          <Image
            className="theme-bg"
            src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity7/food.png"
          ></Image>
          <View className="titleView"></View>
          <View className="themeCounter">
            {themeCounterList.slice(45, 54).map((item, index) => {
              return (
                <View
                  className="counter-item"
                  onClick={this.handleToGoodDetail.bind(this, item)}
                  key={item.id}
                >
                  <View className="counter-img-box">
                    <Image src={item.image} className="counter-img"></Image>
                  </View>
                  <Text className="shop-name" style={{ '-webkit-box-orient': 'vertical' }}>
                    {item.itemName}
                  </Text>
                  <View className="price-box">
                    <Text className="discountPrice">￥{item.discountPrice}</Text>
                    <Text className="price">￥{item.price}</Text>
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        {/* 品牌模块 */}
        <View className="brandStore">
          <Image
            src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity7/brandBg.png"
            className="brandStore-bg"
          ></Image>
          <View className="titleView"></View>
          <View className="brandCounter">
            {brandList.map((item, index) => {
              return (
                <View
                  className="brand-item"
                  onClick={this.handleToBrand(item.brandId, item.title, index)}
                  key={item.id}
                >
                  <Image src={item.image} className="logo"></Image>
                </View>
              )
            })}
          </View>
        </View>

        {/* 活动规则 */}
        <View className="activityRule">
          <Image
            src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity7/rule.png"
            className="rule"
          ></Image>
        </View>
      </View>
    )
  }
}

export default Activity7
