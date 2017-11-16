import Router from 'koa-router';

import HomeRoute from './home';
import ProjectRoute from './project';

const routes = new Router();
routes.use('', HomeRoute.routes(), HomeRoute.allowedMethods());
routes.use('/api/project', ProjectRoute.routes(), ProjectRoute.allowedMethods());
routes.all('(.*)', (ctx) => {
  console.log(ctx.request.url);
});

export default routes;
