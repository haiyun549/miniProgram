// pages/baike.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: {
      principle: "原理",
      suggestion: "建议"
    },
    list: [
      {
        name: "痤疮",
        principle: "油脂分泌",
        suggestion: "低糖低脂"
      },
      {
        name: "鼻塞",
        principle: "堵塞",
        suggestion: "生理盐水、喝热水"
      },
      {
        name: "减肥",
        principle: "摄入多消耗少",
        suggestion: "低热多动"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onload");
    this.getKeep();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  getKeep: function(){
    let that = this;
    wx.request({
      url: 'https://haiyun.luzhenmin.com/getKeep',
      header: {
        'content-type': 'application/json'//默认值
      },
      success (res) {
        console.log(res.data);
        that.setData({
          list: res.data.list
        })
      }
    })
  }
})