import Taro, { Component } from "@tarojs/taro";
import { View, Text, Navigator } from "@tarojs/components";
import "../../../../common/globalstyle.less";
import "./GoodsComment.less";
import servicePath from "../../../../common/util/api/apiUrl";
import { postRequest } from "../../../../common/util/request";
import CommComment from "../../../../components/CommComment/CommComment";

class GoodsComment extends Component {
  state = {
    businessId: "",
    commentList: [], // 评论列表
    commentTotal: "", // 评论总数
  };

  // 查询店铺商品评价信息
  getCommodityEvaluate(state) {
    const postData = {
      current: "1",
      len: "7",
      itemId: `${this.props.itemId}`,
      businessId: `${this.props.businessId}`,
      state: `${state}`,
    };
    postRequest(servicePath.commodityEvaluate, postData)
      .then((res) => {
        console.log("获取评价信息成功", res.data);
        if (res.data.code === 0) {
          console.log(res.data.data.total);
          this.setState({
            commentList: res.data.data.records,
            commentTotal: res.data.data.total,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidUpdate() {
    if (this.state.businessId !== this.props.businessId) {
      this.setState(
        {
          businessId: this.props.businessId,
        },
        () => {
          this.getCommodityEvaluate("");
        }
      );
    }
  }

  render() {
    const { commentList, businessId, commentTotal } = this.state;
    return (
      <View style={{ backgroundColor: "#f5f5f5" }} id="comment">
        {/* 店铺 */}
        <View className="goods-comment-title">
          <View className="title-left">
            <Image
              className="title-image"
              src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsdetails/comment-icon.png"
            />
            <Text className="title-text">用户评价({commentTotal})</Text>
          </View>
          {commentList.length > 2 ? (
            <Navigator
              url={`/pages/usercomment/usercomment?itemId=${this.props.itemId}&businessId=${businessId}`}
            >
              <View className="more">
                <Text>查看更多</Text>
                <Image
                  className="more-image"
                  src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsdetails/more-image.png"
                />
              </View>
            </Navigator>
          ) : null}
        </View>
        {commentList.length == 0 ? null : commentList.length > 2 ? (
          <CommComment commentList={commentList.slice(0, 2)} />
        ) : (
          <CommComment commentList={commentList} />
        )}
      </View>
    );
  }
}

GoodsComment.defaultProps = {
  businessId: "",
};

export default GoodsComment;
