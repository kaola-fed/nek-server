const FileStreamRotator = require('file-stream-rotator')
const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
require('app-module-path').addPath(__dirname + '/app/controllers');

module.exports = {
  // 基础设置
  DEBUG_MODE: process.env.DEBUG_MODE || 'false',
  db: process.env.MONGODB_URI || 'mongodb://localhost/nek',

  // express 相关设置
  express(app) {
    const logDir = path.join(__dirname, 'logs');
    fs.existsSync(logDir) || fs.mkdirSync(logDir);
    const stream = FileStreamRotator.getStream({
      filename: path.join(logDir, 'access-%DATE%.log'),
      frequency: 'daily',
      date_format: 'YYYY-MM-DD',
      verbose: false,
    });
    app.use(morgan(':remote-addr [:date[clf]] :method :url :status :response-time ms', { stream }));
    app.use(favicon(__dirname + '/public/images/favicon.ico'));
    app.use('/', express.static('dist'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
  },

  // 异步路由相关设置
  router(app) {
    const index = express.Router();
    index.use((req, res, next) => {
      // 暂时未接入认证
      if (true) {
        next();
      } else {
        const err = new Error('Unauthorized');
        err.status = 401;
        next(err);
      }
    });
    index.use('/project', require('project'));
    index.use('/page', require('page'));
    index.use('/component', require('component'));
    app.use('/api', index);
  }
};
