// pages/baike.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: {
      prin: "原理",
      sug: "建议"
    },
    list: [
      {
        name: "痤疮",
        prin: "油脂分泌",
        sug: "低糖低脂"
      },
      {
        name: "鼻塞",
        prin: "堵塞",
        sug: "生理盐水、喝热水"
      },
      {
        name: "减肥",
        prin: "摄入多消耗少",
        sug: "低热多动"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onload")
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onready")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onshow")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onhide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onunload")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log("onShareAppMessage")
  },

  aaa: function(event) {
    console.log("11111")
    this.setData ({
      id: 11111
    })
  }

})