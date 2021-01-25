import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image,ScrollView } from '@tarojs/components'
import './brand.less'
import { postRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';
import utils from '../../common/util/utils';

import bgImage from '../../static/hotlist/swiper.png'

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bottom: true,
      id:0,
      border: 0,
      list: [],
      top:[],
      detailList: [],
      isBottom: false,
      current:1,
      pages:1,
      brandCategoryId:'',
      moveStart:'',
      scrollId: '',
    }
  }
  componentWillMount () { }

  componentDidMount () {
    this.getBrandCategoryList()
   }

  componentWillUnmount () { }

  componentDidShow () { 
    utils.updateRecommendCode(this.$router.params.shareRecommend); //绑定、存储代理码
  }

  componentDidHide () { }
  // 上拉事件
  onReachBottom() {
    console.log('到底了');
    if (this.state.current === this.state.pages) {
      console.log("进入");
      if(this.state.id!=this.state.list.length-1){
        this.setState({
          isBottom:true,
        })
      }
    } else if (this.state.pages !== 0) {
      Taro.showLoading({
        title: '正在加载...'
      })
      this.getBrandSessionList(this.state.current + 1,this.state.brandCategoryId)
    }
  }
  onShareAppMessage () {
    const shareRecommend = Taro.getStorageSync('shareRecommend');
    return {
      title: '优质品牌，低价闪购，每日上新别错过！',
      path: `pages/brand/brand?shareRecommend=${shareRecommend}`,
      imageUrl:'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/share/brand-image.jpg'
    }
  }

  getBrandCategoryList() {
    postRequest(servicePath.getBrandCategoryList, {source:10})
      .then(res => {
        console.log("获取品牌分类列表成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            list:res.data.data,
            brandCategoryId:res.data.data[0].id
          })
          this.getBrandSessionList(1,res.data.data[0].id)
        }
      })
      .catch(err => {
        console.log("获取品牌分类列表失敗", err);
      })
  }
  getBrandSessionList(current,brandCategoryId) {
    postRequest(servicePath.getBrandSessionList, {source:10,brandCategoryId,current,len:4,})
      .then(res => {
        console.log("获取品牌分类列表成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            isBottom:false,
            detailList: current==1?[...res.data.data.records]:[...this.state.detailList,...res.data.data.records],
            current:res.data.data.current,
            pages:res.data.data.pages,
            brandCategoryId,
          })
          Taro.hideLoading();
        }
      })
      .catch(err => {
        console.log("获取品牌分类列表失敗", err);
      })
  }
  getNavigate(item){
    Taro.navigateTo({
      url:'/pages/brandlist/brandlist?brandId='+item.brandId+'&name='+item.title
    })
    Taro.setStorageSync('brandImage',item.insideImage?item.insideImage:item.image)
  }
  getNavigateApp=(e,item)=>{
    console.log(item,'11111111');
     Taro.navigateTo({
        url: `/pages/goodsdetails/goodsdetails?itemId=${item.itemId}`,
      })
    e.stopPropagation();
  }
  getmoreList=()=>{
    this.setState({
      bottom:!this.state.bottom,
    })
  }
  getSelectList=(e,type)=>{
    this.getBrandSessionList(1,this.state.list[e].id)
    this.setState({
      brandCategoryId:this.state.list[e].id,
      id:e,
      scrollId:'a'+e,
      bottom:type=='dai'?!this.state.bottom:this.state.bottom
    })
    // document.getElementById('div1').scrollLeft= document.getElementById('a'+e).offsetLeft
    Taro.pageScrollTo({
      scrollTop:0,
      duration:100,
    })
  }
  onTouchEnd(e){
    console.log('endendend',e.changedTouches[0].clientY,this.state.moveStart);
    if(this.state.moveStart-e.changedTouches[0].clientY>200){
      console.log('jinru');
      console.log('this.state.isBottom',this.state.isBottom);
      if(this.state.isBottom){
        this.setState({
          id:this.state.id + 1,
          isBottom:false,
        },()=>{
          console.log(this.state.id);
          this.getBrandSessionList(1,this.state.list[this.state.id].id)
          Taro.pageScrollTo({
            scrollTop:0,
            duration:600,
          })
          // document.getElementById('div1').scrollLeft= document.getElementById('a'+this.state.id).offsetLeft
        })
      }
    }
  }
  onTouchStart(e){
    // console.log('startstart',e.changedTouches[0].clientY,document.getElementById('div2').scrollTop);
    if(this.state.isBottom){
      this.setState({
        moveStart: e.changedTouches[0].clientY
      })
    }
  }
  onTouchMove(e){
    // console.log(e.changedTouches[0]);
  }
  config = {
    navigationBarTitleText: '品牌闪购',
    onReachBottomDistance: 2,
    navigationBarBackgroundColor: '#562FC3',
    navigationBarTextStyle: 'white'
  }

  render () {
    const { bottom,list,id,border,detailList,isBottom,current,pages,scrollId } = this.state
    return (
      <View className='brand' id='div2'>
        {/* onTouchMove={(e)=>this.onTouchMove(e)} onTouchStart={(e)=>this.onTouchStart(e)} onTouchEnd={(e)=>this.onTouchEnd(e)}  */}
        <View className="topTab">
          <ScrollView className="scrollView" id='div1' scrollX={true} scrollIntoView={scrollId}>
            {
              list.map((item,index)=>{
                return <View className={id==index?"item on":'item'} onClick={this.getSelectList.bind(this,index,'top')}  key={item.id}>
                  <Text className="no" id={'a'+index}></Text>
                  {item.title}
                </View>
              })
            }
          </ScrollView>
          <View className="list" onClick={this.getmoreList}>分类</View>
          <View className={bottom?"posi":'posi on'}>
            {
              list.map((item,index)=>{
                return <View className={id==index?"item on":'item'} key={item.id} onClick={this.getSelectList.bind(this,index,'dai')}>{item.title}</View>
              })
            }
          </View>
          {bottom?'':<View className="model"  onClick={this.getmoreList}></View>}
        </View>
        <View className="bottom" >
            <View className="rio">
              <View className="blue" style={'transform:scaleX('+1*border+')'}></View>
            </View>
              {
                detailList.map((item,index)=>{
                      return <View key={item.id} className="brandList" onClick={this.getNavigate.bind(this,item)}>
                      <Image className="bg" src={utils.transWebp(item.image?item.image:'')}></Image>
                      <View className="itemList">
                        {
                          item.itemList?item.itemList.map((itemA,indexA)=>{
                            return <View key={itemA.id} className="good" onClick={(e)=>this.getNavigateApp(e,itemA)}>
                              <Image className="pic" src={utils.transWebp(itemA.image)}></Image>
                              <View className="price">￥{itemA.discountPrice} {itemA.discountPrice!=itemA.price?<Text className="old">￥{itemA.price}</Text>:''}</View>
                            </View>
                          }):''
                        }
                      </View>
                    </View>
                })
              }
              {
                current==pages?<View className="more">-没有更多啦-</View>:''
              }
        </View>
        
      </View>
    )
  }
}
