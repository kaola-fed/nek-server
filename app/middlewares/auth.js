export default (ctx, next) => {
  if (!ctx.session.user) {
    ctx.statusCode = 401;
    return ctx.body = { code: 401 };
  }

  return next();
};
