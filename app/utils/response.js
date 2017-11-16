// 请求返回值序列化，用于给ctx.body赋值，所以统一返回字符串

// 成功
export const success = (data) => {
  return JSON.stringify({ code: 200, data });
};

// 传入参数有误
export const paramsError = (message = 'Input params error') => {
  return JSON.stringify({ code: 400, message });
};
// 未登录
export const unauthorized = (message = 'Unauthorized') => {
  return JSON.stringify({ code: 401, message });
};

// 自定义错误
export const error = (code, message) => {
  return JSON.stringify({ code, message });
};
