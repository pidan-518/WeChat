import Taro, { Component } from "@tarojs/taro";
import { View, Text, RichText } from "@tarojs/components";
import "./CommComment.less";
import "../../common/globalstyle.less";

class CommComment extends Component {
  state = {
    commentList: [], // 评论列表
    scoreIcon: [
      "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsdetails/praise-ac.png",
      "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsdetails/praise-ac.png",
      "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsdetails/praise-ac.png",
    ], // 好评图片
    nrIcon:
      "https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsdetails/praise.png",
  };

  // 评论图片点击事件
  handleCommentImgClick = (Images, itemImg) => {
    console.log(Images);
    Taro.previewImage({
      current: itemImg,
      urls: Images,
    });
  };

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  config = {
    usingComponents: {},
  };

  render() {
    const { scoreIcon, nrIcon } = this.state;
    const { commentList } = this.props;
    return (
      <View className="comm-comment">
        <View className="goods-comment">
          <View className="goods-comment-list">
            {commentList.map((item) => (
              <View key={item.evaluateId} className="list-item">
                <View className="comment-rate">
                  <View className="comment-userinfo">
                    <Image className="user-headPic" src={item.headPic} />
                    <Text className="nikeName">{item.nikeName}</Text>
                  </View>
                  {
                    {
                      10: (
                        <View className="comment-score">
                          {scoreIcon.slice(0, 2).map((itemImage, index) => (
                            <Image
                              className="score-icon"
                              src={itemImage}
                              key={index}
                            />
                          ))}
                          <Image className="score-icon" src={nrIcon} />
                        </View>
                      ),
                      20: (
                        <View className="comment-score">
                          {scoreIcon.slice(0, 1).map((itemImage, index) => (
                            <Image
                              className="score-icon"
                              src={itemImage}
                              key={index}
                            />
                          ))}
                          <Image className="score-icon" src={nrIcon} />
                          <Image className="score-icon" src={nrIcon} />
                        </View>
                      ),
                      0: (
                        <View className="comment-score">
                          {scoreIcon.map((itemImage, index) => (
                            <Image
                              className="score-icon"
                              src={itemImage}
                              key={index}
                            />
                          ))}
                        </View>
                      ),
                    }[item.state]
                  }
                  {/* <View className="comment-date">{item.evaluateTime}</View> */}
                </View>
                {item.remarks !== null ? (
                  <View className="comment-content">{item.remarks}</View>
                ) : null}
                <View className="comment-img-list">
                  {item.imageList.map((itemImg, index) => (
                    <Image
                      className="comment-img"
                      key={index}
                      src={itemImg}
                      onClick={this.handleCommentImgClick.bind(
                        this,
                        item.imageList,
                        itemImg
                      )}
                    />
                  ))}
                </View>
                {item.replyDesc !== null ? (
                  <View>
                    <View className="merchant-reply">
                      <Text className="merchant-reply-title">商家回复：</Text>
                      <RichText
                        className="merchant-reply-text"
                        nodes={item.replyDesc}
                      >
                        {}
                      </RichText>
                    </View>
                    <View className="merchant-reply-image-list">
                      <Image
                        className="merchant-reply-img"
                        /* key={index} */
                        src={item.replyImages}
                        onClick={this.handleCommentImgClick.bind(
                          this,
                          [item.replyImages],
                          item.replyImages
                        )}
                      />
                    </View>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }
}

CommComment.defaultProps = {
  commentList: [],
};

export default CommComment;
