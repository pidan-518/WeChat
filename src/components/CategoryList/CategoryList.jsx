import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import '../../common/globalstyle.less'
import './CategoryList.less'
import servicePath from '../../common/util/api/apiUrl'
import { postRequest } from '../../common/util/request'

// 猜你喜欢组件
class CategoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryList: [] // 分类商品列表
    }
  }

  // 获取产品信息
  getHomeProducts(confType) {
    postRequest(servicePath.homeProducts, {
      confType: confType,
      current: 1,
      len: 8,
    })
      .then(res => {
        if (res.statusCode === 200) {
          console.log("分类产品返回数据成功", res.data);
          this.setState({
            categoryList: res.data.records
          })
        }
      })
      .catch((err) => {
        console.log("分类产品返回数据失败", err);
      });
  }

  componentDidMount () {
    this.getHomeProducts(this.props.confType);
  }

  config = {
    usingComponents: {}
  }

  render () {
    const { categoryList } = this.state
    return (
      <View className="category-wrap">
        <View className="category-title">
          <Image src={this.props.titleImg} />
        </View>
        <View className="category-list">
          {
            categoryList.map(item => 
              <Navigator key={item.id} url={`/pages/goodsdetails/goodsdetails?itemId=${item.item.itemId}`}>
                <View className="list-item" >
                  <Image src={item.item.image} />
                  <View className="good-detail">
                    <Text className="good-name" 
                      style={{
                        display: '-webkit-box', 
                        '-webkit-box-orient': 'vertical',
                        '-webkit-line-clamp': 2,
                        overflow: 'hidden'
                      }}
                    >
                      {item.item.itemName}
                    </Text>
                    <View className="good-price">
                      <View className="good-discountPrice">￥ {item.item.discountPrice}</View>
                      <View className="good-price-txt">￥ {item.item.price}</View>
                    </View>
                  </View>
                </View>
              </Navigator>
            )
          }
        </View>
      </View>
    )
  }
}

export default CategoryList;