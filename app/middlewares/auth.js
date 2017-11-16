import { unauthorized } from '../utils/response';

import { openIDConfig } from '../config';
import KoaOpenid from 'koa-openid';

export default (ctx, next) => {
  if (!ctx.session.user) {
    const port = ctx.host.split(':')[1];
    /* eslint-disable */
    openIDConfig.redirect_uri = `http://nek-server.kaolafed.com:${port}/api/login`;
    /* eslint-enable */
    const koaOpenid = new KoaOpenid(openIDConfig);
    const url = koaOpenid.getLoginURL(ctx);
    ctx.status = 401;
    return ctx.body = unauthorized(url);
  }

  return next();
};
