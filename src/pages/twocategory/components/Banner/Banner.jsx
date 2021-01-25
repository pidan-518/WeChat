import Taro, { Component } from '@tarojs/taro';
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components';
import './Banner.less';
import utils from '../../../../common/util/utils';

// 品牌代购
class Banner extends Component {
  state = {};

  // banner点击事件
  handleSwiperClick = ({ jumpUrl }) => {
    utils.mutiLink(jumpUrl);
    console.log(jumpUrl);
  };

  // 分类点击事件
  handleCategoryClick = (item) => {
    Taro.navigateTo({
      url: `/pages/threecategory/threecategory?source=app&title=${item.categoryName}&categoryId=${item.categoryId}`,
    });
  };

  fCheckUrl(str) {
    var oRegUrl = new RegExp();
    oRegUrl.compile('^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&?/.=]+$');
    if (!oRegUrl.test(str)) {
      return false;
    }
    return true;
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  render() {
    const { rotationImg, twoCategoryImage, bannerImg } = this.props;
    return (
      <View className="banner">
        <View className="banner-box">
          <Image className="banner-img" src={bannerImg} />
        </View>
        <View className="three-categroy-wrapp">
          <View className="three-categroy-list">
            {twoCategoryImage.map((item) => (
              <View
                className="category-item"
                key={item.categoryId}
                onClick={this.handleCategoryClick.bind(this, item)}
              >
                <Image className="category-icon" src={item.icon} alt="" />
                <View className="category-name">{item.categoryName}</View>
              </View>
            ))}
          </View>
        </View>
        <View className="slogan">
          <Image
            className="slogan-img"
            src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/home/banner-title.jpg"
            alt=""
          />
        </View>
        <View className="swiper-banner">
          <Swiper
            className="swiper-wrap"
            autoplay={true}
            circular
            indicatorDots
            indicatorActiveColor="#ff5d8c"
            indicatorColor="#fff"
          >
            {rotationImg.map((item) => (
              <SwiperItem
                key={item.id}
                onClick={this.handleSwiperClick.bind(this, item)}
              >
                <Image className="swiper-item-img" src={item.imgUrl} />
              </SwiperItem>
            ))}
          </Swiper>
        </View>
      </View>
    );
  }
}

export default Banner;
