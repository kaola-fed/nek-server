import mongoose from 'mongoose';

const schema = mongoose.Schema({
  name: String,
  desc: String,
  version: String
}, {
  timestamps: true,
});

schema.statics = {
  async insert(library) {
    return await this.create(library);
  },

  async modify(id, library) {
    return await this.update({ _id: id }, library);
  },

  async selectAll() {
    return await this.find();
  },

  async selectById(id) {
    return await this.findOne({ _id: id });
  },

  async deleteById(id) {
    return await this.remove({ _id: id });
  }
}

export default mongoose.model('Library', schema);
