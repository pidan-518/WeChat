import { postRequest } from './request'
import ServicePath from '../../common/util/api/apiUrl'
import Taro from '@tarojs/taro'

export default {
  /**
   * 绑定、存储代理码
   */
  updateRecommendCode: (shareRecommend) => {
    if (shareRecommend) {
      const registerRecommend = shareRecommend // 代理码，注册、购物分佣两用
      const recommendTime = Date.now() // 打开分享链接的时间
      const postData = {
        recommend: registerRecommend,
        recommendTime
      }   
      postRequest(ServicePath.updateRecommendCode, postData)
        .then(res => {
          if (res.data.code === 0) {}
          else {
            Taro.setStorage({
              key: 'registerRecommend',
              data: registerRecommend
            })
            Taro.setStorage({
              key: 'recommendTime',
              data: recommendTime
            })
          }
        })
    }
  },
  /**
   * webp图片转换
   */
  transWebp: (url) => {
    if (url.indexOf('.webp') !== -1) {
      return `${url}?x-oss-process=image/format,png`
    } else {
      return url
    }
  },
  /**
   * 根据运营配置的url形式，跳转不同页面
   * 规则详见gitlab文档：docs\前端文档\公共\跳转配置格式表.xlsx
   */
  mutiLink: (url) => {
    // 获取页面名、参数
    let pageName = '' // 页面名
    let paramsString = '' // 参数字符串（带问号）
    let paramsObject = {} // 参数对象
    const pageNameIndex = url.lastIndexOf('/')
    const paramsIndex = url.indexOf('?')
    pageName = paramsIndex !== -1 ? url.substring(pageNameIndex + 1, paramsIndex) : url.substring(pageNameIndex + 1)
    paramsString = paramsIndex !== -1 ? url.substring(paramsIndex) : ''
    const querystring = require('querystring') 
    paramsObject = querystring.parse(paramsString.substring(1))
    // http、https情况
    if (url.match('https://') || url.match('http://')) {
      if (url.match('/#/pagesapp/')) { // 爱港猫h5普通页，跳转对应小程序普通页
        Taro.navigateTo({
          url: `/pages/${pageName}/${pageName}${paramsString}`
        })
      } else if (url.match('/#/pageAapp/')) { //爱满猫h5活动页，跳转对应小程序活动页
        Taro.navigateTo({
          url: `/pageA/${pageName}/${pageName}${paramsString}`
        })
      } else { // 其它网站url，直接跳转
        Taro.navigateTo({
          url: `/pages/WebView/WebView?link=${url}`
        })
      }
    } 
    // iconmall情况
    else if (url.match('iconmall://')) { // iconmall格式数据
      switch (pageName) {
        case 'goodsdetail': // 商品详情页
          Taro.navigateTo({
            url: `/pages/goodsdetails/goodsdetails?itemId=${paramsObject.id}`
          })
          break;
        case 'shophome': // 店铺首页
          Taro.navigateTo({
            url: `/pages/shophome/shophome?businessId=${paramsObject.id}`
          })
          break;
        case 'coupon': // 优惠券页
          Taro.navigateTo({
            url: `/pages/certificate/certificate`
          })
          break;
        case 'searchresult': // 商品搜索结果页
          if (paramsObject.key) {
            Taro.navigateTo({
              url: `/pages/searchpage/searchpage?hotText=${paramsObject.key}`
            });
          } else {
            Taro.navigateTo({
              url: `/pages/categoryGoods/categoryGoods?comIds=${[paramsObject.id]}`
            });
          }
          break;
        case 'drpjoin':
          Taro.navigateTo({
            url: `/pages/drpjoin/drpjoin?shareRecommend=${paramsObject.recommend}`
          })
        default:
          break;
      }
    }
  }
}