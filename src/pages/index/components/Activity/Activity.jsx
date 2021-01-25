import Taro, { Component } from '@tarojs/taro';
import { View, Image, Navigator } from '@tarojs/components';
import './Activity.less';
import utils from '../../../../common/util/utils';

// 首页
class Activity extends Component {
  state = {};

  handleNavigator = ({ url }) => {
    console.log(url);
    utils.mutiLink(url);
  };

  /* handleClick() {
    Taro.navigateTo({
      url: "/pages/hotlist/hotlist",
    });
  } */

  onPageScroll(e) {}

  componentWillMount() {}

  componentDidMount() {}

  componentDidShow() {}

  render() {
    const { hotListData, brandFlashSaleData, foundGoodThingsData } = this.props;
    return (
      <View className="activity">
        <View className="activity-coupon-wrap">
          <View
            className="wrap-left"
            onClick={this.handleNavigator.bind(this, hotListData)}
          >
            {/* <Navigator url={hotListData.url}> */}
            <Image src={hotListData.image} className="left-image" />
          </View>
          <View className="wrap-right">
            <View
              className="right-activity"
              onClick={this.handleNavigator.bind(this, brandFlashSaleData)}
            >
              {/* <Navigator url={brandFlashSaleData.url}> */}
              <Image
                src={brandFlashSaleData.image}
                className="right-activity-image"
              />
            </View>
            <View
              className="right-activity"
              onClick={this.handleNavigator.bind(this, foundGoodThingsData)}
            >
              {/* <Navigator url={foundGoodThingsData.url}> */}
              <Image
                src={foundGoodThingsData.image}
                className="right-activity-image"
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

Activity.defaultProps = {
  hotListData: {
    activityId: '',
    image: '',
    url: '',
  },
  brandFlashSaleData: {
    activityId: '',
    image: '',
    url: '',
  },
  specialSurpriseData: {
    activityId: '',
    image: '',
    url: '',
  },
};

export default Activity;
