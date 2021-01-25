import Taro, { Component } from "@tarojs/taro";
import { View, Text, Navigator, Input, Button, Icon } from "@tarojs/components";
import { AtSwipeAction, AtFloatLayout } from "taro-ui";
import "taro-ui/dist/style/components/float-layout.scss";
import "taro-ui/dist/style/components/swipe-action.scss";
import ServicePath from "../../common/util/api/apiUrl";
import { CarryTokenRequest } from "../../common/util/request";
import "../../common/globalstyle.less";
import "./cart.less";

export default class Cart extends Component {
  state = {
    isEmpty: true,
    visibleOO: false, //二次选择弹框
    checkAll: false,
    totalAmount: 0.0,
    addressId: 3,
    pageSubmitInfo: {}, //传入“订单提交”页的信息
    storeList: [],
    hasCheckAll: true, //是否存在全选按钮
    goodsNum: 0, // 选择商品总数
    isAllSelect: false, // 全选
    isEdit: "编辑",
    specModal: false, // 规格弹框
    goodsName: "", // 规格框商品名
    goodsImage: "", // 规格框商品图片
    goodsStock: "", // 规格框库存
    goodsPrice: "", // 规格框价格
    specTagName: "", // 主规格标题
    classTagName: "", // 子规格标题
    specList: [], // 总规格列表
    specArr: [], // 当前主规格列表
    classNameArr: [], // 当前子规格列表
    selectSpec: "", // 选择的主规格
    selectClass: "", // 选择的子规格
    otherClassNames: [], // 用来判断选中的主规格是否存在子规格specId
    specId: "", // 规格id
    id: "",
    goodsItemId: "", // 商品Id
    itemNum: "", // 商品数量
    favoritesNum: 0, // 收藏数量
    isDisable: false, // 规格弹框确定按钮禁止
    purchaseQuantity: 1, // 商品库存
  };

  // 编辑点击事件
  handleEditClick = () => {
    const { isEdit } = this.state;
    if (isEdit === "编辑") {
      this.setState({
        isEdit: "完成",
      });
    } else {
      this.setState({
        isEdit: "编辑",
      });
    }
  };

  //定位商店、商品
  findTarget = (itemStore, itemPro) => {
    let targetStore = {};
    let targetPro = {};
    this.state.storeList.forEach((iStore) => {
      if (iStore.storeID === itemStore.storeID) {
        targetStore = iStore;
        targetStore.proList.forEach((iPro) => {
          if (iPro.id === itemPro.id) {
            targetPro = iPro;
          }
        });
      }
    });
    return {
      targetStore: targetStore,
      targetPro: targetPro,
    };
  };

  //------------------------------------------勾选相关--------------------------------------//

  handleGoodsCheck = (itemShop, itemPro) => {
    const { storeList } = this.state;
    let checkAll = this.state.checkAll;
    let storeGoods = itemShop.proList.length;
    let selectedGoods = 0;
    let selectedStore = 0;
    storeList.forEach((itemStore) => {
      itemStore.proList.map((itemGoods) => {
        if (!itemPro.isShelfUp || itemPro.expired || itemPro.stockNum === 0) {
          return;
        }
        if (itemPro.id === itemGoods.id) {
          if (itemPro.checked === true) {
            itemGoods.checked = false;
            itemStore.checked = false;
            checkAll = false;
            return itemGoods;
          } else {
            itemGoods.checked = true;
            return itemGoods;
          }
        }
      });

      itemStore.proList.map((itemGoods) => {
        if (itemShop.businessId === itemStore.businessId) {
          if (itemGoods.checked === true) {
            selectedGoods++;
          }

          if (selectedGoods === storeGoods) {
            itemStore.checked = true;
          }
        }
      });

      if (itemStore.checked === true) {
        selectedStore++;
      }
      if (selectedStore === storeList.length) {
        checkAll = true;
      }
    });
    this.setState({
      storeList,
      checkAll,
    });
    this.totalAmount();
    this.hasGoodsFavorites();
  };

  // 店铺勾选
  handleShopClick = (itemShop) => {
    const { storeList } = this.state;
    let stores = [];
    storeList.forEach((itemStore) => {
      if (itemShop.storeID === itemStore.storeID) {
        if (itemShop.checked) {
          itemStore.checked = false;
          itemStore.proList.map((item) => {
            item.checked = false;
            return item;
          });
        } else {
          itemStore.checked = true;
          itemStore.proList.map((item) => {
            item.checked = true;
            return item;
          });
        }

        itemStore.proList.map((itemPro) => {
          if (!itemPro.isShelfUp || itemPro.expired || itemPro.stockNum === 0) {
            itemPro.checked = false;
          }
        });

        this.setState({
          storeList,
        });
      }

      if (itemStore.checked === true) {
        stores.push(itemStore);
      }
    });
    if (stores.length === storeList.length) {
      this.setState({
        checkAll: true,
      });
    } else {
      this.setState({
        checkAll: false,
      });
    }
    this.totalAmount();
    this.hasGoodsFavorites();
  };

