import Router from 'koa-router';

import * as ProjectController from '../controllers/project';
import Auth from '../middlewares/auth';

//子路由project
const route = new Router();
route.use(Auth);

route.post('/create', ProjectController.create);
route.get('/list', ProjectController.getList);
route.post('/update', ProjectController.update);
route.get('/detail', ProjectController.detail);
route.get('/delete', ProjectController.deleteProject);

export default route;
