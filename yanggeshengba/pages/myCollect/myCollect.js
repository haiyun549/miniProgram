// pages/myCollect/myCollect.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    top: "",
    icon_view: "/images/eye.png",
    icon_fond: "/images/good.png",
    icon_collect: "/images/favorite.png",
    icon_fond_fill: "/images/good_fill.png",
    icon_collect_fill: "/images/favorite_fill.png",
    knowledge: [
      {
        img: "/images/chifan.jpeg",
        title: "好好吃饭",
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
    console.log("mconload")
    let top = options.type;
    this.setData({top: top});
    console.log(this.data.top);
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
    this.getMyCollectView();
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

  getMyCollectView: function getMyCollectView(){
    let uid = app.globalData.uid;
    let type = this.data.top;
    console.log(uid);
    let that = this;
    wx.request({
      url: 'https://haiyun.luzhenmin.com/getMyCollectView',
      data: {
        uid: uid,
        type: type
      },
      header: {
        'content-type': 'application/json'//默认值
      },
      success (res) {
        console.log(res.data);
        that.setData({
          knowledge: res.data.knowledge
        })
      }
    })
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