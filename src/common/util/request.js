import Taro, { getCurrentPages } from '@tarojs/taro';

// 携带token的请求
export function CarryTokenRequest(url, parmas) {
  return new Promise((resolve, rejece) => {
    Taro.request({
      url: url,
      method: "POST",
      data: JSON.stringify(parmas),
      header: {
        'Content-Type': 'application/json; charset=utf-8',
        'JWT-Token': Taro.getStorageSync("JWT-Token")
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res);
        } else if (res.statusCode === 403) {
          rejece(res);
          let pages = getCurrentPages();
          let currPage = null;
          let hash = ["pages/index/index", "pages/goodsdetails/goodsdetails"];
          if (pages.length) {
            currPage = pages[pages.length - 1];
          }
          
          if (hash.includes(currPage.route)) {
            console.log("进入");
          } else {
            Taro.showToast({
              title: '暂未登录',
              icon: 'none',
              duration: 1000,
              success: () => {
                Taro.removeStorageSync('JWT-Token');
                Taro.removeStorageSync('userinfo');
                setTimeout(() => {
                  Taro.navigateTo({
                    url: '/pages/login/login'
                  });
                }, 1000);
              }
            })
          }
        } else {
          rejece(res);
          Taro.showToast({
            title: '网络连接失败',
            icon: 'none',
            duration: 1000,
          })
        }
      }
    })
  })
};

// post请求
export function postRequest(url, parmas) {
  return new Promise((resolve, rejece) => {
    Taro.request({
      url: url,
      method: "POST",
      data: JSON.stringify(parmas),
      header: {
        'Content-Type': 'application/json; charset=utf-8',
        'JWT-Token': Taro.getStorageSync("JWT-Token")
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res);
        } else {
          rejece(res);
        }
      }
    })
  })
}