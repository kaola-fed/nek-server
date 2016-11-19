const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: { type: String, required: true },
  desc: String,
  templates: [{
    name: { type: String, required: true },
    file: { type: Schema.Types.ObjectId, required: true },
  }],
}, { timestamps: true, versionKey: false });

projectSchema.statics = {
  async queryOne(_id) {
    console.log(_id);
    return await this.findOne({ _id });
  },

  async upsert(_id, name, desc) {
    _id = _id || new mongoose.Types.ObjectId;
    if (!name) throw new Error('[name] is required');
    return await this.update({ _id }, { name, desc }, { upsert: true });
  },

  async getList() {
    return await this.find();
  },

  async upsertTpl(_id, name, file) {
    if (!_id || !name || !file) throw new Error('[_id & name & file] are required');
    const result = await this.find({ _id, 'templates.name': name });
    if (result.length) {
      return await this.update({ _id, 'templates.name': name }, {
        $set: { 'templates.$.file': file }
      });
    }
    return await this.update({ _id }, {
      $addToSet: { 'templates': { name, file } }
    });
  }
};

mongoose.model('Project', projectSchema);
