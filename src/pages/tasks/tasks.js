// pages/completed/completed.js
import constants from "../../common/constants.js";
import Api from "../../api/Api.js"
import dateUtil from '../../utils/date_util';
const { bidirectionalBind } = require('../../utils/bidirectionalBind.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestIp: "",
    userid: "",
    tasks: [],
    role: "",
    searchInput: {
      searchName: '',
      currentQueryTaskState: ''
    },
    ROLE: {},
    TASK_STATUS: {},
    statePicker: {
      selectArr: [],
      selectIndex: 0
    },
    pagination: {
      page: 1,
      limit: 10,
      pageCount: -1
    },
    loadMoreText: {
      more: "加载更多",
      done: "没有更多"
    },
    loadMore: {
      show: false,
      text: "",
      loading: false
    }
  },

  handleButtonTap() {
    let that = this;
    that.reset();
    that.getTasks(that.data.role);
  },

  handleInput(e) {
    bidirectionalBind(e, this);
  },

  bindPickerChange(e) {
    let that = this;
    let currentQueryTaskState = '';
    if (e.detail.value !== 0) {
      currentQueryTaskState = that.data.statePicker.selectArr[e.detail.value];
    }
    that.setData({
      'statePicker.selectIndex': e.detail.value,
      'searchInput.currentQueryTaskState': currentQueryTaskState
    });
    that.reset();
    that.getTasks(that.data.role);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let that = this;
    let taskStates = constants.TASK_STATUS;
    that.data.statePicker.selectArr.push("全部");
    for (let prop in taskStates) {
      that.data.statePicker.selectArr.push(taskStates[prop]);
    }
    that.setData({
      ROLE: constants.ROLE,
      TASK_STATUS: constants.TASK_STATUS,
      role: "staff",
      'statePicker.selectArr': that.data.statePicker.selectArr
    });
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
    let that = this;
    that.reset();
    that.getTasks(this.data.role);
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

  //页面滚动执行方式
  onPageScroll() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.pagination.pageCount >= 0 && that.data.pagination.page >= that.data.pagination.pageCount) {
      that.setData({
        loadMore: {
          show: true,
          text: that.data.loadMoreText.done,
          loading: false
        }
      });
      return;
    } else {
      that.setData({
        loadMore: {
          show: true,
          text: that.data.loadMoreText.more,
          loading: true
        }
      });
    }
    Api.task.listTasks({ userId: 14, role: that.data.role, limit: that.data.pagination.limit, page: ++that.data.pagination.page, queryStr: that.data.searchInput.searchName, taskState: that.data.searchInput.currentQueryTaskState }).then(res => {
      if (!res || res.errCode !== 0) {
        that.setData({'loadMore.show': false});
        return;
      }
      let data = JSON.parse(res.data);
      that.data.pagination.pageCount = data.pageCount;
      let rows = that.dealRows(data.rows);
      that.data.tasks.push(...rows);
      that.setData({
        tasks: that.data.tasks
      });
      that.setData({ 'loadMore.show': false });
    }).then(() => {
      that.setData({ 'loadMore.show': false });
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 访问后台获取任务列表
   */
  getTasks(role) {
    let that = this;
    wx.showLoading({title: "加载中"});
    Api.task.listTasks({ userId: 14, role, limit: that.data.pagination.limit, page: that.data.pagination.page, queryStr: that.data.searchInput.searchName, taskState: that.data.searchInput.currentQueryTaskState}).then(res => {
      wx.hideLoading();
      if (!res || res.errCode !== 0) {
        return;
      }
      let data = JSON.parse(res.data);
      that.data.pagination.pageCount = data.pageCount;
      let rows = that.dealRows(data.rows);
      that.data.tasks.push(...rows);
      that.setData({
        tasks: that.data.tasks
      });
    }).then(() => {
      wx.hideLoading();
    });
  },

  /**
   * 处理rows
   */
  dealRows(rows) {
    rows.forEach(v => {
      v.creatTime = dateUtil.dateFormat(new Date(v.creatTime), "yyyy-MM-dd");
    });
    return rows;
  },

  /**
   * 重置
   */
  reset() {
    let that = this;
    that.data.pagination.page = 1;
    that.data.tasks = [];
    that.setData({
      pagination: {
        limit: 10,
        page: 1,
        pageCount: -1
      },
      loadMore: {
        show: false,
        text: that.data.loadMoreText.more
      },
      tasks: that.data.tasks
    })
  }
})