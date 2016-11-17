const FileStreamRotator = require('file-stream-rotator')
const moment = require('moment');
const morgan = require('koa-morgan');
const server = require('koa-static');
const favicon = require('koa-favicon');
const mount = require('koa-mount');
const Router = require('koa-router');
const path = require('path');
const fs = require('fs');
require('app-module-path').addPath(__dirname + '/app/controllers');

module.exports = {
  DEBUG_MODE: process.env.DEBUG_MODE || 'false',
  db: process.env.MONGODB_URI || 'mongodb://localhost/nek',

  basic(app) {
    const logDir = path.join(__dirname, 'logs');
    fs.existsSync(logDir) || fs.mkdirSync(logDir);
    const stream = FileStreamRotator.getStream({
      filename: path.join(logDir, 'access-%DATE%.log'),
      frequency: 'daily',
      date_format: 'YYYY-MM-DD',
      verbose: false,
    });
    morgan.token('date', () => moment().format('YYYY-MM-DD HH:mm:ss'));
    app.use(morgan(':remote-addr [:date] ":method :url" - :status :response-time ms', { stream }));
    app.use(favicon(__dirname + '/public/images/favicon.ico'));
    app.use(mount('/', server('dist')));
  },

  router(app) {
    const index = new Router({ prefix: '/api' });
    index.use('/project', require('project'));
    index.use('/page', require('page'));
    index.use('/component', require('component'));
    index.use('/upload', require('upload'));
    app.use(index.routes());
    app.use(index.allowedMethods());
  }
};
