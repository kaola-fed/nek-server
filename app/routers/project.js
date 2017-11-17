import Router from 'koa-router';

import * as ProjectControllers from '../controllers/project';
import Auth from '../middlewares/auth';

//子路由project
const route = new Router();
route.use(Auth);

route.post('/create', ProjectControllers.create);
route.get('/list', ProjectControllers.getList);
route.post('/update', ProjectControllers.update);
route.get('/detail', ProjectControllers.detail);
route.get('/nei', ProjectControllers.nei);
route.get('/delete', ProjectControllers.deleteProject);

export default route;
