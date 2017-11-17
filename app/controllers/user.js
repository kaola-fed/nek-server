import * as _ from '../utils/response';
import UserModel from '../models/User';

export const dashboard = async (ctx) => {
  const { username } = ctx.session.user;
  const result = await UserModel.findByUsername(username);
  return ctx.body = _.success({
    projects: result.projects
  });
}
