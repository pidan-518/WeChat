import Taro, { Component, connectSocket } from '@tarojs/taro';
import { View, Text, Form, Input, Textarea, Button } from '@tarojs/components'
import ServicePath from '../../common/util/api/apiUrl';
import { CarryTokenRequest } from '../../common/util/request';
import "../../common/globalstyle.less";
import "./returnapply.less";
import OrderInfo from "../../components/OrderInfo/OrderInfo"

export default class ReturnApply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "orderDetail": {
        "imgUrl": require("../../static/common/production.png"),
        "proName": "xxxxxxx剃须刀",
        "sellerName": "盛世回首",
        "phone": 18712341234,
        "orderID": 3215461548848,
        "type": "黑色 XXL",
        "amount": 2,
        "price": 135, 
      },
      reasonList: [   //原因列表
        '个人原因',
        '商品损坏',
        '卖家发货太慢',
        '卖家原因',
        '已与卖家沟通完毕',
      ],
      previewVisible: false,
      previewImage: '',
      selectedReason: '个人原因',  //换货原因
      selectedReasonId: 0,  //换货原因编号
      description: '',  //原因描述
      fileList: [], //图片列表
      images: '', //图片相对路径列表
    }
  }


  //------------------------------------上传图片相关----------------------------------------//

  //添加图片事件
  handleAddImg = () => {
    Taro.chooseImage({
      // count: 1,
      // sizeType: ['compressed'],
      success: res => {
        const tempFilePaths = res.tempFilePaths
        Taro.uploadFile({
          url: ServicePath.afterSaleUploadImage,
          filePath: tempFilePaths[0],
          name: 'imgList',
          formData: {
            "orderDetailId": this.state.orderDetail.orderDetailId
          },
          header: {
            "Content-Type": "multipart/form-data",
            'JWT-Token': Taro.getStorageSync("JWT-Token")
          },
          success: res => {
            const path = JSON.parse(res.data).data[0].path
            console.log(path, 'path')
            this.setState({
              images: this.state.images?`${this.state.images},${path}`:`${path}`
            }, () => {
            })
          }
        })
        this.setState({
          fileList: [...this.state.fileList, ...res.tempFilePaths]
        })
      }
    })
  }

  //删除图片事件
  handleDeleteImg = (itemFile) => {
    const index = this.state.fileList.indexOf(itemFile)
    this.state.fileList.splice(index, 1)
    this.state.images.split(index, 1)
    this.setState({})
  }


  //---------------------------------------------------------------------------------------//

  //接收我的订单页信息
  getPageProReturn = () => {
    const itemPro = JSON.parse(this.$router.params.state);
    // const itemPro = JSON.parse('{"offset":0,"current":null,"len":null,"orderBy":null,"isAsc":null,"total":null,"params":null,"orderDetailId":424,"orderNo":202007141000457,"itemId":206,"itemNum":1,"itemImage":"https://iconmall-test.oss-cn-shenzhen.aliyuncs.com/item/picture/43/1592289297808.jpg","itemName":"小三輪飛","price":0.03,"itemSpecClassId":756,"totalAmount":0.03,"businessId":43,"state":0,"logisticsState":22,"createTime":"2020-07-14 09:43:10","remarks":null,"item":{"offset":0,"current":null,"len":null,"orderBy":null,"isAsc":null,"total":null,"params":null,"itemId":206,"itemNo":"sp20200616100041","itemName":"小三輪飛","image":"https://iconmall-test.oss-cn-shenzhen.aliyuncs.com/item/picture/43/1592289297808.jpg","businessId":43,"categoryComId":2067,"categoryComPath":"自行车/三轮车/童车:自行车:三轮车","categoryBusId":0,"categoryBusPath":"","price":512,"discountPrice":256,"state":10,"subItemId":null,"logisticsFee":0,"stockNum":937,"saleNum":64,"likeNum":0,"createTime":"2020-06-16 14:39:01","updateTime":"2020-07-13 15:07:38","images":null,"itemTags":null,"specClassPrice":null,"placePurchase":555,"searchType":0,"dealType":0,"videoPath":"","putWay":0,"shelfTime":null,"shopName":null,"businessName":null,"className":null,"specName":null,"logisticsCode":"FOUR_PX","heavy":800,"volume":4320,"brand":"小三","packageUnit":0,"packageNum":800,"itemIntro":"进过三轮改版进步为超级摩托，赛亚人专配","detailVO":null,"itemSpecRelList":null,"collectionStatus":null,"expressFree":1,"taxFree":1,"source":null,"cateIds":null,"notCateIds":null,"sign":null},"itemSpecClassRel":{"offset":0,"current":null,"len":null,"orderBy":null,"isAsc":null,"total":null,"params":null,"id":756,"itemId":206,"classPrice":1000,"className":"100","specName":"蓝色","classTagName":"重量","specTagName":"颜色","stockNum":4,"itemTempId":645,"state":1,"version":8,"isDelete":0,"discountPrice":0.03,"discountRate":0,"expressFree":1,"taxFree":1,"specId":null},"shopName":null,"refundState":null,"evaluateState":80,"logisticsCode":"FOUR_PX","orderNoList":null,"description":"小三輪飛*1","logisticsFee":0,"taxFee":0,"evaluateLevel":null,"shouldPayAmount":0.03,"totalHeavy":800,"returnOrderNo":null,"returnApply":1,"busAccid":null,"packagingNo":20200714100345,"replyStatus":0,"totalOriginPrice":null,"serverType":null,"logisticsNo":null,"expressFree":null,"taxFree":null,"heavyWithPackage":null,"firstHeavyCharge":null,"discountRate":null,"purePrice":0.03,"pureLogisticsFee":0,"pureTaxFee":0,"originPrice":1000,"textState":"","textProButtonOne":"申请退货","sellerName":null}'); //linshi
    // console.log(this.$router.params.state, "this.$router.params.state")
    this.setState({
      "orderDetail": {
        "imgUrl": itemPro.item.image,
        "proName": itemPro.itemName, 
        "sellerName": itemPro.sellerName,
        "phone": null,
        "orderID": itemPro.orderNo,
        "type": `${itemPro.itemSpecClassRel.specName}`,
        "className": `${itemPro.itemSpecClassRel.className}`,
        // "type": `${itemPro.itemSpecClassRel.class} ${itemPro.itemSpecClassRel.specName}`,
        "amount": itemPro.itemNum, 
        "price": itemPro.price, 
        "proID": itemPro.itemId,
        "orderDetailId": itemPro.orderDetailId
      }
    }, () => {
      this.getAfterSaleDetail();
    })
  }

  //获取售后申请详情
  getAfterSaleDetail = () => {
    const postData = {
      "orderDetailId": this.state.orderDetail.orderDetailId
    };
    CarryTokenRequest(ServicePath.afterSaleDetail, postData)
      .then(res => {
        if (res.data.code === 0) {
          const rdd = res.data.data;
          const orderDetail = this.state.orderDetail;
          orderDetail.phone = rdd.businessUser.mobile;
          orderDetail.sellerName = rdd.businessUser.owner;
          this.setState({});
        }
      })
      .catch(err => {
        console.log("接口异常 - 查看售后申请详情：", err);
      })
  }

  //原因说明修改事件
  handleChangeDescription = (e) => {
    this.setState({
      description: e.detail.value
    })
  }

  //提交事件
  handleSubmit = () => {
    const sto = this.state.orderDetail;
    const postData = {
      "orderNo": sto.orderID,
      "itemId": sto.proID,
      "orderDetailId": sto.orderDetailId,
      "type": 1,
      "cause": this.state.selectedReasonId,
      "remarks": this.state.description,
      "images":this.state.images,
    }
    this.gotoPageReturnProcessing(postData);
  }


  //获取提交结果并跳转
  gotoPageReturnProcessing = (postData) => {
    CarryTokenRequest(ServicePath.afterSaleApply, postData)
      .then(res => {
        if (res.data.code === 0) {
          const lst = {};
          const orderDetail = JSON.stringify(this.state.orderDetail)
          Taro.navigateTo({
            url: `../returnprocessing/returnprocessing?orderDetail=${orderDetail}`
          })
        } else {
          Taro.showToast({
            title: res.data.message,
            icon: 'none'
          });
        }
      })
  }

  //订单详情事件：跳转订单详情
  handleSeeOrder = () => {
    this.props.history.push({
      pathname: "/orderdetails",
      state: {
        "orderNo": this.state.orderDetail.orderID
      }
    })
  }

  //原因说明 - 高度自适应
  autoLine = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight + 2}px`;
    console.log(e.target.scrollHeight)
  }


  //选择原因事件
  handleChangeReason = (e) => {
    this.setState({
      selectedReason: this.state.reasonList[e.detail.value],
      selectedReasonId: JSON.parse(e.detail.value) + 1
    })
  }


  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: '申请退货'
    });
  }

  componentDidShow() {
    this.getAfterSaleDetail();
    this.getPageProReturn();
  }


  render() {

    const { selectedReason, reasonList, fileList } = this.state;

    return(
      <View class="returnApply">

        <View class="top">
          <View class="left" >
            <Text>申请退货</Text>
          </View>
          <image src={require('../../static/orderpart/truck.png')} class="right" />
        </View>

        <Form class="form">

          <View className="formItem serviceType">
            <Text className="title">服务类型</Text>
            {/* <Picker 
              class="right"
              mode='selector'
              range={'退货'}
            >
              <Text class="selected_reason" decode="true">退货</Text>
              <Image src={require('../../static/common/arrow-next.png')} class="arrow" />
            </Picker>           */}
            <Text class="right">退货</Text>
          </View>

          <View className="formItem reason">
            <Text className="title">退货原因</Text>
            <Picker 
              class="right"
              mode='selector'
              range={reasonList}
              onChange={this.handleChangeReason}
            >
              <Text class="selected_reason" decode="true">{selectedReason}</Text>
              <Image src={require('../../static/common/arrow-next.png')} class="arrow" />
            </Picker>
          </View>

          <View className="formItem description">
            <Text className="title">原因说明</Text>
            <Textarea 
              class="right"
              placeholder='请输入原因说明'
              onInput={this.handleChangeDescription}
              autoHeight
              >
            </Textarea>
          </View>

          <View className="formItem image">
            <Text className="title">相关图片</Text>
            <View className="imgList">
              {
                fileList.map(itemFile => {
                  return (
                    <View className="item_wrap">
                      <Image src={itemFile} className="itemFile"/>
                      <Button className="delete" onClick={this.handleDeleteImg.bind(this, itemFile)}>删除</Button>
                    </View>
                  )
                })
              }
            </View>
            <View className="addImg_wrap" style={{display: fileList.length<3?'':'none'}}>
              <Button onClick={this.handleAddImg} className="addImg">
                添加图片
              </Button>
              <Text className="upload_desc">(最多可上传3张)</Text>
            </View>
          </View>

          <Button class="complete" onClick={this.handleSubmit}>提交申请</Button>

        </Form>

        <OrderInfo orderDetail={this.state.orderDetail} />

        <View class="ct-wrap">
          <View class="ct-returnApply">
            <View class="applyWrap">
              <View class="remind">
                <Text class="title">提示：</Text>
                <Text class="item">1.商品图片及信息仅供参考，不属质量问题，因拍摄灯光及不同显示器色差等问题可能造成商品图片与实物有色差，一切以实物为准。</Text>
                <Text class="item">2.为了不影响您商品的退货服务，请妥善保管商品的附件、赠品、包装至少15天。</Text>
                <Text class="item">3.商品送货时您需与送货人员开箱验机（外观），开箱后如产品有外观缺陷附件问题的，可直接拒收，签收后发生的外观损坏缺件等问题不予退换货。</Text>
              </View>
            </View>
          </View>
        </View>
        <View class="guessLikeWrap">

        </View>
      </View>
    )
  }
}