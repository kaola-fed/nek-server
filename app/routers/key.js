import Router from 'koa-router';
import * as KeyController from './../controllers/key';
import Auth from '../middlewares/auth';
//子路由project
const route = new Router();
route.use(Auth);

route.get('/list', KeyController.list);
route.post('/add', KeyController.add);
route.post('/edit', KeyController.edit);
route.get('/delete', KeyController.remove);
route.get('/detail', KeyController.detail);

export default route;
