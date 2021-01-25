import Taro, { Component } from '@tarojs/taro';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import './evaluate.less';
import '../../common/globalstyle.less';
import { AtTabs, AtTabsPane } from 'taro-ui';
import 'taro-ui/dist/style/components/tabs.scss';
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';
import CommonEmpty from '../../components/CommonEmpty/CommonEmpty';

// 评价管理
class Evaluate extends Component {
  state = {
    current: 0, // tabs当前选中的索引
    scrollViewHeight: '', // scrollView高度
    commentList: [], // 评论列表
    commentCurrent: '', // 评论列表当前页数
    commentPages: '', // 评论列表总页数
    evaluateState: '', // 评论状态
  };

  // tabs点击事件
  handleTabsClick = (current) => {
    this.setState({
      current,
      commentList: [],
    });
    if (current === 0) {
      this.setState(
        {
          evaluateState: '',
        },
        () => {
          this.getOrderEvaluate(1);
        }
      );
    } else if (current === 1) {
      this.setState(
        {
          evaluateState: 80,
        },
        () => {
          this.getOrderEvaluate(1);
        }
      );
    } else {
      this.setState(
        {
          evaluateState: -80,
        },
        () => {
          this.getOrderEvaluate(1);
        }
      );
    }
  };

  // scrollView的scrolltolower 事件
  ScrollToLowerEvent = () => {
    if (this.state.commentCurrent === this.state.commentPages) {
      console.log('没有更多了');
    } else {
      this.getOrderEvaluate(this.state.commentCurrent + 1);
    }
  };

  // 评论列表查询
  getOrderEvaluate(current) {
    CarryTokenRequest(servicePath.orderEvaluate, {
      current: current,
      len: 10,
      evaluateState: this.state.evaluateState,
      state: 25,
    })
      .then((res) => {
        console.log('评论列表查询成功', res.data);
        if (res.data.code === 0) {
          this.setState({
            commentList: [...this.state.commentList, ...res.data.data.records],
            commentCurrent: res.data.data.current,
            commentPages: res.data.data.pages,
          });
        }
      })
      .catch((err) => {
        console.log('评论列表查询失败', err);
      });
  }

  // 下拉事件
  /* onPullDownRefresh() {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 2000);
  } */

  componentWillMount() {}

  componentDidMount() {}

  componentDidShow() {
    Taro.getSystemInfo({}).then((res) => {
      this.setState(
        {
          scrollViewHeight: res.windowHeight - 43,
          commentList: [],
        },
        () => {
          this.getOrderEvaluate(1);
        }
      );
    });
  }

  config = {
    navigationBarTitleText: '评价管理',
    usingComponents: {},
  };

  render() {
    const tabList = [
      { id: 0, title: '全部' },
      { id: 1, title: '未评价' },
      { id: 2, title: '已评价' },
    ];
    const { current, scrollViewHeight, commentList } = this.state;
    return (
      <View id="evaluate">
        <AtTabs
          current={current}
          swipeable={true}
          tabList={tabList}
          onClick={this.handleTabsClick.bind(this)}
        >
          {tabList.map((item, index) => (
            <AtTabsPane current={current} index={index} key={item.id}>
              <ScrollView
                scrollY
                className="scroll-wrap"
                style={{ height: `${scrollViewHeight}px` }}
                onScrollToLower={this.ScrollToLowerEvent}
              >
                <View className="evaluate-list">
                  {commentList.length === 0 ? (
                    <CommonEmpty content="暂无评论" />
                  ) : (
                    commentList.map((itemComment) => {
                      let orderDetails = [];
                      for (let index in itemComment) {
                        if (index === 'orderDetails') {
                          orderDetails = itemComment.orderDetails || [];
                        }
                      }
                      return (
                        <View
                          className="list-item"
                          key={itemComment.discountPrice}
                        >
                          <View className="item-head">
                            <Navigator
                              url={`/pages/shophome/shophome?businessId=${itemComment.orderDetails[0].businessId}`}
                            >
                              <View className="shop-name">
                                <Text>订单编号：{itemComment.orderNo}</Text>
                              </View>
                            </Navigator>
                          </View>
                          {orderDetails.map((itemDetails) => (
                            <View
                              className="item-goods"
                              key={itemDetails.itemId}
                            >
                              <Navigator
                                url={`/pages/goodsdetails/goodsdetails?itemId=${itemDetails.itemId}`}
                              >
                                <View className="item-content">
                                  <Image src={itemDetails.itemImage} />
                                  <View className="good-wrap">
                                    <View className="good-info">
                                      <View>{itemDetails.itemName}</View>
                                      <View>
                                        <Text className="good-spec">
                                          {itemDetails.item.className}/
                                          {itemDetails.item.specName}
                                        </Text>
                                        <Text> × {itemDetails.itemNum}</Text>
                                      </View>
                                    </View>

                                    <View className="good-price">
                                      <Text className="price-symbol">￥ </Text>
                                      <Text> {itemDetails.totalAmount}</Text>
                                    </View>
                                  </View>
                                </View>
                              </Navigator>
                              <View className="list-item-btn">
                                <Navigator
                                  url={`/pages/evaldetails/evaldetails?orderDetailId=${itemDetails.orderDetailId}&itemId=${itemDetails.itemId}&evaluateState=${itemDetails.evaluateState}&className=${itemDetails.item.className}&specName=${itemDetails.item.specName}&shopName=${itemDetails.shopName}&itemNum=${itemDetails.itemNum}&goodsName=${itemDetails.itemName}&goodsPrice=${itemDetails.totalAmount}&goodsImage=${itemDetails.itemImage}`}
                                >
                                  <Button>
                                    {itemDetails.evaluateState === 80
                                      ? '我要评价'
                                      : '评价信息'}
                                  </Button>
                                </Navigator>
                              </View>
                            </View>
                          ))}
                        </View>
                      );
                    })
                  )}
                </View>
              </ScrollView>
            </AtTabsPane>
          ))}
        </AtTabs>
      </View>
    );
  }
}

export default Evaluate;
