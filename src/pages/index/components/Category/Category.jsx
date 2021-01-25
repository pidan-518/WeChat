import Taro, { Component } from "@tarojs/taro";
import { View, Swiper, SwiperItem } from "@tarojs/components";
import "./Category.less";

class Category extends Component {
  state = {};

  // 分类点击事件
  handleCategoryClick = (item) => {
    Taro.navigateTo({
      url: `../twocategory/twocategory?id=${item.categoryId}&categoryName=${item.categoryName}`,
    });
  };

  onPageScroll(e) {}

  //--------------------

  componentWillMount() {}

  componentDidMount() {}

  componentDidShow() {}

  render() {
    const { categoryIcon } = this.props;
    return (
      <View className="goods-category">
        <View className="category-wrap">
          {categoryIcon.map((item) => (
            <View
              className="category-item"
              key={item.id}
              onClick={this.handleCategoryClick.bind(this, item)}
            >
              <Image src={item.icon} webp />
              <View className="item-txt">{item.categoryName}</View>
            </View>
          ))}
        </View>
      </View>
    );
  }
}

Category.defaultProps = {
  categoryIcon: [],
};

export default Category;
