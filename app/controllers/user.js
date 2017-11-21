import UserModel from '../models/User';

export const dashboard = async (username) => {
  const result = await UserModel.findByUsername(username);
  return result.projects;
};
