function getHome(){
  let uid = (wx.getStorageSync('uid') || ('err'));
  console.log("util")
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
}

module.exports = {
  getHome: getHome
}