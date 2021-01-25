import Taro, { Component } from "@tarojs/taro";
import { View, WebView, Video, Text, ScrollView, Image } from "@tarojs/components";
import "../../common/globalstyle.less";
import "./agmfaq.less";
import { postRequest } from "../../common/util/request";
import servicePath from "../../common/util/api/apiUrl";
import utils from "../../common/util/utils"

export default class Findgoods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      remark: null,
      extension: null,//后缀名
      urltext: null,//文件地址
      video: false,//文件类型是否是视频
      system: false,//系统是否是ios
      empty: false//内容是否为空
    }
  }
  config = {
    navigationBarTitleText: '爱港猫FAQ',
    // // navigationBarColor:'#fffff',
    // onReachBottomDistance: 50,
    // // navigationStyle: "custom",
    // navigationBarBackgroundColor: "#6868DB",
    // navigationBarTextStyle: "white"
  }
  componentWillMount() {

  }

  componentDidMount() {
    Taro.getSystemInfo({
      success: (res) => {
        console.log(res.system, res.platform, 'platform')
        let system = res.system.toLowerCase().indexOf('ios') !== -1
        console.log(system, 'system', res.system.toLowerCase())
        this.setState({
          system: system
        }, () => { this.getFaqConfig() });
      }
    })

  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
  //获取文件
  getFaqConfig = () => {
    postRequest(servicePath.getFaqConfig, { "configKey": "APP_FAQ" })
      .then(response => {
        if (response.data.data.remark.indexOf("https:") === -1) {
          this.setState({
            empty: true,
            system: false
          })
        } else {
          this.setState({
            remark: response.data.data.remark,
          })
          let index = response.data.data.remark.lastIndexOf("https:");
          var tex = response.data.data.remark.substr(index - 1);
          var reg = new RegExp('"', "g");
          // var newStr = str.replace(reg, "");
          let urltext = tex.split(' ')[0].replace(reg, "")
          let filetype = urltext.lastIndexOf('.')
          let extension = urltext.substr(filetype + 1)
          console.log(extension, 'tex')
          if (extension.toLowerCase() == 'pdf') {
            this.setState({
              extension, urltext,
              video: false
            })
            console.log(this.state.system)
            // this.fileType(urltext)
            this.state.system ? null : this.fileType(urltext)
          } else if (extension.toLowerCase() == 'mp4') {
            this.setState({
              extension, urltext,
              video: true
            })
          } else {
            console.log("格式错误");
          }
          console.log("获取成功", extension, urltext);
        }
      })
      .catch(err => {
        console.log("获取等等失败", err);
      })
  }
  //预览pdf
  fileType = (url) => {
    console.log(url, 'url')
    Taro.downloadFile({
      url: url,
      success: function (res) {
        var filePath = res.tempFilePath;
        console.log(filePath, 'filePath');
        Taro.openDocument({
          filePath: filePath,
          fileType: 'pdf',
          success: function (res) {
            console.log(res, 'success');
            Taro.navigateBack({  delta: 2 })
          },
          fail: function (res) {
            console.log(res, 'fail');
          },
          complete: function (res) {
            console.log(res, 'complete');
          }
        })
      },
      fail: function (res) {
        console.log('文件下载失败', res);
      },
      complete: function (res) {
        console.log(res, 'res')
      },
    })
  }

  render() {

    return (
      <View className="agmfaq">
        {this.state.empty ? <View className='empty'>内容为空</View> : null}
        {this.state.system?<WebView src={this.state.urltext}></WebView>:null} 
        <View className='components-page'>
          {this.state.video ? <Video
            id="myVideo"
            src={this.state.urltext}
            // binderror="videoErrorCallback" 
            // danmu-list="{{danmuList}}" 
            // enable-danmu 
            // danmu-btn 
            show-center-play-btn={false}
            show-play-btn={true}
            controls
            picture-in-picture-mode={['push', 'pop']}
          /> : null}
        </View>
      </View>
    )
  }
}
