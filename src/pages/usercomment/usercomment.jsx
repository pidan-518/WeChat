import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import './usercomment.less';
import servicePath from '../../common/util/api/apiUrl';
import { postRequest } from '../../common/util/request';
import '../../common/globalstyle.less';
import CommComment from '../../components/CommComment/CommComment';
import CommonEmpty from '../../components/CommonEmpty/CommonEmpty';

class UserComment extends Component {
  state = {
    commentList: [], // 评论列表
    commentCurrent: 1, // 评论列表当前页
    commentPages: 1, // 评论列表总页
  };

  // 评论图片点击事件
  handleCommentImgClick = (Images, itemImg) => {
    Taro.previewImage({
      current: itemImg,
      urls: Images,
    });
  };

  // 查询店铺商品评价信息
  getCommodityEvaluate(current = 1, state) {
    const postData = {
      current: current,
      len: '7',
      itemId: `${this.$router.params.itemId}`,
      businessId: `${this.$router.params.businessId}`,
      state: `${state}`,
    };
    postRequest(servicePath.commodityEvaluate, postData)
      .then((res) => {
        console.log('获取评价信息成功', res.data);
        if (res.data.code === 0) {
          this.setState(
            {
              commentList: [
                ...this.state.commentList,
                ...res.data.data.records,
              ],
              commentCurrent: res.data.data.current,
              commentPages: res.data.data.pages,
            },
            () => {
              console.log(this.state.commentList);
            }
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentWillMount() {}

  componentDidMount() {
    this.setState(
      {
        commentList: [],
      },
      () => {
        this.getCommodityEvaluate(1, '');
      }
    );
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onReachBottom() {
    const { commentCurrent, commentPages } = this.state;
    if (commentCurrent < commentPages) {
      this.getCommodityEvaluate(commentCurrent + 1, '');
    }
  }

  config = {
    navigationBarTitleText: '用户评论',
    usingComponents: {},
  };

  render() {
    const { commentList } = this.state;
    return (
      <View>
        {commentList.length === 0 ? (
          <CommonEmpty content="暂无评论" />
        ) : (
          <CommComment commentList={commentList} />
        )}
      </View>
    );
  }
}

export default UserComment;
