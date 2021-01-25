import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView, Input, Navigator } from '@tarojs/components';
import './twocategory.less';
import '../../common/globalstyle.less';
import utils from '../../common/util/utils';
import { postRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';
import Banner from './components/Banner/Banner';
import GoodsScroll from './components/GoodsScroll/GoodsScroll';
import GuessGoods from './components/GuessGoods/GuessGoods';
import CommonTop from '../../components/CommonTop/CommonTop';

// 品牌代购
class TwoCategory extends Component {
  state = {
    tabsList: [], // 分类tab数据
    goodsScrollTitles: [
      'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/twocategory/goods-scroll-title1.png',
      'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/twocategory/goods-scroll-title2.png',
      'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/twocategory/goods-scroll-title3.png',
      'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/twocategory/goods-scroll-title4.png',
      'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/twocategory/goods-scroll-title5.png',
      'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/twocategory/goods-scroll-title6.png',
      'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/twocategory/goods-scroll-title7.png',
      'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/twocategory/goods-scroll-title8.png',
      'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/twocategory/goods-scroll-title9.png',
      'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/twocategory/goods-scroll-title10.png',
    ],
    goodsScrollTitle: '',
    bannerImg: '', // 二级分类banner
    tabsIndex: 0,
    tabScroll: '',
    rotationImg: [], // 轮播图图片
    twoCategoryImage: [], // 三级分类
    newItemList: [], // 新品首发商品
    hotItemList: [], // 爆款商品
    parItemList: [], // 天天平价
    guessGoodsList: [], //
    guessGoodsPages: 1, // 推荐商品总页数
    guessGoodsCurrent: 1, // 推荐商品当前页
    categoryId: Taro.getStorageSync('categoryId')
      ? Taro.getStorageSync('categoryId')
      : this.$router.params.id, // 分类Id
    isBackTop: false,
    searchHeight: '', // 搜索框高度
  };

  // 左上角返回按钮
  handleNavigateBack = () => {
    Taro.switchTab({
      url: '/pages/index/index',
    });
  };

  // tabs点击事件
  handleTabsClick = (index, categoryId, e) => {
    let tabWidth = this.state.windowWidth;
    const query = Taro.createSelectorQuery();
    query.select('.tabs-item').boundingClientRect();
    query.exec((res) => {
      this.setState(
        {
          tabScroll:
            e.currentTarget.offsetLeft - tabWidth / 2 + res[0].width / 2,
          tabsIndex: index,
          guessGoodsList: [],
          guessGoodsPages: 1,
          guessGoodsCurrent: 1,
          goodsScrollTitle: this.state.goodsScrollTitles[index],
        },
        () => {
          this.getSencondCategory(categoryId);
          this.getThirdCategory(categoryId);
        }
      );
    });
  };

  // 获取tabs二级分类
  getIndexCategoryImg() {
    const categoryId = Taro.getStorageSync('categoryId')
      ? Taro.getStorageSync('categoryId')
      : this.$router.params.id;
    postRequest(servicePath.getIndexCategoryImg, {
      source: 10,
    })
      .then((res) => {
        console.log('获取二级分类成功', res.data);
        if (res.data.code === 0) {
          const { configCategoryList } = res.data.data;
          configCategoryList.forEach((item, index) => {
            if (item.categoryId == categoryId) {
              Taro.setNavigationBarTitle({
                title: configCategoryList[index].categoryName,
              });
              this.setState(
                {
                  tabsList: configCategoryList,
                  tabsIndex: index,
                  goodsScrollTitle: this.state.goodsScrollTitles[index],
                },
                () => {
                  let tabWidth = this.state.windowWidth;
                  const query = Taro.createSelectorQuery();
                  const offsetLeft = index * 94;
                  query.select('.tabs-item').boundingClientRect();
                  query.exec((res) => {
                    this.setState({
                      tabScroll: offsetLeft - tabWidth / 2 + res[0].width / 2,
                    });
                  });
                  this.getSencondCategory(categoryId);
                  this.getThirdCategory(categoryId);
                }
              );
            }
          });
        }
      })
      .catch((err) => {
        console.log('获取二级分类失败', err);
      });
  }

  // 获取配置二级页面详情（banner+二级分类图标+新品模块+爆品模块+天天平价）
  getSencondCategory(categoryId = this.$router.params.id) {
    postRequest(servicePath.getSencondCategory, {
      categoryId: categoryId,
      source: 10,
    })
      .then((res) => {
        console.log('获取二级页面数据成功', res.data);
        if (res.data.code === 0) {
          const {
            configImgVOList,
            configCategoryList,
            newItemList,
            hotItemList,
            parItemList,
          } = res.data.data;
          this.setState({
            rotationImg: configImgVOList,
            twoCategoryImage: configCategoryList,
            newItemList: newItemList,
            hotItemList: hotItemList,
            parItemList: parItemList,
          });
        }
      })
      .catch((err) => {
        console.log('获取二级页面数据异常', err);
      });
  }

  // 获取推荐模块商品
  getThirdCategory(categoryId, current = 1) {
    postRequest(servicePath.getThirdCategory, {
      categoryId: categoryId,
      len: 10,
      current: current,
      type: 1,
    })
      .then((res) => {
        console.log('获取推荐模块商品成功', res.data);
        if (res.data.code === 0) {
          this.setState({
            guessGoodsList: [
              ...this.state.guessGoodsList,
              ...res.data.data.records,
            ],
            guessGoodsPages: res.data.data.pages,
            guessGoodsCurrent: res.data.data.current,
          });
        }
      })
      .catch((err) => {
        console.log('获取推荐模块商品失败', err);
      });
  }

  // 上拉事件
  onReachBottom() {
    const {
      guessGoodsPages,
      guessGoodsCurrent,
      tabsList,
      tabsIndex,
    } = this.state;
    if (guessGoodsPages > guessGoodsCurrent) {
      this.getThirdCategory(
        tabsList[tabsIndex].categoryId,
        guessGoodsCurrent + 1
      );
    }
  }

  onPageScroll(e) {
    if (e.scrollTop >= 2200) {
      this.setState({
        isBackTop: true,
      });
    } else {
      this.setState({
        isBackTop: false,
      });
    }
  }

  onShareAppMessage() {
    const shareRecommend = Taro.getStorageSync('shareRecommend');
    const { tabsList, tabsIndex } = this.state;
    return {
      title: '香港直邮，急速发货，一站式购齐全球品质好物！',
      path: `pages/twocategory/twocategory?shareRecommend=${shareRecommend}&id=${tabsList[tabsIndex].categoryId}`,
      imageUrl:
        'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/share/icon-image.jpg',
    };
  }

  componentWillMount() {}

  componentDidMount() {
    let searchHeight = Taro.createSelectorQuery();
    searchHeight
      .select('#search-box')
      .boundingClientRect((rect) => {
        console.log(rect);
        this.setState({
          searchHeight: rect.height,
        });
      })
      .exec();
    Taro.getSystemInfo({
      success: (res) => {
        Taro.$navBarMarginTop = res.statusBarHeight || 0;
        this.setState({
          windowWidth: res.windowWidth,
        });
      },
    });
    this.getIndexCategoryImg();
  }

  componentWillUnmount() {}

  componentDidShow() {
    utils.updateRecommendCode(this.$router.params.shareRecommend); //绑定、存储代理码
  }

  config = {
    navigationBarTitleText: '',
    usingComponents: {},
    navigationStyle: 'custom',
  };

  render() {
    const {
      tabsList,
      tabsIndex,
      tabScroll,
      rotationImg,
      twoCategoryImage,
      newItemList,
      hotItemList,
      parItemList,
      guessGoodsList,
      goodsScrollTitle,
      isBackTop,
      searchHeight,
    } = this.state;
    return (
      <View id="two-category">
        <View
          id="search-box"
          style={{ paddingTop: `${Taro.$navBarMarginTop}px` }}
        >
          <Image
            onClick={this.handleNavigateBack}
            className="left-icon"
            src={require('../../static/searchpage/left.png')}
          />
          <View className="left">
            <Navigator url="/pages/searchpage/searchpage" style={{ flex: 1 }}>
              <View className="left-input">
                <Image
                  className="search-icon"
                  src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/twocategory/search-icon.png"
                />
                <Input
                  className="search-input"
                  placeholder=""
                  disabled="true"
                />
              </View>
            </Navigator>
          </View>
        </View>
        <View id="category-tabs" style={{ top: `${searchHeight}px` }}>
          <ScrollView
            scrollX="true"
            className="category-tabs"
            scrollLeft={tabScroll}
            scrollWithAnimation
          >
            {tabsList.map((item, index) => (
              <View
                style={{ color: index === tabsIndex ? '#ff5d8c' : null }}
                className="tabs-item"
                key={item.id}
                onClick={this.handleTabsClick.bind(
                  this,
                  index,
                  item.categoryId
                )}
              >
                <View className="item-txt">{item.categoryName}</View>
                <View
                  className={index === tabsIndex ? 'item-active' : 'item-line'}
                  style={{ display: index === tabsIndex ? 'block' : 'none' }}
                ></View>
              </View>
            ))}
          </ScrollView>
        </View>
        <Banner
          rotationImg={rotationImg}
          twoCategoryImage={twoCategoryImage}
          bannerImg={tabsList[tabsIndex] ? tabsList[tabsIndex].banner : ''}
        />
        <GoodsScroll
          titleImg={goodsScrollTitle}
          goodsData={newItemList}
          title="新品首发"
        />
        <GoodsScroll
          titleImg={goodsScrollTitle}
          goodsData={hotItemList}
          title="人气推荐"
        />
        <GoodsScroll
          titleImg={goodsScrollTitle}
          goodsData={parItemList}
          title="平价好物"
        />
        <GuessGoods titleImg={goodsScrollTitle} goodsData={guessGoodsList} />
        <CommonTop show={isBackTop} />
      </View>
    );
  }
}

export default TwoCategory;
