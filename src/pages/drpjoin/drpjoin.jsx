import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import './drpjoin.less'
// import banner from '../../static/scattered/banner.png'


export default class DrpJoin extends Component {

  componentWillMount () {
    console.log(this.$router.params)
   }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () {
    const drpRecommend = this.$router.params.shareRecommend  //代理码，注册、购物分佣两用
    Taro.setStorage({
      key: 'drpRecommend',
      data: drpRecommend
    })
  }

  componentDidHide () { }


  //点击加入事件
  handleJoin = () => {
    Taro.navigateTo({
      url: `../drpgoods/drpgoods`
    })
  }


  config = {
    navigationBarTitleText: '电商达人'
  }

  render () {
    return (
      //团队详情 页面
      <View className='h5-electricity'>
        {/* 顶部banner开始 */}
        <View className='h5-electricity-banner'>
          <View className='electricity-banner-img'>
            <Image src={'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/drp/drpbanner.png'} alt=""/>
          </View>
        </View>
        {/* 顶部banner结束 */}
        {/* 底部内容开始 */}
        <View className='h5-electricity-content'>
          <View className='electricity-content-pay'>
            <View className='electricity-pay-text'>
              <Text className='pay-text-content1'>资格：</Text>
              <Text className='pay-text-content2'>缴纳</Text>
              <Text className='pay-text-content3'> 486 </Text>
              <Text className='pay-text-content4'>元</Text>
            </View>
          </View>
          <View className='electricity-content-textcontent'>
            <View className='content-textcontent-title'>
              <Text>收益</Text>
            </View>
            <View className='content-textcontent-title1'>
              <Text className='title1-content'>自购/分享5%-50%收益</Text>
              <Text className='title1-content'>介绍费100元/人</Text>
            </View>
          </View>
          <View className='electricity-content-btn'>
            <View className='content-btn' onClick={this.handleJoin}>
              <Button className='btn'>点击加入</Button>
            </View>
          </View>
        </View>
        {/* 底部内容结束 */}
      </View>
    )
  }
}
