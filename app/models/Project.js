import mongoose from 'mongoose';

const schema = mongoose.Schema({
  name: String,
  desc: String,
  git: String,
  neiKey:String,
  type: String,
  // 组件库的_id以及版本
  libs: [{
    id: mongoose.Schema.Types.ObjectId,
    version: String,
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  pages: [{
    id: mongoose.Schema.Types.ObjectId,
    url: String,
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

  async deleteById(id) {
    return await this.remove({_id: id});
  }
}

export default mongoose.model('Project', schema);
