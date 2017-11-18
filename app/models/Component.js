import mongoose from 'mongoose';

const schema = mongoose.Schema({
  name: String,
  tag: String,
  isLayout: Boolean,
  bodyClass: [{ type: String }],
  attributes: [{
    name: { type: String, required: true },
    type: { type: String, required: true },
    default: String
  }],
  events: [{ type: String }],
  library: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Library'
  }
}, {
  timestamps: true,
});

schema.statics = {
  async selectByLib(id) {
    return await this.find({ library: id });
  },
  async selectById(id) {
    return await this.findOne({ _id: id });
  },
  async insert(component) {
    return await this.create(component);
  },

  async deleteById(id) {
    return await this.remove({ _id: id });
  },

  async modify(id, component) {
    return await this.update({ _id: id }, component);
  }
};

export default mongoose.model('Component', schema);
