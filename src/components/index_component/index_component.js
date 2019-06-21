/**
 \* Created with 微信开发者工具.
 \* @author: waiterlong
 \* @time: 2019/01/01 00:00
 \* Description: ***
 \*/
Component({
  behaviors: [],

  properties: {
    num: {
      type: Number,
      value: 0
    }
  },
  data: {
    componentNum: 100
  },

  // 生命周期函数
  created() {},
  attached() {},
  ready() {},
  moved() {},
  detached() {},

  methods: {
    clickInTemplate() {
      this.setData({ num: this.data.num + 1 });
    },
    triggerPageEvent() {
      this.triggerEvent('addNum');
    },
    addComponentNum() {
      this.setData({ componentNum: this.data.componentNum + 1 });
    }
  }
});
