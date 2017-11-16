import { unauthorized } from '../utils/response';

export default (ctx, next) => {
  if (!ctx.session.user) {
    ctx.statusCode = 401;
    return ctx.body = unauthorized();
  }

  return next();
};
