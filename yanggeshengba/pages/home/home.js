// pages/home/home.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    top: "小百科",
    icon_view: "/images/eye.png",
    icon_fond: "/images/good.png",
    icon_collect: "/images/favorite.png",
    icon_fond_fill: "/images/good_fill.png",
    icon_collect_fill: "/images/favorite_fill.png",
    // top: [{top: "小百科"}],
    swiper: [
      {
        img: "/images/chunfen02.jpeg"
      },
      {
        img: "/images/qingming.jpeg"
      },
      {
        img: "/images/guyu02.jpg"
      }
    ],
    knowledge: [
      {
        img: "/images/chifan.jpeg",
        title: "好好吃饭",
        view_num: 0,
        fond_num: 0,
        collect_num: 0,
        fond: 0,
        collect: 0
      },
      {
        img: "/images/sleep.jpeg",
        title: "睡个好觉",
        view_num: 0,
        fond_num: 0,
        collect_num: 0,
        fond: 0,
        collect: 0
      },
      {
        img: "/images/fruits.jpeg",
        title: "好吃又营养的水果",
        view_num: 0,
        fond_num: 0,
        collect_num: 0,
        fond: 0,
        collect: 0
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
    console.log("onshow");
    app.getOpenId().then(this.getHome,this.printError);
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

  getHome: function getHome(){
    let uid = app.globalData.uid;
    console.log(uid);
    let that = this;
    wx.request({
      url: 'https://haiyun.luzhenmin.com/getHome',
      data: {
        uid: uid
      },
      header: {
        'content-type': 'application/json'//默认值
      },
      success (res) {
        console.log(res.data);
        that.setData({
          swiper: res.data.swiper,
          knowledge: res.data.knowledge
        })
      }
    })
  },
  
  printError: function (res) {
    console.log("返回的信息为："+res)
  },

  detail: function(e){
    let kid = e.currentTarget.dataset.kid;
    console.log(kid);
    console.log(e)
    wx.navigateTo({
      url: '/pages/knowledge/knowledge?kid='+kid,
    })
  },
})
