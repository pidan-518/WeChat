import Taro, { Component } from "@tarojs/taro";
import { View, Swiper, SwiperItem } from "@tarojs/components";
import "./Banner.less";
import utils from "../../../../common/util/utils";

// 轮播图
class Banner extends Component {
  state = {};

  handleBnnaerClick = (url) => {
    utils.mutiLink(url);
  };

  onPageScroll(e) {}

  //--------------------

  componentWillMount() {}

  componentDidMount() {}

  componentDidShow() {}

  render() {
    const { bannerData } = this.props;
    return (
      <View>
        <View className="index-swiper">
          <Swiper
            className="swiper-wrap"
            autoplay
            circular
            indicatorDots
            indicatorActiveColor="#ff5d8c"
            indicatorColor="#fff"
          >
            {bannerData.map((item, index) => (
              <SwiperItem key={item.id}>
                <Image
                  onClick={this.handleBnnaerClick.bind(this, item.url)}
                  className="swiper-item-img"
                  src={item.imageUrl}
                  webp
                />
              </SwiperItem>
            ))}
          </Swiper>
        </View>
        {/* <View className="home-slogan">
          <Image
            className="slogan-img"
            src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/home/banner-title.jpg"
          />
        </View> */}
      </View>
    );
  }
}

Banner.defaultProps = {
  bannerData: [],
};

export default Banner;
