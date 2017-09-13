import mongoose from 'mongoose';

const schema = mongoose.Schema({
  name: String,
  version: String,
  components: [{
    id: mongoose.Schema.ObjectId,
    tagName: String,
  }],
});

mongoose.model('Library', schema);
