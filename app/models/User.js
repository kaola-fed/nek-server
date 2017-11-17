import mongoose from 'mongoose';

const schema = mongoose.Schema({
  username: String,
  email: String,
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  }],
});
schema.statics = {
  async initUser(user) {
    let result = await this.findOne({ username: user.username });
    if(!result) {
      result = await this.create({
        username: user.username,
        email: user.email
      });
    }
    return await result._id;
  },
  async findByUsername(username) {
    return await this.findOne({ username }).populate('projects');
  },
  async addProject(userId, project) {
    const userModel = await this.findOne({ _id: userId });
    userModel.projects.push(project);
    return await this.update(userModel);
  },
  async deleteProject(userId, projectId) {
    const userModel = await this.findOne({ _id: userId });
    const index = userModel.projects.indexOf(projectId);
    userModel.projects.splice(index, 1);
    return await this.update(userModel);
  }
}

export default mongoose.model('User', schema);
