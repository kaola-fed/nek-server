const Router = require('koa-router');
const mongoose = require('mongoose');
const multer = require('koa-multer');
const config = require('../../config');

let gfs;
const storage = require('multer-gridfs-storage')({ url: config.db });
const upload = multer({ storage }).any();
storage.once('connection', function(_gfs, _db) {
  gfs = _gfs;
});

const template = new Router();

template.get('/', async ctx => {
  const { fileId, name } = ctx.query;
  if (!fileId) throw new Error('[fileId] is required');
  ctx.set('Content-Disposition', `inline;filename=${name || 'file'}`);
  ctx.body = gfs.createReadStream({ _id: fileId });
});

template.post('/upload', upload, async ctx => {
  ctx.body = ctx.req.files;
});

module.exports = template.routes();
