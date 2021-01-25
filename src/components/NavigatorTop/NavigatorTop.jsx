import Taro, { Component } from '@tarojs/taro';
import { View, Text, Checkbox, CheckboxGroup, Input } from '@tarojs/components'
import { CarryTokenRequest } from '../../common/util/request';
import "../../common/globalstyle.less";
import "./NavigatorTop.less";

export default class NavigatorTop extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }


  //点击导航项事件
  handleItem = (item) => {
    if (item.pageName === '搜索') {
      Taro.navigateTo({
        url: item.url
      })      
    } else {
      Taro.switchTab({
        url: item.url
      })    
    }
  }

  componentDidShow() {
  }

  componentDidUpdate() {}

  render() {

    const itemList = [ //导航列表
      {
        icon: '', //图标
        pageName: '首页', //目标页名
        url: '/pages/index/index', //目标url
      },
      {
        icon: '',
        pageName: '搜索',
        url: '/pages/searchpage/searchpage',
      },
      {
        icon: '',
        pageName: '购物车',
        url: '/pages/cart/cart',
      },
      {
        icon: '',
        pageName: '个人中心',
        url: '/pages/person/person',
      },
    ]
    
    return(
      <View className="navigatorTop">

        {/* 展开/收起 */}
        <Button className="visiControl">
          <Text className="line"></Text>
          <Text className="line"></Text>
          <Text className="line"></Text>
        </Button>

        {/* 菜单 */}
        <View className="list_wrap">
          <Text className="arrow"></Text>
          <View className="itemList">
            {
              itemList.map(item => {
                return (
                  <Button 
                    className="item" 
                    key={item.pageName} 
                    onClick={this.handleItem.bind(this, item)}
                  >
                    {/* <Image /> */}
                    <Text className="pageName">{item.pageName}</Text>
                  </Button>
                )
              })
            }
          </View>
        </View>

      </View>
    )
  }
}
