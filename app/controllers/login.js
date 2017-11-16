import { openIDConfig } from '../config';
import KoaOpenid from 'koa-openid';

const koaOpenid = new KoaOpenid(openIDConfig);

export const index = async function(ctx, next) {
  return await koaOpenid.getUserInfo(ctx, next, (result) => {
    if (result.error) {
      return ctx.redirect('/error');
    }
    ctx.session.user = result.userInfo;
    return ctx.redirect('/');
  });
};

export const isLogin = function(ctx, next) {
  return ctx.body = {
    code: 200,
    data: ctx.session.user
  };
}

export const logout = function(ctx, next) {
  ctx.session.user = null;
  return ctx.body = {
    code: 200,
    data: null
  };
}
