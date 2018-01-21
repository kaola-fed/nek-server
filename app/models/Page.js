import mongoose from 'mongoose';

const schema = mongoose.Schema({
  url: { type: String, unique: true },
  name: String,
  type: Number,
  // JSON
  dom: String,
  key: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Key'
  },
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
  autoIndex: false
});
schema.index({ url: 1 });
schema.statics = {
  async selectById(_id) {
    return await this.findOne({ _id });
  },
  async selectByProject(project, search) {
    return await this.find({ project, url: { $regex: search, $options: 'i' } });
  },
  async selectByIdWithPro(_id) {
    return await this.findOne({ _id }).populate('project').select('url name type project');
  },
  async selectByIdWithKey(_id) {
    return await this.findOne({ _id }).populate('key').select('url name type key');
  },
  async selectByIdWithPop(_id) {
    return await this.findOne({ _id }).populate('key project').select('url name dom type key project');
  },
  async deleteById(_id) {
    return await this.remove({ _id });
  },
  async deleteByProject(project) {
    return await this.remove({ project });
  },
  async modifyDom(_id, dom) {
    return await this.update({ _id }, { dom });
  },
  async modifySetting(_id, page) {
    return await this.update({ _id }, {
      url: page.url,
      name: page.name,
      type: page.type,
      key: page.key
    });
  },
  async selectByUrl(url) {
    return await this.find({ url });
  }
};

export default mongoose.model('Page', schema);
