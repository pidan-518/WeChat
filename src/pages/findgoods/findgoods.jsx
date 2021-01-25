import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import "../../common/globalstyle.less";
import "./findgoods.less";
import { postRequest } from "../../common/util/request";
import servicePath from "../../common/util/api/apiUrl";
import utils from "../../common/util/utils"

export default class Findgoods extends Component {
	constructor(props) {
		super(props);
		this.state = {
			goodsList: [], //商品列表
			tabsIndex: 0, // tabs id
			tabsList: [{ image: '' }],// 分类tab数据
			tabScroll: 0, // tabs自动偏移
			windowWidth: '', // 窗口总大小
			currentPage: 1, //当前页
			pageTotal: 1, //总页数
			loading: false,//上拉加载动画
			line: true,//到底显示
			limit: true,//限流阀 防止上拉多次请求
			backtop:false,//是否显示到顶
		}
	}
	config = {
		navigationBarTitleText: '好物推荐',
		// navigationBarColor:'#fffff',
		onReachBottomDistance: 50,
		// navigationStyle: "custom",
		navigationBarBackgroundColor: "#6868DB",
		navigationBarTextStyle: "white"
	}
	componentWillMount() { }

  componentDidMount() {
    //获取屏幕宽度
    Taro.getSystemInfo({
      success: (res) => {
        this.setState({
          windowWidth: res.windowWidth,
        });
      },
    });
	this.getProductList();
	utils.updateRecommendCode(this.$router.params.shareRecommend)
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

	//头部bar切换
	handleTabsClick = (e, index) => {
		if (this.state.tabsIndex !== index) {
			let actId = this.state.tabsList[index].categoryComId
			console.log(actId, 'categoryComId')
			let tabWidth = this.state.windowWidth;
			const query = Taro.createSelectorQuery();
			query.select('.tabsItem').boundingClientRect();
			query.exec(res => {
				this.setState({
					tabScroll: (e.currentTarget.offsetLeft - tabWidth / 2) + (res[0].width / 2),
					tabsIndex: index,
					goodsList: [],
					currentPage: 1,
					pageTotal: 1,
					loading: false,
					line: true,
				},
					() => { this.getGoodsList(1, actId), console.log(e.currentTarget.offsetLeft, this.state.tabScroll) }
				);
			})
		}
	}

	//跳转商品详情
	handleClickGood = (item) => {
		Taro.navigateTo({
			url: `/pages/goodsdetails/goodsdetails?itemId=${item.itemId}`
		})
	}
	//获取头部导航列表
	getProductList = () => {
		postRequest(servicePath.getItemListByKey, {
			"key": "FOUND_GOOD_THINGS", "source": "10",
		})
			.then(response => {
				console.log("获取头部导航列表成功", response);
				// let tab = []
				// response.data.data.forEach((element) => {
				// 	tab.push({ title: element.name, activityId: element.activityId })
				// })
				this.setState({ tabsList: response.data.data[0].itemCategoryList }, () => {
					// let actId = this.state.tabsList[0].activityId
					// this.getGoodsList(1, actId), console.log(this.state.tabsList, this.state.goodsList)
					console.log('列表首个categoryComId', this.state.tabsList[0].categoryComId), this.getGoodsList(1, this.state.tabsList[0].categoryComId)
				})
			})
			.catch(err => {
				console.log("获取列表失败", err);
			})
	}
	//获取分类查询活动商品列表
	getGoodsList = (currentPage = 1, categoryComId) => {
		postRequest(servicePath.getItemByComIds, {
			"source": "10",
			"current": currentPage,
			"len": 10,
			"comIds": [categoryComId]
		})
			.then(response => {
				console.log("获取分页查询活动商品", response);
				this.setState(prevState => {
					return {
						goodsList: [...prevState.goodsList, ...response.data.data.records],
						currentPage: response.data.data.current,
						pageTotal: Math.ceil(response.data.data.total / 10),
						loading: false,
						limit: true
					}
				}, () => { console.log('1142', this.state.goodsList, this.state.currentPage, this.state.pageTotal) })
			})
			.catch(err => {
				console.log("获取列表失败", err);
			})
	}
	//上拉加载
	onReachBottom() {
		if (!this.state.limit) { return; }
		this.setState({ limit: false })
		if (this.state.currentPage < this.state.pageTotal) {
			console.log('上拉')
			let ind = this.state.tabsIndex
			let actId = this.state.tabsList[ind].categoryComId
			this.getGoodsList(this.state.currentPage + 1, actId)
			this.setState({ loading: true, line: true })
		} else {
			this.setState({ line: false, loading: false })
			console.log('到底了')
		}
	}
	//点击图片跳转
	handleNavigateTo = () => {
		const { tabsList, tabsIndex } = this.state
		console.log(tabsList[tabsIndex].url, '232322')
		let str = tabsList[tabsIndex].url
		utils.mutiLink(str)
	}
	//小程序分享
	onShareAppMessage () {
		const shareRecommend = Taro.getStorageSync('shareRecommend');
		return {
		  title: '爱港猫好物种草机，平价正货随便买！',
		  path: `pages/findgoods/findgoods?shareRecommend=${shareRecommend}`,
		  imageUrl: 'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/share/findgoods-image.jpg'
		}
	  }
	  //点击回到顶部
	  clickTop=()=>{
		// console.log(this.content,this.tabsContent,'123321');
		Taro.pageScrollTo({
			scrollTop: 0,
			duration: 300
		  })
		
	  }
	  //滚动事件
	  onPageScroll(e){
		if( e.scrollTop > 1000){
			!this.state.backtop && this.setState({
				backtop:true
			})
		}else{
			this.state.backtop && this.setState({
				backtop:false
			})
		}	
	  }
	render() {
		const { goodsList, tabScroll, tabsList, tabsIndex } = this.state
		let image = ((tabsList[tabsIndex] ||'').image == null ? ' ' : (tabsList[tabsIndex]).image)
		let nomore = goodsList.length
		console.log(nomore)
		return (
			<View className="specialOfferCategory">
				{/* <View className='navigationStyle' style={{paddingTop: `${Taro.$navBarMarginTop}px`}}>
					<View className='title'>发现好物</View>
				</View> */}
				<ScrollView scrollX="true" className="categoryTabs" scrollLeft={tabScroll} scrollWithAnimation /*style={{top: `${contentTop}px`}}*/>
					{
						tabsList.map((item, index) =>
							<View
								className={index === tabsIndex ? "tabsItem itemSelect" : "tabsItem"}
								key={item.id}
								onClick={(e) => { this.handleTabsClick(e, index) }}
							>
								<View className="itemTxt">{(item.title == null || item.title == "") ? item.name : item.title}</View>
							</View>
						)
					}
				</ScrollView>
				<View className='content' ref ={el =>this.content = el} >
					<View className='background' onClick={this.handleNavigateTo}>
						<Image className='backgroundImage' src={utils.transWebp(image)} ></Image>
					</View>
					{/* <View className='blank' hidden={goodsList.length == 0 ? false : true}>
							<View style='text-align:center;font-size:12px' >--暂无数据--</View>
						</View>  */}
					<View className="tabsContent" ref={el => this.tabsContent = el}>
						{goodsList.map((item) =>
							<View className='goodList' key={item.itemId} onClick={() => { this.handleClickGood(item) }}>
								<View className='leftImg'>
									<Image className='image' src={utils.transWebp(item.image)} />
								</View>
								<View className='rightText' >
									<Text className='goodsTitle'>{item.itemName}</Text>
									<Text className='goodsContent'>{item.itemIntro == null ? '' : item.itemIntro}</Text>
									<View className='goodsfoot'>
										<View className='goodsPrice'>
											<Text className='Price'>￥{item.discountPrice}</Text>
											<Text className={item.discountPrice == item.price ? 'hidden' : 'discountPrice'} hidden={true}>￥{item.price}</Text>
										</View>
										<View className='goodsCat' >查看详情</View>
									</View>
								</View>
							</View>)}
							<View className={ nomore == 0 ? "noList" : 'list'} >
						  {this.state.loading == true
							  ? <View className='load-more'>
								  <span></span>
								  <span></span>
								  <span></span>
								  <span></span>
								  <span></span></View>
							  : ''}
						  <View  style='text-align:center;font-size:12px;' hidden={this.state.line}>--没有更多了--</View>
						  {/* <View  style='text-align:center;font-size:12px;' hidden={this.state.goodsList.length}>--没有数据--</View> */}
					  </View>
					</View>
				</View>
				<View id='backTop' className = "backtop" hidden={!this.state.backtop} onClick={this.clickTop}> <Image className="topImage" src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/public/top.png" alt=""/></View>
			</View>
		)
	}
}
