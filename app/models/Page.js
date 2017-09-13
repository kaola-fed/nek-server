import mongoose from 'mongoose';

const schema = mongoose.Schema({
  url: String,
  // JSON
  dom: String,
  // 所属项目id
  project: mongoose.Schema.ObjectId,
  // 同步数据，生成到 .ftl 中
  syncData: [{
    name: String,
    type: {
      type: String,
      default: 'string',
    },
  }],
});

mongoose.model('Page', schema);
