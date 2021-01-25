import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import './searchgoods.less';
import '../../common/globalstyle.less';
import GoodsList from '../../components/GoodsList/GoodsList';
import { postRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';

// 开业庆典的分类搜索页
class SearchGoods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchVal: '', // 搜索框值
      timer: null, // 防抖函数定时器
      TopHeight: '', // 搜索列表对顶部的距离
      searchListHeight: '', // 搜索列表的高度
      searchList: [], // 搜索结果的list
      paddingTop: '',
      goodsList: [], // 商品列表
      isShow: true, // 显示搜索结果list的值
      goodsCurrent: 1, // 商品列表当前页
      goodsPages: '', // 商品列表总页数
      type: '', // 上拉加载判断请求哪个接口的值 为2请求搜索的商品
      isComposite: true, // 综合
      isSalesSort: '', // 销量切换正倒序
      saleOrder: '', // 销量排序状态 asc=正序，desc=倒序
      salesRiseIcon: require('../../static/searchpage/rise-icon.png'), // 销量正序图标
      salesDropIcon: require('../../static/searchpage/drop-icon.png'), // 销量倒序图标
      isPriceSort: '', // 价格切换正倒序
      priceOrder: '', // 价格排序状态 asc=正序，desc=倒序
      priceRiseIcon: require('../../static/searchpage/rise-icon.png'), // 价格正序图标
      priceDropIcon: require('../../static/searchpage/drop-icon.png'), // 价格倒序图标
    };
  }

  // 左上角返回按钮
  handleNavigateBack = () => {
    Taro.navigateBack({
      delta: 1,
    });
  };

  // 搜索框输入事件
  handleSearchInput = (e) => {
    clearTimeout(this.state.timer);
    this.setState({
      searchVal: e.detail.value,
    });
    if (e.detail.value === '') {
      return;
    }
    this.state.timer = setTimeout(() => {
      this.searchItems(e.detail.value, 1);
    }, 700);
  };

  // 搜索框点击完成按钮时触发事件
  handleSearchInputConfirm = (e) => {
    this.setState(
      {
        isShow: true,
        type: 2,
        goodsList: [],
      },
      () => {
        this.getSearchItems(this.state.searchVal, 1);
      }
    );
  };

  // 搜索框获取焦点事件
  handleSearchInputFocus = (e) => {
    this.setState({
      isShow: false,
    });
  };

  // 搜索框失去焦点事件
  handleSearchInputBlur = (e) => {
    this.setState({
      isShow: true,
    });
  };

  // 综合点击事件
  handleCompositeClick = () => {
    this.setState(
      {
        isComposite: true,
        goodsList: [],
        isSalesSort: '',
        saleOrder: '',
        salesRiseIcon: require('../../static/searchpage/rise-icon.png'),
        salesDropIcon: require('../../static/searchpage/drop-icon.png'),
        isPriceSort: '',
        priceOrder: '',
        priceRiseIcon: require('../../static/searchpage/rise-icon.png'),
        priceDropIcon: require('../../static/searchpage/drop-icon.png'),
      },
      () => {
        this.getItemCategoryItemByComIds(1);
      }
    );
  };

  // 销量点击事件
  handleSalesClick = () => {
    this.setState({
      isPriceSort: '',
      priceOrder: '',
      priceRiseIcon: require('../../static/searchpage/rise-icon.png'),
      priceDropIcon: require('../../static/searchpage/drop-icon.png'),
      isComposite: false,
    });
    if (this.state.isSalesSort === '') {
      this.setState(
        {
          isSalesSort: true,
          salesRiseIcon: require('../../static/searchpage/rise-ac-icon.png'),
          saleOrder: 'asc',
          goodsList: [],
        },
        () => {
          this.getItemCategoryItemByComIds(1);
        }
      );
      return;
    } else if (this.state.isSalesSort) {
      this.setState(
        {
          isSalesSort: false,
          salesRiseIcon: require('../../static/searchpage/rise-icon.png'),
          salesDropIcon: require('../../static/searchpage/drop-ac-icon.png'),
          saleOrder: 'desc',
          goodsList: [],
        },
        () => {
          this.getItemCategoryItemByComIds(1);
        }
      );
      return;
    } else {
      this.setState(
        {
          isSalesSort: true,
          salesRiseIcon: require('../../static/searchpage/rise-ac-icon.png'),
          salesDropIcon: require('../../static/searchpage/drop-icon.png'),
          saleOrder: 'asc',
          goodsList: [],
        },
        () => {
          this.getItemCategoryItemByComIds(1);
        }
      );
    }
  };

  // 价格点击事件
  handlePriceClick = () => {
    this.setState({
      isSalesSort: '',
      saleOrder: '',
      salesRiseIcon: require('../../static/searchpage/rise-icon.png'),
      salesDropIcon: require('../../static/searchpage/drop-icon.png'),
      isComposite: false,
    });
    if (this.state.isPriceSort === '') {
      this.setState(
        {
          isPriceSort: true,
          priceRiseIcon: require('../../static/searchpage/rise-ac-icon.png'),
          priceOrder: 'asc',
          goodsList: [],
        },
        () => {
          this.getItemCategoryItemByComIds(1);
        }
      );
      return;
    } else if (this.state.isPriceSort) {
      this.setState(
        {
          isPriceSort: false,
          priceRiseIcon: require('../../static/searchpage/rise-icon.png'),
          priceDropIcon: require('../../static/searchpage/drop-ac-icon.png'),
          priceOrder: 'desc',
          goodsList: [],
        },
        () => {
          this.getItemCategoryItemByComIds(1);
        }
      );
      return;
    } else {
      this.setState(
        {
          isPriceSort: true,
          priceRiseIcon: require('../../static/searchpage/rise-ac-icon.png'),
          priceDropIcon: require('../../static/searchpage/drop-icon.png'),
          priceOrder: 'asc',
          goodsList: [],
        },
        () => {
          this.getItemCategoryItemByComIds(1);
        }
      );
    }
  };

  // 搜索结果列表item的点击事件
  handleSearchItemClick = (itemName) => {
    this.setState(
      {
        isShow: true,
        searchVal: itemName,
        goodsList: [],
      },
      () => {
        this.getSearchItems(itemName, 1);
      }
    );
  };

  // 根据分类id获取商品
  getItemCategoryItemByComIds(current) {
    postRequest(servicePath.getItemCategoryItemByComIds, {
      comIds: JSON.parse(this.$router.params.comIds),
      current: current,
      len: 10,
      source: 10,
      saleOrder: this.state.saleOrder,
      priceOrder: this.state.priceOrder,
    })
      .then((res) => {
        console.log('获取商品成功', res.data);
        if (res.data.code === 0) {
          this.setState({
            goodsCurrent: res.data.data.current,
            goodsPages: res.data.data.pages,
            goodsList: [...this.state.goodsList, ...res.data.data.records],
          });
        }
      })
      .catch((err) => {
        console.log('获取商品失败', err);
      });
  }

  // 上拉事件
  onReachBottom() {
    if (this.state.goodsCurrent === this.state.goodsPages) {
      console.log('没有更多数据了');
    } else {
      this.searchItems(this.state.searchVal, this.state.goodsCurrent + 1);
    }
  }

  // 搜索关键字
  searchItems(value, current) {
    postRequest(servicePath.searchItems, {
      current: current,
      len: 10,
      keyword: `${value}`,
      source: 10,
    })
      .then((res) => {
        console.log('搜索关键词返回数据成功', res.data);
        if (res.data.code === 0) {
          this.setState({
            searchList: res.data.data.records,
          });
        }
      })
      .catch((err) => {
        console.log('搜索关键词返回数据失败', err);
      });
  }

  // 搜索商品
  getSearchItems(value, current) {
    postRequest(servicePath.searchItems, {
      current: current,
      len: 10,
      keyword: `${value}`,
      source: 10,
    })
      .then((res) => {
        console.log('搜索关键词返回数据成功', res.data);
        if (res.data.code === 0) {
          this.setState({
            goodsList: [...this.state.goodsList, ...res.data.data.records],
            goodsCurrent: res.data.data.current + 1,
            goodsPages: res.data.data.pages,
          });
        }
      })
      .catch((err) => {
        console.log('搜索关键词返回数据失败', err);
      });
  }

  // 上拉事件
  onReachBottom() {
    if (this.state.goodsCurrent === this.state.goodsPages) {
      console.log('没有更多数据了');
    } else {
      if (this.state.type === 2) {
        this.getSearchItems(this.state.searchVal, this.state.goodsCurrent + 1);
      } else {
        this.getItemCategoryItemByComIds(this.state.goodsCurrent + 1);
      }
    }
  }

  componentWillMount() {}

  componentDidMount() {
    let navHeight = Taro.createSelectorQuery();
    navHeight
      .select('#search-goods-head')
      .boundingClientRect((rect) => {
        this.setState(
          {
            TopHeight: rect.height,
          },
          () => {
            Taro.getSystemInfo({
              success: (res) => {
                this.setState({
                  searchListHeight: res.screenHeight,
                });
              },
            });
          }
        );
      })
      .exec();
    this.setState(
      {
        goodsList: [],
      },
      () => {
        this.getItemCategoryItemByComIds(1);
      }
    );
  }

  componentWillUnmount() {}

  componentDidShow() {
    /* Taro.getSystemInfo({})
      .then(res  => {
        Taro.$navBarMarginTop =  res.statusBarHeight || 0;
      }) */
  }

  componentDidHide() {}

  config = {
    onReachBottomDistance: 50,
    navigationStyle: 'custom',
  };

  render() {
    const {
      TopHeight,
      searchListHeight,
      searchList,
      goodsList,
      isShow,
      searchVal,
      isComposite,
      saleOrder,
      priceOrder,
      salesDropIcon,
      salesRiseIcon,
      priceDropIcon,
      priceRiseIcon,
    } = this.state;
    return (
      <View>
        <View
          style={{ paddingTop: `${Taro.$navBarMarginTop}px` }}
          id="search-goods-head"
        >
          <View className="search-goods-head-nav">
            <Image
              onClick={this.handleNavigateBack}
              className="left-icon"
              src={require('../../static/searchpage/left.png')}
            />
            <View className="search-input">
              <Image src={require('../../static/home/search-icon.png')} />
              <Input
                id="searchInput"
                value={searchVal}
                onFocus={this.handleSearchInputFocus}
                onBlur={this.handleSearchInputBlur}
                placeholder="点击搜索您想要的商品"
                onConfirm={this.handleSearchInputConfirm}
                onInput={this.handleSearchInput}
              />
            </View>
          </View>
        </View>
        {/* 搜索结果列表 */}
        <View
          id="search-list"
          style={{
            top: `${TopHeight}px`,
            height: `${searchListHeight - TopHeight}px`,
            display: isShow ? 'none' : 'block',
          }}
        >
          {searchList.map((item) => (
            <View
              className="search-list-item"
              key={item.itemId}
              onClick={this.handleSearchItemClick.bind(this, item.itemName)}
              style={{
                display: '-webkit-box',
                '-webkit-box-orient': 'vertical',
                '-webkit-line-clamp': 1,
                overflow: 'hidden',
              }}
            >
              {item.itemName}
            </View>
          ))}
        </View>
        {/* 商品展示接口 */}
        <View id="search-page" style={{ paddingTop: `${TopHeight}px` }}>
          <View className="search-screen" style={{ top: `${TopHeight}px` }}>
            <View
              className="screen-item"
              onClick={this.handleCompositeClick}
              style={{ color: isComposite ? '#D5205E' : null }}
            >
              综合
            </View>
            <View className="screen-item" onClick={this.handleSalesClick}>
              <View
                className="screen-text"
                style={{ color: saleOrder ? '#D5205E' : null }}
              >
                销量
              </View>
              <View className="screen-filter">
                <Image src={salesRiseIcon} />
                <Image src={salesDropIcon} />
              </View>
            </View>
            <View className="screen-item" onClick={this.handlePriceClick}>
              <View
                className="screen-text"
                style={{ color: priceOrder ? '#D5205E' : null }}
              >
                价格
              </View>
              <View className="screen-filter">
                <Image src={priceRiseIcon} />
                <Image src={priceDropIcon} />
              </View>
            </View>
          </View>
          <View className="search-goods">
            <GoodsList goodsList={goodsList} hasTitle={true} />
          </View>
        </View>
      </View>
    );
  }
}

export default SearchGoods;