  //全选切换
  checkAllGoods = () => {
    if (this.state.checkAll === false) {
      this.setState({
        checkAll: true,
      });
      this.state.storeList.forEach((store) => {
        store.proList.forEach((pro) => {
          if (pro.isShelfUp && !pro.expired && pro.stockNum !== 0) {
            store.checked = true;
            pro.checked = true;
          }
        });
      });
    } else {
      this.setState({
        checkAll: false,
      });
      this.state.storeList.forEach((store) => {
        store.proList.forEach((pro) => {
          store.checked = false;
          pro.checked = false;
        });
      });
    }
    this.setState({
      proList: this.state.proList,
    });
    this.totalAmount();
    this.hasGoodsFavorites();
  };

  //商店选中切换
  checkStore = (itemStore) => {
    itemStore.checked = !itemStore.checked;
    if (itemStore.checked === true) {
      itemStore.proList.forEach((pro) => {
        pro.checked = true;
      });
    } else {
      itemStore.proList.forEach((pro) => {
        pro.checked = false;
      });
    }
    let result = this.state.storeList.some((store) => {
      //全选勾选状态切换
      return !store.checked;
    });
    this.setState({
      checkAll: !result,
    });
    this.totalAmount();
  };

  //-----------------------------------------------------------------------------------//

  //------------------------------------数量修改相关-----------------------------------//

  // 商品数量+1
  amountRaise = (itemStore, itemPro) => {
    let targetPro = this.findTarget(itemStore, itemPro).targetPro;
    targetPro.amount_amount++;
    if (targetPro.amount_amount > 99) {
      targetPro.amount_amount = 99;
      Taro.showToast({
        title: "单次最多可购买99件",
        icon: "none",
        duration: 2000,
      });
    } else if (targetPro.amount_amount < 1) {
      targetPro.amount_amount = 1;
    }
    targetPro.amount = targetPro.singlePrice * targetPro.amount_amount;
    this.shoppingCartUpdate(itemPro, targetPro.amount_amount);
    this.totalAmount();
  };

  // 商品数量-1
  amountReduce = (itemStore, itemPro) => {
    let targetPro = this.findTarget(itemStore, itemPro).targetPro;
    targetPro.amount_amount--;
    if (targetPro.amount_amount > 99) {
      targetPro.amount_amount = 99;
    } else if (targetPro.amount_amount < 1) {
      targetPro.amount_amount = 1;
    }
    targetPro.amount = targetPro.singlePrice * targetPro.amount_amount;
    this.shoppingCartUpdate(itemPro, targetPro.amount_amount);
    this.totalAmount();
  };

  //手动输入商品数量
  inputNumber = (e, itemStore, itemPro) => {
    if (e.detail.value === "") {
      return false;
    }
    let targetPro = this.findTarget(itemStore, itemPro).targetPro;
    targetPro.amount_amount = e.detail.value;
    targetPro.amount_amount = targetPro.amount_amount.replace(/\D/g, "");
    if (targetPro.amount_amount > 99) {
      targetPro.amount_amount = 99;
    } else if (targetPro.amount_amount >= itemPro.stockNum) {
      targetPro.amount_amount = itemPro.stockNum;
    } else if (targetPro.amount_amount < 1 && e.detail.value) {
      targetPro.amount_amount = 1;
    }
    targetPro.amount = targetPro.singlePrice * targetPro.amount_amount;
    this.shoppingCartUpdate(itemPro, targetPro.amount_amount);
    this.totalAmount();
  };

  //输入结束事件
  inputComplete = (e, itemStore, itemPro) => {
    let targetPro = this.findTarget(itemStore, itemPro).targetPro;
    targetPro.amount_amount = e.detail.value;
    this.setState({}, () => {
      targetPro.amount_amount = targetPro.amount_amount
        .replace(/\D/g, "")
        .replace(/^[0]+/, "");
      if (targetPro.amount_amount > 99) {
        targetPro.amount_amount = 99;
      } else if (targetPro.amount_amount >= itemPro.stockNum) {
        targetPro.amount_amount = itemPro.stockNum;
      } else if (
        targetPro.amount_amount < 1 ||
        targetPro.amount_amount < itemPro.purchaseQuantity
      ) {
        if (itemPro.purchaseQuantity !== null) {
          targetPro.amount_amount = itemPro.purchaseQuantity;
        } else {
          targetPro.amount_amount = 1;
        }
      }
      targetPro.amount = targetPro.singlePrice * targetPro.amount_amount;
      this.shoppingCartUpdate(itemPro, targetPro.amount_amount);
      this.totalAmount();
    });
  };

