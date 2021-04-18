// pages/knowledge/knowledge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon_view: "/images/eye.png",
    icon_fond: "/images/good.png",
    icon_collect: "/images/favorite.png",
    icon_fond_fill: "/images/good_fill.png",
    icon_collect_fill: "/images/favorite_fill.png",
    knowledge: [
      {
        title: "睡个好觉",
        content: "早睡早起身体好，但更重要的是按照自己的睡眠规律入睡，每个人的睡眠时间不同，养成习惯就好啦。",
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
    console.log(options);
    let uid = (wx.getStorageSync('uid') || ('err'));
    let kid = options.kid;
    let that = this;
    wx.request({
      url: 'https://haiyun.luzhenmin.com/getKnowledge',
      data: {
        kid: kid,
        uid: uid
      },
      header: {
        'content-type': 'application/json'//默认值
      },
      success (res) {
        console.log(res.data)
        that.setData({
          knowledge: res.data.knowledge
        })
      }
    })
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

  fond: function(e){
    let that = this;
    let kid = e.currentTarget.dataset.kid;
    let uid = (wx.getStorageSync('uid') || ('err'))
    // let fond = e.currentTarget.dataset.fond;
    // //传递参数时会转为字符串到nodejs
    // let obj = {
    //   fond: fond
    // };
    // let data = JSON.stringify(obj);
    // console.log(data)
    wx.request({
      url: 'https://haiyun.luzhenmin.com/tapFond',
      data: {
        kid: kid,
        uid: uid,
        // data: data
      },
      header: {
        'content-type': 'application/json'//默认值
      },
      success (res) {
        console.log(res.data)
        that.setData({
          knowledge: res.data.knowledge
        })
      }
    })
  },

  collect: function(e){
    let that = this;
    let uid = (wx.getStorageSync('uid') || ('err'));
    let kid = e.currentTarget.dataset.kid;
    console.log(kid);
    // let collect = e.currentTarget.dataset.collect;
    // let obj = {
    //   collect: collect
    // };
    // let data = JSON.stringify(obj);
    wx.request({
      url: 'https://haiyun.luzhenmin.com/tapCollect',
      data: {
        kid: kid,
        uid: uid,
        // data: data
      },
      header: {
        'content-type': 'application/json'//默认值
      },
      success (res) {
        console.log(res.data)
        that.setData({
          knowledge: res.data.knowledge
        })
      }
    })
  }
})