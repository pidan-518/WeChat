import Taro, { Component } from "@tarojs/taro";
import { View, Text, RichText } from "@tarojs/components";
import "./GoodsInfo.less";
import { postRequest } from "../../../../common/util/request";
import servicePath from "../../../../common/util/api/apiUrl";
import DescRichText from "../../../../components/taroWxParse/DescRichText";

var WxParse = require("../../../../components/taroWxParse/wxParse/wxParse");
class GoodsInfo extends Component {
  state = {
    shopDescription: "<View></View>",
    itemId: "",
    businessId: 0,
  };

  componentDidUpdate() {
    if (this.state.itemId !== this.props.itemId) {
      this.setState(
        {
          itemId: this.props.itemId,
        },
        () => {
          postRequest(servicePath.itemIntroduction, {
            itemId: this.props.itemId,
          })
            .then((res) => {
              console.log("获取商品介绍成功", res.data);
              if (res.data.code === 0) {
                WxParse.wxParse(
                  "article",
                  "html",
                  res.data.data.description,
                  this.$scope,
                  5
                );
                this.setState({
                  shopDescription: res.data.data.description,
                });
              }
            })
            .catch((err) => {
              console.log("获取商品介绍失败", err);
            });
        }
      );
    }
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    const { shopDescription } = this.state;

    return (
      <View className="goods-info" id="goods-info">
        <View className="goods-info-title">商品介绍</View>
        <import src="../../../../components/taroWxParse/wxParse/wxParse.wxml" />
        <template is="wxParse" data="{{wxParseData:article.nodes}}" />
      </View>
    );
  }
}
GoodsInfo.defaultProps = {
  businessId: "",
};
export default GoodsInfo;
