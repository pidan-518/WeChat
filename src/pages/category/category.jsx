import Taro, { Component } from "@tarojs/taro";
import { ScrollView, Swiper, SwiperItem, View } from "@tarojs/components";
import "./category.less";
import "../../common/globalstyle.less";
import servicePath from "../../common/util/api/apiUrl";
import { postRequest } from "../../common/util/request";
import utils from "../../common/util/utils";

class CateGory extends Component {
  state = {
    hotText: "", // 搜索框placeholder值
    hotArr: [], // 热搜词list
    screenHeight: "", // scrollView高度
    leftList: [], // 左边分类数据
    rightList: [], // 右边分类数据
    leftId: "",
    emptyImg:
      "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/category/empty.png",
    swiperData: "",
    categoryTitle: "", // 分类标题
  };

  // 搜索框点击事件
  handleSearchInputClick = () => {
    Taro.navigateTo({
      url: `/pages/searchpage/searchpage?hotText=${this.state.hotText || ""}`,
    });
  };

  // 左边分类点击事件
  handleLeftCategory = (item) => {
    this.setState({
      leftId: item.id,
      rightList: item.itemCategoryList,
      swiperData: item.imageList,
      categoryTitle: item.subTitle,
    });
  };

  // 轮播图点击事件
  handleBannerClick = (item) => {
    const { leftList } = this.state;
    for (let idx of leftList) {
      if (idx.image === item) {
        console.log(idx.url);
        utils.mutiLink(idx.url);
      }
    }
  };

  // 获取热搜词
  getHotSearchWord = () => {
    const postData = {
      len: 30,
      current: 1,
    };
    postRequest(servicePath.hotSearchWord, postData)
      .then((res) => {
        console.log("获取热搜词成功", res.data);
        if (res.statusCode === 200) {
          const hotArr = [];
          res.data.records.forEach((item) => {
            hotArr.push(item.title);
          });
          this.setState({
            hotArr,
            hotText: hotArr[Math.floor(Math.random() * hotArr.length)],
          });
        }
      })
      .catch((err) => {
        console.log("返回数据失败", err);
      });
  };

  // 获取左边分类
  getCategory = () => {
    postRequest(servicePath.getBottomCategoryNavigation, {
      source: 10,
    })
      .then((res) => {
        console.log("获取分类成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            leftList: res.data.data,
            leftId: res.data.data[0].id,
            rightList: res.data.data[0].itemCategoryList,
            swiperData: res.data.data[0].imageList,
            categoryTitle: res.data.data[0].subTitle,
          });
        }
      })
      .catch((err) => {
        console.log("获取分类接口异常");
      });
  };

  // 上拉加载
  onReachBottom() {}

  componentWillMount() {}

  componentDidMount() {
    this.getHotSearchWord();
    this.getCategory();
    Taro.getSystemInfo({}).then((res) => {
      this.setState({
        screenHeight: res.windowHeight - Taro.$navBarMarginTop - 45,
      });
    });
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  componentDidShow() {
    const hotArr = this.state.hotArr;
    this.setState({
      hotText: hotArr[Math.floor(Math.random() * hotArr.length)],
    });

    utils.updateRecommendCode(this.$router.params.shareRecommend); //绑定、存储代理码
  }

  componentDidHide() {}

  onShareAppMessage() {
    const shareRecommend = Taro.getStorageSync("shareRecommend");
    return {
      imageUrl:
        "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/share/index-share-image.jpg",
      title: "香港直邮，急速发货，一站式购齐全球品质好物！",
      path: `pages/category/category?shareRecommend=${shareRecommend}`,
    };
  }

  config = {
    onReachBottomDistance: 50,
    navigationStyle: "custom",
  };

  render() {
    const {
      screenHeight,
      leftList,
      leftId,
      rightList,
      emptyImg,
      swiperData,
      categoryTitle,
    } = this.state;

    return (
      <View id="category">
        <View
          className="category-head"
          style={{ paddingTop: `${Taro.$navBarMarginTop}px` }}
        >
          <View className="nav--box" onClick={this.handleSearchInputClick}>
            <View className="nav-input">
              <Image src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/home/search-icon.png" />
              <Input disabled type="text" placeholder={hotText || ""} />
            </View>
          </View>
        </View>
        <View className="category-content">
          <ScrollView
            style={{ height: `${screenHeight}px` }}
            className="left-scroll"
            scrollY
            scroll-with-animation="true"
          >
            {leftList.map((item) => (
              <View
                key={item.id}
                onClick={this.handleLeftCategory.bind(this, item)}
                className={` ${
                  item.id === leftId ? "left-item-ac" : "left-item"
                }`}
              >
                {item.name}
              </View>
            ))}
          </ScrollView>
          <ScrollView
            className="right-scroll"
            style={{ height: `${screenHeight}px` }}
            scrollY
          >
            <View className="right-content">
              <View className="right-wrap">
                <Swiper
                  className="swiper-wrap"
                  autoplay
                  circular
                  indicatorDots
                  indicatorActiveColor="#ff5d8c"
                  indicatorColor="#fff"
                >
                  {swiperData.map((item, index) => (
                    <SwiperItem key={index}>
                      <Image
                        onClick={this.handleBannerClick.bind(this, item)}
                        className="swiper-item-img"
                        src={item}
                        webp
                      />
                    </SwiperItem>
                  ))}
                </Swiper>
              </View>
              <View className="right-title">
                <View className="title-img">
                  <Text>{categoryTitle}</Text>
                </View>
              </View>
              <View className="right-list">
                {rightList.map((item) => (
                  <Navigator
                    url={`/pages/categoryGoods/categoryGoods?comIds=${item.categoryComId}`}
                    key={item.id}
                  >
                    <View className="list-item">
                      <View className="item-img">
                        <Image src={item.image ? item.image : emptyImg} />
                      </View>
                      <View className="item-text">
                        {item.title ? item.title : item.name}
                      </View>
                    </View>
                  </Navigator>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default CateGory;
