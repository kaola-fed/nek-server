import { Message } from 'element-ui';

export default {
  /* 正数校验包含空字符串, 最长4位小数, 默认包含0, 如果zero为false, 则不包含 */
  isPositive(value = '', zero = true) {
    if (value !== 0 && !value) {
      return true;
    }
    const regexp = zero ? /^(0|[1-9][0-9]*)(\.\d{1,4})?$/ : /^[1-9]\d*\.\d{1,4}|0\.\d{0,3}[1-9]$/;
    return regexp.test(value);
  },
  /* 正整数校验包含空字符串, 默认包含0, 如果zero为false, 则不包含; */
  isPositiveInt(value = '', zero = true) {
    if (value !== 0 && !value) {
      return true;
    }
    const regexp = zero ? /^(0|[1-9]\d*)$/ : /^\+?[1-9]\d*$/;
    return regexp.test(value);
  },
  /* 过滤undefined, null和'' */
  filterEmpty(data) {
    if (data) {
      const rst = {};
      Object.keys(data).forEach(key => (data[key] || data[key] === 0) && (rst[key] = data[key]));
      return rst;
    }
  },
  /**
   *  将数组每num个分一组, 如[obj1, obj2, obj3], 每2个分一组, 则输出[[obj1, obj2], [obj3]],
   *  可用于根据屏幕大小调整一行显示几个时,计算显示数组
   **/
  segmentGroup(array = [], num = 1) {
    const tmp = [];
    const rst = [];
    array.forEach((item, index) => {
      if (index && !(index%num)) {
        rst.push(tmp.slice());
        tmp.length = 0;
      }
      tmp.push(item);
    });
    rst.push(tmp.slice());
    return rst;
  },
  download(url, params, isImage = true) {
    if (!url) {
      return;
    }

    url += '?';
    if (params) {
      for (let param in params) {
        if (params.hasOwnProperty(param)) {
          if (Array.isArray(param[params])) {
            /* eslint-disable no-loop-func */
            params[param].forEach(el => url += `${param}[]=${el}&`);
            /* eslint-enable no-loop-func */
          } else if (params[param] != undefined) {
            url += `${param}=${params[param]}&`;
          }
        }
      }
    }

    if (isImage) {
      const a = document.createElement('a');
      a.href = url;
      a.download = true;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      window.open(url);
    }
  },


  requestFullScreen() {
    const el = document.documentElement;
    const requestFullScreen = el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (!requestFullScreen) {
      Message && Message.error('当前浏览器不支持该操作');
      return;
    }

    requestFullScreen.call(el);
  },
  exitFullScreen() {
    const cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen;
    if (!cancelFullScreen) {
      Message && Message.error('当前浏览器不支持该操作');
      return;
    }

    cancelFullScreen.call(document);
  }
};
