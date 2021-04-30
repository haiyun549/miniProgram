// pages/foods/foods.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        name: "叶子",
        active: true
      },
      {
        name: "根茎",
        active: false
      },
      {
        name: "瓜果",
        active: false
      },
      {
        name: "肉蛋",
        active: false
      },
      {
        name: "菌藻",
        active: false
      }
    ],
    list: [
      {
        img: "/images/jicai.jpeg",
        name: "荠菜",
        tag_good: "钙",
        tag_bad: ""
      },
      {
        img: "/images/xianyadan.png",
        name: "咸鸭蛋",
        tag_good: "蛋白质",
        tag_bad: "钠盐、脂肪"
      },
      {
        img: "/images/xilanhua.jpeg",
        name: "西兰花",
        tag_good: "维生素A、钙",
        tag_bad: ""
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("foodsonload");
    this.getTabs(this.getFoods);
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
  changeItem: function(e){
    //因为在子组件中bindtap得到index，
    //因此需要子组件通过triggerevent抛出事件，父组件再bind捕获得到index，再修改data
    let index = e.detail;
    let tabs = this.data.tabs;
    tabs.forEach((value,i)=>{
      i == index?value.active=true:value.active=false;
    })
    this.setData({
      tabs: tabs
    })
    //request查询data
    this.getFoods(index);
  },
  getTabs: function(callback){
    let that = this;
    wx.request({
      url: 'https://haiyun.luzhenmin.com/getTabs',
      data: {
      },
      header: {
        'content-type': 'application/json'//默认值
      },
      success (res) {
        console.log("gettabs")
        console.log(res.data);
        let tabs = that.data.tabs;
        let type = res.data.type;
        for(let i=0; i<tabs.length; i++){
          tabs[i].name = type[i].type;
        }
        console.log(tabs)
        that.setData({
          tabs: tabs
        })
        callback(0);
      }
    })
  },
  getFoods: function(index){
    let that = this;
    wx.request({
      url: 'https://haiyun.luzhenmin.com/getFoods',
      data: {
        index: index
      },
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