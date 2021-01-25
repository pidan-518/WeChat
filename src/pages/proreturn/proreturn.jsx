import Taro, { Component } from '@tarojs/taro';
import { View, Text, Checkbox, CheckboxGroup, Input } from '@tarojs/components'
// import post from '../../common/util/taroRequest';
import post from '../../common/util/taroRequest';
import { CarryTokenRequest } from '../../common/util/request';
import ServicePath from "../../common/util/api/apiUrl";
// import { Pagination, message } from "antd";
import "../../common/globalstyle.less";
import "./proreturn.less";
import CommonEmpty from '../../components/CommonEmpty/CommonEmpty';
// import CommonEmpty from "../../components/CommonEmpty/CommonEmpty";
// import { DialogCreate } from "../../components/Dialog/Dialog";
// import // cookie from "react-// cookies";
 
export default class ProReturn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "total": 10,  //总项数
      "currentPage": 1, //当前页
      "pages": 1, //总页数
      "isEmpty": false, //是否为空
      "orderList": []
    }
  }

  //退货状态映射
  transStatusTText = (status) => {
    switch (status) {
      case 0:
        return "申请退货中";
      case 1:
        return "退货中";
      case 2:
        return "退款中";
      case 3:
        return "仲裁中";
      case 4:
        return "退货失败";
      case 5:
        return "已取消申请";
      case 6:
        return "拒绝退货";
      case 7:
        return "退款成功";
      default:
        return "--";
    }
  }

  //获取订单、商品列表
  getAfterSaleList = (currentPage) => {
    const postData = {
      "current": currentPage,
      "len": 6
    }

    CarryTokenRequest(ServicePath.afterSaleList, postData)
      .then(res => {
        if (res.data.code === 0) {
          const rs = res.data.data;
          if (rs.records.length > 0) {
            this.setState({
              "pages": rs.pages,
              "orderList":[...this.state.orderList].concat(rs.records.map(o => {
                return (
                  {
                    "orderID": o.orderNo,
                    "storeName": o.shopName,
                    "businessUser": o.businessUser,
                    "proList": o.returnOfGoods.map(p => {
                      const po = p.orderDetailVO;
                      return (
                        {
                          "proID": po.itemId,
                          "imgUrl": po.itemImage,
                          "title": po.itemName,
                          "amount_amount": po.itemNum,
                          "sepecification": `${po.itemSpecClassRel.specTagName}：${po.itemSpecClassRel.specName}`,
                          "sepcClass": `${po.itemSpecClassRel.classTagName}：${po.itemSpecClassRel.className}`,
                          "price": po.price,
                          "amount": po.price * po.itemNum,
                          "discount": 0.00,
                          "status": p.state,   //接口数据：p.state  1同意退货(退货中)  2退货成功  3申请仲裁  4退货失败  5取消申请
                          "orderDetailId": po.orderDetailId,
                          "orderID": o.orderNo,
                          "returnOrderNo": p.returnOrderNo
                        }
                      )
                    })
                  }
                )
              }))
            })
          } else {
            this.setState({
              isEmpty: true
            })
          }
        }
      })
      .catch(err => {
        console.log("接口异常 - 获取订单、商品列表：", err);
      })
  }

  //定位目标
  findTarget = (itemPro, itemOrder) => {
    let targetOrder = {};
    let targetPro = {};
    this.state.orderList.forEach(iOrder => {
      if (iOrder.orderID === itemOrder.orderID) {
        targetOrder = iOrder;
        targetOrder.proList.forEach(iPro => {
          if (iPro.returnOrderNo === itemPro.returnOrderNo) {
            targetPro = iPro;
          }
        })
      }
    });

    return {
      targetOrder: targetOrder,
      targetPro: targetPro
    }
  }


  //申请退换事件：跳转退换申请
  handleReturnApply = (itemPro) => {
    this.props.history.push({
      pathname: "/returnapply",
      state: itemPro
    })
  }

  //申请退货中，查看详情事件：跳转退换处理页面
  handleReturnProcessing = (itemPro) => {
    this.props.history.push({
      pathname: "/returnprocessing",
      state: itemPro
    })
  }

  //申请仲裁事件
  handleArbitrateApply = (p, o) => {

    Taro.showModal({
      title: '申请仲裁',
      content: '是否确认申请仲裁',
      success: res => {
        if (res.confirm) {
          this.arbitrateApply(p, o)
        }
      }
    })

  }

  //申请仲裁
  arbitrateApply = (p, o) => {
    const targetPro = this.findTarget(p, o).targetPro;

    const postData = {
      "returnOrderNo": p.returnOrderNo,
      "orderNo": o.orderID,
      "state": 3
    };
    CarryTokenRequest(ServicePath.afterSaleApply, postData)
      .then(res => {
        if (res.data.code === 0) {
          Taro.showToast({
            title: '申请仲裁成功'
          })
          targetPro.status = 3;
          this.setState({});
        } else {
          Taro.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      })
  }

  //取消申请事件
  handleCancelApply = (p, o) => {

    const targetPro = this.findTarget(p, o).targetPro;

    /* 取消申请 */
    const cancelApply = () => {
      const postData = {
        "state": 5,
        "returnOrderNo": p.returnOrderNo,
        "orderNo": p.orderID
      };
      CarryTokenRequest(ServicePath.afterSaleApply, postData)
        .then(res => {
          if (res.data.code === 0) {
            Taro.showToast({
              title: '取消申请成功'
            });
            targetPro.status = 5;
            this.setState({});
          }
        })
    }

    /* 二次确认 */
    Taro.showModal({
      title: '取消申请',
      content: '是否取消该申请？',
      success: res => {
        if (res.confirm) {
          cancelApply();
        }
      }
    })

  }


  //退换中、拒绝退换，查看详情事件：跳转退换结果页面
  handleReturnResult = (itemPro, itemOrder) => {
    console.log(itemOrder, 'itemOrder')
    // this.props.history.push({
    //   pathname: "/returnresult",
    //   state: {
    //     "itemPro": itemPro,
    //     "itemOrder": itemOrder
    //   }
    // })

    // itemPro.sellerName = itemOrder.shopName;
    // delete itemPro["amount"];
    const item = JSON.stringify(itemPro)
    Taro.navigateTo({
      url: `../returnresult/returnresult?state=${item}&from=proreturn`
    })
  }

  //切页事件
  handlePage = (pageNum) => {
    this.setState({
      "currentpage": pageNum
    }, () => {
      this.getAfterSaleList();
    })
  }

  //IM事件
  handleIm = (accid) => {
    if (accid) {
      // cookie.save("targetUid", accid, { path: "/" })
      const w = window.open("about:blank");
      w.location.href="../im/main.html";
    } else {
      DialogCreate.open({
        para: "抱歉，该店铺该不支持在线咨询",
        hasCancel: false
      })
    }
  }


  componentDidMount() {
    // document.documentElement.scrollTop = 0;
    Taro.setNavigationBarTitle({
      title: '退换订单'
    })
  }

  componentDidShow() {
    this.getAfterSaleList(this.state.currentPage);
  }
  
  componentDidHide() {
    this.setState({
      orderList: [],
      currentPage: 1
    })
  }

  onReachBottom() {
    if (this.state.currentPage < this.state.pages) {
      this.setState({
        currentPage: this.state.currentPage + 1
      }, () => {
        this.getAfterSaleList(this.state.currentPage)
      })
    }
  }


  render() {

    return(
      <View class="ProReturn">
        <View class="ct-wrap">
          <View class="ct-proReturn">
            <table>
              {
                this.state.orderList.length === 0 ? <CommonEmpty content="暂无订单" /> :
                  this.state.orderList.map(o => {
                    return (
                      <tbody key={o.orderID}>
                        <tr class="orderID">
                          <td colSpan="5">
                            <Text class="prop">订单号：</Text>
                            <Text class="value">{o.orderID}</Text>
                          </td>
                        </tr>
                        {
                          o.proList.map(p => {
                            return (
                              <tr class="orderInfo" key={p.returnOrderNo}>
                                <td class="proInfo">
                                  <Image src={p.imgUrl} alt="" class="left" />
                                  <View class="right">
                                    <Text class="title">{p.title}</Text>
                                    <td class="amount">
                                      <Text class="sepecification">{p.sepecification}</Text>
                                      <Text class="sepcClass">{p.sepcClass}</Text>
                                      <Text class="amount-amount">数量：x{p.amount_amount}</Text>
                                    </td>
                                    <td class="proInfo_subTotal">
                                      <View class="amount currency">{p.amount}</View>
                                      <View class="status">{this.transStatusTText(p.status)}</View>
                                    </td>
                                  </View>
                                </td>
                                <td class="action">
                                  <Button       //申请退换中
                                    class="see"
                                    type="button" 
                                    onClick={this.handleCancelApply.bind(this, p, o)}
                                    style={{display: p.status===0?"inline-block":"none"}}
                                  >
                                    取消申请
                                  </Button>
                                  <Button       //拒绝退换
                                    class="see"
                                    type="button" 
                                    onClick={this.handleArbitrateApply.bind(this, p, o)}
                                    style={{display: [6].includes(p.status)?"inline-block":"none"}}
                                  >
                                    申请仲裁
                                  </Button>
                                  <Button       //退换中/拒绝退换
                                    class="see"
                                    type="button" 
                                    onClick={this.handleReturnResult.bind(this, p, o)}
                                    style={{display: [1,6].includes(p.status)?"inline-block":"none"}}
                                  >
                                    查看详情
                                  </Button>
                                </td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    )
                  })
              }
            </table>
          </View>
        </View>
        {/* <GuessLike />    */}
      </View>
    )
  }
}