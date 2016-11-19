const Router = require('koa-router');
const mongoose = require('mongoose');

const page = new Router();
const Page = mongoose.model('Page');

page.get('/', async ctx => {
  const { project, url } = ctx.query;
  ctx.body = await Page.queryOne(project, url);
});

page.get('/list', async ctx => {
  const { project } = ctx.query;
  ctx.body = await Page.getList(project);
});

page.post('/upsert', async ctx => {
  const { page, project, name, url } = ctx.request.body;
  ctx.body = await Page.upsert(page, project, name, url);
});

module.exports = page.routes();
