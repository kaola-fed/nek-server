import mongoose from 'mongoose';

const schema = mongoose.Schema({
  name: String,
  desc: String,
  git: String,
  neiKey:String,
  type: Number,
  basePath: String,
  listPath: String,
  modalPath: String,
  ftl: String,
  entry: String,
  // 组件库的_id以及版本
  library: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Library',
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

schema.statics = {
  async insert(project) {
    return await this.create(project);
  },

  async selectById(id) {
    return await this.findOne({ _id: id });
  },

  async selectByUser(userid) {
    return await this.find({ members: userid });
  },

  async deleteById(id) {
    return await this.remove({ _id: id });
  },

  async modify(id, project) {
    return await this.update( { _id: id }, project );
  },

  async modifyTpl(id, type, tpl) {
    return await this.update( { _id: id }, { [type]: tpl });
  }
};

export default mongoose.model('Project', schema);
