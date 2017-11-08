import * as CONFIG from './../config';
import KoaOpenid from 'koa-openid';

const koaOpenid = new KoaOpenid(CONFIG);

export const index = async function(ctx, next) {
    return await koaOpenid.getUserInfo(ctx, next, function(result) {
        if(result.error) {
            return ctx.redirect('/error');
        }
        ctx.session.user = result.userInfo;
        return ctx.redirect('/');
    })
}
