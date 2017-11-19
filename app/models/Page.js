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
  async selectById(_id) {
    return await this.findOne({ _id });
  },
  async selectByProject(project) {
    return await this.find({ project });
  },
  async selectByIdWithPro(_id) {
    return await this.findOne({ _id }).populate('project');
  },
  async deleteById(_id) {
    return await this.remove({ _id });
  },
  async deleteByProject(project) {
    return await this.remove({ project });
  },
  async modifyDom(_id, dom) {
    return await this.update({ _id }, { dom });
  }
};

export default mongoose.model('Page', schema);
