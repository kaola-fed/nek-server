import * as CONFIG from './../config';
import KoaOpenid from 'koa-openid';
export const index = async (ctx) => {
    const user = ctx.session.user;
    if(!user) {
        const koaOpenid = new KoaOpenid(CONFIG);
        return await koaOpenid.goLogin(ctx);
    }
    const title = "NEK SERVER";

    console.log(user);
    await ctx.render('index', {
        title,
        username: user.fullname
    })
}
