const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  id: Number,
  name: String,
  desc: String,
  templates: [{
    name: String,
    fileId: Schema.Types.ObjectId,
  }],
});

mongoose.model('Project', projectSchema);
