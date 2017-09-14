import * as CONFIG from './../config';

export const index = async (ctx) => {
    if(!ctx.session.user) {
        const params = {
            response_type: 'code',
            scope: 'openid fullname nickname email',
            client_id: CONFIG.client_id,
            redirect_uri: CONFIG.redirectUrl
        };
        const paramsStr = Object.entries(params).map(arr => `${arr[0]}=${arr[1]}`).join('&');
        return ctx.redirect(`${CONFIG.authorizeUrl}?${paramsStr}`)
    }
    const title = "hello koa";
    const user = ctx.session.user;
    console.log(user);
    await ctx.render('index', {
        title,
        username: user.fullname
    })
}
