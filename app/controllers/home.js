import { openIDConfig } from '../config';
import KoaOpenid from 'koa-openid';

export const index = async (ctx) => {
  const user = ctx.session.user;
  if(!user) {
    const koaOpenid = new KoaOpenid(openIDConfig);
    return await koaOpenid.goLogin(ctx);
  }

  ctx.body = JSON.stringify(user);
};
