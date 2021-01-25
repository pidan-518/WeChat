import Taro, { Component, getCurrentPages } from "@tarojs/taro";
import {
  View,
  Text,
  Image,
  Swiper,
  SwiperItem,
  ScrollView,
} from "@tarojs/components";
import "./loveRobPurchase.less";
import servicePath from "../../common/util/api/apiUrl"; //接口
import { postRequest, CarryTokenRequest } from "../../common/util/request";
import utils from "../../common/util/utils";

export default class loveRobPurchase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentTop: "",
      tabScroll: 0,
      activityTag: "PANIC_BUYING", //活动标签-爱抢购
      source: 50,
      tabIn: 0, //tabs id
      subscript: 0,
      currentPage: 1, //当前页
      pageTotal: 1, //总页数
      loading: false, //上拉加载动画
      line: true, //到底显示
      activityList: [{}], //活动数据列表
      goodsList: [], //商品列表
      tabTimeList: [], //时间tab数据
      activityId: [], //活动ID
      activeState: [], //活动状态
      windowWidth: "", //窗口总大小
      sessionsId: [], //活动场次id
      shareState: false, //分享状态(false=直接进入,ture=分享链接进入)
    };
  }
  componentWillMount() {}

  componentDidMount() {
    // this.gobackIndex(console.log('11111'))

    // 获取屏幕宽度
    Taro.getSystemInfo({
      success: (res) => {
        this.setState({
          windowWidth: res.windowWidth,
        });
      },
    });

    // console.log(new Date().getHours() + ":00");

    // 假设app跳转传过来的参数为：0
    let actId = this.$router.params.activityId; //43;  //app首页传的对应场次的值
    let sessionsId = this.$router.params.sessionsId; //传的值
    let shareState = this.$router.params.share; //传的值
    // let startTime = decodeURI(this.$router.params.startTime); //app首页传的活动开始时间
    // let endTime = decodeURI(this.$router.params.endTime); //app首页传的活动开始时间
    console.log("路由接接收值", this.$router.params);
    // let startTime = "2021-01-05 01:00:00";
    // let endTime = "2021-01-05 02:00:00";
    let Swiperindex = null;

    // 获取活动接口
    postRequest(servicePath.getActivitiesList, {
      activityTag: this.state.activityTag,
      source: this.state.source,
    })
      .then((res) => {
        let timeList = res.data.data; //自定义获取到的数据

        // 模拟未开始场次
        // timeList = timeList.slice(0,1)
        // console.log(timeList);

        //遍历数据
        timeList.forEach((e, index) => {
          // console.log("首页传值", e);
          timeList[index].startTimes = e.startTime.split(" ")[1].slice(0, 5); //截取  小时-分
          if (
            actId == e.activityId &&
            sessionsId == e.sessionsId
            // startTime == e.startTime &&
            // endTime == e.endTime
          ) {
            // console.log(index, 898989);
            Swiperindex = index;
          }
        });

        if (Taro.setStorageSync("tabIn")) {
          //接口判断如果有
          Swiperindex = Number(Taro.sessionStorage.getItem("tabIn")); //使高亮下标相等
        }

        if (Swiperindex == null) {
          Swiperindex = 0;
          // console.log("11111", Swiperindex.startTime);
        }
        // console.log("页面初始化获取时间列表：", res.data.data);

        // 根据活动id，发送请求获得商品列表
        this.getActivityItemId(1, {
          activityId: timeList[Swiperindex].activityId,
          sessionsId: timeList[Swiperindex].sessionsId,
          // startTime: timeList[Swiperindex].startTime,
          // endTime: timeList[Swiperindex].endTime,
        });

        // 检测是否无数据
        this.onReachBottom();

        // 判断进入活动页后的活动状态
        // if () {
        if (timeList[Swiperindex].activeState === 2 && shareState) {
          Taro.switchTab({
            url: `/pages/index/index`,
          });
        }
        // }

        // console.log("场次状态", timeList[Swiperindex].activeState);

        this.setState(
          {
            tabIn: Swiperindex, // 高亮下标
            subscript: Swiperindex,
            activityList: timeList, // 将自定义的数据赋值给 state 中的activityList
            activityId: timeList[Swiperindex].activityId, // 活动ID
            activeState: timeList[Swiperindex].activeState, //活动状态
            sessionsId: timeList[Swiperindex].sessionsId, //场次id
            // startTime: timeList[Swiperindex].startTime, //开始时间
            // endTime: timeList[Swiperindex].endTime, //结束时间
          },
          () => {
            // console.log(this.state.startTime, "被点击的开始时间");
            // 判断传值的活动id是否相等或不存在
            if (actId !== String(this.state.activityId) || actId == undefined) {
              Taro.switchTab({
                url: `/pages/index/index`,
              });
            }
          }
        );
      })
      .catch((err) => {});
  }

  componentWillUnmount() {}

  componentDidShow() {
    utils.updateRecommendCode(this.$router.params.shareRecommend); //代理人

    Taro.createSelectorQuery()
      .select(".tabbar-nav")
      .boundingClientRect((rect) => {
        this.setState({
          contentTop: rect.height,
        });
      })
      .exec();
  }

  componentDidHide() {
    Taro.setStorageSync("tabIn", ""); //清空
  }

  // 据活动ID分页查询活动商品接口
  getActivityItemId(currentPage = 1, param = {}) {
    postRequest(servicePath.getActivityItemId, {
      source: 50,
      current: currentPage,
      len: 5,
      activityId: param.activityId, //this.state.activityId
      sessionsId: param.sessionsId,
      // startTime: param.startTime,
      // endTime: param.endTime,
    })
      .then((res) => {
        // console.log("根据场次获取商品成功：", res.data.data);
        this.setState(
          {
            goodsList: [...this.state.goodsList, ...res.data.data.records], //商品列表
            currentPage: res.data.data.current, //当前页
            pageTotal: res.data.data.pages, //总页数
          }
          // () => console.log("总页数", this.state.pageTotal)
        );
      })
      .catch((res) => {
        console.log(res, 44444444);
      });
  }

  // 上拉加载
  onReachBottom() {
    this.setState({
      loading: false,
      line: false,
    });
    // console.log("上拉");
    if (this.state.currentPage < this.state.pageTotal) {
      let ind = this.state.tabIn;
      let actId = this.state.activityList[ind];
      this.getActivityItemId(this.state.currentPage + 1, actId);
      this.setState({
        loading: true,
        line: true,
      });
    } else {
      this.setState({ line: false, loading: false });
      // console.log("到底了");
    }
  }

  // 点击获取当前抢购时间的滑块
  getSelect = (e, index) => {
    Taro.setStorageSync("tabIn", index); //存高亮(被点击)index
    if (this.state.tabIn != index) {
      const actId = this.state.activityList[index].activityId;
      const sessionsId = this.state.activityList[index].sessionsId;
      // const startime = this.state.activityList[index].startTime;
      // const endtime = this.state.activityList[index].endTime;
      let tabWidth = this.state.windowWidth;
      const query = Taro.createSelectorQuery();
      query.select(".robTimes-item").boundingClientRect();
      query.exec((res) => {
        this.setState(
          {
            currentPage: 1,
            tabScroll:
              e.currentTarget.offsetLeft - tabWidth / 2 + res[0].width / 2,
            tabIn: index,
            goodsList: [],
            // activityId: this.state.tabIn, //活动 id = tabs id
            line: false, // 切换场次的时候，底部提示应该重置
            activityId: actId,
            sessionsId: sessionsId,
            // startTime: startime,
            // endTime: endtime,
          },
          () => {
            // this.getActivitiesList(1, { activityId: actId })
            this.getActivityItemId(1, {
              activityId: actId,
              sessionsId: sessionsId,
              // startTime: startime,
              // endTime: endtime,
            });
            // this.onReachBottom(); // 检测是否无数据
          }
        );
      });
    }
  };

  // 分享小程序
  onShareAppMessage() {
    const shareRecommend = Taro.getStorageSync("shareRecommend");
    const activityId = this.state.activityId; //活动id
    const sessionsId = this.state.sessionsId; //场次id
    const share = true;
    // this.setState({
    //   share: ture,
    // });
    // const startTime = this.state.startTime; //活动开始时间
    // const endTime = this.state.endTime; //活动结束时间
    return {
      title: "【爱抢购】百款商品超低价，每日定时开抢！",
      path: `pages/loveRobPurchase/loveRobPurchase?shareRecommend=${shareRecommend}&activityId=${activityId}&sessionsId=${sessionsId}&share=${share}`,
      imageUrl:
        "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/share/love-image.jpg",
    };
  }

  // 返回上一页
  gobackIndex() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]; //上一页
    if (prevPage !== undefined) {
      // console.log("有上级页面");
      Taro.navigateBack({
        url: prevPage.route, //返回上一级页面
      });
    } else if (prevPage === undefined) {
      // console.log("没有上级页面");
      Taro.switchTab({
        url: `/pages/index/index`,
      });
    }
  }

  //跳转商品详情
  handleClickGood = (item) => {
    Taro.navigateTo({
      url: `/pages/goodsdetails/goodsdetails?itemId=${item.itemId}`,
    });
  };

  config = {
    navigationBarTitleText: "爱抢购",
    onReachBottomDistance: 10, //设置距离底部距离(监听页面滑动)
    navigationStyle: "custom",
    navigationBarTextStyle: "white",
    // enablePullDownRefresh: true,
  };

  render() {
    const { activityList, goodsList, tabScroll } = this.state;

    return (
      //爱抢购 页面
      <View className="app-loveRobPurchase">
        {/* 抢购时间开始 */}
        <View>
          {/* style={{ marginTop: `${contentTop}px` }} */}
          <View className="swiperIndex">
            <View className="topTop">
              <View
                className="tabbar-nav"
                style={{ paddingTop: `${Taro.$navBarMarginTop}px` }}
              >
                <View className="tabbar">
                  <View className="slices" onClick={this.gobackIndex}></View>
                  <View className="text">爱抢购</View>
                </View>
              </View>
              <ScrollView
                className="robTimes"
                scrollX={true}
                scrollWithAnimation={true}
                scrollLeft={tabScroll}
                // style={{top: `${contentTop}px`}}
                scrollIntoView={"a" + this.state.subscript}
                // scrollTop={activityId}
              >
                {activityList.map((item, index) => {
                  return (
                    <View
                      id={"a" + index}
                      className={
                        this.state.tabIn == index ? "active" : "robTimes-item"
                      }
                      onClick={(e) => {
                        this.getSelect(e, index);
                      }}
                    >
                      <View className="item-time">
                        {/* {item.activeState == 2 ? "" : item.startTime} */}
                        {item.startTimes}
                      </View>
                      <View className="item-text">
                        {/* {item.activeState == 1
                          ? " 进行中"
                          : item.activeState == 0
                          ? item.activitySession
                          : null} */}
                        {item.activitySession}
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
          {/* 抢购时间结束 */}
          {/* 背景底色开始 */}
          <View className="bgColor">
            {/* 抢购商品列表开始 */}
            <View
              className={
                this.state.activityList[this.state.tabIn].activeState === 2 ||
                this.state.activityList[this.state.tabIn].activeState === 0
                  ? "robGoods-hide"
                  : "robGoods"
              }
            >
              {this.state.activityList[this.state.tabIn].activeState == 0 ? (
                <View className="robGoods-mask">
                  <View className="mask-title">即将开始</View>
                </View>
              ) : this.state.activityList[this.state.tabIn].activeState == 2 ? (
                <View className="robGoods-mask">
                  <Text className="mask-title">抢购已结束</Text>
                </View>
              ) : null}
              <View
                className="robGoods-list"
                // style={{ marginTop: `${contentTop}px ` }}
              >
                {goodsList.map((item, index) => {
                  return (
                    <View
                      className="list-item"
                      onClick={this.handleClickGood.bind(this, item)}
                    >
                      <View className="item-left">
                        <Image
                          className="goodsImg"
                          // src={item.itemImage}
                          src={utils.transWebp(item.itemImage)}
                        />
                      </View>
                      <View className="item-right">
                        <View
                          className="right-top"
                          style={{ "-webkit-box-orient": "vertical" }}
                        >
                          {item.itemName}
                        </View>
                        <View
                          className="right-middle"
                          style={{ "-webkit-box-orient": "vertical" }}
                        >
                          {item.itemIntro !== null ? item.itemIntro : ""}
                        </View>

                        <View className="right-bottom">
                          <View className="activity-price">
                            ￥
                            {item.promotionPrice == null
                              ? item.discountPrice
                              : item.promotionPrice}
                          </View>
                          <View
                            className="price"
                            style={{
                              display:
                                item.discountPrice === item.price
                                  ? "none"
                                  : null,
                            }}
                          >
                            ￥{item.price}
                          </View>
                          <View className="redirect">去抢购</View>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
              <View className="no-more" hidden={this.state.line}>
                -没有更多啦-
              </View>
            </View>
            {/* 抢购商品列表结束 */}
          </View>
          {/* 背景底色结束 */}
        </View>
      </View>
    );
  }
}
