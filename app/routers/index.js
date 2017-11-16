import Router from 'koa-router';

import HomeRoute from './home';
import ProjectRoute from './project';
import LoginRoute from './login';

const routes = new Router();

routes.use('/api', HomeRoute.routes(), HomeRoute.allowedMethods());
routes.use('/api/login', LoginRoute.routes(), LoginRoute.allowedMethods());
routes.use('/api/project', ProjectRoute.routes(), ProjectRoute.allowedMethods());

routes.get('(.*)', (ctx) => {
  if (!ctx.body && !/^\/api(\/.+|\/?)$/.test(ctx.request.url)) {
    return ctx.render('index');
  }
});

export default routes;
