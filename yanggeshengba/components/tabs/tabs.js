// components/tabs/tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapTab: function(e){
      console.log(e);
      let index = e.currentTarget.dataset.index;
      // let tabs = this.data.tabs;
      this.triggerEvent("changeItem",index);
      // tabs.forEach((value,i)=>{
      //   console.log("foreach")
      //   i == index?value.active=true:value.active=false;
      // })
      // this.setData({
      //   tabs: tabs
      // })
      // console.log(tabs);
    }
  }
})
