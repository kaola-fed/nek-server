import * as CONFIG from '../config';
import KoaOpenid from 'koa-openid';
export const index = async (ctx) => {
  const user = ctx.session.user;
  if(!user) {
    const config = {
      clientId: CONFIG.client_id,
      clientSecret: CONFIG.client_secret,
      redirectUri: CONFIG.redirect_uri
    };
    const koaOpenid = new KoaOpenid(config);
    return await koaOpenid.goLogin(ctx);
  }
  const title = 'NEK SERVER';

  console.log(user);
  await ctx.render('index', {
    title,
    username: user.fullname
  });
};