  //后端数量同步
  shoppingCartUpdate = (itemPro, itemNum) => {
    let specId = "";
    itemPro.itemSpecClassRelVOlist.forEach((itemSpec) => {
      if (
        itemSpec.className === itemPro.type &&
        itemSpec.specName === itemPro.subType
      ) {
        specId = itemSpec.id;
      }
    });
    const postData = {
      id: itemPro.id,
      itemId: itemPro.proID,
      itemNum: itemNum,
      itemSpecClassId: specId,
    };
    CarryTokenRequest(ServicePath.shoppingCartUpdate, postData).then((res) => {
      if (res.data.code === 0) {
        return true;
      } else {
        Taro.showToast({
          title: res.data.msg,
          icon: "none",
        });
        return false;
      }
    });
  };

  //----------------------------------------------------------------------------------//

  //获取购物车信息
  getCart = () => {
    CarryTokenRequest(ServicePath.getCart, {
      current: 1,
      len: 10,
    }).then((res) => {
      if (res.data.data.length > 0) {
        this.setState(
          {
            isEmpty: false,
            checkAll: false,
            specModal: false,
            storeList: [
              ...res.data.data.map((s) => {
                return {
                  businessId: s.businessId,
                  storeID: s.shopId,
                  storeName: s.shopName,
                  checked: false,
                  cartId: s.id,
                  proList: s.detailVOList.map((p) => {
                    p.itemSpecClassRelVOlist.map((purchase) => {
                      if (
                        p.className === purchase.className &&
                        p.specName === purchase.specName
                      ) {
                        p.stockNum = purchase.stockNum;
                        p.purchaseQuantity = purchase.purchaseQuantity;
                        p.singlePurchaseState = purchase.singlePurchaseState;
                      }
                    });
                    return {
                      itemSpecClassRelVOlist: p.itemSpecClassRelVOlist,
                      proID: p.itemId,
                      id: p.id,
                      img: p.image,
                      proInfo: p.itemName,
                      specTagName: p.itemSpecClassRelVOlist[0].specTagName,
                      classTagName: p.itemSpecClassRelVOlist[0].classTagName,
                      amount_amount: p.itemNum,
                      type: p.className,
                      subType: p.specName,
                      originPrice: p.originPrice.toFixed(2),
                      singlePrice: p.price.toFixed(2),
                      amount: p.itemNum * p.price,
                      discount: 0.0,
                      isFavourite: p.isFavourite,
                      isShelfUp: p.isShelfUp,
                      expired: p.expired,
                      checked: false,
                      purchaseQuantity: p.purchaseQuantity,
                      singlePurchaseState: p.singlePurchaseState,
                      stockNum: p.stockNum, // 库存
                    };
                  }),
                };
              }),
            ],
          },
          () => {
            this.totalAmount();
          }
        );
      } else {
        this.setState(
          {
            storeList: [],
            isEmpty: true,
          },
          () => {
            this.totalAmount();
          }
        );
      }
    });
  };

  //计算总价
  totalAmount = () => {
    let a = 0;
    let goodsNum = 0;
    this.state.storeList.forEach((s) => {
      s.proList.forEach((p) => {
        if (p.checked) {
          goodsNum++;
          a += p.amount - p.discount;
        }
      });
    });
    this.setState({
      goodsNum,
      totalAmount: parseFloat(a.toFixed(2)),
    });
  };

  //计算所选商品涉及商店数
  countStore = () => {
    let result = 0;
    const sl = this.state.storeList;
    for (let indexStore = 0; indexStore < sl.length; indexStore++) {
      //计算涉及商店数
      const itemStore = sl[indexStore];
      for (let indexPro = 0; indexPro < itemStore.proList.length; indexPro++) {
        const itemPro = itemStore.proList[indexPro];
        itemStore.includeChecked = false;
        if (itemPro.checked === true) {
          itemStore.includeChecked = true;
          break;
        }
      }
      if (itemStore.includeChecked === true) {
        result++;
      }
    }
    return result;
  };

  //---------------------------------------删除相关---------------------------------------//

