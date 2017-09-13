import mongoose from 'mongoose';

const schema = mongoose.Schema({
  name: String,
  desc: String,
  git: String,
  // 组件库的_id以及版本
  libs: [{
    id: mongoose.Schema.Types.ObjectId,
    version: String,
  }],
  members: [{
    id: mongoose.Schema.Types.ObjectId,
    username: String,
  }],
  pages: [{
    id: mongoose.Schema.Types.ObjectId,
    url: String,
  }],
}, {
  timestamp: true,
});

mongoose.model('Project', schema);
