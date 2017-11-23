import UserModel from '../models/User';
import ProjectModel from '../models/Project';

export const dashboard = async (username) => {
  // const result = await UserModel.findByUsername(username);
  // return result.projects;
  const result = await ProjectModel.selectAll();
  return result;
};
