const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageSchema = new Schema({
  id: Number,
  url: String,
  name: String,
  data: Schema.Types.Mixed,
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
});

mongoose.model('Page', pageSchema);
