import path from 'path';
// import opn from 'opn';

import Koa from 'koa';
import serve from 'koa-static';
import Session from 'koa-session';
import Views from 'koa-views';
import mongoose from 'mongoose';

import { sessionConfig, dbConfig } from './config';
import routers from './routers/index';

//启动mongodb
mongoose.Promise = global.Promise;
const dbOptions = {
  useMongoClient: true,
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};
const connect = () => {
  mongoose.connect(dbConfig.url, dbOptions);
};
const conn = mongoose.connection;
connect();
conn.on('error', console.error);
conn.on('disconnected', connect);
conn.on('open', () => {
  console.log(`Connected mongo: ${dbConfig.url}`);
});

//启动koa
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
