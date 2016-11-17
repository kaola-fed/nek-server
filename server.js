const mongoose = require('mongoose');
const path = require('path');
const route = require('koa-router');
const fs = require('fs');
const Koa = require('koa');

const app = new Koa();
const config = require('./config');

const connect = () => {
  mongoose.connect(config.db, {
    server: { socketOptions: { keepAlive: 120 } }
  });
}, conn = mongoose.connection;
connect();
conn.on('error', console.error);
conn.on('disconnected', connect);
conn.on('open', () => {
  console.log(`Connected mongo: ${config.db}`);
});

fs.readdirSync(path.join(__dirname, 'app/models')).forEach((file) => {
  if (~file.indexOf('.js')) require(path.join(__dirname, 'app/models', file));
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.throw(500, err)
  }
});

config.basic(app);
config.router(app);

const port = process.env.VCAP_APP_PORT || 3300;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});