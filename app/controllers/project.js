const Router = require('koa-router');
const mongoose = require('mongoose');

const project = new Router();
const Project = mongoose.model('Project');

project.get('/', async ctx => {
  const { project } = ctx.query;
  if (!project) {
    throw new Error('[project] is required');
  }
  let result = await Project.queryOne(project);
  result = JSON.parse(JSON.stringify(result));
  result.templates = result.templates.reduce((r, d) => {
    r[d.type] = { name: d.name, file: d.file };
    return r;
  }, {});
  ctx.body = result;
});

project.get('/list', async ctx => {
  ctx.body = await Project.getList();
});

project.post('/upsert', async ctx => {
  const { project, name, desc } = ctx.request.body;
  if (!name) {
    throw new Error('[name] is required');
  }
  ctx.body = await Project.upsert(project, name, desc);
});

project.post('/tpl/upsert', async ctx => {
  const { project, name, file } = ctx.request.body;
  if (!project || !name || !file) {
    throw new Error('[project && name && file] are required');
  }
  ctx.body = await Project.upsertTpl(project, name, file);
});

project.post('/tpl/delete', async ctx => {
  const { project, name } = ctx.request.body;
});

module.exports = project.routes();
