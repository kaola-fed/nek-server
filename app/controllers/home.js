import { openIDConfig } from '../config';
import KoaOpenid from 'koa-openid';

export const index = async (ctx) => {
  const user = ctx.session.user;
  ctx.body = JSON.stringify(user);
};
