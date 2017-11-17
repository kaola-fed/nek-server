import { openIDConfig } from '../config';
import KoaOpenid from 'koa-openid';

import UserModel from '../models/User';

const koaOpenid = new KoaOpenid(openIDConfig);

export const index = async function(ctx, next) {
  const result = await koaOpenid.getUserInfo(ctx);
  if (result.error) {
    return ctx.redirect('/error');
  }
  result.userInfo.username = result.userInfo.nickname;
  delete result.userInfo.nickname;
  const userId = await UserModel.initUser(result.userInfo);
  ctx.session.user = {
    ...result.userInfo,
    id: userId
  };
  return ctx.redirect('/');
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
