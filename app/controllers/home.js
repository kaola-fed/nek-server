import * as CONFIG from './../config';
import KoaOpenid from 'koa-openid';
export const index = async (ctx) => {
    const user = ctx.session.user;
    if(!user) {
        const config = {
            client_id: CONFIG.client_id,
            client_secret: CONFIG.client_secret,
            redirect_uri: CONFIG.redirect_uri
        }
        const koaOpenid = new KoaOpenid(config);
        return await koaOpenid.goLogin(ctx);
    }
    const title = "NEK SERVER";

    console.log(user);
    await ctx.render('index', {
        title,
        username: user.fullname
    })
}