  //---------------------------------------单个删除：确认+删除
  deleteSingleConfirm = (itemStore, itemPro) => {
    const id = [itemPro.id];
    const deleteSingleLocal = () => {
      //本地删除
      let i = 0;
      let targeStore = {};
      this.state.storeList.forEach((iStore) => {
        if (iStore.storeID === itemStore.storeID) {
          targeStore = iStore;
          targeStore.proList.forEach((iPro) => {
            if (iPro.id === itemPro.id) {
              i = targeStore.proList.indexOf(iPro);
            }
          });
        }
      });
      targeStore.proList.splice(i, 1);
      if (targeStore.proList.length === 0) {
        //商店内商品全删时连同商品一起删除
        let indexStore = this.state.storeList.indexOf(targeStore);
        this.state.storeList.splice(indexStore, 1);
      }
      if (this.state.storeList.length === 0) {
        //商品全被删除后切换至空购物车状态
        this.setState({
          checkAll: false,
          isEmpty: true,
        });
      }
      this.totalAmount();
    };
    const deleteSingleRequest = (id) => {
      CarryTokenRequest(ServicePath.deleteProduction, id) //发起删除
        .then((res) => {
          if (res.data.code === 0) {
            Taro.showToast({
              title: "删除成功",
              icon: "success",
              duration: 2000,
            });
            deleteSingleLocal();
          }
        })
        .catch((err) => {
          console.log("接口异常 - 删除商品：", err);
        });
    };
    Taro.showModal({
      cancelText: "我再想想",
      cancelColor: "#ff5d8c",
      content: "您确定将这1款宝贝删除",
      success: (res) => {
        if (res.confirm) {
          deleteSingleRequest(id);
        }
      },
    });
  };

  //---------------------------------------------------------------------------------------//

  // 点击商品
  handleGoodsClick = (itemStore, itemPro, e) => {
    switch (e.text) {
      case "删除":
        this.deleteSingleConfirm(itemStore, itemPro);
        break;
      case "收藏商品":
        this.handleConcern(itemStore, itemPro);
        break;
      case "取消收藏":
        this.handleCancelConcern(itemStore, itemPro);
        break;
      default:
        break;
    }
  };

  //收藏事件
  handleConcern = (itemStore, itemPro) => {
    const postData = {
      itemIdList: [itemPro.proID],
    };
    CarryTokenRequest(ServicePath.userAtItemAdd, postData).then((res) => {
      if (res.data.code === 0) {
        Taro.showToast({
          title: "收藏成功",
          icon: "success",
          duration: 2000,
        });
        this.state.storeList.forEach((iStore) => {
          if (iStore.storeID === itemStore.storeID) {
            iStore.proList.forEach((iPro) => {
              if (iPro.proID === itemPro.proID) {
                iPro.isFavourite = true;
              }
            });
          }
        });
        this.setState({});
      }
    });
  };

  //取消收藏事件
  handleCancelConcern = (itemStore, itemPro) => {
    const postData = {
      itemIdList: [itemPro.proID],
    };
    CarryTokenRequest(ServicePath.userAtItemRemoveByIds, postData).then(
      (res) => {
        if (res.data.code === 0) {
          Taro.showToast({
            title: "取消收藏成功",
          });
          this.state.storeList.forEach((iStore) => {
            if (iStore.storeID === itemStore.storeID) {
              iStore.proList.forEach((iPro) => {
                if (iPro.proID === itemPro.proID) {
                  iPro.isFavourite = false;
                }
              });
            }
          });
          this.setState({});
        } else {
          Taro.showModal({
            title: "提示",
            content: res.data.msg,
            showCancel: false,
          });
        }
      }
    );
  };

  //结算事件
  handleComplete = () => {
    let countStoreResult = this.countStore(); // 获取涉及商店数
    if (countStoreResult !== 0) {
      this.complete();
    }
  };

  //正式结算
  complete = () => {
    let shoppingDetailList = []; // 已选商品列表
    this.state.storeList.forEach((itemStore) => {
      itemStore.proList.forEach((itemPro) => {
        if (itemPro.checked === true) {
          const checkedPro = {
            number: itemPro.amount_amount,
            shoppingDetailId: itemPro.id,
          };
          shoppingDetailList.push(checkedPro);
        }
      });
    });
    let postData = {
      shoppingDetailList: shoppingDetailList,
    };
    this.gotoPageOrderSubmit(postData);
  };

  // 收藏商品按钮点击事件
  handleFavorites = () => {
    const ids = [];
    this.state.storeList.forEach((itemStore) => {
      itemStore.proList.forEach((itemPro) => {
        if (itemPro.checked === true && !itemPro.isFavourite) {
          ids.push(itemPro.proID);
        }
      });
    });
    const postData = {
      itemIdList: ids,
    };
    CarryTokenRequest(ServicePath.userAtItemAdd, postData).then((res) => {
      if (res.data.code === 0) {
        Taro.showToast({
          title: "收藏成功",
          icon: "success",
          duration: 2000,
        });
        this.getCart();
      }
    });
  };

