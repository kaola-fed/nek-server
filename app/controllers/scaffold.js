const Router = require('koa-router');
const mongoose = require('mongoose');

const router = new Router();
const Map = mongoose.model('ScaffoldMap');

router.get('/getUrl', async ctx => {
  const { keyword } = ctx.query;
  if (!keyword) {
    throw new Error('[keyword] is required');
  }
  ctx.body = await Map.queryOne(keyword);
});

router.get('/exist', async ctx => {
  const { keyword } = ctx.query;
  if(!keyword){
    throw new Error('[keyword] is required');
  }
  ctx.body = await Map.exist(keyword);
});

router.get('/add', async ctx => {
  const { keyword, url } = ctx.query;
  if(!keyword || !url){
    throw new Error('[keyword] and [url] is required');
  }
  ctx.body = await Map.upsert(keyword, url);
});

router.get('/remove', async ctx => {
  const { keyword } = ctx.query;
  if(!keyword){
    throw new Error('[keyword] is required');
  }
  ctx.body = await Map.remove(keyword);
});

router.get('/map', async ctx => {
  ctx.body = await Map.getList();
});

module.exports = router.routes();
