import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import './activity3.less';
import '../../common/globalstyle.less';
import TypeList from './components/TypeList/TypeList';
import { postRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';

// 品质生活馆
class Activity3 extends Component {
  state = {
    typeGoodsHeight: '', // 商品大容器高度
    goodsList: [], // 商品列表
  };

  // 根据传入的商品号列表查询商品信息集合
  getItemInfoList() {
    const arr = [
      {
        itemNo: 'sp20200819109155',
      },
      {
        itemNo: 'sp20200708105193',
      },
      {
        itemNo: 'sp20200814108515',
      },
      {
        itemNo: 'sp20200906101722',
      },
      {
        itemNo: 'sp20200724106578',
      },
      {
        itemNo: 'sp20200602102363',
      },
      {
        itemNo: 'sp20200823100170',
      },
      {
        itemNo: 'sp20200601102342',
      },
      {
        itemNo: 'sp20200601102214',
      },
      {
        itemNo: 'sp20200602102824',
      },
      {
        itemNo: 'sp20200826100582',
      },
      {
        itemNo: 'sp20200817108922',
      },
      {
        itemNo: 'sp20200602102530',
      },
      {
        itemNo: 'sp20200628104477',
      },
      {
        itemNo: 'sp20200728106662',
      },
      {
        itemNo: 'sp20200619104073',
      },
      {
        itemNo: 'sp20200602102525',
      },
      {
        itemNo: 'sp20200602102507',
      },
      {
        itemNo: 'sp20200905101630',
      },
      {
        itemNo: 'sp20200905101613',
      },
      {
        itemNo: 'sp20200713105594',
      },
      {
        itemNo: 'sp20200724106587',
      },
      {
        itemNo: 'sp20200730106891',
      },
      {
        itemNo: 'sp20200727106617',
      },
      {
        itemNo: 'sp20200714105740',
      },
      {
        itemNo: 'sp20200630104704',
      },
      {
        itemNo: 'sp20200908101943',
      },
      {
        itemNo: 'sp20200908101928',
      },
    ];
    postRequest(servicePath.itemInfoList, arr)
      .then((res) => {
        console.log('获取规定商品列表成功', res.data);
        if (res.data.code === 0) {
          this.setState(
            {
              goodsList: res.data.data,
            },
            () => {
              Taro.createSelectorQuery()
                .select('.type-goods-wrap')
                .boundingClientRect((rect) => {
                  this.setState({
                    typeGoodsHeight: rect.height - 600,
                  });
                })
                .exec();
            }
          );
        }
      })
      .catch((err) => {
        console.log('获取规定商品列表失敗', err);
      });
  }

  componentWillMount() {}

  componentDidMount() {
    this.getItemInfoList();
  }

  componentWillUnmount() {}

  componentDidShow() {}

  config = {
    navigationBarTitleText: '品质生活馆',
    usingComponents: {},
  };

  render() {
    const { goodsList, typeGoodsHeight } = this.state;
    return (
      <View>
        <View id="activity3">
          <View className="activity3-banner">
            <Image
              className="banner-img"
              src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity3/banner1-1.jpg"
            />
          </View>
          <View className="goods-content">
            <View className="type-goods-wrap">
              <TypeList
                goodsList={goodsList.slice(0, 4)}
                titleImage={
                  'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity3/type-list1-1.png'
                }
              />
              <TypeList
                goodsList={goodsList.slice(4, 12)}
                titleImage={
                  'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity3/type-list2-1.png'
                }
              />
              <TypeList
                goodsList={goodsList.slice(12, 20)}
                titleImage={
                  'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity3/type-list3-1.png'
                }
              />
              <TypeList
                goodsList={goodsList.slice(20)}
                titleImage={
                  'https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/activity3/type-list4-1.png'
                }
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Activity3;