  // 删除商品按钮点击事件
  handleDelete = () => {
    const ids = [];
    this.state.storeList.forEach((itemStore) => {
      itemStore.proList.forEach((itemPro) => {
        if (itemPro.checked === true) {
          ids.push(itemPro.id);
        }
      });
    });
    const deleteSingleRequest = (id) => {
      CarryTokenRequest(ServicePath.deleteProduction, id) //发起删除
        .then((res) => {
          if (res.data.code === 0) {
            Taro.showToast({
              title: "删除成功",
              icon: "success",
              duration: 2000,
              success: () => {
                this.getCart();
              },
            });
          }
        })
        .catch((err) => {
          console.log("接口异常 - 删除商品：", err);
        });
    };
    Taro.showModal({
      title: "删除商品",
      content: "是否删除选中商品？",
      success: (res) => {
        if (res.confirm) {
          deleteSingleRequest(ids);
        }
      },
    });
  };

  //获取结算页信息并跳转
  gotoPageOrderSubmit = (postData) => {
    CarryTokenRequest(ServicePath.gotoSettlement, postData).then((res) => {
      if (res.data.code === 0) {
        this.setState(
          {
            pageSubmitInfo: res.data.data,
          },
          () => {
            const pageSubmitInfo = JSON.stringify(this.state.pageSubmitInfo);
            const shoppingDetailList = JSON.stringify(
              postData.shoppingDetailList
            );
            Taro.navigateTo({
              url: `../ordersubmit/ordersubmit?pageSubmitInfo=${pageSubmitInfo}&shoppingDetailList=${shoppingDetailList}&type=cart`,
            });
          }
        );
      } else {
        Taro.showToast({
          title: res.data.msg,
          duration: 2000,
          icon: "none",
        });
      }
    });
  };

  // 查询购物车列表商品是否包含收藏商品
  hasGoodsFavorites = () => {
    const { storeList } = this.state;
    let favoritesNum = 0;
    for (let itemStore of storeList) {
      for (let itemGoods of itemStore.proList) {
        if (itemGoods.checked === true) {
          if (!itemGoods.isFavourite) {
            favoritesNum += 1;
          }
        }
      }
    }
    this.setState({
      favoritesNum,
    });
  };

  // -------------------规格弹框---------------------------------

  // 商品规格选择弹框
  handleSpecClick = (itemStore, itemPro, e) => {
    let specArr = [];
    let classNameArr = [];
    let goodsStock = "";
    let specId = "";
    itemPro.itemSpecClassRelVOlist.map((item) => {
      if (
        item.specName === itemPro.subType &&
        item.className === itemPro.type
      ) {
        goodsStock = item.stockNum;
        specId = item.id;
      }
      specArr.push(item.specName);
      classNameArr.push(item.className);
    });
    console.log(specId);
    this.setState({
      specModal: true,
      goodsName: itemPro.proInfo,
      goodsImage: itemPro.img,
      itemNum: itemPro.amount_amount,
      specTagName: itemPro.specTagName,
      classTagName: itemPro.classTagName,
      specArr: Array.from(new Set(specArr)),
      classNameArr: Array.from(new Set(classNameArr)),
      selectSpec: itemPro.subType,
      selectClass: itemPro.type,
      goodsPrice: itemPro.singlePrice,
      goodsStock,
      specList: itemPro.itemSpecClassRelVOlist,
      specId,
      id: itemPro.id,
      goodsItemId: itemPro.proID,
    });
    e.stopPropagation();
  };

  AtFloatLayouyClose = () => {
    this.setState({
      specModal: false,
    });
  };

  // 弹框X点击事件
  handleForkClick = () => {
    this.setState({
      specModal: false,
    });
  };

  // 主规格选择
  handleSelectSpec = (item) => {
    const { specList, selectClass } = this.state;
    for (let idx of specList) {
      if (idx.specName === item && idx.className === selectClass) {
        this.setState({
          selectSpec: item,
          purchaseQuantity:
            idx.purchaseQuantity === null ? 1 : idx.purchaseQuantity,
          specId: idx.id,
          goodsPrice: idx.discountPrice.toFixed(2),
          goodsStock: idx.stockNum,
        });
      }
    }
  };

  // 子规格选择
  handleSelectClass = (item) => {
    const { specList, selectSpec } = this.state;
    for (let idx of specList) {
      if (idx.className === item && idx.specName === selectSpec) {
        this.setState({
          selectClass: item,
          specId: idx.id,
          purchaseQuantity:
            idx.purchaseQuantity === null ? 1 : idx.purchaseQuantity,
          goodsPrice: idx.discountPrice.toFixed(2),
          goodsStock: idx.stockNum,
        });
      }
    }
  };

