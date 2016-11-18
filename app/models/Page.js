const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageSchema = new Schema({
  url: String,
  name: String,
  data: Schema.Types.Mixed,
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
}, { timestamps: true, versionKey: false });

pageSchema.statics = {
  async upsert(_id, project, name, url) {
    _id = _id || new mongoose.Types.ObjectId;
    return await this.update({ _id, project }, { name, url }, { upsert: true });
  },

  async getList(project) {
    return await this.find({ project });
  },
};

mongoose.model('Page', pageSchema);
