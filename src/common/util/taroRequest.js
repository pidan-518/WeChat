import Taro from '@tarojs/taro';

export default function post(url, data) {  
  return  Taro.request({
      url: url,
      method: 'post',
      data: data,
      header: {
        'JWT-Token': "iconmalleyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2tleSI6Iis3anhrUlwvSkRGdzJoSUs1UVljakVBPT0iLCJsb2dpbl9uYW1lX2tleSI6IjE4Njc5MDUwNzEyIiwiZXhwX2tleSI6MTU5MDgwODgwMjM2N30.kRct8AaE5y34vRLGPFHQRt6ZV0fIPB6cjH7eR_nw-Po"
        // 'JWT-Token': Taro.getStorageSync("JWT-Token")
      }
    })
}