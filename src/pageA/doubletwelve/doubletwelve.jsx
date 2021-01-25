import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Swiper, SwiperItem, Image } from '@tarojs/components'
import './doubletwelve.less'
import '../../common/globalstyle.less'
import { postRequest } from '../../common/util/request'
import utils from '../../common/util/utils'
import servicePath from '../../common/util/api/apiUrl'

import activityData from './activityData'

// 品牌代购
class Activity8 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      // brandList: [99, 100, 70, 71, 72, 41, 42, 43, 31], // 九个品牌ID(测试)
      // brandList: [87, 86, 85, 90, 89, 91], // 九个品牌ID(预演)
      brandList: [161, 162, 163, 122, 124, 125, 153, 156, 154], // 九个品牌ID(正式环境数据)
      themeCounterList: [], // 54个卖场展示商品
    }
  }

  componentWillMount() {}

  componentDidMount() {
    this.getBrandById()
    this.getInfoList()
  }

  componentWillUnmount() {}

  componentDidShow() {
    console.log('代理人信息：', this.$router.params.shareRecommend)
    utils.updateRecommendCode(this.$router.params.shareRecommend) //代理人
  }

  onShareAppMessage() {
    const shareRecommend = Taro.getStorageSync('shareRecommend')
    return {
      title: '年终盛典 决战双12！',
      path: `pageA/doubletwelve/doubletwelve?shareRecommend=${shareRecommend}`,
      imageUrl: 'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity8/share.jpg',
    }
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
    navigationBarTitleText: '爱港猫双12年终盛典',
    // navigationStyle: 'custom',
  }

  // 跳转到卖场页面
  handleToStore = (comid, name) => () => {
    const shareRecommend = Taro.getStorageSync('shareRecommend')
    Taro.navigateTo({
      url: `../activity7/activitylist/activitylist?comid=${comid}&name=${name}&pageState=0&shareRecommend=${shareRecommend}`,
    })
  }

  // 跳转到品牌闪购页面
  handleToBrand = (brandId, name, index) => () => {
    const insideImage = this.state.brandList[index].insideImage
      ? this.state.brandList[index].insideImage
      : this.state.brandList[index].image
    Taro.setStorageSync('brandImage', insideImage)
    const shareRecommend = Taro.getStorageSync('shareRecommend')
    Taro.navigateTo({
      url: `../activity7/activitylist/activitylist?brandId=${brandId}&name=${name}&pageState=1&shareRecommend=${shareRecommend}`,
    })
  }

  // 跳转到香港免税店
  handleToExTaxStore = shopId => () => {
    const shareRecommend = Taro.getStorageSync('shareRecommend')
    Taro.navigateTo({
      url: `/pages/shophome/shophome?businessId=${shopId}&shareRecommend=${shareRecommend}`,
    })
  }

  // 跳转到领券页面
  handleToCertificate = () => {
    Taro.navigateTo({
      url: `/pages/certificate/certificate`,
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
      brandList,
      themeCounterList,
    } = this.state

    return (
      <View id="activity7">
        <View className="firstScreen"></View>

        {/* 优惠券领取 */}
        <View className="coupons" onClick={this.handleToCertificate}>
          <Image
            className="fullReduction-main"
            src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity8/double12_course.png"
            lazyLoad={true}
          ></Image>
        </View>

        {/* ---------------------- 主题卖场 ------------------- */}
        {/* 美容护肤 */}
        <View className="themeStore" onClick={this.handleToExTaxStore(51)}>
          <Image
            className="theme-bg"
            src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity8/beauty.png"
            lazyLoad={true}
          ></Image>
          <View className="titleView">
            <Text className='themeName'>美容护肤</Text>
            <View className='toMoreBtn'>
              <Text className='btnDesc'>更多</Text>
              <View className='btnIcon'></View>
            </View>
          </View>
          <View className="themeCounter">
            {themeCounterList.slice(0, 9).map(item => {
              return (
                <View
                  className="counter-item"
                  onClick={this.handleToGoodDetail.bind(this, item)}
                  key={item.itemId}
                >
                  <View className="counter-img-box">
                    <Image src={utils.transWebp(item.image)} className="counter-img" lazyLoad={true}></Image>
                  </View>
                  <Text className="shop-name" style={{ '-webkit-box-orient': 'vertical' }}>
                    {item.itemName}
                  </Text>
                  <View className="price-box">
                    <Text className="discountPrice">￥{item.discountPrice}</Text>
                    {item.discountPrice === item.price ? null : <Text className="price">￥{item.price}</Text>}
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        {/* 专业彩妆 */}
        <View className="themeStore" onClick={this.handleToExTaxStore(51)}>
          <Image
            className="theme-bg"
            src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity8/color.png"
            lazyLoad={true}
          ></Image>
          <View className="titleView">
            <Text className='themeName'>专业彩妆</Text>
            <View className='toMoreBtn'>
              <Text className='btnDesc'>更多</Text>
              <View className='btnIcon'></View>
            </View>
          </View>
          <View className="themeCounter">
            {themeCounterList.slice(9, 18).map((item, index) => {
              return (
                <View
                  className="counter-item"
                  onClick={this.handleToGoodDetail.bind(this, item)}
                  key={item.id}
                >
                  <View className="counter-img-box">
                    <Image src={utils.transWebp(item.image)} className="counter-img" lazyLoad={true}></Image>
                  </View>
                  <Text className="shop-name" style={{ '-webkit-box-orient': 'vertical' }}>
                    {item.itemName}
                  </Text>
                  <View className="price-box">
                    <Text className="discountPrice">￥{item.discountPrice}</Text>
                    {item.discountPrice === item.price ? null : <Text className="price">￥{item.price}</Text>}
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        {/* 迷人香氛 */}
        <View className="themeStore" onClick={this.handleToExTaxStore(51)}>
          <Image
            className="theme-bg"
            src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity8/fragrance.png"
            lazyLoad={true}
          ></Image>
          <View className="titleView">
            <Text className='themeName'>迷人香氛</Text>
            <View className='toMoreBtn'>
              <Text className='btnDesc'>更多</Text>
              <View className='btnIcon'></View>
            </View>
          </View>
          <View className="themeCounter">
            {themeCounterList.slice(18, 27).map((item, index) => {
              return (
                <View
                  className="counter-item"
                  onClick={this.handleToGoodDetail.bind(this, item)}
                  key={item.id}
                >
                  <View className="counter-img-box">
                    <Image src={utils.transWebp(item.image)} className="counter-img" lazyLoad={true}></Image>
                  </View>
                  <Text className="shop-name" style={{ '-webkit-box-orient': 'vertical' }}>
                    {item.itemName}
                  </Text>
                  <View className="price-box">
                    <Text className="discountPrice">￥{item.discountPrice}</Text>
                    {item.discountPrice === item.price ? null : <Text className="price">￥{item.price}</Text>}
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        {/* 母婴必备 */}
        <View className="themeStore" onClick={this.handleToStore('279,282,285,295,303,350,718,719,721,729,754,755,756,757', '母婴必备')}>
        {/* <View className="themeStore" onClick={this.handleToStore('1546,1537,1501,1499', '母婴必备')}> */}
          <Image
            className="theme-bg"
            src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity8/baby.png"
            lazyLoad={true}
          ></Image>
          <View className="titleView">
            <Text className='themeName'>母婴必备</Text>
            <View className='toMoreBtn'>
              <Text className='btnDesc'>更多</Text>
              <View className='btnIcon'></View>
            </View>
          </View>
          <View className="themeCounter">
            {themeCounterList.slice(27, 36).map((item, index) => {
              return (
                <View
                  className="counter-item"
                  onClick={this.handleToGoodDetail.bind(this, item)}
                  key={item.id}
                >
                  <View className="counter-img-box">
                    <Image src={utils.transWebp(item.image)} className="counter-img" lazyLoad={true}></Image>
                  </View>
                  <Text className="shop-name" style={{ '-webkit-box-orient': 'vertical' }}>
                    {item.itemName}
                  </Text>
                  <View className="price-box">
                    <Text className="discountPrice">￥{item.discountPrice}</Text>
                    {item.discountPrice === item.price ? null : <Text className="price">￥{item.price}</Text>}
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        {/* 个人护理 */}
        <View className="themeStore" onClick={this.handleToStore('219,220,233,238,239,240,241,245,246,247,248,249,251,255,306,646,647', '个人护理')}>
        {/* <View className="themeStore" onClick={this.handleToStore('1497,1663,1712', '个人护理')}> */}
          <Image
            className="theme-bg"
            src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity8/nursing.png"
            lazyLoad={true}
          ></Image>
          <View className="titleView">
            <Text className='themeName'>个人护理</Text>
            <View className='toMoreBtn'>
              <Text className='btnDesc'>更多</Text>
              <View className='btnIcon'></View>
            </View>
          </View>
          <View className="themeCounter">
            {themeCounterList.slice(36, 45).map((item, index) => {
              return (
                <View
                  className="counter-item"
                  onClick={this.handleToGoodDetail.bind(this, item)}
                  key={item.id}
                >
                  <View className="counter-img-box">
                    <Image src={utils.transWebp(item.image)} className="counter-img" lazyLoad={true}></Image>
                  </View>
                  <Text className="shop-name" style={{ '-webkit-box-orient': 'vertical' }}>
                    {item.itemName}
                  </Text>
                  <View className="price-box">
                    <Text className="discountPrice">￥{item.discountPrice}</Text>
                    {item.discountPrice === item.price ? null : <Text className="price">￥{item.price}</Text>}
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        {/* 居家必备 */}
        <View className="themeStore" onClick={this.handleToStore('117,304,626,650,657,658,659,738', '居家必备')}>
        {/* <View className="themeStore" onClick={this.handleToStore('1497,1498,1501', '居家必备')}> */}
          <Image
            className="theme-bg"
            src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity8/home.png"
            lazyLoad={true}
          ></Image>
          <View className="titleView">
            <Text className='themeName'>居家必备</Text>
            <View className='toMoreBtn'>
              <Text className='btnDesc'>更多</Text>
              <View className='btnIcon'></View>
            </View>
          </View>
          <View className="themeCounter">
            {themeCounterList.slice(45, 54).map((item, index) => {
              return (
                <View
                  className="counter-item"
                  onClick={this.handleToGoodDetail.bind(this, item)}
                  key={item.id}
                >
                  <View className="counter-img-box">
                    <Image src={utils.transWebp(item.image)} className="counter-img" lazyLoad={true}></Image>
                  </View>
                  <Text className="shop-name" style={{ '-webkit-box-orient': 'vertical' }}>
                    {item.itemName}
                  </Text>
                  <View className="price-box">
                    <Text className="discountPrice">￥{item.discountPrice}</Text>
                    {item.discountPrice === item.price ? null : <Text className="price">￥{item.price}</Text>}
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        {/* 品牌模块 */}
        <View className="brandStore">
          <Image
            src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity8/double12_brand.png"
            className="brandStore-bg"
            lazyLoad={true}
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
                  <Image src={activityData.brandImgs[index]} className="logo" lazyLoad={true}></Image>
                </View>
              )
            })}
          </View>
        </View>

        {/* 活动规则 */}
        <View className="activityRule">
          <Image src='https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity8/double12_rule.png' className="rule" lazyLoad={true}></Image>
        </View>
      </View>
    )
  }
}

export default Activity8
