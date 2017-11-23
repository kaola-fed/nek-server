import Router from 'koa-router';

import * as PageController from '../controllers/page';
import Auth from '../middlewares/auth';

//子路由project
const route = new Router();
route.use(Auth);

route.get('/nei', PageController.nei);
route.post('/create', PageController.createPage);
route.get('/list', PageController.pageList);
route.get('/delete', PageController.deletePage);
route.get('/listTemplate', PageController.listTemplate);
route.post('/updateDom', PageController.updatePageDom);
route.get('/detail', PageController.pageDetail);
route.post('/updateSetting', PageController.updateSetting);

export default route;
