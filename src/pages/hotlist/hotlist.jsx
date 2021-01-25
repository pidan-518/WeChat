import Taro, { Component } from '@tarojs/taro'
import { View, Text, Form, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import './hotlist.less'
import '../../common/globalstyle.less'
import { postRequest } from '../../common/util/request'
import servicePath from '../../common/util/api/apiUrl'
import utils from '../../common/util/utils'

import CommonEmpty from '../../components/CommonEmpty/CommonEmpty'
import Loading from './components/Loading/Loading'

import lowPreferential from '../../static/hotlist/low.png'
import middlePreferential from '../../static/hotlist/middle.png'
import highPreferential from '../../static/hotlist/high.png'

export default class Hotlist extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 0, // 热销分类高亮index
      shopSwiperCurrent: 0, // 爆款轮播切换
      shufflyList: [{}], // 轮播图数据
      newDoodsList: [], // 热销新品数据
      hotStyleList: [{}], // 爆款新品数据
      hotClassList: [], // 热销分类数据
      hotGoodsList: [], // 热销商品数据
      isEmpty: false, // 数据加载的状态数据
      len: 4, // 请求数据长度
      showTopBtn: false, // 显示返回头部按钮
    }

    // 节流开关
    this.requestControl = true // 请求控制

    this.vHeight = 0
  }

  componentWillMount() {}

  componentDidMount() {
    // 加载时读取缓存，无缓存时取0，有缓存时取缓存数据
    let classCurrent = 0
    // if (Taro.getStorageSync('classCurrent') != '') {
    //   classCurrent = Number(getStorageSync('classCurrent'))
    //   // console.log('获取缓存下标：', classCurrent)
    // }

    this.getViewPortH()

    // 请求轮播图数据
    this.getData('getShufflyList', 'shufflyList')
    // 精选商品
    this.getData('getSearcChoiceness', 'newDoodsList')
    // 请求热销爆款数据
    this.getData('getHotStyleList', 'hotStyleList')
    // 请求热销分类数据
    postRequest(servicePath.getHotClassList, {
      source: 10,
    }).then(res => {
      if (res.data.code === 0) {
        const hotClassList = res.data.data
        this.setState(
          {
            hotClassList,
          },
          () => {
            this.requestControl = true
            if (this.state.hotClassList[this.state.current].classIdPath != undefined) {
              this.getGoodsList(classCurrent, 6)
            }
          }
        )
      } else {
        Taro.showModal({
          title: '提示',
          content: '热销分类：' + res.data.msg,
          showCancel: false,
        })
      }
    })
  }

  // 获取数据
  getData = (path, stateName) => {
    const requestpath = servicePath[path]
    postRequest(requestpath, {
      source: 50,
    }).then(res => {
      if (res.data.code === 0) {
        const data = res.data.data
        switch (stateName) {
          case 'shufflyList':
            this.setState({
              shufflyList: data,
            })
            break
          case 'newDoodsList':
            this.setState({
              newDoodsList: data,
            })
            break
          case 'hotStyleList':
            this.setState({
              hotStyleList: data,
            })
            break
          default:
            break
        }
      } else {
        Taro.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false,
        })
      }
    })
  }

  // 获取商品数据
  getGoodsList = (classCurrent, datalen = 6) => {
    const firatComIds = this.state.hotClassList[classCurrent].classIdPath

    postRequest(servicePath.getItemListByComIds, {
      comIds: [firatComIds],
      current: 1,
      len: datalen,
      source: 50,
    }).then(res => {
      if (res.data.code === 0) {
        const hotGoodsList = res.data.data.records
        const total = res.data.data.total
        const dataNum = res.data.data.size * res.data.data.current

        let isEmpty = false

        // 总数据小于等于请求的数据量时，数据加载完毕
        if (total <= dataNum) {
          // console.log('加载完全！')
          isEmpty = true
          this.requestControl = false
        }
        // 总数据为零时，显示空白组件，不显示数据加载完成
        if (hotGoodsList.length == 0) {
          isEmpty = false
          // console.log('没有商品数据！', isEmpty)
        }

        Taro.hideLoading()

        this.setState({
          hotGoodsList,
          current: classCurrent,
          isEmpty,
          len: datalen,
        })
      } else {
        Taro.showModal({
          title: '提示',
          content: '商品：' + res.data.msg,
          showCancel: false,
        })
      }
    })
  }

  componentWillUnmount() {}

  componentDidShow() {
    utils.updateRecommendCode(this.$router.params.shareRecommend) // 绑定，存储代理码
  }

  // 爆款轮播图切换
  handleShopSwiperChange = e => {
    this.setState({
      shopSwiperCurrent: e.target.current,
    })
  }

  // 监听current切换
  handleSwiperPageChange = n => () => {
    Taro.showLoading({
      title: '加载中',
    })
    // 禁止切换时因高度切换触发触底事件,300ms后打开请求开关
    this.requestControl = false
    setTimeout(() => {
      this.requestControl = true
    }, 300)

    console.log('==========切换-->', n)

    this.getGoodsList(n)
    this.handleScrollReset()
  }

  // 商品swiper修改后，重置滚动条位置
  handleScrollReset = () => {
    const query = Taro.createSelectorQuery()
    query.select('#hotStyleView').fields(
      {
        rect: true,
        size: true,
        computedStyle: ['margin'],
      },
      function(res) {
        // 此处返回指定要返回的样式名
        res.margin
      }
    )
    query.select('#swiper1').boundingClientRect()
    query.select('.new-product-box').fields(
      {
        rect: true,
        size: true,
        computedStyle: ['margin'],
      },
      function(res) {
        // 此处返回指定要返回的样式名
        res.margin
      }
    )

    query.exec(res => {
      const marginBottom = Number(res[0].margin.split(' ')[2].slice(0, -2))
      const marginNum = Number(res[2].margin.split(' ')[0].slice(0, -2))
      const scrollDis = res[1].height + res[2].height + marginBottom + marginNum
      Taro.pageScrollTo({ scrollTop: scrollDis })
    })
  }

  // 获取视口高度
  getViewPortH = () => {
    const viewport = Taro.createSelectorQuery()
    viewport.selectViewport().boundingClientRect()
    viewport.exec(res => {
      this.vHeight = res[0].height // 显示区域的竖直滚动位置
    })
  }

  // 点击返回头部
  handleScrollTop = () => {
    Taro.pageScrollTo({ scrollTop: 0 })
  }

  // 页面滑动监听
  onPageScroll = e => {
    if (e.scrollTop >= this.vHeight * 2.5 && this.vHeight != 0 && !this.state.showTopBtn) {
      let showTopBtn = true

      this.setState({
        showTopBtn,
      })
    } else if (e.scrollTop < this.vHeight * 2.5 && this.vHeight != 0 && this.state.showTopBtn) {
      let showTopBtn = false

      this.setState({
        showTopBtn,
      })
    }
  }

  // 跳转到小程序商品详情
  handleToShopDetail = id => () => {
    // console.log(id)
    utils.mutiLink(`iconmall://goodsdetail?id=${id}`)
  }

  // 小程序分享事件
  onShareAppMessage() {
    const shareRecommend = Taro.getStorageSync('shareRecommend')
    return {
      title: '全球爆款热销榜，挑选尖货全攻略，戳这里！',
      path: `pages/hotlist/hotlist?shareRecommend=${shareRecommend}`,
      imageUrl:
        'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/share/hot-image.jpg',
    }
  }

  // 轮播图跳转url
  handleToUrl = link => () => {
    console.log(link)
    utils.mutiLink(link)
  }

  config = {
    navigationBarTitleText: '热销榜单',
    // navigationBarBackgroundColor: '#00ff00',
    onReachBottomDistance: 20,
  }

  // 上拉事件
  onReachBottom() {
    const activityComId = this.state.hotClassList[this.state.current].classIdPath
    if (activityComId == undefined) {
      this.requestControl = false
    }

    console.log('上拉加载,是否可请求：', this.requestControl)

    if (this.requestControl) {
      // 增加请求数据量
      let dataLen = this.state.len + 6

      // 加载商品 && 检测数据是否加载完成
      this.getGoodsList(this.state.current, dataLen)
    }
  }

  render() {
    const {
      shufflyList,
      newDoodsList,
      hotStyleList,
      shopSwiperCurrent,
      hotClassList,
      hotGoodsList,
      current,
    } = this.state

    return (
      <View id="hotlist">
        {/* 按钮 */}
        {this.state.showTopBtn ? (
          <View className="TopBtn" onClick={this.handleScrollTop}></View>
        ) : null}
        {/* 海报轮播图 */}
        <View className="swiper-box" id="swiper1">
          <Swiper className="swiper" autoplay={true} circular={true}>
            {/* 第一张图需要另外写，保证无缝衔接 */}
            <SwiperItem onClick={this.handleToUrl(shufflyList[0].picHyperlinks)}>
              <Image
                className="swiperItem"
                src={
                  shufflyList[0].picUrl == undefined ? null : utils.transWebp(shufflyList[0].picUrl)
                }
                lazyLoad={true}
              />
            </SwiperItem>
            {shufflyList.slice(1).map(item => {
              return (
                <SwiperItem key={item.picSort} onClick={this.handleToUrl(item.picHyperlinks)}>
                  <Image
                    className="swiperItem"
                    src={item.picUrl == undefined ? null : utils.transWebp(item.picUrl)}
                    lazyLoad={true}
                  />
                </SwiperItem>
              )
            })}
          </Swiper>
        </View>

        <View className="new-product-box">
          {/* 精选新品 */}
          <View className="new-product-list">
            <Text className="new-product-title">精品好物</Text>
            <Text className="new-product-title2">为你优选精品好物</Text>

            {/* 新品 */}
            {newDoodsList.map(item => {
              return (
                <View
                  className="new-product-item"
                  onClick={this.handleToShopDetail(item.itemId)}
                  key={item.choId}
                >
                  <View className="new-product-detail">
                    <Image
                      src={item.logoPath == undefined ? null : utils.transWebp(item.logoPath)}
                      className="logo"
                      lazyLoad={true}
                    />
                    <Text className="brandName">{item.itemName}</Text>
                    <Text className="shopDesc">
                      {item.description == null ? '' : item.description}
                    </Text>
                    <Text className="price">
                      ￥{item.discountPrice == null ? item.price : item.discountPrice}
                    </Text>
                  </View>
                  <View className="new-product-shop">
                    <Image
                      lazyLoad={true}
                      src={item.image == undefined ? null : utils.transWebp(item.image)}
                      className="shopImg"
                    />
                    <View className="shopBtn">
                      <Text className="btnDesc">立即购买</Text>
                    </View>
                  </View>
                </View>
              )
            })}
          </View>

          {/* 热销爆款swiper */}
          <View className="scrollview-box" id="hotStyleView">
            <Text className="new-product-title">热销爆款</Text>
            <Text className="new-product-title2">为你优选精品好物</Text>
            <Swiper
              className="scrollview"
              nextMargin="80px"
              onChange={this.handleShopSwiperChange}
              current={shopSwiperCurrent}
            >
              {hotStyleList.map((item, index) => {
                return (
                  <SwiperItem
                    className="abox"
                    onClick={this.handleToUrl(item.hotHyperlinks)}
                    key={item.picId}
                  >
                    <Image
                      src={item.hotUrl == undefined ? null : utils.transWebp(item.hotUrl)}
                      alt="数据出错"
                      className={index == shopSwiperCurrent ? 'itemImage-active' : 'itemImage'}
                    />
                  </SwiperItem>
                )
              })}
            </Swiper>
          </View>
        </View>

        {/* 热销分类 */}
        <ScrollView
          className="tabs-header"
          scrollIntoView={`tab_${current}`}
          scrollX
          scrollWithAnimation
        >
          {hotClassList.map((item, index) => {
            return (
              <View
                className="tabs-item"
                onClick={this.handleSwiperPageChange(index)}
                key={item.classId}
                id={`tab_${index}`}
              >
                <View className={this.state.current == index ? 'btn-item-active' : 'btn-item'}>
                  <Text className="maintitle">{item.mainTitle}</Text>
                  <Text className="subtitle">{item.subtitle}</Text>
                </View>
                {index == hotClassList.length - 1 ? null : <View className="line"></View>}
              </View>
            )
          })}
        </ScrollView>
        {/* 热销商品--商品列表 */}
        <View className="swiper-container-box">
          {this.state.hotGoodsList.length === 0 ? (
            <View className="empty-page">
              <CommonEmpty content="没有数据"></CommonEmpty>
            </View>
          ) : (
            this.state.hotGoodsList.map((item, index) => {
              return (
                <View
                  className="shop-item"
                  onClick={this.handleToShopDetail(item.itemId)}
                  key={item.itemId}
                >
                  <Image
                    className={item.taxFree == 0 && item.expressFree == 0 ? 'flag-hide' : 'flag'}
                    src={
                      item.taxFree == 1
                        ? item.expressFree == 1
                          ? highPreferential
                          : middlePreferential
                        : item.expressFree == 1
                        ? lowPreferential
                        : null
                    }
                    lazyLoad={true}
                  ></Image>
                  <Image
                    src={item.image == undefined ? null : utils.transWebp(item.image)}
                    lazyLoad={true}
                    className="shopImg"
                  />
                  <Text className="shopTitle" style={{ '-webkit-box-orient': 'vertical' }}>
                    {item.itemName}
                  </Text>
                  <View className="shopPrice">
                    <Text className="symbol">￥</Text>
                    <View className="shopPrice-text">
                      <Text className="integer">{String(item.discountPrice).split('.')[0]}</Text>
                      <Text className="decimal">
                        {String(item.discountPrice).split('.')[1] != undefined
                          ? '.' + String(item.discountPrice).split('.')[1]
                          : ''}
                      </Text>
                      {item.discountPrice === item.price ? null : <Text className="originalPrice">￥{item.price}</Text>}
                      <Image
                        className="sign"
                        src={item.sign == undefined ? null : utils.transWebp(item.sign)}
                        lazyLoad={true}
                      ></Image>
                    </View>
                  </View>
                </View>
              )
            })
          )}
          {hotGoodsList.length != 0 ? (
            this.state.isEmpty ? (
              <Text className="bottomTip">-已经没有数据了-</Text>
            ) : (
              <Loading color={'#109b9a'}></Loading>
            )
          ) : null}
        </View>
      </View>
    )
  }
}
