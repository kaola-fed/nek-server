import mongoose from 'mongoose';

const schema = mongoose.Schema({
  tagName: String,
  library: mongoose.Schema.ObjectId,
  attributes: [{
    type: { type: String, required: true },
  }],
  events: [{ name: String }],
  isLayout: Boolean,
});

mongoose.model('Library', schema);
