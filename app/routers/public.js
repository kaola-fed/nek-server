import Router from 'koa-router';

import * as PageController from '../controllers/page';

import * as _ from '../utils/response';

const route = new Router();

route.get('/page', async (ctx) => {
  const id = ctx.request.query.id;
  if (!id) {
    return ctx.body = _.paramsError('需要输入id');
  }

  // 生成JS/HTML
  const modules = await PageController.gen(id);

  // 生成ftl/entry
  const { ftl, entry, url, type, name } = await PageController.getTpl(id);

  return ctx.body = _.success({
    url,
    title: name,
    type,
    ftl,
    entry,
    ...modules
  });
});

export default route;
