import mongoose from 'mongoose';

const schema = mongoose.Schema({
  url: String,
  name: String,
  type: Number,
  // JSON
  dom: String,
  // 所属项目id
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  // 同步数据，生成到 .ftl 中
  syncData: [{
    name: String,
    type: {
      type: String,
      default: 'string',
    },
  }],
}, {
  timestamps: true,
});

schema.statics = {
  async selectById(id) {
    return await this.findOne({ _id: id });
  },
  async selectByProject(project) {
    return await this.find({ project });
  },
  async deleteById(id) {
    return await this.remove({ _id: id });
  },
  async deleteByProject(project) {
    return await this.remove({ project });
  }
};

export default mongoose.model('Page', schema);
