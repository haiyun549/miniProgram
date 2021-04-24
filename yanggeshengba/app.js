// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    console.log("onlaunch")
  },
  globalData: {
    userInfo: null,
    uid: undefined
  },

  getOpenId: function () {
    let that = this;
    let promise = new Promise((resolve,reject)=>{
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log(res.code)
          wx.request({
            url: 'https://haiyun.luzhenmin.com/getOpenId',
            method: "POST",
            data: {
              code: res.code
            },
            header: {
              'content-type': 'application/json'//默认值
            },
            success (res) {
              console.log(res.data)
              that.globalData.uid = res.data.userid;
              console.log(that.globalData.uid)
              // wx.setStorageSync('uid', res.data.userid)
              // console.log(wx.getStorageSync('uid'))
              if(res.data.userid){
                resolve("成功了");
              }else
                reject('失败了')
            }
          })
        }
      })     
    })
    return promise;
  }
})
