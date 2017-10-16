const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true }
}, { timestamps: true, versionKey: false });

projectSchema.statics = {
  async queryOne(name) {
    return await this.findOne({ name });
  },

  async upsert(name, url) {
    name = name || new mongoose.Types.ObjectId;
    return await this.update(
      { name },
      JSON.parse(JSON.stringify({ name, url })),
      { upsert: true });
  },

  async getList() {
    return await this.find();
  }
};

mongoose.model('ScaffoldMap', projectSchema);