  // 弹框确定按钮
  handleSpecConfirm = () => {
    const postData = {
      id: this.state.id,
      itemId: this.state.goodsItemId,
      itemNum: this.state.itemNum,
      itemSpecClassId: this.state.specId,
    };
    CarryTokenRequest(ServicePath.shoppingCartUpdate, postData).then((res) => {
      if (res.data.code === 0) {
        this.getCart();
      } else {
        Taro.showToast({
          title: res.data.msg,
          icon: "none",
        });
      }
    });
  };

  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: "购物车",
    });
  }

  componentDidShow() {
    this.setState({
      isEdit: "编辑",
    });
    this.getCart();
  }

  componentDidHide() {
    this.setState({
      storeList: [],
    });
  }

  render() {
    const {
      storeList,
      totalAmount,
      goodsNum,
      checkAll,
      isEdit,
      specModal,
      goodsName,
      goodsImage,
      specTagName,
      classTagName,
      specArr,
      classNameArr,
      selectSpec,
      selectClass,
      goodsStock,
      goodsPrice,
      favoritesNum,
      purchaseQuantity,
    } = this.state;
    return (
      <View>
        <View id="cart">
          <View className="cart-header">
            <View className="toast">
              <Image
                className="toast-img"
                src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/cart/remind-icon.png"
              />
              <Text>商品税费和邮费需用户自行支付，如有疑问请联系客服。</Text>
            </View>
            <View className="edit">
              <Text
                className="edit-text"
                onClick={this.handleEditClick.bind(this)}
              >
                {isEdit}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: this.state.isEmpty === true ? "none" : "block",
              padding: "0rpx 22rpx",
            }}
          >
            {storeList.map((itemStore) => (
              <View className="shop-box" key={itemStore.storeID}>
                <View className="shop-title">
                  <View
                    className="shop-check"
                    onClick={this.handleShopClick.bind(this, itemStore)}
                  >
                    <Icon
                      className="check"
                      style={{ display: itemStore.checked ? "none" : "block" }}
                      type="circle"
                      size="16"
                    ></Icon>
                    <Icon
                      style={{ display: itemStore.checked ? "block" : "none" }}
                      className="check-ac"
                      type="success"
                      size="16"
                      color="#ff5d8c"
                    ></Icon>
                  </View>
                  <Navigator
                    url={`/pages/shophome/shophome?businessId=${itemStore.businessId}`}
                  >
                    <Text className="shop-title-text">
                      {itemStore.storeName}
                    </Text>
                    <Image
                      className="go-shop-icon"
                      src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/common/blak-icon.png"
                    />
                  </Navigator>
                </View>
                <View className="goods-list">
                  {itemStore.proList.map((itemPro) => (
                    <AtSwipeAction
                      /* autoClose */
                      key={itemPro.proID}
                      options={[
                        {
                          text:
                            itemPro.isFavourite === true
                              ? "取消收藏"
                              : "收藏商品",
                          style: {
                            backgroundColor: "#7F7F7F",
                          },
                        },
                        {
                          text: "删除",
                          style: {
                            backgroundColor: "#FF4545",
                          },
                        },
                      ]}
                      onClick={this.handleGoodsClick.bind(
                        this,
                        itemStore,
                        itemPro
                      )}
                    >
                      <View className="goods-item">
                        <View
                          className="goods-checkbox"
                          onClick={this.handleGoodsCheck.bind(
                            this,
                            itemStore,
                            itemPro
                          )}
                        >
                          <Icon
                            className="check"
                            style={{
                              display: itemPro.checked
                                ? "none"
                                : !itemPro.isShelfUp || itemPro.expired
                                ? "none"
                                : itemPro.stockNum === 0
                                ? "none"
                                : "block",
                            }}
                            type="circle"
                            size="16"
                          ></Icon>
                          {/* {console.log()} */}
                          <Icon
                            style={{
                              display: itemPro.checked
                                ? "block"
                                : !itemPro.isShelfUp || itemPro.expired
                                ? "none"
                                : itemPro.stockNum === 0
                                ? "none"
                                : "none",
                            }}
                            className="check-ac"
                            type="success"
                            size="16"
                            color="#ff5d8c"
                          ></Icon>
                          <Icon
                            style={{
                              display:
                                !itemPro.isShelfUp ||
                                itemPro.expired ||
                                itemPro.stockNum === 0
                                  ? "block"
                                  : "none",
                            }}
                            color="#ccc"
                            size="16"
                            type="circle"
                          ></Icon>
                        </View>
                        <View className="goods-image-box">
                          <Navigator
                            url={`/pages/goodsdetails/goodsdetails?itemId=${itemPro.proID}`}
                          >
                            <Image className="goods-image" src={itemPro.img} />
                            <View
                              className="isShelfUp"
                              style={{
                                display: itemPro.isShelfUp ? "none" : "block",
                              }}
                            >
                              已下架
                            </View>
                            <View
                              className="expired"
                              style={{
                                display: itemPro.expired ? "block" : "none",
                              }}
                            >
                              已过期
                            </View>
                            <View
                              className="in-stock"
                              style={{
                                display:
                                  itemPro.stockNum === 0 ? "block" : "none",
                              }}
                            >
                              已售罄
                            </View>
                          </Navigator>
                        </View>
                        <View className="goods-info">
                          <Navigator
                            url={`/pages/goodsdetails/goodsdetails?itemId=${itemPro.proID}`}
                          >
                            <View
                              className="goods-name"
                              style={{
                                display: "-webkit-box",
                                "-webkit-box-orient": "vertical",
                                "-webkit-line-clamp": 2,
                                overflow: "hidden",
                              }}
                            >
                              {itemPro.proInfo}
                            </View>

                            <View
                              onClick={this.handleSpecClick.bind(
                                this,
                                itemStore,
                                itemPro
                              )}
                            >
                              <Text className="sku-box">
                                {itemPro.subType};{itemPro.type}
                                <Text className="sku-icon"></Text>
                              </Text>
                            </View>
                            {itemPro.purchaseQuantity == null ||
                            itemPro.purchaseQuantity == 1 ? (
                              ""
                            ) : (
                              <View>
                                <Text className="purchase-quantity">
                                  {itemPro.purchaseQuantity}件起购
                                </Text>
                              </View>
                            )}
                            {itemPro.singlePurchaseState == null ||
                            itemPro.singlePurchaseState === 0 ? (
                              ""
                            ) : (
                              <View>
                                <Text className="single-purchase-state">
                                  不可单独购买
                                </Text>
                              </View>
                            )}
                          </Navigator>
                          <View className="price-box">
                            <Text className="price-text">
                              {itemPro.singlePrice}
                            </Text>
                            {itemPro.stockNum == 0 ||
                            itemPro.expired | !itemPro.isShelfUp ? null : (
                              <View className="goods-number-box">
                                <Button
                                  className="reduce"
                                  onClick={this.amountReduce.bind(
                                    this,
                                    itemStore,
                                    itemPro
                                  )}
                                  disabled={
                                    itemPro.amount_amount <=
                                    itemPro.purchaseQuantity
                                      ? true
                                      : itemPro.amount_amount === 1
                                      ? true
                                      : false
                                  }
                                >
                                  <View
                                    className="line"
                                    style={{
                                      backgroundColor:
                                        itemPro.amount_amount <=
                                        itemPro.purchaseQuantity
                                          ? "#ccc"
                                          : itemPro.amount_amount === 1
                                          ? "#ccc"
                                          : "#000",
                                    }}
                                  ></View>
                                </Button>
                                <Input
                                  type="number"
                                  maxLength="2"
                                  value={itemPro.amount_amount}
                                  className="number-input"
                                  onInput={(e) => {
                                    this.inputNumber(e, itemStore, itemPro);
                                  }}
                                  onBlur={(e) => {
                                    this.inputComplete(e, itemStore, itemPro);
                                  }}
                                />
                                <Button
                                  className="add"
                                  onClick={this.amountRaise.bind(
                                    this,
                                    itemStore,
                                    itemPro
                                  )}
                                  disabled={
                                    itemPro.amount_amount >= itemPro.stockNum
                                      ? true
                                      : itemPro.amount_amount === 99
                                      ? true
                                      : false
                                  }
                                >
                                  <View
                                    className="line"
                                    style={{
                                      backgroundColor:
                                        itemPro.amount_amount >=
                                        itemPro.stockNum
                                          ? "#ccc"
                                          : itemPro.amount_amount === 99
                                          ? "#ccc"
                                          : "#000",
                                    }}
                                  ></View>
                                  <View
                                    className="line trans"
                                    style={{
                                      backgroundColor:
                                        itemPro.amount_amount >=
                                        itemPro.stockNum
                                          ? "#ccc"
                                          : itemPro.amount_amount === 99
                                          ? "#ccc"
                                          : "#000",
                                    }}
                                  ></View>
                                </Button>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    </AtSwipeAction>
                  ))}
                </View>
              </View>
            ))}
          </View>
          <View
            className="empty"
            style={{ display: this.state.isEmpty === true ? "block" : "none" }}
          >
            <Image
              className="empty-icon"
              src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/common/cartEmpty-icon.png"
            />
            <View className="empty-point">购物车里没有商品，先去逛逛~</View>
          </View>
        </View>
        <View className="to-settle">
          <View
            className="all-checkbox"
            onClick={this.checkAllGoods.bind(this)}
          >
            <View className="checkbox-wrap">
              <Icon
                className="check"
                style={{
                  display: checkAll ? "none" : "block",
                }}
                type="circle"
                size="16"
              ></Icon>
              <Icon
                style={{
                  display: checkAll ? "block" : "none",
                }}
                className="check-ac"
                type="success"
                size="16"
                color="#ff5d8c"
              ></Icon>
            </View>
            <Text className="all-checkbox-text">全选</Text>
          </View>
          <View
            className="settle-box"
            style={{ display: isEdit == "编辑" ? "block" : "none" }}
          >
            <View className="price-total">
              <View>
                <Text>总计</Text>
                <Text className="price">
                  <Text className="price-symbol">￥</Text>
                  <Text className="price-text">{totalAmount.toFixed(2)}</Text>
                </Text>
              </View>
              <View style={{ color: "#787878" }}>(不含税费/运费)</View>
            </View>
            <View className="settle-btn-box">
              <Button
                onClick={this.handleComplete}
                className="settle-btn"
                disabled={goodsNum !== 0 ? false : true}
              >
                <Text>结算</Text>
                <Text className="goods-total">{goodsNum}</Text>
              </Button>
            </View>
          </View>
          <View style={{ display: isEdit == "完成" ? "block" : "none" }}>
            <View className="delete-box">
              <Button
                className="favorites-btn"
                disabled={favoritesNum !== 0 ? false : true}
                onClick={this.handleFavorites.bind(this)}
              >
                <Image
                  className="favorites-icon"
                  src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/goodsdetails/favorites.png"
                />
                <Text>收藏商品</Text>
              </Button>
              <Button
                className="delete-btn"
                disabled={goodsNum !== 0 ? false : true}
                onClick={this.handleDelete}
              >
                <Image
                  className="delete-icon"
                  src="https://iconmall-developer.oss-cn-beijing.aliyuncs.com/png/small/common/delete.png"
                />
                <Text>删除</Text>
              </Button>
            </View>
          </View>
        </View>
        <AtFloatLayout isOpened={specModal} onClose={this.AtFloatLayouyClose}>
          <View className="goods-spec-box">
            <Image
              onClick={this.handleForkClick}
              className="fork"
              src={require("../../static/goodsdetails/fork.png")}
            />
            <View className="goods-info-box">
              <View className="goods-img-box">
                <Image className="goods-image" src={goodsImage} />
              </View>
              <View className="goods-name-box">
                <View
                  className="goods-name-text"
                  style={{
                    display: "-webkit-box",
                    "-webkit-box-orient": "vertical",
                    "-webkit-line-clamp": 2,
                    overflow: "hidden",
                  }}
                >
                  {goodsName}
                </View>
                <View className="goods-price">
                  <Text className="price-symbol">￥</Text>
                  <Text className="price-text">{goodsPrice}</Text>
                </View>
                <View className="goods-stock">库存：{goodsStock}</View>
              </View>
            </View>
            {/* 商品主规格 */}
            <View className="goods-spec-wrap">
              <View className="spec-title">{specTagName}</View>
              <View className="spec-list">
                {specArr.map((item, index) => (
                  <View
                    key={index}
                    onClick={this.handleSelectSpec.bind(this, item)}
                    className={
                      selectSpec === item ? "spec-item-ac" : "spec-item"
                    }
                  >
                    {item}
                  </View>
                ))}
              </View>
            </View>
            {/* 商品子规格 */}
            <View className="goods-class-wrap">
              <View className="class-title">{classTagName}</View>
              <View className="class-list">
                {classNameArr.map((item, index) => (
                  <View
                    key={index}
                    onClick={this.handleSelectClass.bind(this, item)}
                    className={
                      selectClass === item
                        ? "className-item-ac"
                        : "className-item"
                    }
                  >
                    {item}
                  </View>
                ))}
              </View>
            </View>
            <View className="Add-cart-btn">
              <Button
                disabled={
                  goodsStock === 0 || goodsStock < purchaseQuantity
                    ? true
                    : false
                }
                onClick={this.handleSpecConfirm}
              >
                {goodsStock === 0 || goodsStock < purchaseQuantity
                  ? "已售罄"
                  : "确定"}
              </Button>
            </View>
          </View>
        </AtFloatLayout>
      </View>
    );
  }
}
