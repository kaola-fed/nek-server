import mongoose from 'mongoose';

const schema = mongoose.Schema({
  name: String,
  key: String,
  project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
  }
}, {
  timestamps: true,
});

schema.statics = {
  async insert(key) {
    return await this.create(key);
  },

  async modify(id, key) {
    return await this.update({ _id: id }, key);
  },

  async selectAll() {
    return await this.find();
  },

  async selectByProject(project) {
    return await this.find({ project });
  },

  async selectById(id) {
    return await this.findOne({ _id: id });
  },

  async deleteById(id) {
    return await this.remove({ _id: id });
  }
}

export default mongoose.model('Key', schema);
