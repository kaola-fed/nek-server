import mongoose from 'mongoose';

const schema = mongoose.Schema({
  name: String,
  version: String,
  components: [{
    id: mongoose.Schema.ObjectId,
    tagName: String,
  }],
}, {
  timestamps: true,
});

export default mongoose.model('Library', schema);
