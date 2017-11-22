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
  const result = await PageController.gen(id);

  // 生成ftl/entry
  const { ftl, entry } = await PageController.getTpl(id);

  return ctx.body = _.success({
    ftl,
    entry,
    index: result
  });
});

export default route;
