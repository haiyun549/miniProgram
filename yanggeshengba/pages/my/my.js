// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [
      {
        img: "/images/beverage.png",
        content: "我的收藏",
        icon: "/images/right.png"
      },
      {
        img: "/images/chicken.png",
        content: "浏览历史",
        icon: "/images/right.png"
      },
      {
        img: "/images/lemon.png",
        content: "养生计划",
        icon: "/images/right.png"
      }
    ],
    setting: [
      {
        img: "/images/coffee.png",
        content: "意见反馈",
        icon: "/images/right.png"
      },
      {
        img: "/images/pills.png",
        content: "设置",
        icon: "/images/right.png"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  tapItem: function(e){
    console.log(e.currentTarget.dataset)
    let type = e.currentTarget.dataset.type;
    if(type == "我的收藏" || type == "浏览历史"){
      console.log("mytype: "+type)
      wx.navigateTo({
        url: "../myCollect/myCollect?type="+type
      })  
    }
  }
})