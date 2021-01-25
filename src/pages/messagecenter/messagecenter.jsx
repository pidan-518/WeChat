import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import './messagecenter.less';
import '../../common/globalstyle.less'
import servicePath from '../../common/util/api/apiUrl';
import { CarryTokenRequest } from '../../common/util/request';
import CommonEmpty from '../../components/CommonEmpty/CommonEmpty';

// 消息中心
class MessageCenter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      scrollViewHeight: '', // scrollView高度
      messageList: [] // 消息列表
    }
  }

  // 标记全部已读按钮点击事件
  handleReadAllMessage = () => {
    this.setMessageReadAll();
  }

  // 消息列表点击事件
  handleMessageItemClick = (messageId) => {
    this.setMessageRead(messageId);
  }

  // 获取消息列表
  getMyMessageList() {
    CarryTokenRequest(servicePath.myMessageList, {
      current: 1,
      len: 100
    })
      .then(res => {
        console.log("获取消息列表成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            messageList: res.data.data.records
          })
        }
      })
      .catch(err => {
        console.log("获取消息列表失败", err);
      })
  }

  // 设置单个消息已读
  setMessageRead(id) {
    CarryTokenRequest(servicePath.setMessageRead, {
      messageId: id
    })
      .then(res => {
        console.log("设置已读成功", res.data);
        if (res.data.code === 0) {
          this.getMyMessageList();
        }
      })
      .catch(err => {
        console.log("设置已读失败", err);
      })
  }

  // 设置全部消息已读
  setMessageReadAll() {
    CarryTokenRequest(servicePath.setMessageReadAll, "")
      .then(res => {
        console.log("设置已读成功", res.data);
        if (res.data.code === 0) {
          this.getMyMessageList();
        }
      })
      .catch(err => {
        console.log("设置已读失败", err);
      })
  }

  componentWillMount () { }

  componentDidMount () { }

  componentDidShow () {
    Taro.getSystemInfo({})
      .then(res => {
        this.setState({
          scrollViewHeight: (res.windowHeight - 45)
        }, () => {
          this.getMyMessageList();
        })
      })
  }


  config = {
    navigationBarTitleText: '消息中心',
    usingComponents: {}
  }

  render () {
    const { scrollViewHeight, messageList } = this.state
    return (
      <View id='message-center'>
        <ScrollView scrollY className="scroll-wrap" style={{height: `${scrollViewHeight}px`}}>
          <View className="message-list">
            {
              messageList.length === 0 ? <CommonEmpty content="暂无消息" /> :
                messageList.map(item => 
                  <View className="list-item" key={item.messageId} onClick={this.handleMessageItemClick.bind(this, item.messageId)}>
                    {/*  */}
                    <View className="item-title">
                      <Text>{item.messageTitle}</Text>
                      {
                        item.messageStatus === 0 ? 
                          <Image className="message-sign" src={require("../../static/personcenter/unread.png")} />
                          : ""
                      }
                    </View>
                    <View className="item-content">{item.messageContent}</View>
                  </View>
                )
            }
          </View>
        </ScrollView>
        <View className="message-btn" onClick={this.handleReadAllMessage}>标记全部已读</View>
      </View>
    )
  }
}

export default MessageCenter;