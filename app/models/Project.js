import mongoose from 'mongoose';

const schema = mongoose.Schema({
  name: String,
  desc: String,
  git: String,
  neiKey:String,
  type: String,
  // 组件库的_id以及版本
  libs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Library',
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  pages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
  }],
}, {
  timestamps: true,
});

schema.statics = {
  async insert(project) {
    return await this.create(project);
  },

  async findById(id) {
    return await this.findOne({ _id: id });
  },

  async getPageListById(id) {
    return await this.findOne({ _id: id }).populate('pages');
  },

  async deleteById(id) {
    return await this.remove({_id: id});
  },

  async addPage(id, pageId) {
    const projectModel = await this.findOne({_id: id});
    projectModel.pages.push(pageId);
    return await this.update({_id: id}, projectModel);
  },

  async deletePage(id, pageId) {
    const projectModel = await this.findOne({_id: id});
    const index = projectModel.pages.indexOf(pageId);
    projectModel.pages.splice(index, 1);
    return await this.update({_id: id}, projectModel);
  }
};

export default mongoose.model('Project', schema);
