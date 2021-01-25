import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './shopqualifications.less';
import { postRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';
import CommonEmpty from '../../components/CommonEmpty/CommonEmpty';

// 店铺资质信息
class ShopQualifications extends Component {

  constructor(props) {
    super(props);
    this.state = {
      certList: [] // 店铺资质信息
    };
  }

  componentWillMount () { 
  }

  // 获取店铺资质信息
  getQualificationCertInfo() {
    postRequest(servicePath.getQualificationCertInfo, {
      shopId: this.$router.params.shopId
    })
      .then(res => {
        console.log("查询店铺资质信息成功", res.data);
        if (res.data.code === 0) {
          const { certList } = res.data.data;
          this.setState({ certList });
        }
      })
      .catch(err => {
        console.log("查询店铺资质信息失败", err);
      })
  }

  componentDidMount () { this.getQualificationCertInfo() }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '',
    usingComponents: {}
  }

  render () {

    const { certList } = this.state

    return (
      <View>
        {
          certList.length === 0 ? <CommonEmpty content="该店铺没有上传资质信息" /> 
          : 
          <View id='shop-qfcations'>
            {
              certList.map((item) => {
                return (
                  <View className="qfcations" key={item}>
                    <Image src={item} />
                  </View>
                )
              })
            }
          </View>
        }
      </View>
    )
  }
}

export default ShopQualifications;