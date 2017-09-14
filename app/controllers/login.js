import * as LoginService from './../services/login';

export const index = async (ctx) => {
    let code = ctx.query.code;
    if(ctx.query.error) {
        await ctx.render('error', {
            error: ctx.query.error,
            error_description: ctx.query.err
        })
    } else {
        const json = await LoginService.fetchToken(code);
        const result = LoginService.checkIdToken(json.id_token);
        if(result) {
            const userInfo = await LoginService.fetchUserInfo(json.access_token)
            ctx.session.user = userInfo;
        }
        await ctx.redirect('/');
    }
}
