const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: String,
}, { timestamps: true, versionKey: false });

categorySchema.statics = {
  async upsert(_id, name) {
    _id = _id || new mongoose.Types.ObjectId;
    return await this.update(
      { _id },
      JSON.parse(JSON.stringify({ name })),
      { upsert: true });
  },

  async getList() {
    return await this.find();
  },
};

mongoose.model('Category', categorySchema);
