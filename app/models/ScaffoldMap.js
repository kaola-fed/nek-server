const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  keyword: { type: String, required: true },
  url: { type: String, required: true }
}, { timestamps: true, versionKey: false });

projectSchema.statics = {
  async queryOne(keyword) {
    return await this.findOne({ keyword });
  },

  async upsert(keyword, url) {
    keyword = keyword || new mongoose.Types.ObjectId;
    return await this.update(
      { keyword },
      JSON.parse(JSON.stringify({ keyword, url })),
      { upsert: true });
  },

  async remove(keyword) {
    return await this.deleteOne({ keyword });
  },

  async exist(keyword) {
    return !!(await this.where('keyword').equals(keyword)).length;
  },

  async getList() {
    return await this.find();
  }
};

mongoose.model('ScaffoldMap', projectSchema);
