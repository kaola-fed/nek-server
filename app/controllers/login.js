import * as CONFIG from './../config';
import KoaOpenid from 'koa-openid';

const config = {
  clientId: CONFIG.client_id,
  clientSecret: CONFIG.client_secret,
  redirectUri: CONFIG.redirect_uri
};
const koaOpenid = new KoaOpenid(config);

export const index = async function(ctx, next) {
  return await koaOpenid.getUserInfo(ctx, next, (result) => {
    if(result.error) {
      return ctx.redirect('/error');
    }
    ctx.session.user = result.userInfo;
    return ctx.redirect('/');
  });
};
