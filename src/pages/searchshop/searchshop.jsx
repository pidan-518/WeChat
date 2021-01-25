import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './searchshop.less';
import { postRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';
import CommonEmpty from '../../components/CommonEmpty/CommonEmpty';
// import '../../common/globalstyle.less'

class SearchShop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchVal: '', // 输入框值
      searchList: [], // 搜索list数据
      shopList: [], // 店铺list数据
      timer: '', // 函数防抖定时器
      searchInputHeight: '', // 搜索框的高度
      searchListHeight: '', // 搜索list框的高度
      isShow: true, // 显示隐藏搜索list
      visible: true, // 显示隐藏搜索历史框
      ShopSearchHistory: [] // 店铺搜索历史
    }
  }

  // 返回上一页点击事件
  handleNavigateBack = () => {
    Taro.navigateBack({
      delta: 1
    })
  }

  // 搜索框输入事件
  handleSearchInput = (e) => {
    clearTimeout(this.state.timer);
    this.setState({
      searchVal: e.detail.value,
      isShow: false
    })
    if (e.detail.value === '') {
      this.setState({
        searchList: [],
        isShow: true,
        visible: true
      })
      return;
    }

    this.state.timer = setTimeout(() => {
      this.searchShopByName(e.detail.value, 1)
    }, 700)
  }

  // 搜索框获取焦点事件
  handleSearchInputFocus = (e) => {
    if (e.detail.value !== '') {
      this.setState({
        isShow: false
      }, () => {
        this.searchShopByName(e.detail.value, 1)
      })
    } else {
      this.setState({
        visible: true
      })
    }
  }

  // 搜索框失去焦点事件
  handleSearchInputBlur = (e) => {
    this.setState({
      isShow: true,
      visible: false,
    })
  }

  // 搜索框完成按钮
  handleSearchInputConfirm = (e) => {
    let ShopSearchHistory = this.state.ShopSearchHistory;
    ShopSearchHistory.unshift(this.state.searchVal);
    this.setState({
      isShow: true,
      visible: false,
      shopList: [],
      searchVal: this.state.searchVal,
      ShopSearchHistory: this.unique(ShopSearchHistory)
    }, () => {
      Taro.setStorageSync('ShopSearchHistory', JSON.stringify(this.state.ShopSearchHistory));
      this.getSearchShopByName(this.state.searchVal, 1);
    })
  }

  // 搜索结果列表item的点击事件
  handleSearchItemClick = (shopName) => {
    let ShopSearchHistory = this.state.ShopSearchHistory;
    ShopSearchHistory.unshift(shopName);
    this.setState({
      isShow: true,
      visible: false,
      shopList: [],
      searchVal: shopName,
      ShopSearchHistory: this.unique(ShopSearchHistory)
    }, () => {
      Taro.setStorageSync('ShopSearchHistory', JSON.stringify(this.state.ShopSearchHistory));
      this.getSearchShopByName(shopName, 1);
    });
  }

  // 搜索历史删除点击事件
  handleDeleteSearchHistory = () => {
    this.setState({
      ShopSearchHistory: []
    }, () => {
      Taro.removeStorageSync('ShopSearchHistory')
    })
  }

  // 搜索历史的item点击事件
  handleSearchHistoryItem = (shopName) => {
    this.setState({
      shopList: [],
      searchVal: shopName
    }, () => {
      this.getSearchShopByName(shopName, 1);
    })
  }

  // 搜索店铺
  searchShopByName = (value, current) => {
    postRequest(servicePath.searchShopByName, {
      current: current,
      len: 10,
      name: `${value}`
    })
    .then((res) => {
      console.log("搜索店铺成功", res.data);
      if (res.data.code === 0) {
        this.setState({
          searchList: res.data.data.records,
        })
      }
    })
    .catch((err) => {
      console.log("搜索店铺失败", err);
    });
  }

  // 获取店铺
  getSearchShopByName = (value, current) => {
    postRequest(servicePath.searchShopByName, {
      current: current,
      len: 10,
      name: `${value}`
    })
    .then((res) => {
      console.log("获取店铺列表成功", res.data);
      if (res.data.code === 0) {
        this.setState({
          shopList: res.data.data.records,
          visible: false
        })
      }
    })
    .catch((err) => {
      console.log("获取店铺列表成功", err);
    });
  }

  // 数组去重
  unique(arr) {
    return Array.from(new Set(arr));
  }

  componentWillMount () { 
    let ShopSearchHistory =  Taro.getStorageSync('ShopSearchHistory');
    if (ShopSearchHistory !== '') {
      this.setState({
        ShopSearchHistory: JSON.parse(ShopSearchHistory)
      });
    }
  }

  componentDidMount () { 
    let navHeight = Taro.createSelectorQuery();
    navHeight.select(".search-box").boundingClientRect((rect) => {
      this.setState({
        searchInputHeight: rect.height
      }, () => {
        Taro.getSystemInfo({
          success: res => {
            this.setState({
              searchListHeight: res.screenHeight,
            })
          }
        })
      })
    }).exec();
  }

  componentWillUnmount () { }

  componentDidShow () { 
    Taro.getSystemInfo({})
      .then(res  => {
        Taro.$navBarMarginTop =  res.statusBarHeight || 0;
      })
  }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '搜索店铺',
    usingComponents: {},
    navigationStyle: 'custom',
  }

  render () {
    const { 
      searchVal,
      searchInputHeight,
      searchListHeight,
      isShow,
      searchList,
      shopList,
      ShopSearchHistory,
      visible
    } = this.state
    return (
      <View id='search-shop'>
        <View className="search-box" style={{paddingTop: `${Taro.$navBarMarginTop}px`}}>
          <View className="search-line">
            <Image 
              onClick={this.handleNavigateBack}
              className="left-icon" 
              src={require("../../static/searchpage/left.png")} 
            />
            <View className="search-input">
              <Image src={require("../../static/home/search-icon.png")} />
              <Input 
                placeholder="搜索你想找的店铺"
                value={searchVal}
                onFocus={this.handleSearchInputFocus}
                onBlur={this.handleSearchInputBlur}
                onConfirm={this.handleSearchInputConfirm}
                onInput={this.handleSearchInput}
              />
            </View>
          </View>
        </View>
        {/* 搜索数据展示框 */}
        <View 
          className="search-list"
          style={{
            top: `${searchInputHeight}px`,
            height: `${searchListHeight - searchInputHeight}px`,
            display: isShow ? 'none' : 'block'
          }}
        >
          {
            searchList.map(item =>
              <View
                key={item.shopId}
                className="search-list-item"
                onClick={this.handleSearchItemClick.bind(this, item.name)}
              >
                {item.name}
              </View>
            )
          }
        </View>
        {/* 搜索历史框 */}
        <View 
          className="history-search-wrap"
          style={{
            top: `${searchInputHeight}px`,
            height: `${searchListHeight - searchInputHeight}px`,
            display: visible ? 'block' : 'none'
          }}
        >
          {
            ShopSearchHistory.length === 0 ? null :
              <View className="history-content">
                <View className="history-line">
                  <Text>搜索历史</Text>
                  <Image onClick={this.handleDeleteSearchHistory} src={require('../../static/searchpage/delete.png')} />
                </View>
                <View className="history-list">
                  {
                    ShopSearchHistory.map((item, index) => 
                      <View
                        key={index+1}
                        onClick={this.handleSearchHistoryItem.bind(this, item)}
                        className="history-list-item"
                      >
                        {item}
                      </View>
                    )
                  }
                </View>
              </View>
          }
        </View>
        {/* 店铺列表 */}
        <View className="shop-list">
          {
            shopList.length === 0 ? <CommonEmpty content="暂无店铺"/> :
              shopList.map(item => 
                <Navigator url={`/pages/shophome/shophome?businessId=${item.businessId}`} key={item.businessId}>
                  <View className="shop-list-item" key={item.businessId}>
                    <Image src={item.logoPath} />
                    <View className="shop-name">{item.name}</View>
                  </View>
                </Navigator>
              )
          }
        </View>
      </View>
    )
  }
}

export default SearchShop;