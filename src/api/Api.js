// api/Api.js
/**
 \* Created with 微信开发者工具.
 \* @author: 龙威
 \* @time: 2019/5/30 10:14
 \* Description: 请求封装
 \*/

import Ajax from './Ajax'
const { host } = require('../env.js');

export default {
  task: {
    listTasks(params) {
      return Ajax.get(`${host}/base_task/state/listTasks`, params);
    }
  },
  weixin: {
    //提供消息ID
    offerFormId(params) {
      return Ajax.get(`${host}/base_task/offerFormId`, params);
    },
    //获得消息币总数
    getMsgCoinSum(params) {
      return Ajax.get(`${host}/base_task/getMsgCoinSum`, params);
    }
  }
}