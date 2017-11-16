import path from 'path';
// import opn from 'opn';

import Koa from 'koa';
import serve from 'koa-static';
import Session from 'koa-session';
import Views from 'koa-views';

import { sessionConfig } from './config';
import routers from './routers/index';

const app = new Koa();
app.keys = ['nek-server'];

app.use(Session(sessionConfig, app));

app.use(serve(path.resolve(__dirname, '../dist')));
app.use(Views(path.resolve(__dirname, '../dist'), { extension: 'html' }));
app.use(routers.routes()).use(routers.allowedMethods());

app.on('error', (err) => {
  console.error(err);
});

const PORT = 3000;

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  if (process.env.NODE_ENV === 'development') {
    // opn(`http://localhost:${PORT}`);
  }
});

