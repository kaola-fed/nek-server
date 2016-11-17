const Router = require('koa-router');
const mongoose = require('mongoose');
const multer = require('koa-multer');
const config = require('../../config');

const storage = require('multer-gridfs-storage')({ url: config.db });
const upMulter = multer({ storage }).single('fileData');

const upload = new Router();

upload.post('/', upMulter, async ctx => {
  ctx.body = ctx.req.file;
});

module.exports = upload.routes();
