import * as CONFIG from './../config';
import KoaOpenid from 'koa-openid';

const config = {
    client_id: CONFIG.client_id,
    client_secret: CONFIG.client_secret,
    redirect_uri: CONFIG.redirect_uri
}
const koaOpenid = new KoaOpenid(config);

export const index = async function(ctx, next) {
    return await koaOpenid.getUserInfo(ctx, next, function(result) {
        if(result.error) {
            return ctx.redirect('/error');
        }
        ctx.session.user = result.userInfo;
        return ctx.redirect('/');
    })
}
