// api/Ajax.js
/**
 \* Created with 微信开发者工具.
 \* @author: 龙威
 \* @time: 2019/5/30 10:14
 \* Description: 默认请求配置
 \*/
const createConfig = () => {
  let config = {
    // 请求方法同上
    method: 'GET', // default

    // 请求头信息
    header: {
      'content-type': 'application/json;charset=UTF-8'
    },

    data: {
    },

    dataType: 'json'
  };
  return config;
};

/**
 * 自定义请求
 * @param conf
 * @returns {Promise.<TResult>|*}
 */
const customRequest = (conf) => {
  return new Promise((resolve, reject) => {
    conf.success = res => {
      if (!res || res.statusCode !== 200) {
        console.log(res);
        reject(res);
        return;
      }
      resolve(res.data);
    };
    conf.fail = e => {
      console.log(e);
      reject(e);
    };
    conf.complete = () => {
      // complete
    };
    //网络请求
    wx.request(conf);
  })
};

const Ajax = {
  get(url, params) {
    let config = createConfig();
    config.method = 'GET';
    config.url = url;
    config.data = params || {};
    return customRequest(config)
  },
  post(url, params) {
    let config = createConfig();
    config.method = 'POST';
    config.url = url;
    config.data = params || {};
    return customRequest(config)
  },
  delete(url, params) {
    let config = createConfig();
    config.method = 'DELETE';
    config.url = url;
    config.data = params || {};
    return customRequest(config)
  },
  put(url, params) {
    let config = createConfig();
    config.method = 'PUT';
    config.url = url;
    config.data = params || {};
    return customRequest(config)
  }
};
export default Ajax;