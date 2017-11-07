import path from 'path';

import Koa from 'koa';
import serve from 'koa-static';
import Session from 'koa-session';
import views from 'koa-views';
import routers from './routers/index';
import * as CONFIG from './config';

const app = new Koa();
app.keys = ['nek-server'];

app.use(Session(CONFIG.session, app));
app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
}));

app.use(routers.routes()).use(routers.allowedMethods());

app.listen(3000);
