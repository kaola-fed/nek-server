const Router = require('koa-router');
const mongoose = require('mongoose');

const page = new Router();
const Page = mongoose.model('Page');

page.get('/', async ctx => {
  const { projectId, url } = ctx.query;
  ctx.body = await Page.queryOne(projectId, url);
});

page.get('/list', async ctx => {
  const { projectId } = ctx.query;
  ctx.body = await Page.getList(projectId);
});

page.post('/upsert', async ctx => {
  const { pageId, projectId, name, url } = ctx.request.body;
  ctx.body = await Page.upsert(pageId, projectId, name, url);
});

module.exports = page.routes();
