import Router from 'koa-router';
import * as LibraryController from './../controllers/library';
import Auth from '../middlewares/auth';
//子路由project
const route = new Router();
route.use(Auth);

route.get('/list', LibraryController.list);
route.post('/add', LibraryController.add);
route.post('/edit', LibraryController.edit);
route.get('/delete', LibraryController.remove);
route.get('/detail', LibraryController.detail);
route.get('/getComponents', LibraryController.getComponents);
route.get('/deleteComponent', LibraryController.deleteComponent);
route.post('/addComponent', LibraryController.addComponent);
route.post('/editComponent', LibraryController.editComponent);
route.get('/detailComponent', LibraryController.detailComponent);

export default route;
